export class Cell {
    constructor() {
        this.state = 0;
        this.player;
    }

    setPlayer(player) {
        this.player = player
    }

    getPlayer() {
        return this.player;
    }
    setState(val) {
        this.state = val;
    }

    getState() {
        return this.state;
    }
}

// CLASSE PRINCIPALE
export class Grid {
    constructor(nbCol, nbLin) {
        this.col = nbCol;
        this.lig = nbLin;
        this.grid = [];
        this.cnvW = 128 / 2;
        this.cnvH = 120;
    }

    initGrid() {
        for (let i = 0; i < this.lig; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.col; j++) {
                this.grid[i][j] = new Cell();
            }
        }
    }

    coord_to_cell(posX, posY) {
        //console.log(posX, posY);
        let numLine = posY / this.cnvH;
        let numCol = posX / this.cnvW;
        return this.grid[numLine][numCol];
    }
}


// GRILLE PLATEFORME
export class GridPlatform extends Grid {
    constructor(nbCol, nbLin, ctx, cnv) {
        super(nbCol, nbLin);
        this.ctx2D = ctx;
        this.cnv = cnv;
        this.proceduralTab = [];

    }

    procedural() {
        for (let i = 0; i < this.lig; i++) {
            for (let j = 0; j < this.col; j++) {
                if (i == 3) {
                    this.grid[i][j].state = 5;
                } else {
                    const randJ = Math.floor(Math.random() * 10);
                    const randI = Math.floor(Math.random() * 4);
                    this.grid[randI][randJ].state = 5;
                }
            }
        }
    }

    drawPlf() {
        /**
         * Que des plateformes au niveau 0 
         * Que des plateformes accéssibles sur la meme colone d'une ligne maximum d'écart
         * 1er tour : Full plateforme au niveau 0 
         * 2eme tour : plateforme niv 1 
         * 3 eme tour / 4eme tour  : s'assurer au niv 2 que les plateformes sont accessibles
         * 5 eme tour : Placer des objets ( 2eme grille objet)   
         *  */
        const gradient = this.ctx2D.createLinearGradient(0, 0, 0, this.cnv.height / 1.2);
        gradient.addColorStop(0, "gray");
        gradient.addColorStop(1, "black");
        this.ctx2D.fillStyle = gradient;
        for (let i = 0; i < this.lig; i++) {
            for (let j = 0; j < this.col; j++) {
                if (this.grid[i][j].state === 5) {
                    this.ctx2D.fillRect(this.cnvW * j, this.cnvH * i + (this.cnvH - this.cnvH / 16), this.cnvW, this.cnvH / 8);
                    this.ctx2D.strokeRect(this.cnvW * j, this.cnvH * i + (this.cnvH - this.cnvH / 16), this.cnvW, this.cnvH / 8);
                }
                //this.ctx2D.strokeRect(this.cnvW * j, this.cnvH * i, 128, 120);
            }

        }

    }
}


// GRILLE OBJ
export class GridObj extends Grid {
    constructor(nbCol, nbLin, plfGrid, ctx, cnv) {
        super(nbCol, nbLin);
        this.plfGrid = plfGrid;
        this.ctx2D = ctx;
        this.cnv = cnv;
        this.assets = [];
        this.nbObj = 19;
        this.img;
        this.imgId = 0;
    }

    loadBg() {
        for (let i = 0; i < this.nbObj; i++) {
            this.img = new Image();
            this.img.src = `assets/img/obj/obj_${i}.png`;
            this.assets.push(this.img);
        }
    }


    generateObj() {
        for (let i = 0; i < this.lig; i++) {
            for (let j = 0; j < this.col; j++) {
                const randJ = Math.floor(Math.random() * 10);
                const randI = Math.floor(Math.random() * 2);
                if (i < 3 && this.plfGrid.grid[randI][randJ].state == 5) {
                    const echantillon =  Math.random() > 0.85;
                    if(echantillon){
                        let randObj = Math.floor(Math.random() * this.nbObj);
                        this.grid[randI][randJ].state = randObj;

                    } 
                }
            }
        }
    }

