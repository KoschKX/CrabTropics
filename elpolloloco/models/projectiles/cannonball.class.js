/**
 * A Cannonball.
 * @extends {Enemy}
 */
class Cannonball extends Enemy {

    /** @type {string} */
    name = 'Cannonball';

    /** @type {number} */
    x = 120;

    /** @type {number} */
    y = 0;

    /** @type {number} */
    groundOffset = 36;

    /** @type {number} */
    health = 10;

    /** @type {number} */
    starthealth = 10;

    /** @type {number} */
    frameRate = 24;

    /** @type {boolean} */
    useGravity = true;

    /** @type {number} */
    speed = 0.25;

    /** @type {number} */
    frameRate = 24;

    /** @type {number} */
    scale = 1;

    /** @type {number} */
    width = 5;

    /** @type {number} */
    height = 5;

    /** @type {number} */
    maxSize = 33;

    /** @type {number} */
    maxZoomSize = 66;

    /** @type {Anim} */
    IMAGES_ROLL = new Anim('./img/cannonballA/ROLL_001.png', 1, '');

    /** @type {Anim[]} */
    imagesLib = [
        this.IMAGES_ROLL,
    ];

    /** @type {[number, number, number, number, string, boolean][]} */
    boxes = [[0, 0, this.width, this.height, 'red', true]];

    /** @type {boolean} */
    hostile = true;

    /** @type {boolean} */
    madeGroundContact = false;

    /**
     * Creates a Cannonball instance.
     * @param {World} The World.
     * @param {boolean} [immediate=false] - Whether to initialize the cannonball immediately.
     */
    constructor(world, immediate = false) {
        super(world);
        this.generateStamp(this.name);

        if (immediate) { 
            this.init(); 
        }
    }

    /**
     * Destroys the cannonball and cleans up.
     */
    destroy() {
        this.world.level.projectiles = destroy(this, this.world.level.projectiles, this.world);
        super.destroy();
    }

    /**
     * Initializes the cannonball object, loading images and setting up animation.
     */
    init() {
        super.init();

        this.loadImage(this.IMAGES_ROLL.files[0]);
        this.changeAnimation(this.IMAGES_ROLL);

        this.bounce(20);

        this.hostile = false;
    }

    /**
     * Main logic of the cannonball, executed every frame.
     * @param {number} delta - The time elapsed since the last frame in milliseconds.
     */
    main(delta) {
        super.main(delta);

        this.handleScaling(delta);
        this.updateCollisionBoxes();
        this.checkGroundHit();
    }

    /**
     * Checks for collision with the ground and adjusts behavior accordingly.
     */
    checkGroundHit() {
        if (this.falling) {
            this.hostile = true;
            this.world.audio.playSound(['cannon_whizzA', 'cannon_whizzB', 'cannon_whizzC'], 0.33, false);
        } else {
            this.hostile = false;
        }

        if (!this.madeGroundContact && this.isOnGround()) {
            this.bounce(5);
            this.useGround = false;
            this.madeGroundContact = true;
            this.world.audio.playSound(['cannon_thudA', 'cannon_thudB', 'cannon_thudC'], 0.66, false);
        } else if (this.madeGroundContact) {
            this.toggleCollider(0, false);
            this.hostile = false;
            this.speedY -= 0.1;
            this.y -= this.speedY;
        }

        if (this.y >= this.world.cvs.height + this.height) {
            this.destroy();
        }
    }

    /**
     * Handles scaling of the cannonball during its flight or after hitting the ground.
     * @param {number} delta - The time elapsed since the last frame in milliseconds.
     */
    handleScaling(delta) {
        let mxw, mxh;
        let scaleRate;

        if (this.madeGroundContact) {
            mxw = this.maxZoomSize; 
            mxh = this.maxZoomSize;
            scaleRate = 0.25;
        } else {
            mxw = this.maxSize; 
            mxh = this.maxSize;
            scaleRate = 0.1;
        }

        const scaleIncrement = scaleRate * (delta / 1000);
        this.scale += scaleIncrement;

        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        if (this.width * this.scale < mxw) {
            this.width *= this.scale;
        }
        if (this.height * this.scale < mxh) {
            this.height *= this.scale;
        }

        this.x = centerX - this.width / 2;
        this.y = centerY - this.height / 2;
    }

    /**
     * Updates the collision boxes to match the current size of the cannonball.
     */
    updateCollisionBoxes() {
        this.boxes[0][2] = this.width;
        this.boxes[0][3] = this.height;
    }
}