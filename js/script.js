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


window.document.addEventListener('keydown', event => {
    game.tabPlayer[0].controls(event);
});

const game = new Game(cnv,ctx);
game.init();
game.start();


//window.document.addEventListener('resize', game.onResize());



