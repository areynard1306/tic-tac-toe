let winnerText = document.getElementById("winnerText");
let buttonRestart = document.getElementById("buttonRestart");
let scoreRed = document.getElementById("scoreRed");
let scoreRedDisplay = document.getElementById("scoreRedDisplay");
let scoreBlue = document.getElementById("scoreBlue");
let scoreBlueDisplay = document.getElementById("scoreBlueDisplay");
let draw = document.getElementById("draw")
let drawDisplay = document.getElementById("drawDisplay")
let scoreRedCase = document.getElementById("scoreRedCase");
let scoreBlueCase = document.getElementById("scoreBlueCase");
let confettiContainer = document.getElementById('confetti-container');

const buttonsTitle = ["button0", "button1", "button2", "button3", "button4", "button5", "button6", "button7", "button8"];
let buttons = [];
let buttonsRed = [];
let buttonsBlue = [];

let color
let symbole
let tour = 1;
let isWinner = false;
const comboGagnant = [
    ["button0", "button1", "button2"],
    ["button3", "button4", "button5"],
    ["button6", "button7", "button8"],
    ["button0", "button3", "button6"],
    ["button1", "button4", "button7"],
    ["button2", "button5", "button8"],
    ["button0", "button4", "button8"],
    ["button2", "button4", "button6"]
];
// Fin de la déclaration des variables //

        // Vérifier si le mode sombre est activé
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Appliquer le thème clair

}

buttonsTitle.forEach(function(buttonTitle) {
    let button = document.getElementById(buttonTitle);
    button.style.backgroundColor = "white";
    buttons.push(button);
});

buttons.forEach(function(button) {
    button.style.color = "black";

    button.addEventListener("click", function() {
        const start = performance.now() // calcul du temps d'éxécution de la fonction

        if (tour % 2 == 1) {
            color = "red";
            symbole = "X"
            addSelectedBlue();
        } else {
            color = "blue";
            symbole = "O"
            addSelectedRed();
        }

        if (button.style.color == "black") {
            button.style.color = color;
            button.innerHTML = symbole;
            tour += 1;

            buttonsRed = buttons.filter(button => button.style.color == "red").map(button => button.id);
            buttonsBlue = buttons.filter(button => button.style.color == "blue").map(button => button.id);

            comboGagnant.forEach(function(combo) {
                if (combo.every(val => buttonsRed.includes(val))) {
                    winnerText.innerHTML = "Le joueur Rouge a gagné";
                    updateScore(scoreRed);
                    isWinner = true;
                    highlightWinningCombo(combo, "red");
                    createConfetti()
                } else if (combo.every(val => buttonsBlue.includes(val))) {
                    winnerText.innerHTML = "Le joueur Bleu a gagné";
                    updateScore(scoreBlue);
                    isWinner = true;
                    highlightWinningCombo(combo, "blue");
                    createConfetti()
                }
            });
            
            if (!isWinner && buttons.every(button => button.style.color !== "black")) {
                winnerText.innerHTML = "Égalité !";
                updateScore(draw)
                isWinner = true;
            }

            if (isWinner) {
                buttons.forEach(function(b) {
                    b.disabled = true;
                    b.style.filter = "grayscale(0.6)";
                    b.style.backgroundColor = 'rgba(188, 188, 188, 0.43)'
                });
                
                buttonRestart.style.visibility = "visible";
                buttonRestart.addEventListener("click", restart);
            }
        }
        const end = performance.now(); // fin du temps d'éxécution
        console.log(`Temps d'exécution: ${end - start} millisecondes`);
    });
});

document.addEventListener("DOMContentLoaded", afficherPopup);


function updateScore(scoreElement) {
    let scoreValue = parseInt(scoreElement.value);
    scoreValue += 1;
    scoreElement.value = scoreValue;
    if (scoreElement === scoreRed) {
        scoreRedDisplay.innerText = scoreValue;
    } else if (scoreElement === scoreBlue) {
        scoreBlueDisplay.innerText = scoreValue;
    }
    else {
        drawDisplay.innerText = scoreValue;
    }
}

// Fonction permettant de recommencer la partie
function restart() {
    buttons.forEach(function(button) {
        button.style.color = "black";
        button.style.filter = 'none';
        button.disabled = false;
        button.innerHTML = ""
        button.style.backgroundColor = "white";
        button.style.border = "1px solid black";
        button.classList.remove("winning-button");
        
    confettiContainer.innerHTML = ""
    buttonsBlue = [];
    buttonsRed = [];
    isWinner = false;
    winnerText.innerHTML = "";
    if (tour %2 == 1) {
        scoreBlueCase.style.animation = "none"
    } else {
        scoreRedCase.style.animation = "none"
    }
    tour = 0;
    
    buttonRestart.style.visibility = "hidden";
    afficherPopup()
    });
}

// Fonction en lien avec l'affichage du combo gagnant
function highlightWinningCombo(combo, color) {
    combo.forEach(function(buttonId) {
        let winningButton = document.getElementById(buttonId);
        winningButton.style.border = `3px solid ${color}`;
        winningButton.classList.add("winning-button");
    });
    if (tour %2 == 1) {
        scoreBlueCase.style.animation = "clignoter 0.9s infinite";
        addSelectedBlue();
    } else {
        scoreRedCase.style.animation = "clignoter 0.9s infinite";
        addSelectedRed();
    }
}

// Fonctions en lien avec la séléction des Cases
function addSelectedBlue() {
    scoreBlueCase.classList.add("selectedCase");
    scoreBlueCase.classList.add("selectedBlue");
    scoreRedCase.classList.remove("selectedCase");
    scoreRedCase.classList.remove("selectedRed");
}

function addSelectedRed() {
    scoreBlueCase.classList.remove("selectedCase");
    scoreBlueCase.classList.remove("selectedBlue");
    scoreRedCase.classList.add("selectedCase");
    scoreRedCase.classList.add("selectedRed");
}

// Fonctions en lien avec la Popup.
function afficherPopup() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('popup').style.display = 'block';

    let countdownValue = 5;
    const countdownElement = document.getElementById("countdown");
    
    const countdownInterval = setInterval(function() {
        countdownElement.textContent = countdownValue;
        countdownValue--;

        if (countdownValue < 0) {
            clearInterval(countdownInterval);
            masquerPopup();
        }
    }, 1000)
}

function choisirJoueur(joueur) {
    if (joueur == "J2") {
        tour = 0;
        addSelectedBlue();
    } else {
        tour = 1;
        addSelectedRed();
    }
    masquerPopup();
}

function masquerPopup() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('popup').style.display = 'none';
}

function createConfetti() {
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.bottom = `${Math.random() * 100}vh`;
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confettiContainer.appendChild(confetti);
    }
}

  