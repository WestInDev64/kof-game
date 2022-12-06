import { HealthBar, Color } from "./HealthBar.js";
import { getRandomArbitrary, findAndRemove } from "./Utiles.js";


export const PersoState = {
    IDLE: "IDLE",
    WALK_FWD: "WALK_FWD",
    WALK_BWD: "WALK_BWD",
    JUMP_UP: "JUMP_UP",
    JUMP_FWD: "JUMP_FWD",
    JUMP_BWD: "JUMP_BWD",
    CROUCH: "CROUCH",
    PUNCH: "PUNCH",
    KICK: "KICK",
    DAMMAGE: "DAMMAGE",
    KO: "KO",
};


export const startPos = {
    LEFT: 'L',
    RIGHT: 'R'
};

// PERSONNAGE
export class Personnage {
    constructor(config, startPosition, canvas, ctx, scene) {
        this.config = config;

        /* Rendu */
        this.cnv = canvas;
        this.ctx = ctx;

        /* configs perso */
        this.name;
        this.hp = 100;
        this.hpMax = 100;
        this.kO = false;
        this.startPosition = startPosition;
        this.assetsFolder;
        this.imgNamePng;

        /* Sprites & animations */
        this.assets = [];
        this.imgFrame = 0;
        this.currentSpriteH;
        this.currentSpriteW;
        this.img;
        this.timeAnimation = 0;
        this.anime;

        /* Position taille  */
        this.cnvW = 128 / 2;
        this.cnvH = 120;
        this.position = { x: 0, y: 0 };
        this.dirInverse = false;
        this.acceleration = 0;
        this.velocity = { x: 0, y: 0 };
        this.speed = 0;
        this.gravity = 10;

        /* Déplacements - Mouvements*/
        this.direction = 4;
        this.actionNum = 0;
        this.onAction = false;
        this.onHit = false;
        this.collidingWithOpponent = false;

        /* Les états */
        this.isColliding = false;
        this.isJumping = false;
        this.isCrouching = false;
        this.isOnFloor = true;

        /* Objets rattachés */
        this.hpBar;
        this.polygons;
        this.scene = scene;
        this.platforms;

        this.pressedKeys = [];
        this.opponents = [];
        this.randomInt;
        this.currentAiAction;
        this.currentAiAttack;
    }

    loadImg() {
        for (let i = 0; i < this.config.nbFrames; i++) {
            this.img = new Image();
            this.img.src = `assets/img/persos/${this.assetsFolder}/${this.imgNamePng}${i}.png`;
            this.assets.push(this.img);
        }
    }

