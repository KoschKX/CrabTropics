/**
 * A crab enemy. He is definitely crabby.
 * @extends {Enemy}
 */
class Crab extends Enemy {

    /** @type {string} The name of the enemy. */
    name = 'Crab';

    /** @type {number} The current health of the crab. */
    health = 3;

    /** @type {number} The maximum health of the crab. */
    maxHealth = 3;

    /** @type {number} The height of the crab. */
    height = 64;

    /** @type {number} The width of the crab. */
    width = 192;

    /** @type {number} The ground offset of the crab. */
    groundOffset = 0;

    /** @type {number} The frame rate for animations. */
    frameRate = 24;

    /** @type {boolean} Whether the crab uses gravity. */
    useGravity = true;

    /** @type {number} The speed at which the crab moves. */
    speed = 3;

    /** @type {Array<Array<number>>} The fine collision boxes for the crab. */
    boxes_fine = [
        [this.width * 0.25, this.height * 0.35, this.width * 0.50, this.height * 0.60, 'red', true],
        [this.width * 0.15, this.height * 0.10, this.width * 0.7, this.height * 0.25, 'yellow', true]
    ];

    /** @type {Array<Array<number>>} The collision boxes when the crab is hurt. */
    boxes_hurt = [
        [this.width * 0.25, this.height * 0.46, this.width * 0.50, this.height * 0.48, 'red', true],
        [this.width * 0.37, this.height * 0.45, this.width * 0.25, this.height * 0.20, 'yellow', true]
    ];

    /** @type {Array<Array<number>>} The current collision boxes of the crab. */
    boxes = [];

    /** @type {boolean} Whether the crab is hostile or not. */
    hostile = false;

    /** @type {boolean} Whether the crab should bounce when injured. */
    bounceoninjured = true;

    /** @type {Anim} Animation for yellow crab movement. */
    IMAGES_MOVEA1 = new Anim('./img/crabA/YELLOW_MOVE_001.png', 12, '');

    /** @type {Anim} Animation for blue crab movement. */
    IMAGES_MOVEA2 = new Anim('./img/crabA/BLUE_MOVE_001.png', 12, '');

    /** @type {Anim} Animation for red crab movement. */
    IMAGES_MOVEA3 = new Anim('./img/crabA/RED_MOVE_001.png', 12, '');

    /** @type {Anim} Animation for red crab movement (alternative). */
    IMAGES_MOVEB = new Anim('./img/crabB/RED_MOVE_001.png', 12, '');

    /** @type {Anim} Animation for yellow crab death. */
    IMAGES_DIEA1 = new Anim('./img/crabA/YELLOW_DIE_004.png', [4, 5, 6, 7, 8, 9, 10, 11, 12], 'repeat=0');

    /** @type {Anim} Animation for blue crab death. */
    IMAGES_DIEA2 = new Anim('./img/crabA/BLUE_DIE_004.png', [4, 5, 6, 7, 8, 9, 10, 11, 12], 'repeat=0');

    /** @type {Anim} Animation for red crab death. */
    IMAGES_DIEA3 = new Anim('./img/crabA/RED_DIE_004.png', [4, 5, 6, 7, 8, 9, 10, 11, 12], 'repeat=0');

    /** @type {Anim} Animation for red crab death (alternative). */
    IMAGES_DIEB = new Anim('./img/crabB/RED_DIE_004.png', [4, 5, 6, 7, 8, 9, 10, 11, 12], 'repeat=0');

    /** @type {Anim} Animation for yellow crab appearance. */
    IMAGES_APPEARA1 = new Anim('./img/crabA/YELLOW_APPEAR_001.png', [4, 5, 6, 7, 8, 9, 10, 11, 12], 'repeat=0');

    /** @type {Anim} Animation for blue crab appearance. */
    IMAGES_APPEARA2 = new Anim('./img/crabA/BLUE_APPEAR_001.png', [4, 5, 6, 7, 8, 9, 10, 11, 12], 'repeat=0');

    /** @type {Anim} Animation for red crab appearance. */
    IMAGES_APPEARA3 = new Anim('./img/crabA/RED_APPEAR_001.png', [4, 5, 6, 7, 8, 9, 10, 11, 12], 'repeat=0');

    /** @type {Array<Anim>} Array containing all crab animations. */
    imagesLib = [
        this.IMAGES_MOVEA1, this.IMAGES_MOVEA2, this.IMAGES_MOVEA3, this.IMAGES_MOVEB,
        this.IMAGES_DIEA1, this.IMAGES_DIEA2, this.IMAGES_DIEA3, this.IMAGES_DIEB,
        this.IMAGES_APPEARA1, this.IMAGES_APPEARA2, this.IMAGES_APPEARA3,
    ];

    /** @type {boolean} Flag indicating whether the crab is appearing. */
    appearing = false;

    /** @type {Stomp} A stomp effect triggered upon death. */
    stomp;

    /** @type {string} A sound effect played when the crab is walking. */
    walksound;

