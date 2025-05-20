/**
 * Background element.
 * Inherits from MovableObject (n case I want them to move later). For now, it's is really for static backgrounds.
 */
class Background extends MovableObject {

    /** START VALUES */
    name = 'Background';
    width = 740;
    height = 480;
    x = 0;
    y = 0;

    /** IMAGES */
    IMAGES_BG = new Anim('./img/blank.png');
    imagesLib = [this.IMAGES_BG];
    imagePath;
    imageCache = [];

    /** UNIQUE */
    useGround = false;
    layer = 0;

    /**
     * Creates a background object and loads the specified image.
     * @param {object} world - The game world context.
     * @param {string} imagePath - Path to the background image.
     * @param {number} layer - Rendering layer index.
     * @param {number} x - X position of the background.
     * @param {number} y - Y position of the background.
     * @param {number} [width] - Optional width override.
     * @param {number} [height] - Optional height override.
     */
    constructor(world, imagePath, layer, x, y, width, height) {
        super(world);
        if(!imagePath){ return; }
        this.loadImage(imagePath);
        this.imagePath = imagePath;
        this.imagesLib[0].files[0] = imagePath;
        this.x = x;
        this.y = y;
        this.layer = layer;
        if (width) this.width = width;
        if (height) this.height = height;
        this.generateStamp(this.name);
        this.init();
    }

    /**
     * Initializes the background by loading its image and setting the animation.
     */
    init() {
        this.initialized = true;
        this.loadImage(this.IMAGES_BG.files[0]);
        this.changeAnimation(this.IMAGES_BG);
    }

    /**
     * Fits the background dimensions to the size of the canvas.
     */
    fit() {
        this.width = this.cvs.width;
        this.height = this.cvs.height;
    }
}