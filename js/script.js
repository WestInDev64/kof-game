import detailanimeMai from "../assets/img/persos/Mai/detailanimeMai.js";
import detailanimeKing from "../assets/img/persos/King/detailanimeking.js";
import detailanimeSie from "../assets/img/persos/Sie Kensou/detailanimeSie.js";
import animebg from "../assets/img/bg/ruins/animebg.js";
import animebg2 from "../assets/img/bg/shion/animebg.js";
import animebg3 from "../assets/img/bg/alley/animebg.js";
import { Personnage, Color } from "./Personnage.js";
import { Cell, Grid, GridBG, GridObj, GridPlatform } from "./Grid.js";
import { Decor } from "./Decor.js";

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


class Game {
    constructor() {
        this.tabPlayer = [];
        this.decor;
        this.gridBg;
        this.gridPlatfrm = new GridPlatform(gridCol, gridLig, ctx, cnv);
        this.gridObj;
        this.gameOver = false;
        this.fps = 90;
        this.timer;
        this.bgFolder = ["ruins", "shion", "alley"];                                    // 
        this.nbFramesBg = [animebg.nbFrames, animebg2.nbFrames, animebg3.nbFrames];
        this.bgAnime = [animebg, animebg2, animebg3];
    }

    init() {
        const randBg = Math.floor(Math.random() * 3);
        this.decor = new Decor(cnv,ctx,this.bgFolder[randBg], this.nbFramesBg[randBg],this.bgAnime[randBg]);
        this.decor.init();

        //console.table(this.gridObj.grid);
        let mai = new Personnage("Mai", "Mai", "Mai Shiranui_", 'L', 1, detailanimeMai, this.gridBg, this.gridPlatfrm, cnv, ctx);
        let king = new Personnage("King", "King", "King_", 'R', 2, detailanimeKing, this.gridBg, this.gridPlatfrm, cnv, ctx);
        let king2 = new Personnage("King", "King", "King_", 'R', 2, detailanimeKing, this.gridBg, this.gridPlatfrm, cnv, ctx);
        let king3 = new Personnage("King", "King", "King_", 'R', 2, detailanimeKing, this.gridBg, this.gridPlatfrm, cnv, ctx);
        let calum = new Personnage("Sie Kensou", "Sie Kensou", "Sie Kensou_", 'R', 2, detailanimeKing, this.gridBg, this.gridPlatfrm, cnv, ctx);
        this.tabPlayer.push(mai);
        this.tabPlayer.push(king);
        this.tabPlayer.push(king2);
        this.tabPlayer.push(king3);
        this.tabPlayer.push(calum);
        for (let player of this.tabPlayer) {
            player.init();
        }
    }

    update() {
        clearCanvas();                                          // Efface le canvas
        this.decor.drawBg();                                    // Dessine Bg
        this.decor.animeBg();                                   // Anime Bg
        console.table(this.decor.proceduralTab);
        this.decor.drawPlf();
        //this.gridPlatfrm.drawPlf();                             // Dessine plateforme
        //this.gridObj.drawObj();                                 // Dessine Item
        //console.log(this.gridObj);
        /* for (let player of this.tabPlayer) {
            this.gridBg.setCellGrid(player, player.codePlayer);
        } */
        //console.log(this.gridPlatfrm);
        //this.gridBg.enemyClose();
        for (let player of this.tabPlayer) {
            player.animeRandom();                               // Anime aléatoire
            player.move();                                      // Déplacement
            player.draw();                                      // Dessine perso
            if (player.kO) {
                // restart dans 1s
                this.resDefer();
            }
        }
    }

    start() {
        this.timer = setInterval(() => this.update(), this.fps);
    }

    resDefer() {
        setTimeout(this.restart, 1000);
    }

    pause() {
        clearInterval(this.timer);
    }
    restart() {
        this.timestamp = 90;
        window.document.location.reload();
    }
}

function clearCanvas() {
    ctx.fillStyle = "#FFFFFF";
    /**
     * ClearRect: rectangle vide (efface le fond)
     * fillRect : rectangle plein
     * strokeRect : rectangle surligné
     * @param x : coin sup gauche du rectangle 
     * @param y : coin sup gauche du rectangle 
     * @param w : largeur du rectangle 
     * @param h : hauteur du rectangle 
     */
    //ctx.clearRect(this.posX, this.posY, 128, 120);
    ctx.fillRect(0, 0, cnv.width, cnv.height);
}



const game = new Game();
game.init();
game.start();


