import { HealthBar, Color } from "./HealthBar.js";

// PERSONNAGE
export class Personnage {
    constructor(name, assetsFolder, imgNamePng, startPosition, codePlayer, json, bgGrid, plfGrid, canvas, ctx, hpbar) {
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
        this.hpBar;
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
        this.hpBar = new HealthBar(this, this.cnv, this.ctx2D, this.posX, this.posY, this.hp, this.hpMax, this.cnvW, this.cnvH);
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
        this.ctx2D.save();
        // Tailles dynamiques en fonction du sprite
        let sizeSpriteW = this.assets[this.imgId].width;
        let sizeSpriteH = this.assets[this.imgId].height;
        /**
         * Je translate en X -> largeur de grille / 2 -  (32px) - largeur sprite (30px ) 
         */
        this.ctx2D.translate((this.posX + this.cnvW / 2) - sizeSpriteW / 2, (this.posY + this.cnvH) - sizeSpriteH);
        if (this.dirInverse) {
            this.ctx2D.translate(sizeSpriteW, 0);
            this.ctx2D.scale(-1, 1);
        }
        this.ctx2D.drawImage(this.assets[this.imgId], 0, 0);
        this.ctx2D.fillStyle = "#00FFFF75";
        this.ctx2D.fillRect(0, 0, sizeSpriteW, sizeSpriteH);
        
        //console.log(this.hpBar);
        this.ctx2D.restore();
        this.hpBar.rodolpheBar();
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