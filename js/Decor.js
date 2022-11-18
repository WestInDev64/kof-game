// CLASSE PRINCIPALE
export class Decor {
    constructor(canvas, ctx, bgFolder, bgFramesNb, detailAnime) {
        this.cnv = canvas;
        this.cnvW = 128 / 2;
        this.cnvH = 120;
        this.bgFolder = bgFolder;
        this.bgLayers = [];
        this.cnvW = 128 / 2;
        this.cnvH = 120;
        this.ctx2D = ctx;
        this.nbBgFrames = bgFramesNb;
        this.img;
        this.imgId = 0;
        this.animeDetail = detailAnime;
        this.animeDetail = detailAnime;
        this.proceduralTab = [];
        this.platformW = 128 / 2;
        this.platformH = 120 / 8;
        this.lig = 4;
        this.col = 10;
    }

    /* Chargement du Background */
    loadBg() {
        for (let i = 0; i < this.nbBgFrames; i++) {
            this.img = new Image();
            this.img.src = `assets/img/bg/${this.bgFolder}/frame_${i.toString().padStart(2, '0')}.png`;
            this.bgLayers.push(this.img);
        }
    }

    /* Initialisation element décor */
    init() {
        this.loadBg();
        this.procedural();
    }

    /* Dessing Background */
    drawBg() {
        const ratioW = this.cnv.width / this.bgLayers[this.imgId].width;
        const ratioH = this.cnv.height / this.bgLayers[this.imgId].height;
        const ratio = Math.max(ratioW, ratioH);
        const w = this.bgLayers[this.imgId].width * ratio;
        const h = this.bgLayers[this.imgId].height * ratio;
        this.ctx2D.save();
        /**
         * Translate la position du contexte et décale l'origine du canvas 0,0
         * @param x : décalage horizontale
         * @param y : décalage verticale
         */
        this.ctx2D.translate(this.cnv.width / 2, this.cnv.height / 2);
        /**
         * Dessine l'image dans le contexte 2D
         * @param Image     : Image à dessiner
         * @param dX        : coord x position de l'image dans le canvas
         * @param dY        : coord y position de l'image dans le canvas
         * @param dWidth    : Largeur de l'image
         * @param dHeight   : Hauteur de l'image
         * @param sx        : coord x 
         * @param sy        : Image à dessiner
         * @param sLargeur  : Image à dessiner
         * @param sHauteur  : Image à dessiner
         */
        this.ctx2D.drawImage(this.bgLayers[this.imgId], 0, 0, this.bgLayers[this.imgId].width, this.bgLayers[this.imgId].height, -w / 2, -h / 2, w, h);
        this.ctx2D.restore();
    }

    /* Animation du Background */
    animeBg() {
        this.imgId++;
        if (this.imgId > this.animeDetail.animations[0].end)
            this.imgId = this.animeDetail.animations[0].start;
    }

    /* Procedural Platform */
    procedural() {
        for (let i = 0; i < 16; i++) {
            let randJ = Math.floor(Math.random() * 10);
            let randI = Math.floor(Math.random() * 3);
            this.proceduralTab.push({ randI, randJ });
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
        gradient.addColorStop(0, "white");
        gradient.addColorStop(1, "magenta");
        this.ctx2D.fillStyle = gradient;
        for (let i = 0; i < this.proceduralTab.length; i++) {
            this.ctx2D.fillRect(this.platformW * this.proceduralTab[i].randJ, this.cnvH * this.proceduralTab[i].randI + (this.cnvH - this.cnvH / 16), this.platformW, this.platformH);
            this.ctx2D.strokeRect(this.platformW * this.proceduralTab[i].randJ, this.cnvH * this.proceduralTab[i].randI + (this.cnvH - this.cnvH / 16), this.platformW, this.platformH);
        }

    }
}
