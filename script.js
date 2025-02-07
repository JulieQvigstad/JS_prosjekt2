const containerDiv = document.querySelector(".container")
const figurElm = document.getElementById("figur")
const maxLeft = containerDiv.offsetWidth - figurElm.offsetWidth
const maxTopp = containerDiv.offsetHeight - figurElm.offsetHeight


let x = 0
let y = 700 //start øverst
let vx = 0
let vy = 0 //fart i y retning (opp og ned)

const GRAVITASJON = 1

function hopp() {
    vy += GRAVITASJON //gravitasjonen påvirker farten i y-retning (faller ned)

    y += vy //y-posisjon endrer seg med y-fart
    figurElm.style.left = x + "px"
    figurElm.style.top = y + "px"
    if (x > maxLeft || x < 0) {
        // Har truffet en kant: Snu farts-retning:
        vx = -vx
    }
    if (y > maxTopp) {
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
        //console.log("Du presset space")
        vy = -20
    }
    if (event.key == "a") {
        vx = -2
    }
    if (event.key == "d") {
        vx = 2
    }

}

document.addEventListener("keypress", tasteTrykk)

setInterval(hopp, 20)

