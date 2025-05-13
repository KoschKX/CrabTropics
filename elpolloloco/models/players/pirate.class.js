/**
 * A Pirate named Kit.
 */
class Pirate extends Player {

    /** START VALUES */
    name = 'Pirate';
    groundOffset = -64;
    speed = 4;
    frameRate = 24;
    health = 3;
    maxHealth = 6;
    starthealth = 3;
    useGravity = true;


    /** ANIMATIONS */
    IMAGES_IDLE = new Anim('./img/kit/IDLE_001.png', [1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2], '');
    IMAGES_WALK = new Anim('./img/kit/RUN_001.png', 14, '');
    IMAGES_JUMP = new Anim('./img/kit/JUMP_001.png', 7, 'repeat=0');
    IMAGES_HURT = new Anim('./img/kit/JUMP_001.png', [1, 1, 2, 3, 4], '');
    IMAGES_DIE = new Anim('./img/kit/DIE_001.png', 16, 'repeat=0');
    IMAGES_DIG = new Anim('./img/kit/DIG_001.png', 14, '');
    imagesLib = [
        this.IMAGES_IDLE, this.IMAGES_WALK, this.IMAGES_JUMP,
        this.IMAGES_HURT, this.IMAGES_DIE, this.IMAGES_DIG,
    ];

    /** HITBOXES */
    boxes = [
        [this.width * 0.33, this.height * 0.20, this.width * 0.36, this.height * 0.65, 'red', true],
        [this.width * 0.33, this.height * 0.85, this.width * 0.36, this.height * 0.15, 'yellow', true]
    ];

    /** UNIQUE */
    lastMark = 0;
    maxMarks = 3;
    spotting = true;
    digging = false;
    currXmark;

    /**
     * Creates a Pirate instance.
     * @param {World} The World.
     */
    constructor(world) {
        super(world);
        this.generateStamp(this.name);
    }

    /**
     * Destroys the pirate character object.
     */
    destroy() {
        super.destroy();
    }

    /**
     * Initializes the pirate character.
     */
    init() {
        super.init();
        this.loadImage(this.IMAGES_IDLE.files[0]);
        this.changeAnimation(this.IMAGES_IDLE);
    }

    /**
     * Main logic of the pirate, executed every frame.
     * @param {number} delta - The time elapsed since the last frame in milliseconds.
     */
    main(delta) {
        super.main(delta);
        this.xMarkSpotting();
        this.replenishBigCrab();
    }

    /**
     * Caches all pirate-related images.
     */
    cache() {
        this.cacheImages(this.IMAGES_IDLE);
        this.cacheImages(this.IMAGES_WALK);
        this.cacheImages(this.IMAGES_JUMP);
        this.cacheImages(this.IMAGES_HURT);
        this.cacheImages(this.IMAGES_DIE);

        super.cacheImages();
    }

    /**
     * Handles animation changes for the pirate character based on its state.
     */
    handleAnimation() {
        if (!this.world) { return; }

        this.hurt = this.isHurt();

        if (this.dead) {
            this.changeAnimation(this.IMAGES_DIE);
        } else if (this.digging) {
            if (this.currImage == this.currImageSet.files.length - 1) {
                this.xMarkRemove(this.currXmark);
            }
            this.changeAnimation(this.IMAGES_DIG);
        } else if (this.hurt && !this.invincible) {
            this.changeAnimation(this.IMAGES_HURT);
        } else {
            if (this.bouncing) {
                this.changeAnimation(this.IMAGES_JUMP);
            } else {
                if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
                    this.changeAnimation(this.IMAGES_WALK);
                } else {
                    this.changeAnimation(this.IMAGES_IDLE);
                }
            }
        }
        this.playAnimation(this.currImageSet);
    }

    /**
     * Makes the pirate dig and create a shovel hole.
     * @param {XMark} xmark - The XMark object to be dug up.
     */
    dig(xmark) {
        if (!xmark.buried || this.digging) { return; }
        this.currImage = 0;
        this.digging = true;
        this.static = true;
        this.invincible = true;
        this.currXmark = xmark;

        if(xmark.xarrow){ xmark.xarrow.destroy(); }

        let hole = new ShovelHole(this.world, true);
        hole.x = xmark.x;
        hole.y = xmark.y - 6;
        this.world.level.projectiles.push(hole);
        this.world.audio.playSound('shovel_digA', 0.5);
    }

    /**
     * Replenishes a big crab enemy if there are none.
     */
    replenishBigCrab() {
        if (!this.world) { return; }
        let crabsB = this.world.level.enemies.filter(enemy => enemy.name === 'Crab' && enemy.variant === 3);
        if (!crabsB.length) {
            let crabB = new Crab(this.world, 3);
            this.world.level.enemies.push(crabB);
            let rndDir = randomInt(0, 1);
            if (rndDir == 1) {
                crabB.x = this.world.level.bounds[0] - crabB.width;
                crabB.currDirection = 1;
            } else {
                crabB.x = this.world.level.bounds[2] + crabB.width;
                crabB.currDirection = 0;
            }
            let self = this;
            this.world.setTimer(function () {
                crabB.init();
            }, randomInt(1, 10) * 1000);
        }
    }

    /**
     * Removes an XMark object and resets pirate state.
     * @param {XMark} xmark - The XMark object to remove.
     */
    xMarkRemove(xmark) {
        if (!xmark) { return; }
        xmark.buried = false;
        xmark.destroy();
        if (xmark == this.currXmark) {
            this.currXmark = false;
            this.invincible = false;
            this.digging = false;
            this.static = false;
        }
    }

    /**
     * Spots new XMarks and adds them to the world.
     */
    xMarkSpotting() {
        if (!this.world || !this.world.level) { return; }
        if (!this.spotting) { return; }

        const rDelay = randomInt(100, 100000);
        const now = this.now();

        this.xmarks = this.world.level.projectiles.filter(projectile => projectile.name === 'XMark');

        if (now - this.lastMark < rDelay || this.xmarks.length >= this.maxMarks) {
            return;
        }

        let mark = new XMark(this.world, true);

        let markCenterX = randomInt(0, this.world.level.bounds[2]) - (mark.width * 0.5);
        let markCenterY = this.world.ground + (mark.height * 0.5) + 36;

        mark.x = markCenterX;
        mark.y = markCenterY;
        mark.world = this.world;

        // mark.createXArrow();

        this.world.level.projectiles.push(mark);

        this.world.audio.playSound('xmark_appearA', 0.5);

        this.lastMark = this.now();
    }
}