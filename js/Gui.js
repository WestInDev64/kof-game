export class FpsCounter {
    constructor(ctx) {
        this.ctx = ctx;
        this.fps = 0;
    }

    update(time) {
        this.fps = Math.trunc(1 / time.secondsPassed);
    }

    draw() {
        this.ctx.font = "bold 20px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.textAlign = "center";
        this.ctx.fillText(`FPS : ${this.fps}`, this.ctx.canvas.width / 2, 30);
    }
}

export class Overlay {
    constructor(cnv, ctx, game) {
        this.cnv = cnv;
        this.ctx = ctx;
        this.game = game;
    }

    update(time) {
        this.fps = Math.trunc(1 / time.secondsPassed);
    }

    draw() {
        this.ctx.font = "bold 20px Arial";
        this.ctx.strokeStyle='black';
        this.ctx.fillStyle = "black";
        this.ctx.textAlign = "left";
        this.ctx.fillText(`${this.game.tabPlayer[0].name} hp: ${Math.round(this.game.tabPlayer[0].hp)}%`, 30, 30);
        this.ctx.fillText(`hp: ${Math.round(this.game.tabPlayer[1].hp)}%`, this.cnv.width - 100, 30);
        this.ctx.stroke();
    }

}


//New class Menu because i don't understand your canvas at all
export class Menu {
    constructor({
        pos,
        imgSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        ctx
    }) {
        this.pos = pos
        this.height = 300
        this.width = 100
        this.image = new Image()
        this.image.src = imgSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = this.offset = offset
        this.ctx = ctx;
    }
    //added
    draw() {
        this.ctx.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.pos.x - this.offset.x,
            this.pos.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        )
    }
    //added
    frames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }
    // methode pour mettre a jour, les pos des personnages.
    animer() {
        this.draw()
        this.frames()
    }
}