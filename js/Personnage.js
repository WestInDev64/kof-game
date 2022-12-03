import { HealthBar, Color } from "./HealthBar.js";
export const PersoState = {
    IDLE: "IDLE",
    WALK_FWD: "WALK_FWD",
    WALK_BWD: "WALK_BWD",
    JUMP_UP: "JUMP_UP",
    CROUCH: "CROUCH"
};

// PERSONNAGE
export class Personnage {
    constructor(name, assetsFolder, imgNamePng, startPosition, codePlayer, json, canvas, ctx, scene) {
        /* Rendu */
        this.cnv = canvas;
        this.ctx = ctx;

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
        this.imgFrame = 0;
        this.detail = json;
        this.currentSpriteH;
        this.currentSpriteW;
        this.img;
        this.timeAnimation = 0;
        this.anime = {
            IDLE: this.detail.animations.find(a => a.name === 'IDLE'),
            WALK_FWD: this.detail.animations.find(a => a.name === 'WALK_FWD'),
            WALK_BWD: this.detail.animations.find(a => a.name === 'WALK_BWD'),
            JUMP_UP: this.detail.animations.find(a => a.name === 'JUMP_UP'),
            CROUCH: this.detail.animations.find(a => a.name === 'CROUCH')
        };

        /* Position taille  */
        this.cnvW = 128 / 2;
        this.cnvH = 120;
        this.position = { x: 0, y: 0 };
        this.dirInverse = false;
        this.acceleration = 0;
        this.velo = 0;
        this.velocity = { x: 0, y: 0 };
        this.startVelocity = {
            jump: 100
        };
        this.gravity = 1;


        /* Déplacements - Mouvements*/

        this.direction = 4;
        this.actionNum = 0;
        this.onAction = false;
        this.onHit = false;

        /* Les états */
        this.isCollide = false;
        this.isJumping = false;
        this.isCrouching = false;
        this.isOnFloor = true;

        /* Objets rattachés */
        this.hpBar;
        this.polygons;

        this.pressedKeys = [];
        this.platforms = scene.platforms;
    }

    loadImg() {
        for (let i = 0; i < this.detail.nbFrames; i++) {
            this.img = new Image();
            this.img.src = `assets/img/persos/${this.assetsFolder}/${this.imgNamePng}${i}.png`;
            this.assets.push(this.img);
        }
    }

    init() {
        this.loadImg();
        if (this.startPosition == 'L') {
            this.position.x = 2 * this.cnvW;
            this.position.y = 3 * this.cnvH;
            this.dirInverse = true;
        }
        else {
            let col = getRandomArbitrary(5, 10)
            let lin = getRandomArbitrary(0, 4)
            this.position.x = col * this.cnvW;
            this.position.y = lin * this.cnvH;
        }
        this.hpBar = new HealthBar(this, this.cnv, this.ctx, this.position.x, this.position.y, this.hp, this.hpMax, this.cnvW, this.cnvH);
    }


    idle() {
        this.direction = 0;
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
        this.ctx.save();
        // Tailles dynamiques en fonction du sprite
        this.currentSpriteW = this.assets[this.imgFrame].width;
        this.currentSpriteH = this.assets[this.imgFrame].height;
        /**
         * Je translate en X -> largeur de grille / 2 -  (32px) - largeur sprite (30px ) 
         */
        this.ctx.translate((this.position.x + this.cnvW / 2) - this.currentSpriteW / 2, (this.position.y + this.cnvH) - this.currentSpriteH);
        if (this.dirInverse) {
            this.ctx.translate(this.currentSpriteW, 0);
            this.ctx.scale(-1, 1);
        }
        this.ctx.drawImage(this.assets[this.imgFrame], 0, 0);
        this.ctx.fillStyle = "#00FFFF75";
        this.ctx.fillRect(0, 0, this.currentSpriteW, this.currentSpriteH);

        this.updateDynamicObj();                                                // Met à jour les polygons
        this.drawPolygon(this.polygons);                                        // Dessine les polygons dans le context du perso

        this.ctx.restore();                                                     // Restore le contexte

        this.hpBar.rodolpheBar();
    }

