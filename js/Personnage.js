

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

// PERSONNAGE
export class Personnage {
    constructor(name, assetsFolder, imgNamePng, startPosition, codePlayer, json, bgGrid, plfGrid, canvas, ctx) {
        this.name = name;
        this.codePlayer = codePlayer;
        this.hp = 100;
        this.hpMax = 100;
        this.assetsFolder = assetsFolder;
        this.imgNamePng = imgNamePng;
        this.assets = [];
        this.detail = json;
        this.cnvW = 128 / 2;
        this.cnvH = 120;
        this.posX = 0;
        this.posY = 0;
        this.imgId = 0;
        this.canMove = true;
        this.dirMove = 4;
        this.actionNum = 0;
        this.onAction = false;
        this.onHit = false;
        this.kO = false;
        this.dirInverse = false;
        this.startPosition = startPosition;
        this.bgGrid = bgGrid;
        this.plfGrid = plfGrid;
        this.cnv = canvas;
        this.ctx2D = ctx;
    }

    loadImg() {
        for (let i = 0; i < this.detail.nbFrames; i++) {
            this.img = new Image();
            this.img.src = `assets/img/persos/${this.assetsFolder}/${this.imgNamePng}${i}.png`;
            //this.img.sizes.
            this.assets.push(this.img);
        }
    }

    init() {
        this.loadImg();
        if (this.startPosition == 'L') {
            this.posX = 2 * this.cnvW;
            this.posY = 3 * this.cnvH;
            this.dirInverse = true;
        }
        else {
            let col = getRandomArbitrary(5, 10)
            let lin = getRandomArbitrary(0, 4)
            this.posX = col * this.cnvW;
            this.posY = lin * this.cnvH;
        }
        //this.healthBar();
        this.rodolpheBar();
    }

