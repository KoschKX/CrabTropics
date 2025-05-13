/**
 * A Sparkle effect.
 * @extends MovableObject
 */
class Sparkle extends MovableObject {

    /** START VALUES */
    name = 'Sparkle';
    scale = 1;
    frameRate = 24;
    speed = 0.25;
    useGravity = false;

    /** ANIMATIONS */
    IMAGES_SPARKLEA = new Anim('./img/sparkle/SPARKLE_GREEN_001.png', 25, '');
    IMAGES_SPARKLEB = new Anim('./img/sparkle/GOLD_001.png', 25, '');
    imagesLib = [
        this.IMAGES_SPARKLEA,
        this.IMAGES_SPARKLEB,
    ];

    /** UNIQUE */
    target = null;
    offset = [0, 0];

    /**
     * Creates a Sparkle instance.
     * @param {World} The world.
     * @param {number|number[]} variant The variant of the sparkle (0 for green, 1 for gold), or an array with range for random selection.
     * @param {boolean} immediate If set to true, initializes the Sparkle immediately.
     */
    constructor(world, variant = 0, immediate = false) {
        super(world);
        this.generateStamp(this.name);

        // Determine the variant of the sparkle, either from a range or direct value.
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
     * Sets the target object for the Sparkle to follow.
     * @param {MovableObject} target The target object the sparkle will follow.
     * @param {number[]} offset The offset to adjust the sparkle's position relative to the target.
     */
    setTarget(target, offset = []) {
        this.target = target;
        this.offset = offset;
    }

    /**
     * Destroys the Sparkle object and removes it from the world.
     */
    destroy() {
        this.world.level.effects = destroy(this, this.world.level.effects, this.world);
        super.destroy();
    }

    /**
     * Initializes the Sparkle object, setting its animation and size based on its variant.
     */
    init() {
        super.init();

        // Set the sparkle's animation based on its variant (green or gold).
        const variantData = [this.IMAGES_SPARKLEA, this.IMAGES_SPARKLEB];
        this.loadImage(variantData[this.variant].files[0]);

        // Adjust the size based on the selected variant.
        if (this.variant === 0) {
            this.width = 256;
            this.height = 256;
        }
        if (this.variant === 1) {
            this.width = 128;
            this.height = 128;
        }

        // Apply the animation.
        this.changeAnimation(variantData[this.variant]);
    }

    /**
     * The main update loop for the Sparkle. Called every frame.
     * Updates the position based on the target object.
     * @param {number} delta The time difference between frames.
     */
    main(delta) {
        super.main(delta);

        // If the sparkle has a target, update its position to follow the target.
        if (this.target) {
            this.x = this.target.x + ((this.target.width - this.width) * 0.5) + this.offset[0];
            this.y = this.target.y + ((this.target.height - this.height) * 0.5) + this.offset[1];
        }
    }

    /**
     * Plays the provided animation for the Sparkle object.
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