    drawPolygon(polygon) {
        this.ctx.beginPath();
        this.ctx.moveTo(polygon.points[0].x, polygon.points[0].y);
        for (let i = 0; i < polygon.points.length; i++) {
            this.ctx.lineTo(polygon.points[i].x, polygon.points[i].y);
        }
        this.ctx.lineTo(polygon.points[0].x, polygon.points[0].y);
        this.ctx.strokeStyle = "#FF0000";
        this.ctx.stroke();
        this.ctx.closePath();
    }

    updateDynamicObj() {
        /* Polygon de collision en fonction du sprite */
        this.polygons = new SAT.Polygon(new SAT.Vector(this.position.x, this.position.y),
            [new SAT.Vector(this.currentSpriteW * 0.25, 0),
            new SAT.Vector(this.currentSpriteW * 0.25, this.currentSpriteH),
            new SAT.Vector(this.currentSpriteW * 0.75, this.currentSpriteH),
            new SAT.Vector(this.currentSpriteW * 0.75, 0)
            ]);
    }

    animeRandom() {
        const isIdle = this.imgFrame >= this.anime.IDLE.start && this.imgFrame <= this.anime.IDLE.end;
        const shouldMove = Math.random() > 0.85;
        if (isIdle && shouldMove) {
            const direction = Math.floor(Math.random() * 5);
            this.direction = direction;
        }
        else {
            this.direction = 0;
        }
    }


    action(value) {
        switch (value) {
            case 0:
                this.imgFrame = this.detail.animations.find(a => a.name === 'kick').start;
                break;
            case 1:
                this.imgFrame = this.detail.animations.find(a => a.name === 'dammaged').start;
                break;
            case 2:
                this.imgFrame = this.detail.animations.find(a => a.name === 'ko').start;
                break;
            default:
                break;
        }
    }

    update(time) {
        if (time.previous > this.timeAnimation + 99) {
            this.timeAnimation = time.previous;
            this.imgFrame++;
        }

        if (this.pressedKeys.includes("ArrowDown")) {
            this.move(4);                                                   // S'accroupir

            /* Retirer les touches du tab lorsque l'on est baissé */
            findAndRemove(this.pressedKeys, "ArrowLeft");
            findAndRemove(this.pressedKeys, "ArrowRight");
            findAndRemove(this.pressedKeys, "ArrowUp");
        }
        /* Gestion des mouvements au clavier sans à-coups*/
        if (this.pressedKeys.includes("ArrowRight")) this.move(1);      // Droite
        if (this.pressedKeys.includes("ArrowLeft")) this.move(2);       // Gauche
        if (this.pressedKeys.includes("ArrowUp")) {                     // Sauter
            this.move(3);
        }
        if (this.pressedKeys.length == 0) {
            this.move(0);                 // Idle
        }

        // Gravity

        //this.applyGravity(this.gravity);
        //this.velo += this.acceleration;


        //this.position.y += this.velo;

        /**
         * !ICI Probleme Constrain
         * 
         */

        /* this.polygons.pos.x = this.position.x;
        this.polygons.pos.y = this.position.y;

        this.isOnFloor = false;

        for (const platform of this.platforms) {
            const response = new SAT.Response();
            if (SAT.testPolygonPolygon(this.polygons, platform, response)) {
                this.position.x -= response.overlapV.x;
                this.position.y -= response.overlapV.y;

                if (response.overlapV.y > 0 && this.velocity > 0) {
                    this.isOnFloor = true;
                }
            }
        }

        this.acceleration = 0; */
    }