    drawObj() {
        //this.ctx2D.fillStyle = 'red';
        for (let i = 0; i < this.lig; i++) {
            for (let j = 0; j < this.col; j++) {
                if (this.grid[i][j].state > 0 && this.grid[i][j].state <= 18) {
                    //console.log(randObj);
                    this.ctx2D.drawImage(this.assets[this.grid[i][j].state], this.cnvW * j, this.cnvH * i + (this.cnvH - this.cnvH /2), this.cnvW, this.cnvH/2) ;
                    //this.ctx2D.fillRect(this.cnvW * j, this.cnvH * i + (this.cnvH - this.cnvH /4), this.cnvW, this.cnvH / 8);
                }
            }

        }
    }
}



// GRILLE DE JEU
export class GridBG extends Grid {
    constructor(nbCol, nbLin, persoTab, bgFolder, bgFramesNb, ctx, canvas, detailAnime) {
        super(nbCol, nbLin);
        this.tabPlayers = persoTab;
        this.bgFolder = bgFolder;
        this.bgLayers = [];
        this.cnvW = 128 / 2;
        this.cnvH = 120;
        this.ctx2D = ctx;
        this.cnv = canvas;
        this.nbBgFrames = bgFramesNb;
        this.imgId = 0;
        this.animeDetail = detailAnime;
    }



    loadBg() {
        for (let i = 0; i < this.nbBgFrames; i++) {
            this.img = new Image();
            this.img.src = `assets/img/bg/${this.bgFolder}/frame_${i.toString().padStart(2, '0')}.png`;
            this.bgLayers.push(this.img);
        }
    }

    drawBg() {
        /* // CIEL
        const gradient = this.ctx2D.createLinearGradient(0, 0, 0, this.cnv.height / 1.2);
        gradient.addColorStop(0, "black");
        gradient.addColorStop(0.33, "purple");
        gradient.addColorStop(0.66, "blue");
        gradient.addColorStop(1, "black");
        this.ctx2D.fillStyle = gradient;
        this.ctx2D.fillRect(0, 0, this.cnv.width, this.cnv.height);

        // SOLEIL
        const cercle = new Path2D();
        cercle.arc(this.cnv.width / 2, this.cnv.height /1.25, this.cnv.width / 4, 0, 2 * Math.PI);
        this.ctx2D.fillStyle = "yellow";
        this.ctx2D.fill(cercle);
        
        // LUNE
        const moon = new Path2D();
        moon.arc(this.cnv.width / 2, this.cnv.height /1.25, this.cnv.width / 4, 0, 2 * Math.PI);
        this.ctx2D.fillStyle = "yellow";
        this.ctx2D.fill(cercle); */

        //console.log(this.bgLayers);
        const ratioW = this.cnv.width / this.bgLayers[this.imgId].width;
        const ratioH = this.cnv.height / this.bgLayers[this.imgId].height;

        const ratio = Math.max(ratioW, ratioH);

        const w = this.bgLayers[this.imgId].width * ratio;
        const h = this.bgLayers[this.imgId].height * ratio;

        this.ctx2D.save();
        this.ctx2D.translate(this.cnv.width / 2, this.cnv.height / 2);
        this.ctx2D.drawImage(this.bgLayers[this.imgId], 0, 0, this.bgLayers[this.imgId].width, this.bgLayers[this.imgId].height, -w / 2, -h / 2, w, h);
        this.ctx2D.restore();
    }

    animeBg() {
        this.imgId++;
        if (this.imgId > this.animeDetail.animations[0].end)
            this.imgId = this.animeDetail.animations[0].start;
    }


    drawGrid() {
        //ctx.beginPath();
        //ctx.fillStyle = "#00FFFF";
        /**
         * ClearRect: rectangle vide (efface le fond)
         * fillRect : rectangle plein
         * strokeRect : rectangle surligné
         * @param x : coin sup gauche du rectangle 
         * @param y : coin sup gauche du rectangle 
         * @param w : largeur du rectangle 
         * @param h : hauteur du rectangle 
         */
        //ctx.fillRect(0, 0, cnv.width, cnv.height);
        for (let i = 0; i < this.lig; i++) {
            for (let j = 0; j < this.col; j++) {
                this.ctx2D.strokeRect(this.cnvW * j, this.cnvH * i, 128, 120);
            }
        }
    }


    to_ij(x, y) {
        let i = y / this.cnvH;
        let j = x / this.cnvW;
        return [i, j];
    }

    setCellGrid(perso, val) {
        let i = perso.getPosY() / this.cnvH;
        let j = perso.getPosX() / this.cnvW;
        this.grid[i][j].setState(val);
        this.grid[i][j].setPlayer(perso);
    }

}

