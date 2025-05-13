/**
 * An X means buried Treasures.
 */
class XMark extends Enemy {

    /** START VALUES*/
    name = 'XMark';
    width = 64;
    height = 24;
    speed = 0;
    frameRate = 24;
    useGravity = false;

    /** ANIMATIONS */
    IMAGES_MARK = new Anim('./img/misc/XMARK_DISTORTED_001.png');
    imagesLib = [
        this.IMAGES_MARK,
    ];

    /** HITBOXES */
    boxes = [[0, 0, this.width, this.height, 'lime', true]];

    /** UNIQUE **/
    buried = true;
    xarrow;

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
        if(this.xarrow){ this.xarrow.destroy(); }
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
     * Create accompanying XArrow object.
     */
    createXArrow(){
        this.xarrow = new XArrow(this.world, true);
        this.xarrow.x = this.x;
        this.xarrow.y = this.y - this.height * 2.5;
        this.world.level.projectiles.push(this.xarrow);
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