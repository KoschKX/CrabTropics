/**
 * BOOM!
 * @extends MovableObject
 */
class Explosion extends MovableObject {

    /** START VALUES */
    name = 'Explosion';
    scale = 1;
    frameRate = 24;
    useGravity = false;
    speed = 0.25;
    width = 182;
    height = 182;
    
    /** ANIMATIONS */
    IMAGES_EXPLODE = new Anim('./img/explosionA/EXPLODE_001.png', 9, '');
    imagesLib = [
        this.IMAGES_EXPLODE,
    ];

    /**
     * Creates an Explosion instance.
     * @param {World} The world.
     * @param {boolean} immediate If set to true, it initializes the Explosion immediately.
     */
    constructor(world, immediate = false) {
        super(world);
        this.generateStamp(this.name);

        if (immediate) { 
            this.init();
        }
    }

    /**
     * Destroys the Explosion object and cleans up.
     */
    destroy() {
        this.world.level.effects = destroy(this, this.world.level.effects, this.world);
        super.destroy();
    }

    /**
     * Initializes the Explosion object, setting up its speed and animation.
     */
    init() {
        super.init();
        this.speed = random(0.25, 0.5);
        this.originalspeed = this.speed;
        this.loadImage(this.IMAGES_EXPLODE.files[0]);
        this.changeAnimation(this.IMAGES_EXPLODE);
    }

    /**
     * The main update loop for the Explosion. Called every frame.
     * @param {number} delta The time difference between frames.
     */
    main(delta) {
        super.main(delta);
    }

    /**
     * Plays the provided animation for the Explosion object.
     * @param {Anim} anim The animation to play.
     */
    playAnimation(anim) {
        if (!this.world || !anim) { return; }

        let i = this.currImage % anim.files.length;
        let path = anim.files[i];
        this.img = this.getCachedImage(path);

        // If the animation is not yet complete, increment the frame.
        if (i < anim.files.length - 1) {
            this.currImage++;
        } else {
            // If animation is complete, destroy the object.
            this.destroy();
        }
    }
}