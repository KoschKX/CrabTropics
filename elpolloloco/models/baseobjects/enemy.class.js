/**
 * An enemy character.
 * Inherits from the Character class and handles enemy-specific behaviors such as movement and animation.
 */
class Enemy extends Character {

    /** START VALUES */
    name = 'Enemy';

    /** HEALTH */
    dead = false;
    dying = false;

    /** VARIATION */
    variant = 0;

    /** BEHAVIOR */
    attacksEnemies = false;

    /** STATUS */
    isBoss = false;

    /**
     * Creates a new enemy object.
     * @param {object} world - The world context containing the canvas and game logic.
     */
    constructor(world) {
        super(world);
    }

    /**
     * Initializes the enemy properties and any specific setups.
     */
    init() {
        super.init();
    }

    /**
     * Destroys the enemy object and cleans up any resources.
     */
    destroy() {
        super.destroy();
    }

    /**
     * Main update function to be called every frame for the enemy.
     * @param {number} delta - The time delta since the last frame.
     */
    main(delta) {
        super.main(delta);
        this.handleMovement();
    }

    /**
     * Handles the enemy's movement and direction changes.
     * Changes direction when the enemy reaches the boundaries of the level.
     */
    handleMovement() {
        if (!this.initialized || this.dead) { return; }

        // Move left or right based on the current direction
        if (this.currDirection === 0) { this.moveLeft(); }
        if (this.currDirection === 1) { this.moveRight(); }

        // Change direction when the level boundaries are reached.
        if (this.currDirection === 0 && this.x < this.world.level.bounds[0]) {
            this.currDirection = 1;  // Switch to moving right
        }
        if (this.currDirection === 1 && this.x > this.world.level.bounds[2] - this.width) {
            this.currDirection = 0;  // Switch to moving left
        }
    }

    /**
     * Handles the animation for the enemy.
     * This can be expanded to include specific animations for the enemy.
     */
    handleAnimation() {
        super.handleAnimation();
    }
}