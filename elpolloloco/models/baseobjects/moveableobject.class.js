/**
 * Represents an animated, movable object in a game world.
 */
class MovableObject {

    /** ID */
    name = '';
    stamp = '';

    /** IMAGE */
    x = 120;
    y = 350;
    width = 128;
    height = 128;

    /** ANIMATION */
    IMAGES_BLANK = new Anim('./img/blank.png');
    imagesLib = [this.IMAGES_BLANK];
    imageCache = [];
    currImageSet = [''];
    noRepeat = [];
    img;
    cache;
    flipOffset = [0, 0];
    frameRate = 30;
    animInterval;
    groundOffset = 0;
    currImage = 0;

    /** STATUS */
    facingRight = true;
    falling = false;
    bouncing = false;
    static = false;
    appearing = false;

    /** PHYSICAL */
    speed = 1;
    acceleration = 1;
    speedY = 0;
    gravity = 0.066;
    useGravity = false;
    useGround = true;
    currDirection = 1;

    initialized = false;

    /* WORLD REFERENCE */
    world; delta = 0;

    /**
     * Creates a movable object.
     * @param {any} world - The world context in which the object exists.
     * @param {string} name - The name of the object.
     */
    constructor(world, name) {
        this.world = world;
        if (this.name) {
            this.name = name;
            this.generateStamp(name);
        }
    }

    /** Stops animation and clears the interval. */
    destroy() {
        clearInterval(this.animInterval);
    }

    /** Initializes the object, sets default image and starts animation. */
    init() {
        this.delta = 0;
        this.loadImage(this.IMAGES_BLANK.files[0]);
        this.currImageSet = this.IMAGES_BLANK;
        clearInterval(this.animInterval);
        this.animInterval = setInterval(() => {
            this.animate();
        }, 1000 / this.frameRate);
        this.initialized = true;
    }

    /**
     * Generates a unique stamp based on time and randomness.
     * @param {string} name
     */
    generateStamp(name) {
        this.stamp =
            Date.now().toString(36) + '_' +
            Math.floor(performance.now()).toString(36) + '_' +
            Math.random().toString(36).slice(2, 8);
    }

    /** Main update function; handles gravity if enabled. */
    main(delta) {
        this.delta = delta;
        if (this.useGravity) {
            this.handleGravity();
        }
    }

    /** Runs one animation step unless the world is paused. */
    animate() {
        if (this.world && this.world.paused) return;
        this.handleAnimation();
    }

    /** Gets the current time from the world. */
    now() {
        return this.world ? this.world.elapsedTime : 0;
    }

    // --- SPRITE HANDLING ---

    /**
     * Loads a single image from cache.
     * @param {string} path
     */
    loadImage(path) {
        const ext = path.split('.').pop();
        if (ext !== 'png' && ext !== 'jpg') return;
        if (!path || path.startsWith('*')) return;
        const check = document.querySelector('#cache img[src="' + path + '"]');
        if (check) this.img = check;
    }

    /**
     * Loads multiple images into the cache if not already loaded.
     * @param {string[]} arr
     * @returns {string[]} The same array passed in.
     */
    loadImages(arr) {
        if (!arr) return;
        arr.forEach((path) => {
            if (!path || path === '' || path.startsWith('*') || this.imageCache?.[path]) return;
            const check = document.querySelector('#cache img[src="' + path + '"]');
            if (!check && this.world && this.world.level) {
                this.world.level.createImage(this, path, true);
            }
            this.imageCache[path] = path;
        });
        return arr;
    }

    /**
     * Retrieves an image element from cache or returns a default.
     * @param {string} path
     * @returns {HTMLImageElement}
     */
    getCachedImage(path) {
        const check = document.querySelector('#cache img[src="' + path + '"]');
        return check || this.IMAGES_BLANK.files[0];
    }

