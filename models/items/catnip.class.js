/**
 * Catnip item for replenishing health.
 */
class Catnip extends Enemy {

    /** START VALUES */
    name = 'Catnip';
    width = 76;
    height = 76;
    speed = 0;
    frameRate = 24;
    useGravity = false;
    hostile = true;

    /** ANIMATIONS */
    IMAGES_SPARKLE = new Anim('./img/catnip/SPARKLE_001.png', 1, '');
    imagesLib = [
        this.IMAGES_SPARKLE,
    ];

    /** HITBOXES */
    boxes = [[this.width * 0.25, 0, this.width * 0.5, this.height, 'lime', true]];

    /** UNIQUE */
    buried = true;

    /**
     * Creates an instance of the Catnip class.
     * @param {World} The World.
     * @param {boolean} [immediate=false] - Whether to initialize the object immediately.
     */
    constructor(world, immediate = false) {
        super(world);
        this.generateStamp(this.name);

        if (immediate) {
            this.init();
        }
    }

    /**
     * Destroys the Catnip instance.
     */
    destroy() {
        this.world.level.items = destroy(this, this.world.level.items, this.world);
        super.destroy();
    }

    /**
     * Initializes the Catnip object.
     */
    init() {
        super.init();
        this.loadImage(this.IMAGES_SPARKLE.files[0]);
        this.changeAnimation(this.IMAGES_SPARKLE);
    }

    /**
     * So far, no logic for the Catnip.
     * @param {number} delta - The time elapsed since the last frame in milliseconds.
     */
    main(delta) {
        super.main(delta);
    }

    /**
     * No movement.
     */
    moveLeft() {}
    moveRight() {}
}