import { HealthBar, Color } from "./HealthBar.js";

// PERSONNAGE
export class Personnage {
    constructor(name, assetsFolder, imgNamePng, startPosition, codePlayer, json, canvas, ctx) {
        /* Rendu */
        this.cnv = canvas;
        this.ctx2D = ctx;

        /* Details perso */
        this.name = name;
        this.codePlayer = codePlayer;
        this.hp = 100;
        this.hpMax = 100;
        this.kO = false;
        this.startPosition = startPosition;

        /* Sprites & animations */
        this.imgNamePng = imgNamePng;
        this.assetsFolder = assetsFolder;
        this.assets = [];
        this.imgId = 0;
        this.detail = json;
        this.currentSpriteH;
        this.currentSpriteW;
        this.img;

        /* Position taille  */
        this.cnvW = 128 / 2;
        this.cnvH = 120;
        this.posX = 0;
        this.posY = 0;
        this.dirInverse = false;

        /* Déplacements - Mouvements*/
        this.canMove = true;
        this.dirMove = 4;
        this.actionNum = 0;
        this.onAction = false;
        this.onHit = false;
        this.isCollide = false;

        /* Objets rattachés */
        this.hpBar;
        this.polygons;
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
        this.currentSpriteW = this.assets[this.imgId].width;
        this.currentSpriteH = this.assets[this.imgId].height;
        /**
         * Je translate en X -> largeur de grille / 2 -  (32px) - largeur sprite (30px ) 
         */
        this.ctx2D.translate((this.posX + this.cnvW / 2) - this.currentSpriteW / 2, (this.posY + this.cnvH) - this.currentSpriteH);
        if (this.dirInverse) {
            this.ctx2D.translate(this.currentSpriteW, 0);
            this.ctx2D.scale(-1, 1);
        }
        this.ctx2D.drawImage(this.assets[this.imgId], 0, 0);
        this.ctx2D.fillStyle = "#00FFFF75";
        this.ctx2D.fillRect(0, 0, this.currentSpriteW, this.currentSpriteH);

        this.updateDynamicObj();                                                // Met à jour les polygons
        this.drawPolygon(this.polygons);                                   // Dessine les polygons dans le context du perso

        this.ctx2D.restore();                                                   // Restore le contexte
        this.hpBar.rodolpheBar();
    }

    drawPolygon(polygon) {
        this.ctx2D.beginPath();
        this.ctx2D.moveTo(polygon.points[0].x, polygon.points[0].y);
        for (let i = 0; i < polygon.points.length; i++) {
            this.ctx2D.lineTo(polygon.points[i].x, polygon.points[i].y);
        }
        this.ctx2D.lineTo(polygon.points[0].x, polygon.points[0].y);
        this.ctx2D.strokeStyle = "#FF0000";
        this.ctx2D.stroke();
        this.ctx2D.closePath();
    }

    updateDynamicObj() {
        /* Polygon de collision en fonction du sprite */
        this.polygons = new SAT.Polygon(new SAT.Vector(this.posX, this.posY),
            [new SAT.Vector(this.currentSpriteW * 0.25, 0),
            new SAT.Vector(this.currentSpriteW * 0.25, this.currentSpriteH),
            new SAT.Vector(this.currentSpriteW * 0.75, this.currentSpriteH),
            new SAT.Vector(this.currentSpriteW * 0.75, 0)
            ]);
    }

    animeRandom() {
        //const shouldMove = Math.random() > 0.85;
        const isIdle = this.imgId >= this.detail.animations.find(a => a.name === 'idle').start
            && this.imgId <= this.detail.animations.find(a => a.name === 'idle').end;
        const shouldMove = Math.random() > 0.85;
        if (isIdle && shouldMove) {
            const direction = Math.floor(Math.random() * 5);
            this.dirMove = direction;
        }
        else {
            this.dirMove = 0;
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
                if (this.posX < this.cnv.width - this.cnvW && (this.isCollide == false)) this.posX += 10;
                // Animation de marche possible au bord de la grille
                this.imgId = this.detail.animations.find(a => a.name === 'walkFwd').start;
                break;
            case 2: // GAUCHE
                if (this.posX > this.cnvW && (this.isCollide == false)) this.posX -= 10;
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

    is_collide(target) {
        // si mon polygon rentre en contact avec celui d'un autre joueur je retourne true
        // sinon je retourne false
        const response = new SAT.Response();
        const collided = SAT.testPolygonPolygon(this.polygons, target, response);
        console.log("collide : " + collided);
        return collided;
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

    controls(event) {
        switch (event.key) {
            case 'q':
                // gaucheq
                console.log("qq");
                this.dirMove = 2;
                this.move();
                break;
            case 'z':
                // haut
                console.log("z");
                this.dirMove = 3;
                this.move();
                break;
            case 'd':
                console.log("d");
                // droite
                this.dirMove = 1;
                this.move();
                break;
            case 's':
                console.log("s");
                this.dirMove = 4;
                this.move();
                break;
            default:
                break;
        }
    }
}


function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}