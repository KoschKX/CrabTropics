/**
 * A loading icon (a boat wheel) that rotates in the canvas.
 * @extends {Icon}
 */
class LoadIcon extends Icon {

    /** @type {string} The image path for the loading icon. */
    imgpath = './img/icons/wheel.png';

    /** @type {number} The rotation angle of the icon in radians. */
    angle = 0;

    /**
     * Creates an instance of LoadIcon.
     * @param {HTMLCanvasElement} canvas - The canvas element where the icon will be drawn.
     * @param {number} [x=0] - The initial x-coordinate of the icon.
     * @param {number} [y=0] - The initial y-coordinate of the icon.
     */
    constructor(canvas, x = 0, y = 0) {
        super(canvas, x, y);
        super.init();
    }

    /**
     * Draws the rotating loading icon on the canvas.
     */
    draw() {
        // Set position of the icon relative to the canvas
        this.x = this.cvs.width - this.width - 16;
        this.y = this.cvs.height - this.height - 16;

        // Calculate the center of the icon for rotation
        const centerX = this.x + this.width * 0.5;
        const centerY = this.y + this.height * 0.5;

        // Decrease the angle for rotation, in radians
        this.angle -= 1 * Math.PI / 180;

        // Save the current canvas context state
        this.ctx.save();

        // Clear the canvas before redrawing
        this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);

        // Translate the context to the center of the icon
        this.ctx.translate(centerX, centerY);

        // Rotate the context by the angle
        this.ctx.rotate(this.angle);

        // Draw the image centered around the translation point
        this.ctx.drawImage(this.img, -this.width * 0.5, -this.height * 0.5, this.width, this.height);

        // Restore the context to its previous state
        this.ctx.restore();
    }
}