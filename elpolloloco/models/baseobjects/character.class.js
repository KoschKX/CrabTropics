/**
 * A character.
 * Handles health, money, movement, collision detection, animation and states for characters.
 */
class Character extends MovableObject {

    /** @type {string} */
    name = 'Character';

    /** @type {boolean} */
    dead = false;

    /** @type {boolean} */
    hurt = false;

    /** @type {boolean} */
    invincible = false;

    /** @type {boolean} */
    willInvincible = false;

    /** @type {boolean} */
    hostile = false;

    /** @type {boolean} */
    reviving = false;

    /** @type {boolean} */
    flickering = false;

    /** @type {number} */
    health = 1;

    /** @type {number} */
    maxHealth = 3;

    /** @type {number} */
    starthealth;

    /** @type {number} */
    reviveTimout;

    /** @type {number} */
    dieTimout;

    /** @type {number} */
    doubloons = 0;

    /** @type {number} */
    lastHit = 0;

    /** @type {number} */
    lastFlicker = 0;

    /** @type {boolean} */
    useGravity = true;

    /** @type {boolean} */
    falling = false;

    /** @type {boolean} */
    bounding = false;

    /** @type {Array} */
    boxes = [];

    /** @type {Array} */
    aboxes = [];

    /** @type {Array} */
    aboxesLib = [];

    /** @type {string[]} */
    boxcolors = ['red', 'yellow', 'lime'];

    /**
     * Creates a new character object.
     * @param {object} world - The world context containing the canvas and game logic.
     */
    constructor(world) {
        super(world);
    }

    /**
     * Initializes the character properties and collision boxes.
     */
    init() {
        super.init();
        this.starthealth = this.health;
        this.initCollisionBoxes();
    }

    /**
     * Main update function to be called every frame.
     * @param {number} delta - The time delta since the last frame.
     */
    main(delta) {
        super.main(delta);
    }

    /**
     * Destroys the character and clears any timeouts.
     */
    destroy() {
        super.destroy();
        this.world.clearTimer(this.reviveTimout);
        this.world.clearTimer(this.dieTimout);
    }

    /* COLLISIONS */

    /**
     * Initializes the character's collision boxes.
     */
    initCollisionBoxes() {
        if (this.boxes.length) { return; }
        this.boxes = [[0, 0, this.width, this.height, 'white', false]];
    }

    /**
     * Calculates the direction of the collision with another object.
     * @param {MovableObject} mo - The other movable object.
     * @param {number} boxA - The index of the character's collision box.
     * @param {number} boxB - The index of the other object's collision box.
     * @returns {number} - The direction of the collision (1: top, 2: right, 3: bottom, 4: left).
     */
    getCollisionDirection(mo, boxA, boxB) {
        const [tbx, tby, tbw, tbh] = this.boxes[boxA];
        const [mbx, mby, mbw, mbh] = mo.boxes[boxB];

        let offset = this.getOffset();
        let moffset = mo.getOffset();
        let tx = this.x - offset[0];
        let ty = this.y - offset[1];
        let mx = mo.x - moffset[0];
        let my = mo.y - moffset[1];

        const thisLeft = tx + tbx;
        const thisRight = thisLeft + tbw;
        const thisTop = ty + tby;
        const thisBottom = thisTop + tbh;

        const moLeft = mo.x + mbx;
        const moRight = moLeft + mbw;
        const moTop = mo.y + mby;
        const moBottom = moTop + mbh;

        const overlapX = Math.min(thisRight, moRight) - Math.max(thisLeft, moLeft);
        const overlapY = Math.min(thisBottom, moBottom) - Math.max(thisTop, moTop);

        return overlapX < overlapY ? (tx < mx ? 4 : 2) : (ty < my ? 1 : 3);
    }

