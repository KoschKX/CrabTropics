/**
 * A Stomp effect. Crush your enemies.
 * @extends MovableObject
 */
class Stomp extends MovableObject {

    /**
     * @type {string} The name of the Stomp object.
     */
    name = 'Stomp';

    /**
     * @type {number} The width of the Stomp object.
     */
    width = 400;

    /**
     * @type {number} The height of the Stomp object.
     */
    height = 300;

    /**
     * @type {number} The frame rate of the Stomp animation.
     */
    frameRate = 24;

    /**
     * @type {boolean} Whether gravity should be applied to the Stomp object (not used).
     */
    useGravity = false;

    /**
     * @type {number} The speed of the Stomp object.
     */
    speed = 0.25;

    /**
     * @type {number} The frame rate used for the Stomp animation.
     */
    frameRate = 30;

    /**
     * @type {number} The scale of the Stomp object.
     */
    scale = 1;

    /**
     * @type {Anim} The animation for the Stomp effect.
     */
    IMAGES_STOMP = new Anim('./img/stompA/STOMP_001.png', 28, '');

    /**
     * @type {Anim[]} The list of animations associated with the Stomp object.
     */
    imagesLib = [
        this.IMAGES_STOMP
    ];

    /**
     * Creates a Stomp instance.
     * @param {World} world The world in which the Stomp exists.
     * @param {boolean} immediate If set to true, initializes the Stomp immediately.
     */
    constructor(world, immediate = false) {
        super(world);
        this.generateStamp(this.name);

        if (immediate) { 
            this.init(); 
        }
    }

    /**
     * Destroys the Stomp object and cleans up.
     */
    destroy() {
        this.world.level.effects = destroy(this, this.world.level.effects, this.world);
        super.destroy();
    }

    /**
     * Initializes the Stomp object, setting its animation and properties.
     */
    init() {
        super.init();
        this.loadImage(this.IMAGES_STOMP.files[0]);
        this.changeAnimation(this.IMAGES_STOMP);
    }

    /**
     * The main update loop for the Stomp object. Called every frame.
     * @param {number} delta The time difference between frames.
     */
    main(delta) {
        super.main(delta);
    }

    /**
     * Plays the provided animation for the Stomp object.
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