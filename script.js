const containerDiv = document.querySelector(".container")
const figurElm = document.getElementById("figur")
const hinderElm = document.getElementById("hinder")
const ørnElm = document.getElementById("ørn")
const treElm = document.getElementById("tre")
const blomstElm = document.getElementById("blomst")
const startButton = document.getElementById("startButton")

const maxLeft = containerDiv.offsetWidth - figurElm.offsetWidth
const maxTopp = containerDiv.offsetHeight - figurElm.offsetHeight
const hinderStart = maxLeft + 500

const looseSound = document.getElementById("looserSound")
const jumpSound = document.getElementById("jumpSound")
const startSound = document.getElementById("startSound")


let Katt = maxTopp //start nederst (katten)
let vKatt = 0 //fart i y retning (farten til katten: opp og ned)
const vx = -5 //Hastighet til hinderne  
let spillAktivt = false;

//timer
let spillTid = 0; //tiden i sekunder
let tidsIntervall;

//tiden vises i høyre hjørnet mens man spiller 
const tidDisplay = document.createElement("div");
tidDisplay.style.position = "absolute";
tidDisplay.style.top = "10px";
tidDisplay.style.right = "20px";
tidDisplay.style.fontSize = "30px";
tidDisplay.style.color = "white";
tidDisplay.style.fontWeight = "bold";
tidDisplay.style.fontFamily = "Arial, sans-serif";

document.body.appendChild(tidDisplay);

const GRAVITASJON = 1


//en array for hinderne 
let hindre = [
    { element: hinderElm, x: hinderStart },
    { element: ørnElm, x: hinderStart + 600 },
    { element: treElm, x: hinderStart + 1400 },
    { element: blomstElm, x: hinderStart + 2000 }
];

function hopp() {
    vKatt += GRAVITASJON //gravitasjonen påvirker farten i y-retning (faller ned)
    Katt += vKatt //katt-posisjon endrer seg med katt-fart
    figurElm.style.top = Katt + "px"
    if (Katt > maxTopp) { // Treffer bunn
        Katt = maxTopp
        vKatt = 0
    }
    if (Katt < 0) { //hindrer at figuren spretter ut av rammen på toppen 
        Katt = 0
        vKatt = 0
    }
}

function tasteTrykk(event) { //når man trykker space hopper katten
    if (event.key == " ") {
        console.log("Du presset space")
        vKatt = -20
    }

    const jumpSound = document.getElementById("jumpSound");
    jumpSound.currentTime = 0;
    jumpSound.play();

}

document.addEventListener("keypress", tasteTrykk)


function oppdaterHindre() {
    let alleUte = true;

    hindre.forEach(hinder => {
        hinder.x += vx;
        hinder.element.style.left = hinder.x + "px";

        if (hinder.x > -hinder.element.offsetWidth) {
            alleUte = false;
        }
    });

    if (alleUte) {
        stokkerHindre();
    }
}


function stokkerHindre() {
    for (let i = hindre.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [hindre[i], hindre[j]] = [hindre[j], hindre[i]];
    }

    //nye startposisjoner 
    let startX = hinderStart;
    hindre.forEach(hinder => {
        hinder.x = startX;
        hinder.element.style.left = startX + "px";
        startX += 600; // justerer avstanden mellom hindrene
    });
}

const buffer = 60 //gjør at kollisjonen skjer når man ser at de kolliderer 
//sjekker om det har skjedd kollisjon
function sjekkKollisjon() {
    const figurRect = figurElm.getBoundingClientRect() //får info om posisjonen og størrelsen til figur elementet i forhold til skjermen

    return hindre.some(hinder => { //hindre er listen over alle hinderne, some går gjennom hvert hinder å sjekker kollisjon
        const hinderRect = hinder.element.getBoundingClientRect(); //samme som over, gjør at man kan se om figuren og et hinder overlapper hverandre 
        return (
            figurRect.right > hinderRect.left + buffer && //sjekker om de overlapper
            figurRect.left < hinderRect.right - buffer &&
            figurRect.bottom > hinderRect.top + buffer &&
            figurRect.top < hinderRect.bottom - buffer //hvis alle sjekkene er true har det skjedd en kollisjon
        );
    });
}


//funksjon for å vise "GAME OVER"
function visGameOver() {
    clearInterval(tidsIntervall); //stopper tiden

    document.querySelectorAll(".gameOverText, .timeText"). forEach(el => el.remove)

    const gameOverText = document.createElement("h1")
    gameOverText.innerText = "GAME OVER"
    gameOverText.style.position = "absolute"
    gameOverText.style.top = "50%"
    gameOverText.style.left = "50%"
    gameOverText.style.transform = "translate(-50%, -50%)"
    gameOverText.style.fontSize = "75px"
    gameOverText.style.color = "red"
    gameOverText.style.fontWeight = "bold"
    gameOverText.style.fontFamily = "Press Start 2P"
    gameOverText.style.padding = "20px"
    gameOverText.style.borderRadius = "10px"

    document.body.appendChild(gameOverText)

    //tiden vises under game over
    const timeText = document.createElement("h2");
    timeText.innerText = `Tid: ${spillTid} sekunder`;
    timeText.style.position = "absolute";
    timeText.style.top = "30%";
    timeText.style.left = "50%";
    timeText.style.transform = "translate(-50%, -50%)";
    timeText.style.fontSize = "40px";
    timeText.style.color = "green";
    timeText.style.fontWeight = "bold";
    document.body.appendChild(timeText);

    if (looseSound) {
        looseSound.play()
    }

    setTimeout(() => {
        startButton.style.display = "block"; //viser startknappen igjen
        gameOverText.remove(); //fjerner game over teksten
        timeText.remove();
    }, 3000) //tiden det tar før start knappen kommer tilbake
}


function oppdaterAlt() {
    if (!spillAktivt) return //stopper spillet hvis kollisjon har skjedd

    hopp()
    oppdaterHindre()

    if (sjekkKollisjon()) {
        spillAktivt = false
        console.log("Kollisjon! Spillet stopper.")
        visGameOver() //viser skriften game over
    } else {
        requestAnimationFrame(oppdaterAlt)
    }
}

startButton.addEventListener("click", () => {
    spillAktivt = true
    startButton.style.display = "none" //skjuler startknappen

    startSound.currentTime = 0; //spiller lyd når man trykkker på startknapepn
    startSound.play();

    spillTid = 0;
    tidsIntervall = setInterval(() => {
        spillTid++;
        tidDisplay.innerText = `Tid: ${spillTid} sekunder`
    }, 1000);


    Katt = maxTopp
    vKatt = 0

    let startX = hinderStart;
    hindre.forEach(hinder => {
        hinder.x = startX;
        hinder.element.style.left = startX + "px";
        startX += 600;
    });

    oppdaterAlt()


})







