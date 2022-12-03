import { Game } from "./Game.js";

const cnv = document.getElementById('myCanvas');
const ctx = cnv.getContext('2d');
cnv.style.width = window.innerWidth + "px";
cnv.style.height = window.innerHeight + "px";

ctx.imageSmoothingEnabled = false;
const gridCol = 10;
const gridLig = 4;

const cnvW = 128 / 2;
const cnvH = 120;

let fps = {
    previous: 0,
    secondsPassed: 0
};


const game = new Game(cnv, ctx);
game.init();
game.start();


function update(time) {
    window.requestAnimationFrame(update);

    fps = {
        secondsPassed: (time - fps.previous) / 1000,
        previous: time,
    };

    game.update(fps);
}



/* Valeurs des paramètres :  
img : Il indique l’image ou la vidéo à dessiner sur la toile.
x : Indique la coordonnée x où l’image doit être placée.
y: Indique la coordonnée y où l’image doit être placée.
swidth : C’est un paramètre facultatif et indique la largeur de l’image découpée.
sheight : C’est un paramètre facultatif et indique la hauteur de l’image découpée.
sx : C’est un paramètre facultatif et indique la coordonnée x où commencer le découpage.
sy: C’est un paramètre facultatif et indique la coordonnée y où commencer le découpage.
width : C’est un paramètre facultatif et indique la largeur de l’image à utiliser.
hauteur : C’est un paramètre facultatif et indique la hauteur de l’image à utiliser. */


/* Keyboard keydown autorisés */
window.document.addEventListener('keydown', event => {
    switch (event.key) {
        case "ArrowRight":
        case "ArrowLeft":
        case "ArrowUp":
        case "ArrowDown":
        case 'w':
        case 'x':
        case 'c':
        case 'v':
            game.tabPlayer[0].controls(event);
            break;
    }
});

window.requestAnimationFrame(update);


//window.document.addEventListener('resize', game.onResize());



