/**
 * An icon for canvas.
 * Handles loading an image, drawing it, and managing its position and size.
 */
class Icon {

    /** START VALUES */
    name = 'Icon';
    x = 0;
    y = 0;
    width = 64;
    height = 64;

    /** IMAGE */
    cvs;
    ctx;
    img;
    imgpath;
    drawInterval;

    /**
     * Creates a new Icon.
     * @param {HTMLCanvasElement} canvas - The canvas element on which to draw the icon.
     * @param {number} [x=0] - The x position of the icon on the canvas.
     * @param {number} [y=0] - The y position of the icon on the canvas.
     */
    constructor(canvas, x = 0, y = 0) {
        this.cvs = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = x;
        this.y = y;
    }

    /**
     * Loads an image from a specified file path and calls the provided callback once the image is loaded.
     * @param {string} path - The file path to the image to be loaded.
     * @param {function} [callback] - The callback function to be called once the image is loaded.
     * @returns {HTMLImageElement} The image element.
     */
    loadImage(path, callback) {
        let img = new Image();
        img.src = path;
        if (callback && typeof callback === 'function') {
            img.onload = () => {
                callback();
                img.onload = null;
            };
        }
        return img;
    }

    /**
     * Initializes the icon by loading the image specified by the 'imgpath' and starts the drawing loop.
     */
    init() {
        if (this.imgpath) {
            let self = this;
            this.img = this.loadImage(this.imgpath, function () {
                clearInterval(self.drawInterval);
                self.drawInterval = setInterval(() => {
                    self.draw();
                }, 1000 / 60); // 60 frames per second
            });
        }
    }

    /**
     * Draws the icon on the canvas.
     * Clears the canvas and then draws the image at the specified position and size.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
        this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}