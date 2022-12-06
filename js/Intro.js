export class Intro {
    constructor(cnv, ctx, game) {
        this.cnv = cnv;
        this.ctx = ctx;
        this.game = game;
        this.currentSelect = 0;
        this.img;
        this.timeAnimation = 0;
        this.background = [];
        this.titleImg;
        this.ioriAnime = {
            nb: 26,
            array: [],
            frame: 0
        };
        this.jsLogoAnime = {
            nb: 4,
            array: [],
            frame: 0
        };
        this.musicState = "OFF";
        this.menu = {
            new_game: {
                text: "New Game",
                x: this.cnv.width * 0.4,
                y: this.cnv.height * 0.6
            },
            demo: {
                text: "Demo",
                x: this.cnv.width * 0.4,
                y: this.cnv.height * 0.65
            },
            sound: {
                text: "Sound: ",
                x: this.cnv.width * 0.4,
                y: this.cnv.height * 0.7
            },
        };
    }

    loadimg() {
        this.titleImg = new Image();
        this.titleImg.src = `assets/img/sprt/kof-title.png`;

        for (let i = 0; i < this.ioriAnime.nb; i++) {
            let iori = new Image();
            iori.src = `assets/img/sprt/iori/frame_${i.toString().padStart(2, '0')}.png`;
            this.ioriAnime.array.push(iori);
        }
        for (let i = 0; i < this.jsLogoAnime.nb; i++) {
            let jslogo = new Image();
            jslogo.src = `assets/img/sprt/js-logo/frame_${i.toString().padStart(2, '0')}.png`;
            this.jsLogoAnime.array.push(jslogo);
        }
    }


    init() {
        this.loadimg();
    } 


    update(time) {

        if (time.previous > this.timeAnimation + 99) {
            this.timeAnimation = time.previous;
            this.jsLogoAnime.frame++;
            this.ioriAnime.frame++;
            if (this.jsLogoAnime.frame > (this.jsLogoAnime.nb - 1))
                this.jsLogoAnime.frame = 0;
            if (this.ioriAnime.frame > (this.ioriAnime.nb - 1))
                this.ioriAnime.frame = 0;
        }

    }


    draw() {
        this.clearCanvas();
        /* const ratioW = this.cnv.width / this.bgLayers[this.imgId].width;
        const ratioH = this.cnv.height / this.bgLayers[this.imgId].height;
        const ratio = Math.max(ratioW, ratioH);
        const w = this.background[this.imgId].width * ratio;
        const h = this.bgLayers[this.imgId].height * ratio; */
        const h = (this.titleImg.height / this.titleImg.width) * this.cnv.width;
        const w = this.cnv.width;
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);
        this.ctx.drawImage(this.jsLogoAnime.array[this.jsLogoAnime.frame], this.cnv.width - (this.jsLogoAnime.array[this.jsLogoAnime.frame].width / 2), h / 2, this.jsLogoAnime.array[this.jsLogoAnime.frame].width / 4, this.jsLogoAnime.array[this.jsLogoAnime.frame].height / 4);
        this.ctx.drawImage(this.titleImg, w / 6, h / 2, w / 2, h / 2);
        this.ctx.drawImage(this.ioriAnime.array[this.ioriAnime.frame], w / 4, this.cnv.height - 200, this.ioriAnime.array[this.ioriAnime.frame].width, this.ioriAnime.array[this.ioriAnime.frame].height);
        this.ctx.font = "bold 20px system-ui";
        // triangle selection
        if (this.jsLogoAnime.frame % 2 == 0) {
            switch (this.currentSelect) {
                case 0:
                    this.drawCursor(this.menu.new_game);
                    break;
                case 1:
                    this.drawCursor(this.menu.demo);
                    break;
                case 2:
                    this.drawCursor(this.menu.sound);
                    break;
                case 3:
                    this.drawCursor(this.menu.exit);
                    break;
                default:
                    break;
            }
        }
        this.jsLogoAnime.frame % 4 == 0 ? this.ctx.fillStyle = "red" : this.ctx.fillStyle = "darkblue";
        this.ctx.fill();
        this.ctx.fillStyle = "orange";
        this.ctx.textAlign = "left";
        this.ctx.fillText(this.menu.new_game.text, this.menu.new_game.x, this.menu.new_game.y);
        this.ctx.fillText(this.menu.demo.text, this.menu.demo.x, this.menu.demo.y);
        this.ctx.fillText(`${this.menu.sound.text}${this.musicState}`, this.menu.sound.x, this.menu.sound.y);
        this.ctx.font = "bold 12px system-ui";
        this.ctx.fillText(`version plus que Beta v0.0.1`, w * 0.7, this.cnv.height * 0.97);
        if (this.ioriAnime.frame > 10)
            this.ctx.fillText(`Insert Coin -> Press "W"`, w * 0.1, this.cnv.height * 0.97);
    }

    drawCursor(menu) {
        const menupos = menu;
        this.ctx.beginPath();
        this.ctx.moveTo(menupos.x - 30, menupos.y - 16);
        this.ctx.lineTo(menupos.x - 30, menupos.y);
        this.ctx.lineTo(menupos.x, menupos.y - 8);
        this.ctx.closePath();
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

    controlsKeyDown(event) {
        //console.log(event.key);
        if (this.currentSelect > 3) this.currentSelect = 0;
        switch (event.key) {
            case "w":
                if(this.currentSelect == 0) {
                    this.game.selectPerso();
                }
                else if(this.currentSelect == 1) this.game.demo();
                else if(this.currentSelect == 2) {
                    //console.log("TEST", this.musicState, this.currentSelect);
                    if(this.musicState == "OFF"){
                        this.musicState = "ON";
                        this.game.sound.music.play();
                        //this.game.sound.music.stop();
                    }else {
                        this.musicState = "OFF";
                        this.game.sound.music.pause();
                    }
                }
                break;
            case "ArrowDown":
                if (this.currentSelect < 2)
                    this.currentSelect++;
                break;
            case "ArrowUp":
                if (this.currentSelect > 0)
                    this.currentSelect--;
                break;
            default:
                break;
        }

    }z

}