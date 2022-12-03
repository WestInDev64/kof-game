

// COULEUR RGB
export class Color {
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    static lerp(c1, c2, ratio) {
        const r = Math.round((c2.r - c1.r) * ratio + c1.r);
        const g = Math.round((c2.g - c1.g) * ratio + c1.g);
        const b = Math.round((c2.b - c1.b) * ratio + c1.b);

        return new Color(r, g, b);
    }

    toString() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }
}

export class HealthBar {
    constructor(perso, canvas, ctx, posX, posY, hp, hpMax, cnvW, cnvH) {
        this.perso = perso;
        this.cnv = canvas;
        this.ctx = ctx;
        this.w = cnvW;
        this.h = cnvH * 0.1;
        this.posX = posX;
        this.posY = posY - this.h;
        this.hp = hp;
        this.hpMax = hpMax;
    }

    rodolpheBar() {

        const map = (v, srcMin, srcMax, dstMin, dstMax) => {
            return (v - srcMin) * (dstMax - dstMin) / (srcMax - srcMin) + dstMin;
        };
        this.ctx.save();
        this.ctx.translate(this.perso.position.x, this.perso.position.y);
        if (this.perso.dirInverse) {
            this.ctx.translate(this.w,0);
            this.ctx.scale(-1, 1);
        }

        let life = this.perso.hp;
        //console.log(life);
        const lifeMax = this.perso.hpMax;
        const barSize = this.w;

        // Background
        this.ctx.fillStyle = "#000";
        this.ctx.beginPath();
        this.ctx.moveTo(0, 10);
        this.ctx.lineTo(5, 0);
        this.ctx.lineTo(barSize, 0);
        this.ctx.lineTo(barSize - 5, 10);
        this.ctx.closePath();
        this.ctx.fill();

        // Life
        const lifeRatio = life / lifeMax;
        const red = new Color(255, 0, 0);
        const orange = new Color(255, 176, 0);
        const yellow = new Color(255, 255, 0);
        const green = new Color(85, 255, 85);

        if (lifeRatio > 0.66)
            this.ctx.fillStyle = Color.lerp(yellow, green, (lifeRatio - 0.66) * 3).toString();
        else if (lifeRatio > 0.33)
            this.ctx.fillStyle = Color.lerp(orange, yellow, (lifeRatio - 0.33) * 3).toString();
        else
            this.ctx.fillStyle = Color.lerp(red, orange, lifeRatio * 3).toString();

        this.ctx.beginPath();
        this.ctx.moveTo(barSize, 0);
        const x = Math.round(lifeRatio * barSize);
        if (x <= 5) {
            const y = map(x, 0, 5, 0, 10);
            this.ctx.lineTo(barSize - x, y);
            this.ctx.lineTo(barSize - x, 0);
        } else if (x < barSize - 5) {
            this.ctx.lineTo(barSize - 5, 10);
            this.ctx.lineTo(barSize - x, 10);
            this.ctx.lineTo(barSize - x, 0);
        } else {
            const y = map(x, barSize - 5, barSize, 0, 10);
            this.ctx.lineTo(barSize - 5, 10);
            this.ctx.lineTo(barSize - x, 10);
            this.ctx.lineTo(barSize - x, y);
            this.ctx.lineTo(5, 0);
        }
        this.ctx.closePath();
        this.ctx.fill();

        // Reflet
        this.ctx.fillStyle = "#fff8";
        this.ctx.beginPath();
        this.ctx.moveTo(2, 6);
        this.ctx.lineTo(4, 2);
        this.ctx.lineTo(barSize - 1, 2);
        this.ctx.lineTo(barSize - 3, 6);
        this.ctx.closePath();
        this.ctx.fill();

        // Border
        this.ctx.strokeStyle = "#000";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, 10);
        this.ctx.lineTo(5, 0);
        this.ctx.lineTo(barSize, 0);
        this.ctx.lineTo(barSize - 5, 10);
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.restore();
    }

    healthbarre() {
        this.ctx2Dx.fillStyle = "#000000";
        this.ctx2Dx.fillRect(this.posX, this.posY, this.hpMax, 25);
        if (this.hpMax * 0.75 < this.hp) {
            this.ctx2Dx.fillStyle = "#00FF00";
        }
        if (this.hpMax * 0.75 > this.hp) {
            this.ctx2Dx.fillStyle = "#FFFF00";
        }
        if (this.hpMax * 0.50 > this.hp) {
            this.ctx2Dx.fillStyle = "#FF9900";
        }
        if (this.hpMax * 0.25 > this.hp) {
            this.ctx2Dx.fillStyle = "#FF0000";
        }
        if (this.hp <= 0) {
            this.hp = 0;
            this.kO = true;
            this.ctx2Dx.fillStyle = "#FF0000";
        }
        this.ctx2Dx.fillRect(this.posX, this.posY, this.hp, 25);
    }
}