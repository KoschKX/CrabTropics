/**
 * Represents the main player character in the game.
 * Inherits from Character and includes controls, health, and item interaction.
 */
class Player extends Character {

    /** START VALUES */
    name = 'Character';
    health = 3;
    starthealth = 3;

    /** HITBOXES */
    box = [this.width, this.height, this.width, this.height];

    /**
     * Constructs a new Player object.
     * @param {World} world - The game world the player exists in.
     */
    constructor(world) {
        super(world);
    }

    /**
     * Initializes the player.
     */
    init() {
        super.init();
    }

    /**
     * Called every game tick. Handles player logic and controls.
     * @param {World} world - The game world.
     */
    main(world) {
        super.main();
        this.handleControls();
    }

    /**
     * Cleans up the player.
     */
    destroy() {
        super.destroy();
    }

    /**
     * Resets the player state (stub).
     */
    reset() {}

    /**
     * Handles player input and movement logic.
     */
    handleControls() {
        if (!this.world || !this.world.keyboard) return;

        if (this.dead) {
            this.deactivateColliders();
            return;
        } else {
            this.activateColliders();
        }

        if (this.world.keyboard.LEFT) {
            this.facingRight = false;
            this.moveLeft();
        }

        if (this.world.keyboard.RIGHT) {
            this.facingRight = true;
            this.moveRight();
        }

        if (this.world.keyboard.SPACE && !this.isAboveGround()) {
            this.jump();
        }
    }

    /**
     * Draws the collider for debug purposes if the player is alive.
     * @param {CanvasRenderingContext2D} ctx - The drawing context.
     * @param {number} idx - Index of the collider to draw.
     */
    drawCollider(ctx, idx) {
        if (!this.dead) {
            super.drawCollider(ctx, idx);
        }
    }

    /**
     * Called when the player is hit. Reduces health and plays a sound.
     * @param {boolean} makeInvincible - Whether to make the player temporarily invincible.
     */
    isHit(makeInvincible) {
        super.isHit(makeInvincible);
        if (this.health == 0) {
            this.world.audio.playSound('pirate_dieA', 1.0, false);
        } else {
            this.world.audio.playSound(['pirate_hitA', 'pirate_hitB', 'pirate_hitC'], 1.0, false);
        }
    }

    /**
     * Handles picking up an item like Doubloon or Catnip.
     * @param {Item} item - The item the player collided with.
     */
    getItem(item) {
        if (item.name === "Doubloon") {
            this.doubloons += item.value;
            this.world.audio.playSound('doubloon_getA');
            const sparkle = new Sparkle(this.world, 1, true);
            sparkle.setTarget(this, [0, -this.height * 0.66]);
            this.world.level.effects.push(sparkle);
        } else if (item.name === "Catnip") {
            this.health += 1;
            if (this.health > this.maxHealth) {
                this.health = this.maxHealth;
            }
            this.world.audio.playSound('catnip_getA');
            const sparkle = new Sparkle(this.world, 0, true);
            sparkle.setTarget(this, [0, -this.height * 0.5]);
            this.world.level.effects.push(sparkle);
        }
        item.destroy();
    }

    /**
     * Makes the player bounce with sound feedback.
     * @param {number} spd - Speed of the bounce.
     * @param {number[]} point - Point of contact.
     */
    bounce(spd, point) {
        super.bounce(spd, point);
        this.world.audio.playSound('jump');
    }

    /**
     * Makes the player jump with sound feedback.
     */
    jump() {
        super.jump();
        this.world.audio.playSound('jump');
    }
}