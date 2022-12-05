export class Intro {
    constructor(cnv, ctx) {
        this.cnv = cnv;
        this.ctx = ctx;
        this.img;
        this.timeAnimation = 0;
        this.background = [];
        this.titleImg;
        this.imgFrame = 0;
        this.iorigif = {
            nb: 26,
            array: []
        };
        this.jsLogo = {
            nb: 4,
            array: []
        };
        this.menu = [];

    }
    loadimg() {
        this.titleImg = new Image();
        this.titleImg.src = `assets/img/sprt/kof-title.png`;
        for (let i = 0; i < this.iorigif.nb; i++) {
            let iori = new Image();
            iori.src = `assets/img/sprt/iori/frame_${i.toString().padStart(2, '0')}.png`;
            this.iorigif.array.push(iori);
        }
        console.log(this.iorigif);
    }


    init() {
        this.loadimg();
    }


    update(time) {

        if (time.previous > this.timeAnimation + 99 ) {
            this.timeAnimation = time.previous;
            this.imgFrame++;
            if(this.imgFrame > this.iorigif.array.nb){
                this.imgFrame = 0;
            }
        }
        console.log(this.imgFrame);
    }


    draw() {
        /* const ratioW = this.cnv.width / this.bgLayers[this.imgId].width;
        const ratioH = this.cnv.height / this.bgLayers[this.imgId].height;
        const ratio = Math.max(ratioW, ratioH);
        const w = this.background[this.imgId].width * ratio;
        const h = this.bgLayers[this.imgId].height * ratio; */

        const h = (this.titleImg.height / this.titleImg.width) * this.cnv.width;
        const w = this.cnv.width;
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.cnv.width, this.cnv.height);
        this.ctx.drawImage(this.titleImg, w / 4, h / 2, w / 2, h / 2);
        this.ctx.drawImage(this.iorigif.array[this.imgFrame], w / 4, this.cnv.height - 200, this.iorigif.array[this.imgFrame].width, this.iorigif.array[this.imgFrame].height);
    }

    controlKeyDown() {
    }
}