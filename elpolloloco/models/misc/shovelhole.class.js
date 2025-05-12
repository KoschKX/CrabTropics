/**
 * A Hole that spawns items like crabs, doubloons, and catnip.
 * @extends {Enemy}
 */
class ShovelHole extends Enemy {

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
    IMAGES_OPEN = new Anim('./img/misc/SHOVELHOLE_OPEN_001.png', 0, '');

    /** @type {Anim} */
    IMAGES_CLOSE = new Anim('./img/misc/SHOVELHOLE_CLOSE_001.png', 4, '');

    /** @type {Anim[]} */
    imagesLib = [
        this.IMAGES_OPEN, this.IMAGES_CLOSE,
    ];

    /** @type {boolean | null} */
    createobj = null;

    /** @type {number} */
    objtype;

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
        super.destroy();
    }

    /**
     * Initializes the shovel hole object.
     */
    init() {
        super.init();
        this.loadImage(this.IMAGES_OPEN.files[0]);
        this.changeAnimation(this.IMAGES_OPEN);
        let self = this;
        this.world.setTimer(function () {
            self.changeAnimation(self.IMAGES_CLOSE);
        }, 2000);

        this.setContent();
    }

    /**
     * Main logic of the shovel hole, executed every frame.
     * @param {number} delta - The time elapsed since the last frame in milliseconds.
     */
    main(delta) {
        super.main(delta);
    }

    /**
     * Sets the content type of the shovel hole (empty, catnip, crabs, or doubloons).
     */
    setContent() {
        const roll = Math.random() * 100;
        if (roll < 5) {
            this.objtype = 0; // 5% EMPTY
        } else if (roll < 15) {
            this.objtype = 3; // 10% CATNIP
        } else if (roll < 30) {
            this.objtype = 1; // 15% CRABS
        } else {
            this.objtype = 2; // 70% DOUBLOONS
        }
    }

    /**
     * Creates a doubloon object.
     */
    createDoubloon() {
        if (!this.world) { return; }
        let self = this;
        this.world.setTimer(function () {
            if (self.createobj) { return; }

            let rndVari;
            const roll = Math.random() * 100;
            if (roll <= 30) {
                rndVari = 1; // 30% SILVER
            } else {
                rndVari = 0; // 70% GOLD
            }

            self.createobj = new Doubloon(self.world, rndVari, true);
            self.createobj.x = self.x + (self.width - self.createobj.width) * 0.5;
            self.createobj.y = self.y - self.height;
            const animations = [
                self.createobj.IMAGES_SPINA, self.createobj.IMAGES_IMAGES_SPINB
            ];
            const anim = animations[self.createobj.variant];
            self.world.level.items.push(self.createobj);
            self.world.audio.playSound('doubloon_findA', 1.0);
        }, 1000);
    }

    /**
     * Creates a catnip object.
     */
    createCatnip() {
        if (!this.world) { return; }
        let self = this;
        this.world.setTimer(function () {
            if (self.createobj) { return; }
            self.createobj = new Catnip(self.world, true);
            self.createobj.x = self.x + (self.width - self.createobj.width) * 0.5;
            self.createobj.y = self.y - (self.height * 2);
            self.createobj.changeAnimation(self.createobj.IMAGES_SPARKLE);
            self.world.level.items.push(self.createobj);
            self.world.audio.playSound('catnip_findA', 1.0);
        }, 1000);
    }

    /**
     * Creates a crab object.
     */
    createCrab() {
        if (!this.world) { return; }
        this.world.setTimer(() => {
            if (this.createobj) return;
            this.createobj = new Crab(this.world, [0, 2]);
            this.createobj.x = this.x + (this.width - this.createobj.width) * 0.5;
            this.createobj.y = this.y;
            this.createobj.init();
            this.createobj.appear();
            this.world.level.enemies.push(this.createobj);
        }, 1500);
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
     * Plays the current animation.
     * @param {Anim} anim - The animation to be played.
     */
    playAnimation(anim) {
        if (!this.world || !anim) return;
        const i = this.currImage % anim.files.length;
        const path = anim.files[i];
        this.img = this.getCachedImage(path);
        if (i === 0) {
            const actions = {
                1: this.createCrab, 2: this.createDoubloon, 3: this.createCatnip
            };
            const action = actions[this.objtype];
            if (action) action.call(this);
        }
        if (i < anim.files.length - 1) {
            this.currImage++;
        } else if (anim === this.IMAGES_CLOSE) {
            this.destroy();
        }
    }
}