    init() {
        this.name = this.config.name;
        this.assetsFolder = this.config.name;
        this.imgNamePng = this.config.fileName;
        this.anime = {
            IDLE: this.config.animations.find(a => a.name === 'IDLE'),
            WALK_FWD: this.config.animations.find(a => a.name === 'WALK_FWD'),
            WALK_BWD: this.config.animations.find(a => a.name === 'WALK_BWD'),
            JUMP_UP: this.config.animations.find(a => a.name === 'JUMP_UP'),
            CROUCH: this.config.animations.find(a => a.name === 'CROUCH'),
            PUNCH: this.config.animations.find(a => a.name === 'PUNCH'),
            KICK: this.config.animations.find(a => a.name === 'KICK'),
            DAMMAGE: this.config.animations.find(a => a.name === 'DAMMAGE'),
            KO: this.config.animations.find(a => a.name === 'KO'),
        };
        this.loadImg();
        this.platforms = this.scene.platforms;


        if (this.startPosition == startPos.LEFT) {
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


    draw() {
        /**
         * Sauvegarde le contexte à sa forme initiale
         * Déplace le contexte à la position du sprite
         * Déplace d'une taille en x si inversion du sprite 
         * (car l'inversion du contexte est effcuté à partir de la position d'origine)
         * Dessine l'image à la position 0 -> car ctx précédemment déplacé
         * Restore le contexte à sa forme initiale
         */
        this.ctx.save();
        // Tailles dynamiques en fonction du sprite
        this.currentSpriteW = this.assets[this.imgFrame].width;
        this.currentSpriteH = this.assets[this.imgFrame].height;
        this.ctx.translate((this.position.x + this.cnvW / 2) - this.currentSpriteW / 2, (this.position.y + this.cnvH) - this.currentSpriteH);

        if (this.dirInverse) {
            this.ctx.translate(this.currentSpriteW, 0);
            this.ctx.scale(-1, 1);
        }
        this.ctx.drawImage(this.assets[this.imgFrame], 0, 0);
        // this.ctx.fillStyle = "#00FFFF75";
        // this.ctx.fillRect(0, 0, this.currentSpriteW, this.currentSpriteH);
        this.ctx.restore();                                                     // Restore le contexte
        this.updateDynamicObj();                                                // Met à jour les polygons
       //this.drawPolygon(this.polygons);                                        // Dessine les polygons dans le context du perso

        this.hpBar.rodolpheBar();
    }

    drawPolygon(polygon) {
        this.ctx.save();
        this.ctx.translate(polygon.pos.x, polygon.pos.y);
        this.ctx.beginPath();
        this.ctx.moveTo(polygon.points[0].x, polygon.points[0].y);
        for (let i = 0; i < polygon.points.length; i++) {
            this.ctx.lineTo(polygon.points[i].x, polygon.points[i].y);
        }
        this.ctx.lineTo(polygon.points[0].x, polygon.points[0].y);
        this.ctx.strokeStyle = "#FF0000";
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }

    updateDynamicObj() {
        /* Polygon de collision en fonction du sprite */
        // Je me place sur la gauche de mon sprite 

        // creation de plusieurs polygons pour differentes hit box
        this.polygons = new SAT.Polygon(new SAT.Vector(this.position.x + this.cnvW / 2 - this.currentSpriteW / 2 + this.currentSpriteW * 0.25, (this.position.y + this.cnvH) - this.currentSpriteH),
            [new SAT.Vector(),
            new SAT.Vector(0, this.currentSpriteH),
            new SAT.Vector(this.currentSpriteW * 0.5, this.currentSpriteH),
            new SAT.Vector(this.currentSpriteW * 0.5, 0)
            ]);
    }

    animeRandom(time) {


        for (let opponent of this.opponents) {
            if (this.isCollide(opponent)) {
                const shouldMove = Math.random() > 0.85;
                if (shouldMove)
                    this.attackRandom(time);
            }
            else {
                /* On check si l'iA est en action */
                if (this.currentAiAction) {
                    // il continu son action

                    this.move(this.currentAiAction.actionId, time);

                    // si il a terminé son action 
                    if (this.currentAiAction.end < (new Date()).getTime()) {

                        this.currentAiAction = null;
                    }
                    return;
                }

                // Il decide une nouvelle action 
                this.currentAiAction = {
                    actionId: Math.floor(Math.random() * 7),
                    end: (new Date()).getTime() + 500 + Math.random() * 300
                };
                this.move(this.currentAiAction.actionId, time);
            }
        }


    }

    attackRandom(time) {
        /* On check si l'iA est en action */
        if (this.currentAiAttack) {
            // il continu son action

            this.action(this.currentAiAttack.attackId, time);

            // si il a terminé son action 
            if (this.currentAiAttack.end < (new Date()).getTime()) {

                this.currentAiAttack = null;
            }
            return;
        }

        // Il decide une nouvelle action 
        this.currentAiAttack = {
            attackId: Math.floor(Math.random() * 2),
            end: (new Date()).getTime() + 3000 + Math.random() * 1000
        };


        // applique l'action immediatement
        this.action(this.currentAiAttack.attackId, time);

    }




    update(time) {
        if (time.previous > this.timeAnimation + 99) {
            this.timeAnimation = time.previous;
            this.imgFrame++;
        }

        if (this.pressedKeys.length == 0) this.move(0, time);                 // Idle
        /* Gestion des mouvements au clavier sans à-coups*/
        if (this.pressedKeys.includes("ArrowDown")) {
            this.move(4, time);                                               // S'accroupir
            /* Retirer les touches du tab lorsque l'on est baissé */
            findAndRemove(this.pressedKeys, "ArrowLeft");
            findAndRemove(this.pressedKeys, "ArrowRight");
            findAndRemove(this.pressedKeys, "ArrowUp");
        }
        if (this.pressedKeys.length == 1 && this.pressedKeys.includes("ArrowRight")) this.move(1, time);      // Droite
        if (this.pressedKeys.length == 1 && this.pressedKeys.includes("ArrowLeft")) this.move(2, time);       // Gauche
        if (this.pressedKeys.length == 1 && this.pressedKeys.includes("ArrowUp")) {                     // Sauter
            this.move(3, time);
        }
        if (this.pressedKeys.length == 2
            && this.pressedKeys.includes("ArrowRight")
            && this.pressedKeys.includes("ArrowUp")) {
            this.move(5, time);                                                                               // Saut + Droite
        }
        if (this.pressedKeys.length == 2
            && this.pressedKeys.includes("ArrowLeft")
            && this.pressedKeys.includes("ArrowUp")) {
            this.move(6, time);                                                                               // Saut + Droite
        }


        /* Actions touches WXCV */
        if (this.pressedKeys.includes("w")) this.action(0, time);             // Punch
        if (this.pressedKeys.includes("x")) this.action(1, time);             // Kick
        if (this.pressedKeys.includes("d")) this.action(2, time);             // Dammage
        if (this.pressedKeys.includes("k")) this.action(3, time);             // KO


        // Gravity

        this.applyGravity(this.gravity);
        this.speed += this.acceleration;

        //if( this.speed >= 30) this.speed = 30;

        this.position.y += this.speed * time.secondsPassed;

        if (this.position.y > this.cnv.height - this.cnvH) {
            this.position.y = this.cnv.height - this.cnvH;
        }

        this.polygons.pos.x = this.position.x;
        this.polygons.pos.y = this.position.y;

        this.isOnFloor = false;

        for (const platform of this.platforms) {
            const response = new SAT.Response();
            if (SAT.testPolygonPolygon(this.polygons, platform, response)) {
                this.position.x -= response.overlapV.x;
                //console.log(response);
                if (response.overlapV.y > 0 && this.speed > 0) {
                    this.isOnFloor = true;
                    this.position.y -= response.overlapV.y;
                }
            }
        }
        this.acceleration = 0;

        /* Gestion direction des persos quand ils changent de position */
        this.direction = this.getDirection(this.startPosition);
        if (this.direction == 1 && this.startPosition == startPos.LEFT) this.dirInverse = true; //   persoL | oponentD 
        if (this.direction == -1 && this.startPosition == startPos.LEFT) this.dirInverse = false; // OponentD | persoL
        if (this.direction == 1 && this.startPosition == startPos.RIGHT) this.dirInverse = true;// OponentL | PersoR 
        if (this.direction == -1 && this.startPosition == startPos.RIGHT) this.dirInverse = false;//  PersoR  | OponentL
    }


    move(value, time) {
        switch (value) {
            case 0: // IDLE
                this.currentPersoState = PersoState.IDLE;
                for (const anime of this.config.animations) {
                    if (this.imgFrame == anime.end) {
                        this.imgFrame = this.anime.IDLE.start;
                        //this.onAction = false;
                    }
                }
                break;
            case 1: // DROITE
                this.currentPersoState = PersoState.WALK_FWD;
                // Contrainte avec collision ennemy
                for (let opponent of this.opponents) {

                    if (this.position.x < this.cnv.width - this.cnvW && (!this.isCollide(opponent)))
                        this.position.x += 60 * time.secondsPassed;

                    if (opponent.position.x < this.cnv.width - opponent.cnvW
                        && this.isCollide(opponent)
                        && [PersoState.IDLE, PersoState.CROUCH, PersoState.JUMP_UP, PersoState.JUMP_FWD, PersoState.JUMP_BWD].includes(opponent.currentPersoState)) {
                        this.direction = this.getDirection(this.startPosition);
                        switch (this.startPosition) {
                            case PersoState.LEFT:
                                if (this.direction == 1) {
                                    this.position.x += 2;
                                    opponent.position.x += 2;
                                } else {
                                    this.position.x += 2;
                                }
                                break;
                            case PersoState.RIGHT:
                                if (this.direction == 1) {
                                    this.position.x += 2;
                                } else {
                                    this.position.x += 2;
                                    opponent.position.x += 2;
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }
                // Animation de marche possible au bord de la grille
                if (this.anime.WALK_FWD.start > this.imgFrame || this.anime.WALK_FWD.end < this.imgFrame)
                    this.imgFrame = this.anime.WALK_FWD.start;
                break;
            case 2: // GAUCHE
                this.currentPersoState = PersoState.WALK_FWD;
                for (let opponent of this.opponents) {
                    if (this.position.x > 0 && (!this.isCollide(opponent))) this.position.x -= 60 * time.secondsPassed;

                    if (opponent.position.x > 0
                        && this.isCollide(opponent)
                        && [PersoState.IDLE, PersoState.CROUCH, PersoState.JUMP_UP, PersoState.JUMP_FWD, PersoState.JUMP_BWD].includes(opponent.currentPersoState)) {
                        this.direction = this.getDirection(this.startPosition);
                        switch (this.startPosition) {
                            case PersoState.LEFT:
                                if (this.direction == 1) {
                                    this.position.x -= 2;
                                } else {
                                    opponent.position.x -= 2;
                                    this.position.x -= 2;
                                }
                                break;
                            case PersoState.RIGHT:
                                if (this.direction == 1) {
                                    this.position.x -= 2;
                                    opponent.position.x -= 2;
                                } else {
                                    this.position.x -= 2;
                                }
                                break;
                            default:
                                break;
                        }

                    }

                }
                // Animation de marche possible au bord de la grille
                if (this.anime.WALK_FWD.start > this.imgFrame || this.anime.WALK_FWD.end < this.imgFrame)
                    this.imgFrame = this.anime.WALK_FWD.start;

                // calculer la direction pour débloquer le mouvement
                break;
            case 3: // HAUT
                //this.velocity.y = this.startVelocity.jump;
                this.currentPersoState = PersoState.JUMP_UP;
                if (this.isOnFloor && this.position.y >= this.cnvH) {
                    this.speed = - this.cnv.height;
                    //this.position.y -= this.cnvH;
                }
                /* Animation de saut */
                if (this.anime.JUMP_UP.start > this.imgFrame || this.anime.JUMP_UP.end < this.imgFrame) {
                    this.imgFrame = this.anime.JUMP_UP.start;
                }



                break;
            case 4: // S'ACCROUPIR
                this.currentPersoState = PersoState.CROUCH;
                if (this.anime.CROUCH.start > this.imgFrame || this.anime.CROUCH.end < this.imgFrame) {
                    this.imgFrame = this.anime.CROUCH.start;
                }
                break;
            case 5: // SAUT + DROITE 
                this.currentPersoState = PersoState.JUMP_FWD;
                if (this.isOnFloor && this.position.y >= this.cnvH) {
                    this.speed = - this.cnv.height;
                }
                if (this.position.x < this.cnv.width - this.cnvW)
                    this.position.x += 2;
                if (this.anime.JUMP_UP.start > this.imgFrame || this.anime.JUMP_UP.end < this.imgFrame) {
                    this.imgFrame = this.anime.JUMP_UP.start;
                }

                // si le perso est collide avec l'adv en y -> comparer la pos.x du joueur et celui de l'adv pour décalage
                // en x en positif ou negatif

                break;
            case 6: // SAUT + GAUCHE 
                this.currentPersoState = PersoState.JUMP_BWD;
                if (this.isOnFloor && this.position.y >= this.cnvH) {
                    this.speed = - this.cnv.height;
                }
                if (this.position.x > 0) this.position.x -= 2;
                if (this.anime.JUMP_UP.start > this.imgFrame || this.anime.JUMP_UP.end < this.imgFrame) {
                    this.imgFrame = this.anime.JUMP_UP.start;
                }

                // si le perso est collide avec l'adv en y -> comparer la pos.x du joueur et celui de l'adv pour décalage
                // en x en positif ou negatif
                break;
            default:
                break;
        }
    }


    action(value, time) {
        switch (value) {

            case 0: // PUNCH
                this.currentPersoState = PersoState.PUNCH;
                if (this.anime.PUNCH.start > this.imgFrame || this.anime.PUNCH.end < this.imgFrame) {
                    this.imgFrame = this.anime.PUNCH.start;
                }
                this.makeDammage(time);
                break;

            case 1: // KICK
                this.currentPersoState = PersoState.KICK;
                if (this.anime.KICK.start > this.imgFrame || this.anime.KICK.end < this.imgFrame) {
                    this.imgFrame = this.anime.KICK.start;
                }
                this.makeDammage(time);
                break;

            case 2: // DAMMAGE
                this.currentPersoState = PersoState.DAMMAGE;
                if (this.anime.DAMMAGE.start > this.imgFrame || this.anime.DAMMAGE.end < this.imgFrame) {
                    this.imgFrame = this.anime.DAMMAGE.start;
                }
                break;

            case 3: // K.O
                this.currentPersoState = PersoState.KO;
                if (this.anime.KO.start > this.imgFrame || this.anime.KO.end < this.imgFrame) {
                    this.imgFrame = this.anime.KO.start;
                }
                break;
            default:
                break;
        }
    }


    isCollide(opponent) {
        // si mon polygon rentre en contact avec celui d'un autre joueur je retourne true
        // sinon je retourne false
        const response = new SAT.Response();
        const collided = SAT.testPolygonPolygon(this.polygons, opponent.polygons, response);
        return collided;
    }

    isCollideWithTheFloor(platform) {
        const pointA = this.polygons.points[1];
        const pointB = this.polygons.points[2];
        console.log(this.polygons);
        const testA = SAT.pointInPolygon(pointA, platform);
        const testB = SAT.pointInPolygon(pointB, platform);
        if (testA && testB) {
            return true;
        }
        return false;
    }


    applyGravity(force) {
        this.acceleration += force;
    }

    getDirection(startPos) {
        for (let opponent of this.opponents) {
            if (startPos == startPos.LEFT) {
                if (this.position.x > opponent.position.x)
                    return -1;
                return 1;
            }
            else {
                if (this.position.x < opponent.position.x)
                    return 1;
                return -1;
            }
        }
    }


    makeDammage(time) {
        for (let opponent of this.opponents) {
            /* D'abord être en collision avec l'adversaire */
            if (this.isCollide(opponent)) {
                /* L'adv à ses hp en positifs et que le joueur est entrain d'attaquer */
                if (opponent.hp > 0 && (this.currentPersoState == PersoState.PUNCH || this.currentPersoState == PersoState.KICK)) {
                    opponent.action(2); // Reçois des dommages
                    opponent.hp -= 60 * time.secondsPassed; // -60 d'hp
                }
                if (opponent.hp < 0) {
                    opponent.action(3, time); // Animation K.O
                }
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

