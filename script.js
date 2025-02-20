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


let y = maxTopp //start nederst y=katt
let vy = 0 //fart i y retning (opp og ned)
let buskX = hinderStart //buskens startsposisjon
let ørnX = hinderStart + 600 //ørnen starter litt bak busken
let treX = hinderStart + 1400 //treet starter bak ørnen
let blomstX = hinderStart + 2000
const vx = -5 //Hastighet til hinderne  

const GRAVITASJON = 1
//let spillAktivt = false //Spillet starter ikke aktivt

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

}

document.addEventListener("keypress", tasteTrykk)


function oppdaterHindre() {
    buskX += vx
    hinderElm.style.left = buskX + "px"

    ørnX += vx
    ørnElm.style.left = ørnX + "px"

    treX += vx
    treElm.style.left = treX + "px"

    blomstX += vx
    blomstElm.style.left = blomstX + "px"

    if (buskX < -hinderElm.offsetWidth && ørnX < -ørnElm.offsetWidth && treX < -treElm.offsetWidth && blomstX < -blomstElm.offsetWidth) {
        buskX = hinderStart
        ørnX = buskX + 600
        treX = buskX + 1400
        blomstX = buskX + 2000
    }
}

// Sjekker om det har skjedd kollisjon
function sjekkKollisjon() {
    const figurRect = figurElm.getBoundingClientRect() //får info om posisjonen og størrelsen til figur elementet
    const hinderRect = hinderElm.getBoundingClientRect() //samme 
    const ørnRect = ørnElm.getBoundingClientRect()
    const treRect = treElm.getBoundingClientRect()
    const blomstRect = blomstElm.getBoundingClientRect()
    const buffer = 60 //gjør at kollisjonen skjer når man ser at de kolliderer 

    return (
        (figurRect.right > hinderRect.left + buffer &&
        figurRect.left < hinderRect.right - buffer &&
        figurRect.bottom > hinderRect.top + buffer &&
        figurRect.top < hinderRect.bottom - buffer) ||

        (figurRect.right > ørnRect.left + buffer &&
        figurRect.left < ørnRect.right - buffer &&
        figurRect.bottom > ørnRect.top + buffer &&
        figurRect.top < ørnRect.bottom - buffer) ||

        (figurRect.right > treRect.left + buffer &&
        figurRect.left < treRect.right - buffer &&
        figurRect.bottom > treRect.top + buffer &&
        figurRect.top < treRect.bottom - buffer) ||

        (figurRect.right > blomstRect.left + buffer &&
        figurRect.left < blomstRect.right - buffer &&
        figurRect.bottom > blomstRect.top + buffer &&
        figurRect.top < blomstRect.bottom - buffer)
    )
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

let spillAktivt = false 


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
    buskX = hinderStart
    ørnX = hinderStart + 600
    treX = hinderStart + 1400
    blomstX = hinderStart + 2000
    
    figurElm.style.top = y + "px"
    hinderElm.style.left = buskX + "px"
    ørnElm.style.left = ørnX + "px"
    treElm.style.left = treX + "px"
    blomstElm.style.left = blomstX + "px"
    
    oppdaterAlt()
    
    //buskX = hinderStart
    //ørnX = hinderStart + 400
    
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





