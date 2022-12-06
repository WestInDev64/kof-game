export class SelectPerso {
    constructor(cnv, ctx, game) {
        this.cnv = cnv;
        this.ctx = ctx;
        this.game = game;
        this.currentSelect = 0;
        this.img;
        this.timeAnimation = 0;
        this.background = [];
        this.titleImg;
        this.col = 3;
        this.lin = 2;


        /* LEs persos */
        this.persos = {
            nb: 6,
            array: []
        };

        this.jsLogoAnime = {
            nb: 4,
            array: [],
            frame: 0
        };


        this.menu = {
            confirm: {
                text: "Press W Confirm",
                x: this.cnv.width * 0.2,
                y: this.cnv.height * 0.6
            },
            cancel: {
                text: "Press X Cancel",
                x: this.cnv.width * 0.2,
                y: this.cnv.height * 0.65
            },
            controls: {
                text: "Controls: ",
                x: this.cnv.width * 0.6,
                y: this.cnv.height * 0.4
            },
            punch: {
                text: "Punch: W",
                x: this.cnv.width * 0.6,
                y: this.cnv.height * 0.5
            },
            kick: {
                text: "Kick: X",
                x: this.cnv.width * 0.6,
                y: this.cnv.height * 0.55
            },
            jump: {
                text: "Jump: Arrow Up",
                x: this.cnv.width * 0.6,
                y: this.cnv.height * 0.60
            },
            crouch: {
                text: "Crouch: Arrow Down",
                x: this.cnv.width * 0.6,
                y: this.cnv.height * 0.65
            },
            walkF: {
                text: "Walk: Arrow Left & Right",
                x: this.cnv.width * 0.6,
                y: this.cnv.height * 0.70
            }
        };
    }

    loadimg() {
        this.titleImg = new Image();
        this.titleImg.src = `assets/img/sprt/kof-title.png`;

        for (let i = 0; i < this.jsLogoAnime.nb; i++) {
            let jslogo = new Image();
            jslogo.src = `assets/img/sprt/js-logo/frame_${i.toString().padStart(2, '0')}.png`;
            this.jsLogoAnime.array.push(jslogo);
        }

        this.persos.array = [
            {
                name: "Mai",
                img: new Image(),
                position: { x: 0, y: 0 }
            },
            {
                name: "King",
                img: new Image(),
                position: { x: 0, y: 0 }
            },
            {
                name: "Kyo",
                img: new Image(),
                position: { x: 0, y: 0 }

            },
            {
                name: "Kim",
                img: new Image(),
                position: { x: 0, y: 0 }
            },
            {
                name: "Kensou",
                img: new Image(),
                position: { x: 0, y: 0 }
            },
            {
                name: "Terry",
                img: new Image(),
                position: { x: 0, y: 0 }
            }
        ];

        this.persos.array[0].img.src = "assets/img/CSEL/mai.png";
        this.persos.array[1].img.src = "assets/img/CSEL/king.png";
        this.persos.array[2].img.src = "assets/img/CSEL/kyo.png";
        this.persos.array[3].img.src = "assets/img/CSEL/kim.png";
        this.persos.array[4].img.src = "assets/img/CSEL/kensou.png";
        this.persos.array[5].img.src = "assets/img/CSEL/terry.png";
    }

    init() {
        this.loadimg();
    }


    update(time) {

        if (time.previous > this.timeAnimation + 99) {
            this.timeAnimation = time.previous;
            this.jsLogoAnime.frame++;
            if (this.jsLogoAnime.frame > (this.jsLogoAnime.nb - 1))
                this.jsLogoAnime.frame = 0;
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

        // console.log(this.persos.array);
        const persoThumbW = this.persos.array[0].img.width;
        const persoThumbH = this.persos.array[0].img.height;
        const sizeThumbW = 44;
        const sizeThumbH = 44;
        const gap = 8;

        // Background
        this.ctx.fillStyle = "darkred";
        this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);

        // Logo + Titre
        this.ctx.drawImage(this.jsLogoAnime.array[this.jsLogoAnime.frame], this.cnv.width - (this.jsLogoAnime.array[this.jsLogoAnime.frame].width / 2), this.cnv.height * 0.1, this.jsLogoAnime.array[this.jsLogoAnime.frame].width / 4, this.jsLogoAnime.array[this.jsLogoAnime.frame].height / 4);
        this.ctx.drawImage(this.titleImg, w / 6, this.cnv.height * 0.1, w / 2, h / 2);

        this.ctx.save();
        this.ctx.translate(this.cnv.width * 0.33, this.cnv.height * 0.33);


        let i = 0;
        for (let thumb of this.persos.array) {
        }
        for (let i = 0; i < this.lin; i++) {
            for (let j = 0; j < this.col; j++) {
                this.ctx.drawImage(this.persos.array[this.col * i + j].img, 178, 210, 44, 44, (sizeThumbW + gap) * j, (sizeThumbH + gap) * i, 44, 44);
                this.persos.array[this.col * i + j].position.x = (sizeThumbW + gap) * j;
                this.persos.array[this.col * i + j].position.y = (sizeThumbH + gap) * i;

            }
        }

        // Dessine rectangle selection
        if (this.jsLogoAnime.frame % 2 == 0) {
            this.drawCursor(this.persos.array[this.currentSelect]);
        }
        this.ctx.restore();
        //this.ctx.drawImage(thi s.ioriAnime.array[this.ioriAnime.frame], w / 4, this.cnv.height - 200, this.ioriAnime.array[this.ioriAnime.frame].width, this.ioriAnime.array[this.ioriAnime.frame].height);


        this.jsLogoAnime.frame % 4 == 0 ? this.ctx.fillStyle = "red" : this.ctx.fillStyle = "darkblue";
        this.ctx.font = "bold 20px system-ui";
        this.ctx.textAlign = "left";   
        this.ctx.fillStyle = "blue";
        this.ctx.fillText(`Player 1: ${this.persos.array[this.currentSelect].name}`, this.cnv.width * 0.05 , this.cnv.height * 0.4);
        //this.ctx.fillStyle = "red";
        //this.ctx.fillText(`Player 2: ${this.persos.array [this.currentSelect].name}`, this.cnv.width * 0.70 , this.cnv.height * 0.4);
        this.ctx.fillStyle = "orange";
        this.ctx.fillText(this.menu.confirm.text, this.menu.confirm.x, this.menu.confirm.y);
        this.ctx.fillText(this.menu.cancel.text, this.menu.cancel.x, this.menu.cancel.y);
        this.ctx.fillText(this.menu.controls.text, this.menu.controls.x, this.menu.controls.y);
        this.ctx.fillText(this.menu.punch.text, this.menu.punch.x, this.menu.punch.y);
        this.ctx.fillText(this.menu.kick.text, this.menu.kick.x, this.menu.kick.y);
        this.ctx.fillText(this.menu.jump.text, this.menu.jump.x, this.menu.jump.y);
        this.ctx.fillText(this.menu.crouch.text, this.menu.crouch.x, this.menu.crouch.y);
        this.ctx.fillText(this.menu.walkF.text, this.menu.walkF.x, this.menu.walkF.y);
        this.ctx.font = "bold 12px system-ui";
        this.ctx.fillText(`version plus que Beta v0.0.1`, w * 0.7, this.cnv.height * 0.97);

    }

    drawCursor(perso) {
        /* this.ctx.beginPath();
        this.ctx.moveTo(menupos.x - 30, menupos.y - 16);
        this.ctx.lineTo(menupos.x - 30, menupos.y);
        this.ctx.lineTo(menupos.x, menupos.y - 8);
        this.ctx.lineTo(menupos.x, menupos.y - 8);
        this.ctx.closePath(); */
        this.ctx.strokeStyle = "blue";
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(perso.position.x, perso.position.y, 44, 44);


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
        switch (event.key) {
            case "w":
                this.game.init(this.persos.array[this.currentSelect].name);
                break;
            case "x":
                break;
            case "ArrowDown":
                if (this.currentSelect < this.col)
                    this.currentSelect += 3;
                break;
            case "ArrowUp":
                if (this.currentSelect >= this.col)
                    this.currentSelect -= 3;
                break;
            case "ArrowRight":
                if (this.currentSelect % this.col !== this.col - 1)
                    this.currentSelect++;
                break;
            case "ArrowLeft":
                if (this.currentSelect % this.col !== 0)
                    this.currentSelect--;
                break;
            default:
                break;
        }

    }
}