    /**
     * Checks if the character is colliding with another object.
     * @param {MovableObject} mo - The other movable object.
     * @param {number} idxA - The index of the character's collision box.
     * @param {number} idxB - The index of the other object's collision box.
     * @returns {number} - The direction of the collision or undefined if no collision.
     */
    isColliding(mo,idxA,idxB) {
        if(!this.boxes || !mo || !mo.boxes){ return; }
        if(!this.boxes[idxA][5] || !this.boxes[idxB][5] || idxA>this.boxes.length-1 || idxB>mo.boxes.length-1 ){ return; }
        if((this.dead || this.invincible || !mo.hostile || mo.dead || mo.hurt) && idxA==0){ return; }

        let offset = this.getOffset(); let moffset = mo.getOffset();    //
        let tx = this.x - offset[0]; let ty = this.y - offset[1];       // ACCOUNT FOR OFFSETS 
        let mx = mo.x - moffset[0]; let my = mo.y - moffset[1];         //

        let dir = 0; 
        let isColliding = (
            tx + this.boxes[idxA][0] < mx + mo.boxes[idxB][0] + mo.boxes[idxB][2] &&
            tx + this.boxes[idxA][0] + this.boxes[idxA][2] > mx + mo.boxes[idxB][0] &&
            ty + this.boxes[idxA][1] < my + mo.boxes[idxB][1] + mo.boxes[idxB][3] &&
            ty + this.boxes[idxA][1] + this.boxes[idxA][3] > my + mo.boxes[idxB][1]
        );

        if(isColliding){  
            dir = this.getCollisionDirection(mo,idxA,idxB);
            if(this.world.debug){
                let tdir = '';
                if(dir==1){ tdir = 'top'; } if(dir==2){ tdir = 'right'; }
                if(dir==3){ tdir = 'bottom'; } if(dir==4){ tdir = 'left'; }
            }
        }
        return dir;
    }

    /**
     * Toggles a specific collider on or off.
     * @param {number} idx - The index of the collision box.
     * @param {boolean} onOff - Whether to enable (true) or disable (false) the collider.
     */
    toggleCollider(idx, onOff) {
        if (!this.boxes || !this.boxes[idx]) { return; }
        this.boxes[idx][5] = onOff;
    }

    /**
     * Activates all of the character's collision boxes.
     */
    activateColliders() {
        this.boxes.forEach((box) => { box[5] = true; });
    }

    /**
     * Deactivates all of the character's collision boxes.
     */
    deactivateColliders() {
        this.boxes.forEach((box) => { box[5] = false; });
    }

    /**
     * Draws the specified collider on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     * @param {number} idx - The index of the collider to draw.
     */
    drawCollider(ctx, idx) {
        if (!ctx || !this.boxes || this.boxes.length < idx) { return; }
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.setLineDash(this.boxes[idx][5] ? [] : [3, 3]);
        ctx.strokeStyle = this.boxes[idx][5] ? this.boxes[idx][4] : 'white';
        ctx.rect(this.boxes[idx][0], this.boxes[idx][1], this.boxes[idx][2], this.boxes[idx][3]);
        ctx.stroke();
    }

    /**
     * Draws all of the character's collision boxes on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawColliders(ctx) {
        if (!this.boxes || !this.boxes.length) { return; }
        this.boxes.forEach((box, idx) => this.drawCollider(ctx, idx, box));
    }

    /**
     * Retrieves and initializes animated hitboxes for the character.
     * @param {Array} lib - The library of animations.
     */
    getAnimatedHitBoxes(lib) {
        let tmpboxes = this.aboxesLib;
        this.aboxesLib = [];
        let self = this;
        tmpboxes.forEach((anim, idx) => {
            let ahb = new AnimatedHitbox(this, anim);
            self.aboxesLib[anim.name] = ahb;
        });
    }

    /**
     * Animates the character's collision boxes based on the current animation.
     */
    animateCollisionBoxes() {
        this.alib = this.aboxesLib[this.currImageSet.name];
        this.boxes = [];
        if (!this.alib) { return; }
        this.aboxes = this.alib.boxes;
        for (let ab = 0; ab < this.aboxes.length; ab++) {
            let abox = this.aboxes[ab][parseInt(this.currImage)];
            if (!abox) { return; }
            abox = this.scaleBox(abox, abox[6], abox[7], this.width, this.height);
            abox[5] = true;
            this.boxes.push(abox);
        }
    }

    /**
     * Scales a collision box to fit the character's current size.
     * @param {Array} sbox - The box to scale.
     * @param {number} fw - The original width of the box.
     * @param {number} fh - The original height of the box.
     * @param {number} tw - The target width to scale to.
     * @param {number} th - The target height to scale to.
     * @returns {Array} - The scaled box.
     */
    scaleBox(sbox, fw, fh, tw, th) {
        if (fw === 0 || fh === 0) return sbox.slice();
        const scaleX = tw / fw;
        const scaleY = th / fh;
        const box = sbox.slice();
        box[0] = box[0] * scaleX;
        box[1] = box[1] * scaleY;
        box[2] = box[2] * scaleX;
        box[3] = box[3] * scaleY;
        return box;
    }

