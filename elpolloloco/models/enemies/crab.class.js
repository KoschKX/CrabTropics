/**
 * A crab enemy. He is definitely crabby.
 */
class Crab extends Enemy {

    /** START VALUES */
    name = 'Crab';
    width = 230;
    height = 88;
    groundOffset = 0;
    frameRate = 24;
    health = 3;
    maxHealth = 3;
    speed = 0.1;
    useGravity = true;
    hostile = false;
    bounceoninjured = true;
    
    /** ANIMATIONS */
    IMAGES_MOVEA1 = new Anim('./img/crabA/YELLOW_MOVE_001.png', 12, '');
    IMAGES_MOVEA2 = new Anim('./img/crabA/BLUE_MOVE_001.png', 12, '');
    IMAGES_MOVEA3 = new Anim('./img/crabA/RED_MOVE_001.png', 12, '');
    IMAGES_MOVEB = new Anim('./img/crabB/RED_MOVE_001.png', 12, '');
    IMAGES_DIEA1 = new Anim('./img/crabA/YELLOW_DIE_004.png', [4, 5, 6, 7, 8, 9, 10, 11, 12], 'repeat=0');
    IMAGES_DIEA2 = new Anim('./img/crabA/BLUE_DIE_004.png', [4, 5, 6, 7, 8, 9, 10, 11, 12], 'repeat=0');
    IMAGES_DIEA3 = new Anim('./img/crabA/RED_DIE_004.png', [4, 5, 6, 7, 8, 9, 10, 11, 12], 'repeat=0');
    IMAGES_DIEB = new Anim('./img/crabB/RED_DIE_004.png', [4, 5, 6, 7, 8, 9, 10, 11, 12], 'repeat=0');
    IMAGES_APPEARA1 = new Anim('./img/crabA/YELLOW_APPEAR_001.png', [4, 5, 6, 7, 8, 9, 10, 11, 12], 'repeat=0');
    IMAGES_APPEARA2 = new Anim('./img/crabA/BLUE_APPEAR_001.png', [4, 5, 6, 7, 8, 9, 10, 11, 12], 'repeat=0');
    IMAGES_APPEARA3 = new Anim('./img/crabA/RED_APPEAR_001.png', [4, 5, 6, 7, 8, 9, 10, 11, 12], 'repeat=0');
    imagesLib = [
        this.IMAGES_MOVEA1, this.IMAGES_MOVEA2, this.IMAGES_MOVEA3, this.IMAGES_MOVEB,
        this.IMAGES_DIEA1, this.IMAGES_DIEA2, this.IMAGES_DIEA3, this.IMAGES_DIEB,
        this.IMAGES_APPEARA1, this.IMAGES_APPEARA2, this.IMAGES_APPEARA3,
    ];

    /** HITBOXES */
    boxes = [];
    boxes_fine = [
        [this.width * 0.25, this.height * 0.35, this.width * 0.50, this.height * 0.60, 'red', true],
        [this.width * 0.15, this.height * 0.10, this.width * 0.7, this.height * 0.25, 'yellow', true]
    ];
    boxes_hurt = [
        [this.width * 0.25, this.height * 0.46, this.width * 0.50, this.height * 0.48, 'red', true],
        [this.width * 0.37, this.height * 0.45, this.width * 0.25, this.height * 0.20, 'yellow', true]
    ];

    /** UNIQUE */
    appearing = false;
    stomp;
    walksound;

    /**
     * Creates a Crab instance.
     * @param {World} The World.
     * @param {number | number[]} [variant=0] - The variant of the crab (color/type).
     */
    constructor(world, variant = 0, immediate = false) {
        super(world);
        this.generateStamp(this.name);

        // Set the variant (type/color) of the crab
        if (Array.isArray(variant) && variant.length >= 2) {
            this.variant = randomInt(variant[0], variant[1]);
        } else {
            this.variant = variant;
        }

        this.speed = random(0.05, 0.1);
        this.originalspeed = this.speed;

        if (immediate) {
            this.init();
        }
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
    init(respawn = true) {
        super.init();
        this.boxes = [this.boxes_fine];
        this.hostile = true;
        if(respawn){ this.respawn(); this.moving = true; }
    }

    respawn(){
        this.spawn( this.world.level.bounds[2] * 0.5, this.world.level.bounds[2], this.world.ground );
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
        if (!this.world || this.static || this.dead || !this.moving)  { return; }
        super.moveLeft(this.delta);
        if (!this.walksound || !this.world.audio.isSpecificSoundPlaying('crab_walkA', this.walksound)) {
            this.walksound = this.world.audio.playSound('crab_walkA', 0.25, true);
        }
    }

    /**
     * Moves the crab to the right.
     */
    moveRight() {
        if (!this.world || this.static || this.dead || !this.moving) { return; }
        super.moveRight(this.delta);
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