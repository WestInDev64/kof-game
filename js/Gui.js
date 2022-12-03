export class FpsCounter {
    constructor(ctx) {
        this.ctx = ctx;
        this.fps = 0;
    }

    update(time){
        this.fps = Math.trunc(1 / time.secondsPassed);
    }

    draw(){
        this.ctx.font = "bold 20px Arial";
        this.ctx.fillStyle = "black";
        this.ctx.textAlign = "center";
        this.ctx.fillText(`FPS : ${this.fps}`, this.ctx.canvas.width / 2, 30);
    }
}