    /**
     * Creates a Crab instance.
     * @param {World} The World.
     * @param {number | number[]} [variant=0] - The variant of the crab (color/type).
     */
    constructor(world, variant = 0) {
        super(world);
        this.generateStamp(this.name);

        // Set the variant (type/color) of the crab
        if (Array.isArray(variant) && variant.length >= 2) {
            this.variant = randomInt(variant[0], variant[1]);
        } else {
            this.variant = variant;
        }

        // Set the initial position and speed
        this.x = 200 + random(0, 500);
        this.y = world.ground;
        this.speed = random(0.5, 1);
        this.originalspeed = this.speed;
    }

    /**
     * Destroys the Crab instance and cleans up.
     */
    destroy() {
        super.destroy();
        this.world.level.enemies = destroy(this, this.world.level.enemies, this.world);
        this.world.clearTimer(this.dieTimeout);
        this.world.clearTimer(this.reviveTimout);
    }

    /**
     * Initializes the crab by setting its collision boxes and making it hostile.
     */
    init() {
        super.init();
        this.boxes = [this.boxes_fine];
        this.hostile = true;
    }

    /**
     * Main logic for the crab. Handles invincibility, death, and animations.
     * @param {number} delta - The time delta for frame updates.
     */
    main(delta) {
        super.main(delta);

        let self = this;

        if (this.invincible && !this.dead) {
            this.static = true;
            this.revive(3000, function () {
                self.static = false;
                self.invincible = false;
                self.hostile = true;
            });
        }

        if (this.dead && !this.dieTimeout) {
            this.dieTimeout = this.world.setTimer(function () { self.die(); }, 1000);
        }

        if (this.hurt || this.invincible || this.dead) {
            this.boxes = this.boxes_hurt;
            this.toggleCollider(0, false);
        } else {
            this.boxes = this.boxes_fine;
            this.toggleCollider(0, true);
        }
    }

    /**
     * Called when the crab is hit by something.
     */
    isHit() {
        super.isHit();
        this.currImage = 0;
        this.invincible = true;
        this.static = true;
        this.hostile = false;

        if (this.health <= 0) this.world.clearTimer(this.reviveTimout);
        this.world.audio.playSound(['crab_hitA', 'crab_hitB', 'crab_hitC']);
    }

    /**
     * Moves the crab to the left.
     */
    moveLeft() {
        if (!this.world || this.static || this.dead) { return; }
        super.moveLeft();
        if (!this.walksound || !this.world.audio.isSpecificSoundPlaying('crab_walkA', this.walksound)) {
            this.walksound = this.world.audio.playSound('crab_walkA', 0.25, true);
        }
    }

    /**
     * Moves the crab to the right.
     */
    moveRight() {
        if (!this.world || this.static || this.dead) { return; }
        super.moveRight();
        if (!this.walksound || !this.world.audio.isSpecificSoundPlaying('crab_walkA', this.walksound)) {
            this.walksound = this.world.audio.playSound('crab_walkA', 0.25, true);
        }
    }

    /**
     * Makes the crab appear by playing its appearance animation.
     */
    appear() {
        const animations = [
            this.IMAGES_APPEARA1, this.IMAGES_APPEARA2, this.IMAGES_APPEARA3
        ];
        const anim = animations[this.variant];
        if (anim) this.changeAnimation(anim);
        this.appearing = true;
        this.static = true;
    }

    /**
     * Handles the animation of the crab based on its current state (moving, dying, etc.).
     */
    handleAnimation() {
        if (!this.appearing) {
            const variantData = {
                0: { invincible: this.IMAGES_DIEA1, move: this.IMAGES_MOVEA1 },
                1: { invincible: this.IMAGES_DIEA2, move: this.IMAGES_MOVEA2 },
                2: { invincible: this.IMAGES_DIEA3, move: this.IMAGES_MOVEA3 },
                3: { invincible: this.IMAGES_DIEB, move: this.IMAGES_MOVEB }
            }[this.variant];

            if (variantData) {
                const { move, invincible } = variantData;
                this.changeAnimation((this.invincible || this.dead) || this.hurt ? invincible : move);
            }
        }

        this.playAnimation(this.currImageSet);

        if (this.currImageSet == this.IMAGES_MOVEB || 
            (this.currImageSet == this.IMAGES_MOVEA1 || 
             this.currImageSet == this.IMAGES_MOVEA2 || 
             this.currImageSet == this.IMAGES_MOVEA3)) {
            this.applyAnimationOffsets(this.currOffsetSet);
        }

        if (this.appearing && this.currImage == this.currImageSet.files.length - 1) {
            this.appearing = false;
            this.static = false;
        }
    }


    /**
     * Handles the crab's death and applies the stomp effect.
     */
    die() {
        if (this.stomp) { return; }
        this.stomp = new Stomp(this.world, true);
        this.stomp.world = this.world;
        this.stomp.x = (this.x + (this.width - this.stomp.width) * 0.5);
        this.stomp.y = (this.y + (this.height - this.stomp.height) * 0.5) - 20;
        this.world.level.effects.push(this.stomp);
        this.destroy();
    }
}