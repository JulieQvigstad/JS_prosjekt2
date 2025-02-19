const containerDiv = document.querySelector(".container")
const figurElm = document.getElementById("figur")
const hinderElm = document.getElementById("hinder")
const startButton = document.getElementById("startButton")

const maxLeft = containerDiv.offsetWidth - figurElm.offsetWidth
const maxTopp = containerDiv.offsetHeight - figurElm.offsetHeight
const hinderStart = maxLeft + 500

const looseSound = document.getElementById("looserSound")
const lydSpiller = new Audio("looser.mp3")


let y = maxTopp //start nederst y=katt
let vy = 0 //fart i y retning (opp og ned)
let x = hinderStart //Hinderets startsposisjon
const vx = -5 //Hastighet til hinderet 

const GRAVITASJON = 1
let spillAktivt = false //Spillet starter ikke aktivt

function hopp() {
    if (!spillAktivt) return
    
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
    if (event.key == " " && spillAktivt) {
        //console.log("Du presset space")
        vy = -20
    }

}

document.addEventListener("keypress", tasteTrykk)


//let x = hinderStart // Hinder starter her
//const vx = -5 // Farten til hinderne

function oppdaterHindre() {
    if (!spillAktivt) return
    
    x += vx
    hinderElm.style.left = x + "px"
    
    if (x < -hinderElm.offsetWidth) {
        x = hinderStart 
        hinderElm.style.bottom = 100 + "px"
    }
}

// Sjekker om det har skjedd kollisjon
function sjekkKollisjon() {
    const figurRect = figurElm.getBoundingClientRect() //får info om posisjonen og størrelsen til figur elementet
    const hinderRect = hinderElm.getBoundingClientRect() //samme 
    const buffer = 50 //gjør at kollisjonen skjer når man ser at de kolliderer 

    return (
        figurRect.right > hinderRect.left + buffer &&
        figurRect.left < hinderRect.right - buffer &&
        figurRect.bottom > hinderRect.top + buffer &&
        figurRect.top < hinderRect.bottom - buffer
    ) 
}

//Funksjon for å vise "GAME OVER"
function visGameOver() {
    spillAktivt = false
    

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
    looseSound.play();

    setTimeout(() => {
        startButton.style.display = "block" // Viser startknappen igjen
        gameOverText.remove() // Fjerner "GAME OVER"-teksten
    }, 2000) //tiden det tar før teksten kommer 
}

//Starter spillet på nytt
function startSpill() {
    spillAktivt = true

    y = maxTopp // Nullstiller figurens posisjon
    vy = 0
    x = hinderStart //flytter hinderet til startposisjonen sin

    figurElm.style.top = y + "px"
    hinderElm.style.left = x + "px"

    startButton.style.display = "none" // Skjuler startknappen
    requestAnimationFrame(oppdaterAlt) // Starter spill-loop
}


//let spillAktivt = true

function oppdaterAlt() {
    if (!spillAktivt) return // Stopper spillet hvis kollisjon har skjedd

    hopp()
    oppdaterHindre()

    if (sjekkKollisjon()) {
        //spillAktivt = false
        console.log("Kollisjon! Spillet stopper.")
        visGameOver() //Viser skriften "game over"
    } else {
        requestAnimationFrame(oppdaterAlt)
    }
}

startButton.addEventListener("click", startSpill)

/*startButton.addEventListener("click", () => {
    spillAktivt = true
    startButton.style.display = "none" // Skjuler startknappen
    oppdaterAlt()
})*/







