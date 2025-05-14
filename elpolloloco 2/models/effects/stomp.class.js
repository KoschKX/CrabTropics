/**
 * A Stomp effect. Crush your enemies.
 * @extends MovableObject
 */
class Stomp extends MovableObject {

    /** START VALUES */
    name = 'Stomp';
    width = 400;
    height = 300;
    scale = 1;
    speed = 0.25;
    useGravity = false;
    frameRate = 30;

    /** ANIMATIONS */
    IMAGES_STOMP = new Anim('./img/stompA/STOMP_001.png', 28, '');
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