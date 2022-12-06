/* Anime perso */
import detailanimeMai from "../assets/img/persos/Mai/detailanimeMai.js";
import detailanimeKing from "../assets/img/persos/King/detailanimeking.js";
import detailanimeSie from "../assets/img/persos/Kensou/detailanimeSie.js";
import detailanimeKyo from "../assets/img/persos/Kyo/detailanimeKyo.js";
import detailanimeKim from "../assets/img/persos/Kim/detailanimeKim.js";
import detailanimeTerry from "../assets/img/persos/Terry/detailanimeTerry.js";


/* Anime Background */
//import animebg from "../assets/img/bg/ruins/animebg.js";
import animebg2 from "../assets/img/bg/shion/animebg.js";
import animebg3 from "../assets/img/bg/alley/animebg.js";

import { Personnage, PersoState } from "./Personnage.js";
import { Scene } from "./Scene.js";
import { FpsCounter, Overlay } from "./Gui.js";
import { Camera } from "./Camera.js";
import { Intro } from "./Intro.js";
import { SelectPerso } from "./SelectPerso.js";
import { findAndRemove } from "./Utiles.js";

export const GameState = {
    INTRO: "INTRO",
    SELECT: "SELECT",
    INGAME: "INGAME",
    GAME_OVER: "GAME_OVER",
    YOU_WIN: "YOU_WIN",
    YOU_LOST: "YOU_LOST",
    DEMO: "DEMO"
}

export class Game {
    constructor(canvas, ctx) {
        this.cnv = canvas;
        this.ctx = ctx;
        this.mainPlayer;
        this.tabPlayer = [];
        this.scene;
        this.gameOver = false;
        this.fps;
        this.timer;
        this.bgFolder = ["shion", "alley"];                                    // 
        this.nbFramesBg = [animebg2.nbFrames, animebg3.nbFrames];
        this.bgAnime = [animebg2, animebg3];
        this.sound = {
            music: new Audio('assets/sound/ok.mp3'),
            kick: new Audio('assets/sound/kick.mp3')
        };
        this.overlay;
        this.camera;
        this.introScene;
        this.selectScene;
        this.gameState;
        this.assetsPersosConfig = {
            Mai: detailanimeMai,
            King: detailanimeKing,
            Kyo: detailanimeKyo,
            Kim: detailanimeKim,
            Kensou: detailanimeSie,
            Terry: detailanimeTerry
        }
        this.listFighters = ["Mai", "King", "Kyo", "Kim", "Kensou", "Terry"];

    }

    intro() {
        this.gameState = GameState.INTRO;
        this.introScene = new Intro(this.cnv, this.ctx, this);
        this.introScene.init();
    }

    selectPerso() {
        this.gameState = GameState.SELECT;
        this.selectScene = new SelectPerso(this.cnv, this.ctx, this);
        this.selectScene.init();
    }

    demo() {
        this.gameState = GameState.DEMO;
        const randBg = Math.floor(Math.random() * 2);
        this.scene = new Scene(this.cnv, this.ctx, this.bgFolder[randBg], this.nbFramesBg[randBg], this.bgAnime[randBg]);
        this.scene.init();
        const randP = Math.floor(Math.random() * 6);
        this.mainPlayer = new Personnage(this.assetsPersosConfig[this.listFighters[randP]], 'L', this.cnv, this.ctx, this.scene);
        /* Init Persos */
        const persoTab = [
            new Personnage(this.assetsPersosConfig[this.listFighters[Math.floor(Math.random() * 6)]], 'R', this.cnv, this.ctx, this.scene),
            new Personnage(this.assetsPersosConfig[this.listFighters[Math.floor(Math.random() * 6)]], 'R', this.cnv, this.ctx, this.scene),
            new Personnage(this.assetsPersosConfig[this.listFighters[Math.floor(Math.random() * 6)]], 'R', this.cnv, this.ctx, this.scene)
        ];

        this.tabPlayer.push(this.mainPlayer);
        for (let vperso of persoTab) {
            this.tabPlayer.push(vperso)
        }

        for (let opponent of persoTab) {
            this.mainPlayer.opponents.push(opponent);
            opponent.opponents.push(this.mainPlayer);
        }

        /* Init game objects */
        this.fps = new FpsCounter(this.ctx);
        this.overlay = new Overlay(this.cnv, this.ctx, this);
        this.mainPlayer.init();
        for (let player of this.tabPlayer) {
            player.init();
        }

    }

    init(player1) {
        this.gameState = GameState.INGAME;
        /* Init backgrounds */
        const randBg = Math.floor(Math.random() * 2);
        this.scene = new Scene(this.cnv, this.ctx, this.bgFolder[randBg], this.nbFramesBg[randBg], this.bgAnime[randBg]);
        this.scene.init();

        this.mainPlayer = new Personnage(this.assetsPersosConfig[player1], 'L', this.cnv, this.ctx, this.scene);

        /* Init Persos */
        const persoTab = [
            new Personnage(this.assetsPersosConfig[this.listFighters[Math.floor(Math.random() * 6)]], 'R', this.cnv, this.ctx, this.scene),
            new Personnage(this.assetsPersosConfig[this.listFighters[Math.floor(Math.random() * 6)]], 'R', this.cnv, this.ctx, this.scene),
            new Personnage(this.assetsPersosConfig[this.listFighters[Math.floor(Math.random() * 6)]], 'R', this.cnv, this.ctx, this.scene)
        ];

        this.tabPlayer.push(this.mainPlayer);
        for (let vperso of persoTab) {
            this.tabPlayer.push(vperso)
        }

        for (let opponent of persoTab) {
            this.mainPlayer.opponents.push(opponent);
            opponent.opponents.push(this.mainPlayer);
        }

        /* Init game objects */
        this.fps = new FpsCounter(this.ctx);
        this.overlay = new Overlay(this.cnv, this.ctx, this);

        this.mainPlayer.init();
        for (let player of this.tabPlayer) {
            player.init();
        }

    }

    update(fps) {
        this.clearCanvas();
        this.scene.drawBg(this.camera);                                    // Dessine Bg
        this.scene.animeBg(fps);                                // Anime Bg
        this.scene.drawPlf();                                   // Dessine Plateforme
        
        //this.introScene.draw();
        //this.camera.draw();
        for (let player of this.tabPlayer) {
            player.draw();
            player.update(fps);
            if (player.currentPersoState == PersoState.KO) {
                if (player !== this.mainPlayer) {
                    if (this.mainPlayer.opponents.length == 0) {
                        this.gameState = GameState.GAME_OVER;
                        this.resDefer();
                    }
                    else {
                        findAndRemove(this.tabPlayer, player);
                        findAndRemove(this.opponents, player);
                    }
                } else {
                    this.gameState = GameState.GAME_OVER;
                    this.resDefer();
                }
            }
            //console.log(this.mainPlayer.polygons.points);
        }

        for (let p of this.tabPlayer) {
            if (p !== this.mainPlayer) {
                p.animeRandom(fps);
            }
        }

        if(this.gameState == GameState.DEMO){
            for (let p of this.tabPlayer) { {
                    p.animeRandom(fps);
                }
            }
        }

        this.fps.update(fps);
        this.fps.draw();
        this.overlay.draw();

        /* Gestion de l'ambiance sonore */
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
        this.intro();
    }

    resDefer() {
        setTimeout(this.restart, 1000);
    }

    pause() {
        clearInterval(this.timer);
    }
    restart() {
        window.document.location.reload();
    }

    onResize() {
        let width = document.body.clientWidth;
        let height = document.body.clientHeight;

        this.cnv.width = width;
        this.cnv.height = height;
    }
}