    /**
     * Plays the specified animation for the character.
     * @param {Anim} anim - The animation to play.
     */
    playAnimation(anim) {
        if (!anim || !anim.files || !this.img) { return; }
        let i = this.currImage % anim.files.length;
        let path = anim.files[i];

        if (this.hurt || this.invincible) {
            if (this.health == 0) {
                if (i === anim.files.length - 1) this.hurt = false, this.dead = true;
            } else {
                if (i < anim.files.length - 1) this.hurt = false;
            }
        }
        if (!this.invincible && this.hurt && this.willInvincible) {
            if (i === anim.files.length - 1) this.setInvincible(1000);
            this.willInvincible = false;
        }
        if (this.dead) {
            if (i < anim.files.length - 1) this.currImage++;
        } else {
            this.currImage++;
        }

        if ((!anim.repeat && i == anim.files.length - 1)) { this.currImage = i; return; }
        this.img = this.getCachedImage(path);
    }

    /**
     * Makes the character jump.
     */
    jump() {
        if (this.dead) { return; }
        if (!this.isAboveGround()) { this.speedY = 20; this.bouncing = true; }
    }

    /* STATUS */

    /**
     * Marks the character as hit, reducing health and potentially making the character invincible.
     * @param {boolean} makeInvincible - Whether to make the character invincible after being hit.
     */
    isHit(makeInvincible) {
        if (this.hurt || this.willInvincible) { return; }
        this.hurt = true;
        this.health--;
        this.health < 0 ? this.health = 0 : this.lastHit = this.now();
        if (makeInvincible) { this.willInvincible = true; }
    }

    /**
     * Checks if the character is still in the hurt state.
     * @returns {boolean} - Whether the character is still hurt.
     */
    isHurt() {
        let timepassed = this.now() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    /**
     * Returns the time since the character died in seconds.
     * @param {boolean} inSeconds - Whether to return the result in seconds.
     * @returns {number} - The time since death in seconds or -1 if not dead.
     */
    deadTime(inSeconds) {
        if (!this.dead) { return -1; }
        let timepassed = this.now() - this.lastHit;
        timepassed = timepassed / 1000;
        inSeconds && (timepassed = timepassed.toFixed(0));
        return timepassed;
    }

    /**
     * Checks if the character is flickering (used for invincibility effects).
     * @param {number} intv - The flicker interval in milliseconds.
     * @returns {boolean} - Whether the character is flickering.
     */
    flicker(intv) {
        this.lastFlicker ||= performance.now();
        const eTime = performance.now() - this.lastFlicker;
        return Math.floor(eTime / intv) % 2 === 0;
    }

    /**
     * Makes the character invincible for a certain amount of time.
     * @param {number} delay - The delay in milliseconds before the character becomes invincible.
     * @param {boolean} onOff - Whether to turn invincibility on or off.
     */
    setInvincible(delay, onOff) {
        if (this.invincible) { return; }
        this.world.setTimer(() => {
            this.invincible = false;
            this.flickering = false;
            this.toggleCollider(1, true);
        }, delay);
        this.invincible = true;
        this.toggleCollider(0, false);
        this.flickering = true;
    }

    /**
     * Checks if the character is invincible.
     * @returns {boolean} - Whether the character is invincible.
     */
    isInvincible() {
        let timepassed = this.now(true) - this.hit;
        timepassed = timepassed / 1000;
        return timepassed < 1;
    }

    /**
     * Revives the character after death.
     * @param {number} [delay=0] - The delay in milliseconds before reviving the character.
     * @param {function} [callback] - Function executed after the character is revived.
     */
    revive(delay=0, callback){
        if(this.reviving){ return; }
        this.world.clearTimer(this.reviveTimout);
        this.reviveTimout = this.world.setTimer(() => {
            this.dead = false; this.hurt = false; this.reviving=false;
            if(this instanceof Player){
                this.health = this.starthealth;
            }
            this.world.clearTimer(this.reviveTimout);
            if(callback){ callback();}
        },delay);
        this.reviving=true;
    }

    /**
     * Callback for after the character has been revived.
     * @param {function} callback - Function executed after revival.
     */
    reviveCallback(callback) {
        callback && callback();
    }
}