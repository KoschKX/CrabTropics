/**
 * A Hole that spawns items like crabs, doubloons, and catnip.
 */
class XArrow extends Enemy {

    /** STARTVALUES */
    name = 'XArrow';
    width = 76;
    height = 76;
    frameRate = 24;
    speed = 0;
    useGravity = false;

    /** ANIMATIONS */
    IMAGES_ARROWDIG = new Anim('./img/misc/ARROW_DIG_001.png', 8, '');
    imagesLib = [
        this.IMAGES_BLANK, this.IMAGES_ARROWDIG,
    ];

    /** UNIQUE */
    active = false;
    atvDelay = 2000;
    atvInterval;

    /**
     * Creates an instance of the ShovelHole class.
     * @param The World.
     * @param {boolean} immediate - Whether to initialize the object immediately.
     */
    constructor(world, immediate) {
        super(world);
        this.generateStamp(this.name);
        if (immediate) {
            this.init();
        }
    }

    /**
     * Destroys the shovel hole object.
     */
    destroy() {
        this.world.level.projectiles = destroy(this, this.world.level.projectiles, this.world);
        this.atvInterval = this.world.clearRepeater( this.atvInterval );
        super.destroy();
    }

    /**
     * Initializes the shovel hole object.
     */
    init() {
        super.init();
        this.loadImage(this.IMAGES_BLANK.files[0]);
        this.changeAnimation(this.IMAGES_BLANK);

        let self = this; this.atvInterval = this.world.setRepeater(function(){
           self.active = !self.active;
        }, this.atvDelay);
    }

    /**
     * Main logic of the shovel hole, executed every frame.
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

    /**
     * Handles the animation.
     */
    handleAnimation() {
        if(this.active){
            this.changeAnimation(this.IMAGES_ARROWDIG);
        }else{
            this.changeAnimation(this.IMAGES_BLANK);
        }
        this.playAnimation(this.currImageSet);
    }

    /**
     * Plays the current animation.
     * @param {Anim} anim - The animation to be played.
     */
    playAnimation(anim) {
        if (!this.world || !anim) return;
        const i = this.currImage % anim.files.length;
        const path = anim.files[i];
        this.img = this.getCachedImage(path);
        this.currImage++;
    }
}