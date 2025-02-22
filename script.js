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


let y = maxTopp //start nederst y=katt
let vy = 0 //fart i y retning (opp og ned)
const vx = -5 //Hastighet til hinderne  
let spillAktivt = false;

const GRAVITASJON = 1
//let spillAktivt = false //Spillet starter ikke aktivt

//en array for hinderne 
let hindre = [
    { element: hinderElm, x: hinderStart },
    { element: ørnElm, x: hinderStart + 600 },
    { element: treElm, x: hinderStart + 1400 },
    { element: blomstElm, x: hinderStart + 2000 }
];

function hopp() {
    vy += GRAVITASJON //gravitasjonen påvirker farten i y-retning (faller ned)
    y += vy //y-posisjon endrer seg med y-fart
    figurElm.style.top = y + "px"
    if (y > maxTopp) { // Treffer bunn
        y = maxTopp
        vy = 0
    }
    if (y < 0) { //Hindrer at figuren spretter ut av rammen på toppen 
        y = 0
        vy = 0
    }
}

function tasteTrykk(event) {
    if (event.key == " ") {
        console.log("Du presset space")
        vy = -20
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
            alleUte = false; //minst et hinder er fortsatt i skjermen
        }
    });

    if(alleUte) {
        stokkerHindre();
    }
 }
    

function stokkerHindre () {
    for (let i = hindre.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random()* (i + 1));
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

// Sjekker om det har skjedd kollisjon
function sjekkKollisjon() {
    const figurRect = figurElm.getBoundingClientRect() //får info om posisjonen og størrelsen til figur elementet
    const buffer = 60 //gjør at kollisjonen skjer når man ser at de kolliderer 

    return hindre.some(hinder => {
        const hinderRect = hinder.element.getBoundingClientRect();
        return (
            figurRect.right > hinderRect.left + buffer &&
            figurRect.left < hinderRect.right - buffer &&
            figurRect.bottom > hinderRect.top + buffer &&
            figurRect.top < hinderRect.bottom - buffer
        );
    });
    }


//Funksjon for å vise "GAME OVER"
function visGameOver() {
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

    if (looseSound) {
        looseSound.play()
    }

    setTimeout(() => {
        startButton.style.display = "block" // Viser startknappen igjen
        gameOverText.remove() // Fjerner "GAME OVER"-teksten
    }, 2000) //tiden det tar før teksten kommer 
}

//let spillAktivt = false 


function oppdaterAlt() {
    if (!spillAktivt) return // Stopper spillet hvis kollisjon har skjedd
    
    hopp()
    oppdaterHindre()
    
    if (sjekkKollisjon()) {
        spillAktivt = false
        console.log("Kollisjon! Spillet stopper.")
        visGameOver() //Viser skriften "game over"
    } else {
        requestAnimationFrame(oppdaterAlt)
    }
}

startButton.addEventListener("click", () => {
    spillAktivt = true
    startButton.style.display = "none" // Skjuler startknappen
    
    y = maxTopp
    vy = 0

    let startX = hinderStart;
    hindre.forEach(hinder => {
        hinder.x = startX;
        hinder.element.style.left = startX + "px";
        startX += 600; 
    });

    
    
    oppdaterAlt()
    
    
    
})


//Starter spillet på nytt
/*function startSpill() {
    spillAktivt = true

    y = maxTopp // Nullstiller figurens posisjon
    vy = 0
    x = hinderStart //flytter hinderet til startposisjonen sin

    figurElm.style.top = y + "px"
    hinderElm.style.left = x + "px"

    startButton.style.display = "none" // Skjuler startknappen
    requestAnimationFrame(oppdaterAlt) // Starter spill-loop
}
*/


//let spillAktivt = true