    /**
     * Draws the object onto a canvas context.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        if (!this.img || !(this.img instanceof HTMLImageElement)) return;
        let offX = this.facingRight ? this.flipOffset[0] : 0;

        if (this.currDirection === 0) {
            ctx.translate(this.x + this.width + offX, this.y);
            ctx.scale(-1, 1);
        } else {
            ctx.translate(this.x - offX, this.y);
        }
        ctx.drawImage(this.img, 0, 0, this.width, this.height);
    }

    /** Plays the current animation. */
    handleAnimation() {
        if (this.world && this.world.paused) return;
        this.playAnimation(this.currImageSet);
    }

    /**
     * Switches to a different animation set.
     * @param {Anim} anim
     * @param {any} offs
     */
    changeAnimation(anim, offs = null) {
        if (this.currImageSet === anim) return;
        this.currImageSet = anim;
        this.currImage = 0;
        this.loadImages(anim.files);
    }

    /**
     * Cycles through frames in the current animation.
     * @param {Anim} anim
     */
    playAnimation(anim) {
        if (this.world && this.world.paused) return;
        if (!anim || !anim.files || !this.img) return;
        const i = this.currImage % anim.files.length;
        const path = anim.files[i];
        this.currImage++;
        if (this.anim?.offsets?.length) this.applyAnimationOffsets(anim);
        this.img = this.getCachedImage(path);
    }

    /**
     * Applies frame-specific horizontal offsets for animations.
     * @param {Anim} anim
     */
    applyAnimationOffsets(anim) {
        if (!anim) return;
        const i = this.currImage % anim.offsets.length;
        const off = anim.offsets[i];
        const fscale = 100 / this.width;
        const foff = off * fscale;
        if (this.currDirection === 0) this.x += foff;
        if (this.currDirection === 1) this.x -= foff;
    }

    /** @returns {number[]} The current flip offsets */
    getOffset() {
        return [this.flipOffset[0], this.flipOffset[1]];
    }

    /**
     * Extracts animation name from path.
     * @param {string} path
     * @returns {string}
     */
    getAnimName(path) {
        if (typeof path !== 'string') return '';
        return path.split('/').pop().split('.')[0].split('_')[0];
    }

    // --- MOVEMENT ---

    /** Handles falling and bouncing using gravity simulation. */
    handleGravity() {
        if (!this.world) return;

        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY *(this.delta * this.gravity); // Adjust gravity with delta
            this.speedY -= this.acceleration * (this.delta * this.gravity); // Apply gravity with delta
            this.falling = this.speedY > 0 ? false : true;
        } else {
            this.falling = false;
        }

        if (this.isAboveGround() || this.speedY === 0) this.bouncing = true;

        if (this.useGround && !this.isAboveGround()) {
            this.falling = false;
            this.bouncing = false;
            this.y = this.world.ground + this.groundOffset;
        }
    }

    /**
     * Initiates an upward bounce.
     * @param {number} spd - Vertical speed.
     * @param {number} [point] - Optional new Y position.
     */
    bounce(spd, point) {
        this.speedY = spd;
        this.bouncing = true;
        this.falling = false;
        this.currImage = 0;
        if (point) this.y = point;
    }

    /** Moves the object left. */
    moveLeft(delta) {
        if (!this.world || this.static || this.dead || !this.initialized) return;
        if (this.x < this.world.level.bounds[0] - (this.width * 0.5)) return;
        this.x -= this.speed * delta;
        this.currDirection = 0;
    }

    /** Moves the object right. */
    moveRight(delta) {
        if (!this.world || this.static || this.dead ) return;
        if (this.x > this.world.level.bounds[2] - (this.width * 0.5)) return;
        this.x += this.speed * delta;
        this.currDirection = 1;
    }

    /** @returns {boolean} True if the object is above the ground level. */
    isAboveGround() {
        return this.world ? this.y < this.world.ground + this.groundOffset : false;
    }

    /** @returns {boolean} True if the object is on the ground level. */
    isOnGround() {
        return this.world ? this.y === this.world.ground + this.groundOffset : false;
    }


}