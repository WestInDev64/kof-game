import { Game, GameState } from "./Game.js";
import { Menu } from "./Gui.js";

const cnv = document.getElementById('myCanvas');
const ctx = cnv.getContext('2d');
cnv.style.width = window.document.innerWidth + "px";
cnv.style.height = window.document.innerHeight + "px";

ctx.imageSmoothingEnabled = false;


const audio = new Audio('assets/sound/ok.mp3');

//Pour le boutton play
let menu = true;

const btn1Play = document.querySelector('#btnPlay'); 
const btnRefresh = document.querySelector('#btnRefresh'); 
const btnAudio = document.querySelector('#btnAudio'); 
const coordMai = document.querySelector('#coord');

const menuImage = new Menu({
    pos: { x: 0, y: 0 },
    imgSrc: 'assets/img/sprt/pict.jpg',
    canv: cnv,
    ctx: ctx
})

const cnvW = 128 / 2;
const cnvH = 120;

let fps = {
    previous: 0,
    secondsPassed: 0
};


//added for the button 
btn1Play.addEventListener('click', function () {
    menu = false
    //document.querySelector('#btnPlay').style.display = 'none'
    window.requestAnimationFrame(update);
});

btnRefresh.addEventListener('click', () => {
    window.document.location.reload();
});

btnAudio.addEventListener('click', () => {
    audio.play();
});

const game = new Game(cnv, ctx);
game.start();
//game.init();


function update(time) {
    window.requestAnimationFrame(update);

    fps = {
        secondsPassed: (time - fps.previous) / 1000,
        previous: time,
    };

    switch (game.gameState) {
        case GameState.INTRO:
            game.introScene.draw();
            game.introScene.update(fps);
            break;
        case GameState.INGAME:
            game.update(fps);
            break;
        default:
            break;
    }
    if (!menu) {
        coordMai.textContent = `Positions: 
        Mai {${game.tabPlayer[0].position.x}, ${game.tabPlayer[0].position.y}} --- 
        King  {${game.tabPlayer[1].position.x}, ${game.tabPlayer[1].position.y}}`;
    }
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
        case "w":
        case "x":
        case "c":
        case "v":
        case "d":
        case "k":
            game.tabPlayer[0].controlsKeyDown(event);
            break;
    }
});

/* Keyboard keydown autorisés */
window.document.addEventListener('keyup', event => {
    switch (event.key) {
        case "ArrowRight":
        case "ArrowLeft":
        case "ArrowUp":
        case "ArrowDown":
        case "w":
        case "x":
        case "c":
        case "v":
        case "d":
        case "k":
            game.tabPlayer[0].controlsKeyUp(event);
            break;
    }
});

window.requestAnimationFrame(update);


//window.document.addEventListener('resize', game.onResize());