    healthBar() {
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

    rodolpheBar() {

        const map = (v, srcMin, srcMax, dstMin, dstMax) => {
            return (v - srcMin) * (dstMax - dstMin) / (srcMax - srcMin) + dstMin;
        };

        this.ctx2D.save();
        this.ctx2D.translate(this.posX, this.posY);

        const life = this.hp;
        const lifeMax = this.hpMax;
        const barSize = this.cnvW;

        // Background
        this.ctx2D.fillStyle = "#000";
        this.ctx2D.beginPath();
        this.ctx2D.moveTo(0, 10);
        this.ctx2D.lineTo(5, 0);
        this.ctx2D.lineTo(barSize, 0);
        this.ctx2D.lineTo(barSize - 5, 10);
        this.ctx2D.closePath();
        this.ctx2D.fill();

        // Life
        const lifeRatio = life / lifeMax;
        const red = new Color(255, 0, 0);
        const orange = new Color(255, 176, 0);
        const yellow = new Color(255, 255, 0);
        const green = new Color(85, 255, 85);

        if (lifeRatio > 0.66)
            this.ctx2D.fillStyle = Color.lerp(yellow, green, (lifeRatio - 0.66) * 3).toString();
        else if (lifeRatio > 0.33)
            this.ctx2D.fillStyle = Color.lerp(orange, yellow, (lifeRatio - 0.33) * 3).toString();
        else
            this.ctx2D.fillStyle = Color.lerp(red, orange, lifeRatio * 3).toString();

        this.ctx2D.beginPath();
        this.ctx2D.moveTo(0, 10);
        const x = Math.round(lifeRatio * barSize);
        if (x <= 5) {
            const y = map(x, 0, 5, 10, 0);
            this.ctx2D.lineTo(x, y);
            this.ctx2D.lineTo(x, 10);
        } else if (x < barSize - 5) {
            //console.clear();
            //console.log(x)
            this.ctx2D.lineTo(5, 0);
            this.ctx2D.lineTo(x, 0);
            this.ctx2D.lineTo(x, 10);
        } else {
            const y = map(x, barSize - 5, barSize, 10, 0);
            this.ctx2D.lineTo(5, 0);
            this.ctx2D.lineTo(x, 0);
            this.ctx2D.lineTo(x, y);
            this.ctx2D.lineTo(barSize - 5, 10);
        }
        this.ctx2D.closePath();
        this.ctx2D.fill();

        // Reflet
        this.ctx2D.fillStyle = "#fff8";
        this.ctx2D.beginPath();
        this.ctx2D.moveTo(2, 6);
        this.ctx2D.lineTo(4, 2);
        this.ctx2D.lineTo(barSize - 1, 2);
        this.ctx2D.lineTo(barSize - 3, 6);
        this.ctx2D.closePath();
        this.ctx2D.fill();

        // Border
        this.ctx2D.strokeStyle = "#000";
        this.ctx2D.lineWidth = 2;
        this.ctx2D.beginPath();
        this.ctx2D.moveTo(0, 10);
        this.ctx2D.lineTo(5, 0);
        this.ctx2D.lineTo(barSize, 0);
        this.ctx2D.lineTo(barSize - 5, 10);
        this.ctx2D.closePath();
        this.ctx2D.stroke();

        this.ctx2D.restore();
    }

    setDirMove(val) {
        this.dirMove = val;
    }

    getPosX() {
        return this.posX;
    }
    getPosY() {
        return this.posY;
    }

    idle() {
        this.dirMove = 0;
    }

    draw() {
        /**
         * Sauvegarde le contexte à sa forme initiale
         * Déplace le contexte à la position du sprite
         * Déplace d'une taille en x si inversion du sprite 
         * (car l'inversion du contexte est effcuté à partir de la position d'origine)
         * Dessine l'image à la position 0 -> car ctx précédemment déplacé
         * Restore le contexte à sa forme initiale
         */
        //this.healthBar();
        this.rodolpheBar();
        this.ctx2D.save();
        // Tailles dynamiques en fonction du sprite
        let sizeSpriteW = this.assets[this.imgId].width;
        let sizeSpriteH = this.assets[this.imgId].height;
        this.ctx2D.translate((this.posX + this.cnvW / 2) - sizeSpriteW / 2, (this.posY + this.cnvH) - sizeSpriteH);
        if (this.dirInverse) {
            this.ctx2D.translate(sizeSpriteW, 0);
            this.ctx2D.scale(-1, 1);
        }
        this.ctx2D.drawImage(this.assets[this.imgId], 0, 0);
        this.ctx2D.fillStyle = "#00FFFF75";
        this.ctx2D.fillRect(0, 0, sizeSpriteW, sizeSpriteH);
        this.ctx2D.restore();
    }

    animeRandom() {
        //const shouldMove = Math.random() > 0.85;
        const isIdle = this.imgId >= this.detail.animations.find(a => a.name === 'idle').start
            && this.imgId <= this.detail.animations.find(a => a.name === 'idle').end;
        const shouldMove = Math.random() > 0.85;
        if (isIdle && shouldMove) {
            const direction = Math.floor(Math.random() * 5);
            this.setDirMove(direction);
        }
        else {
            this.setDirMove(0);
        }
    }


    action() {
        switch (this.actionNum) {
            case 0:
                this.imgId = this.detail.animations.find(a => a.name === 'kick').start;
                break;
            case 1:
                this.imgId = this.detail.animations.find(a => a.name === 'dammaged').start;
                break;
            case 2:
                this.imgId = this.detail.animations.find(a => a.name === 'ko').start;
                break;
            default:
                break;
        }
    }


    move() {
        switch (this.dirMove) {
            case 0: // IDLE
                this.imgId++;
                for (const anime of this.detail.animations) {
                    if (this.imgId == anime.end + 1) {
                        this.imgId = this.detail.animations.find(a => a.name === 'idle').start;
                        this.onAction = false;
                    }
                }
                break;
            case 1: // DROITE
                if (this.posX < this.cnv.width - this.cnvW) this.posX += 10;
                // Animation de marche possible au bord de la grille
                this.imgId = this.detail.animations.find(a => a.name === 'walkFwd').start;
                break;
            case 2: // GAUCHE
                if (this.posX > this.cnvW) this.posX -= 10;
                // Animation de marche possible au bord de la grille
                this.imgId = this.detail.animations.find(a => a.name === 'walkFwd').start;
                break;
            case 3: // HAUT
                if (this.posY > 0) {
                    this.posY -= this.cnvH;
                    this.imgId = this.detail.animations.find(a => a.name === 'jump').start
                }
                break;
            case 4: // BAS
                if (this.posY < this.cnv.height - this.cnvH) this.posY += this.cnvH;
                // Animation de s'accroupir possible au sol
                this.imgId = this.detail.animations.find(a => a.name === 'crouch').start
                break;
            default:
                break;
        }
    }

    enemyClose() {
        // détection adversers adjacents
        let enemyOnTheLeft, enemyOnTheRight, leftPlayer, rightPlayer;
        // pour l'ensemble des joueurs  je vérifie leurs cases adjacentes
        // si elles sont supérieurs à 0, alors il y a un joueur sinon elles sont vides
        for (let player of this.tabPlayers) {
            // si je suis en col 0 je regarde qu'à droite 
            // si je suis en col (nbCol - 1) je regarde qu'à gauche 
            // sion je regarde a gauche et a droite
            if (player.posX >= 0
                && player.posX <= (this.nbCol - 2) * player.cnvW
                && this.bgGrid.coord_to_cell(player.posX + player.cnvW, player.posY).state > 0
                && this.bgGrid.coord_to_cell(player.posX + player.cnvW, player.posY).state !== player.codePlayer) {
                rightPlayer = this.bgGrid.coord_to_cell(player.posX + player.cnvW, player.posY).player;
                enemyOnTheRight = rightPlayer != undefined;
                //console.log(rightPlayer);
            }
            else if (player.posX <= player.cnvW * (this.nbCol - 1)
                && player.posX >= player.cnvW
                && this.bgGrid.coord_to_cell(player.posX - player.cnvW, player.posY).state > 0
                && this.bgGrid.coord_to_cell(player.posX - player.cnvW, player.posY).state !== player.codePlayer) {
                leftPlayer = this.bgGrid.coord_to_cell(player.posX - player.cnvW, player.posY).player;
                enemyOnTheLeft = leftPlayer != undefined;
                //console.log(leftPlayer);
            }
            else {
                return;
            }
            /*  if ((enemyOnTheLeft || enemyOnTheRight) && (this.onAction == false)) {
                 this.onAction = true; */
            if (enemyOnTheLeft && (player.onAction == false)) {
                player.onAction = true;
                leftPlayer.onHit = true;
                if (leftPlayer.hp <= 0) {
                    leftPlayer.kO = true;
                    leftPlayer.actionNum = 2;
                    player.actionNum = 3;
                }
                else {
                    player.actionNum = 0;
                    leftPlayer.hp -= 10;
                    leftPlayer.actionNum = 1;
                }
                if (player.dirInverse) player.dirInverse = false;
                player.action();
                leftPlayer.action();
            }

            if (enemyOnTheRight && (player.onAction == false)) {
                player.onAction = true;
                rightPlayer.onHit = true;
                if (rightPlayer.hp <= 0) {
                    rightPlayer.kO = true;
                    rightPlayer.actionNum = 2;
                    player.actionNum = 3;
                }
                else {
                    player.actionNum = 0;
                    rightPlayer.hp -= 10;
                    rightPlayer.actionNum = 1;
                }
                if (!player.dirInverse) player.dirInverse = true;
                player.action();
                rightPlayer.action();
            }
        }
    }


}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}