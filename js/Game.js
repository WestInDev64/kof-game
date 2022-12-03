/* Anime perso */
import detailanimeMai from "../assets/img/persos/Mai/detailanimeMai.js";
import detailanimeKing from "../assets/img/persos/King/detailanimeking.js";
import detailanimeSie from "../assets/img/persos/Sie Kensou/detailanimeSie.js";
import detailanimeKyo from "../assets/img/persos/Kyo/detailanimeKyo.js";
import detailanimeKim from "../assets/img/persos/Kim Kaphwan/detailanimeKim.js";
import detailanimeTerry from "../assets/img/persos/Terry Bogard/detailanimeTerry.js";


/* Anime Background */
import animebg from "../assets/img/bg/ruins/animebg.js";
import animebg2 from "../assets/img/bg/shion/animebg.js";
import animebg3 from "../assets/img/bg/alley/animebg.js";

import { Personnage } from "./Personnage.js";
import { Scene } from "./Scene.js";
import { FpsCounter } from "./Gui.js";

export class Game {
    constructor(canvas,ctx) {
        this.cnv = canvas;
        this.ctx = ctx;
        this.tabPlayer = [];
        this.scene;
        this.gameOver = false;
        this.fps;
        this.timer;
        this.bgFolder = ["ruins", "shion", "alley"];                                    // 
        this.nbFramesBg = [animebg.nbFrames, animebg2.nbFrames, animebg3.nbFrames];
        this.bgAnime = [animebg, animebg2, animebg3];
    }

    init() {
        const randBg = Math.floor(Math.random() * 3);
        this.scene = new Scene(this.cnv, this.ctx, this.bgFolder[randBg], this.nbFramesBg[randBg], this.bgAnime[randBg]);
        this.scene.init();

        const persoTab = [
            new Personnage("Mai", "Mai", "Mai Shiranui_", 'L', 1, detailanimeMai, this.cnv, this.ctx),
            new Personnage("King", "King", "King_", 'R', 2, detailanimeKing, this.cnv, this.ctx),
        ];
        
        this.fps = new FpsCounter(this.ctx);
        //console.table(this.gridObj.grid);
        //let calum = new Personnage("Sie Kensou", "Sie Kensou", "Sie Kensou_", 'R', 2, detailanimeSie, cnv, ctx);
        //let calum2 = new Personnage("Kyo", "Kyo", "Kyo Kusanagi_", 'L', 2, detailanimeKyo, cnv, ctx);
        //let calum3 = new Personnage("Kim Kaphwan", "Kim Kaphwan", "Kim Kaphwan_", 'L', 2, detailanimeKim, cnv, ctx);
        //let calum4 = new Personnage("Terry Bogard", "Terry Bogard", "Terry Bogard_", 'R', 2, detailanimeTerry, cnv, ctx);
        this.tabPlayer.push(persoTab[0]);
        this.tabPlayer.push(persoTab[1]);
        //this.tabPlayer.push(calum);
        //this.tabPlayer.push(calum2);
        //this.tabPlayer.push(calum3);
        //this.tabPlayer.push(calum4);
        for (let player of this.tabPlayer) {
            player.init();
        }

    }

    update(fps) {
        //console.log(fps);
        this.clearCanvas();
        this.scene.drawBg();                                    // Dessine Bg
        this.scene.animeBg(fps);                                // Anime Bg
        this.scene.drawPlf();                                   // Dessine Plateforme
        this.fps.update(fps);
        this.fps.draw();


        for (let player of this.tabPlayer) {
            player.update(fps);
            player.move(0);                                // Déplacement
            player.animeRandom();                               // Anime aléatoire
            player.draw();                                      // Dessine perso
            if (player.kO) {
                // restart dans 1s
                this.resDefer();
            }
        }

        // A chaque frame 
        for (let player of this.tabPlayer) {
            for (let i = 0; i < this.tabPlayer.length; i++) {
                if (player.name !== this.tabPlayer[i].name) {
                    player.isCollide = player.is_collide(this.tabPlayer[i].polygons);
                }
            }

        }

    }


    clearCanvas() {
        this.ctx.fillStyle = "#FFFFFF";
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
        this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);
    }

    start() {
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

    onResize() {
        const baseW = 640;
        const baseH = 480;

        const ratioW = innerWidth / baseW;
        const ratioH = innerHeight / baseH;
        const ratio = Math.min(ratioW, ratioH);
        const w = baseW * ratio;
        const h = baseH * ratio;
 
        this.cnv.width = w;
        this.cnv.height = h;

        if (this.scene) {
            this.scene._onResize();
        }

        if (this.tabPlayer) {
            for (let player of this.tabPlayer) {
                player._onResize();
            }
        }

        if (this.platforms) {
            for (let platform of this.platforms) {
                platform._onResize();
            }
        }
    }

}

