const containerDiv = document.querySelector(".container")
const figurElm = document.getElementById("figur")
const hinderElm = document.getElementById("hinder")

const maxLeft = containerDiv.offsetWidth - figurElm.offsetWidth
const maxTopp = containerDiv.offsetHeight - figurElm.offsetHeight


let y = maxTopp //start nederst
let vy = 0 //fart i y retning (opp og ned)

const GRAVITASJON = 1

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
        //console.log("Du presset space")
        vy = -20
    }

}

document.addEventListener("keypress", tasteTrykk)




let x = maxLeft // Hinder starter her
const vx = -5 // Farten til hinderne

function oppdaterHindre() {
    x += vx
    hinderElm.style.left = x + "px"
    if (x < 0) {
        x = maxLeft 
    }
}



function oppdaterAlt() {
    hopp()
    oppdaterHindre()
    requestAnimationFrame(oppdaterAlt)
}


oppdaterAlt()
// setInterval(oppdaterAlt, 20)


