/**
 * An X means buried Treasures.
 * @extends {Enemy}
 */
class XMark extends Enemy {

    /** @type {string} */
    name = 'XMark';

    /** @type {number} */
    frameRate = 24;

    /** @type {boolean} */
    useGravity = false;

    /** @type {number} */
    speed = 0;

    /** @type {number} */
    width = 64;

    /** @type {number} */
    height = 24;

    /** @type {Anim} */
    IMAGES_MARK = new Anim('./img/misc/XMARK_DISTORTED_001.png');

    /** @type {Anim[]} */
    imagesLib = [
        this.IMAGES_MARK,
    ];

    /** @type {Array<[number, number, number, number, string, boolean]>} */
    boxes = [[0, 0, this.width, this.height, 'lime', true]];

    /** @type {boolean} */
    buried = true;

    /**
     * Creates an instance of the XMark class.
     * @param {World} world - The world object where the XMark exists.
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
     * Destroys the XMark object.
     */
    destroy() {
        this.world.level.projectiles = destroy(this, this.world.level.projectiles, this.world);
        super.destroy();
    }

    /**
     * Initializes the XMark object.
     */
    init() {
        super.init();
        this.loadImage(this.IMAGES_MARK.files[0]);
        this.changeAnimation(this.IMAGES_MARK);
    }

    /**
     * Main logic of the XMark, executed every frame.
     * @param {number} delta - The time elapsed since the last frame in milliseconds.
     */
    main(delta) {
        super.main(delta);
    }

    /**
     * Placeholder method for moving left.
     */
    moveLeft() {}

    /**
     * Placeholder method for moving right.
     */
    moveRight() {}
}