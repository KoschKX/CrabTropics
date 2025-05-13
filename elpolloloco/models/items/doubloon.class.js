/**
 * A class representing the Doubloon item in the game.
 */
class Doubloon extends Enemy {

    /** START VALUES */
    name = 'Doubloon';
    width = 32;
    height = 32;
    speed = 0;
    frameRate = 24;
    useGravity = false;
    hostile = true;

    /** ANIMATIONS */
    IMAGES_SPINA = new Anim('./img/doubloon/SMALL_GOLD_SPIN_001.png', 29, '');
    IMAGES_SPINB = new Anim('./img/doubloon/SMALL_SILVER_SPIN_001.png', 29, '');
    imagesLib = [
        this.IMAGES_SPINA, this.IMAGES_SPINB
    ];

    /** HITBOXES */
    boxes = [[0, 0, this.width, this.height, 'lime', true]];

    /** UNIQUE */
    buried = true;
    value = 0;

    /**
     * Creates an instance of the Doubloon class.
     * @param {World} The World.
     * @param {number | [number, number]} [variant=0] - The variant of the Doubloon (0 for gold, 1 for silver).
     * @param {boolean} [immediate=false] - Whether to initialize the object immediately.
     */
    constructor(world, variant = 0, immediate = false) {
        super(world);
        this.generateStamp(this.name);

        if (Array.isArray(variant) && variant.length >= 2) {
            this.variant = randomInt(variant[0], variant[1]);
        } else {
            this.variant = variant;
        }

        if (immediate) {
            this.init();
        }
    }

    /**
     * Destroys the Doubloon instance.
     */
    destroy() {
        this.world.level.items = destroy(this, this.world.level.items, this.world);
        super.destroy();
    }

    /**
     * Initializes the Doubloon object.
     */
    init() {
        super.init();

        const variantData = [this.IMAGES_SPINA, this.IMAGES_SPINB];

        this.loadImage(variantData[this.variant].files[0]);

        if (this.variant === 0) {
            this.value = 1; // Gold Doubloon
        }
        if (this.variant === 1) {
            this.value = 5; // Silver Doubloon
        }

        this.changeAnimation(variantData[this.variant]);
    }

    /**
     * So far, No main logic of the Doubloon.
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