    move(value) {
        switch (value) {
            case 0: // IDLE
                this.currentPersoState = PersoState.IDLE;
                for (const anime of this.detail.animations) {
                    if (this.imgFrame == anime.end + 1) {
                        this.imgFrame = this.anime.IDLE.start;
                        //this.onAction = false;
                    }
                }
                break;
            case 1: // DROITE
                this.currentPersoState = PersoState.WALK_FWD;
                if (this.position.x < this.cnv.width - this.cnvW && (this.isCollide == false)) this.position.x += 2;
                // Animation de marche possible au bord de la grille
                if (this.anime.WALK_FWD.start > this.imgFrame || this.anime.WALK_FWD.end <= this.imgFrame)
                    this.imgFrame = this.anime.WALK_FWD.start;
                break;
            case 2: // GAUCHE
                this.currentPersoState = PersoState.WALK_FWD;
                if (this.position.x > this.cnvW && (this.isCollide == false)) this.position.x -= 2;
                // Animation de marche possible au bord de la grille
                if (this.anime.WALK_FWD.start > this.imgFrame || this.anime.WALK_FWD.end <= this.imgFrame)
                    this.imgFrame = this.anime.WALK_FWD.start;
                break;
            case 3: // HAUT
                //this.velocity.y = this.startVelocity.jump;
                this.currentPersoState = PersoState.JUMP_UP;
                if (!this.isJumping && this.position.y >= this.cnvH) {
                    this.position.y -= this.cnvH;
                }

                if (this.anime.JUMP_UP.start > this.imgFrame || this.anime.JUMP_UP.end <= this.imgFrame) {
                    this.imgFrame = this.anime.JUMP_UP.start;
                    //this.velocity.y = this.startVelocity.jump;
                    //this.applyGravity(this.startVelocity.jump);
                }
                if (this.imgFrame == this.anime.JUMP_UP.end) {
                    this.isJumping = false;
                }
                if (this.isJumping) {
                    const index = this.pressedKeys.indexOf("ArrowUp");
                    if (index >= 0) this.pressedKeys.splice(index, 1);
                }
                this.isJumping = true;
                break;
            case 4: // S'ACCROUPIR
                this.currentPersoState = PersoState.CROUCH;
                if (this.anime.CROUCH.start > this.imgFrame || this.anime.CROUCH.end <= this.imgFrame) {
                    this.imgFrame = this.anime.CROUCH.start;
                }
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

        return collided;
    }

    applyGravity(force) {
        this.acceleration += force;
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
            if (player.position.x >= 0
                && player.position.x <= (this.nbCol - 2) * player.cnvW
                && this.bgGrid.coord_to_cell(player.position.x + player.cnvW, player.position.y).state > 0
                && this.bgGrid.coord_to_cell(player.position.x + player.cnvW, player.position.y).state !== player.codePlayer) {
                rightPlayer = this.bgGrid.coord_to_cell(player.position.x + player.cnvW, player.position.y).player;
                enemyOnTheRight = rightPlayer != undefined;
                //console.log(rightPlayer);
            }
            else if (player.position.x <= player.cnvW * (this.nbCol - 1)
                && player.position.x >= player.cnvW
                && this.bgGrid.coord_to_cell(player.position.x - player.cnvW, player.position.y).state > 0
                && this.bgGrid.coord_to_cell(player.position.x - player.cnvW, player.position.y).state !== player.codePlayer) {
                leftPlayer = this.bgGrid.coord_to_cell(player.position.x - player.cnvW, player.position.y).player;
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

    controlsKeyDown(event) {
        if (!this.pressedKeys.includes(event.key))
            this.pressedKeys.push(event.key);
    }


    controlsKeyUp(event) {
        const index = this.pressedKeys.indexOf(event.key);
        if (index >= 0) this.pressedKeys.splice(index, 1);
    }
}


function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function findAndRemove(array, el) {
    const index = array.indexOf(el)
    if (index !== -1) {
        array.splice(index, 1)
    }
    return array
}