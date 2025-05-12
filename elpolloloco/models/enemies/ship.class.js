/**
 * A Pirate Ship.
 * @extends Enemy
 */
class Ship extends Enemy {
    /**
     * @type {string} The name of the Ship.
     */
    name = 'Ship';

    /**
     * @type {number} The height of the Ship.
     */
    height = 200;

    /**
     * @type {number} The width of the Ship.
     */
    width = 200;

    /**
     * @type {number} The health of the Ship.
     */
    health = 10;

    /**
     * @type {number} The starting health of the Ship.
     */
    starthealth = 10;

    /**
     * @type {number} The frame rate for animations.
     */
    frameRate = 24;

    /**
     * @type {boolean} Whether gravity is applied to the Ship.
     */
    useGravity = false;

    /**
     * @type {number} The speed of the Ship's movement.
     */
    speed = 0.25;

    /**
     * @type {number} The frame rate for animation.
     */
    frameRate = 10;

    /**
     * @type {number} The scale of the Ship's appearance.
     */
    scale = 1;

    /**
     * @type {Anim} The floating animation for the Ship.
     */
    IMAGES_FLOAT = new Anim('./img/ship/FLOAT_001.png', [1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2], '');

    /**
     * @type {Anim[]} A library of animations for the Ship.
     */
    imagesLib = [
        this.IMAGES_FLOAT,
    ];

    /**
     * @type {Explosion[]} The list of explosions associated with the Ship.
     */
    explosions = [];

    /**
     * @type {Cannonball[]} The list of cannonballs fired by the Ship.
     */
    cballs = [];

    /**
     * @type {number[][]} Locations of the Ship's cannons.
     */
    cannonLocs = [[33, -165], [-33, -165]];

    /**
     * @type {number} Maximum number of shots the Ship can fire.
     */
    maxShots = 2;

    /**
     * @type {number} Minimum frequency of shots.
     */
    minShotFreq = 500;

    /**
     * @type {number} Maximum frequency of shots.
     */
    maxShotFreq = 100000;

    /**
     * @type {number} The timestamp of the last shot fired.
     */
    lastShot = this.now();

    /**
     * @type {boolean} Whether the Ship is firing.
     */
    firing = true;

    /**
     * @type {boolean} Whether the Ship is hostile.
     */
    hostile = false;

    /**
     * Creates the Ship.
     * @param {World} The World.
     */
    constructor(world) {
        super(world);
        this.generateStamp(this.name);
    }

    /**
     * Initializes the Ship's position, speed, and animation.
     */
    init() {
        super.init();

        // Set random position and speed for the Ship.
        this.x = 200 + random(0, 500);
        this.y = 110;
        this.speed = random(0.25, 0.5);
        this.originalspeed = this.speed;

        // Load the Ship's floating animation.
        this.loadImage(this.IMAGES_FLOAT.files[0]);
        this.changeAnimation(this.IMAGES_FLOAT);
    }

    /**
     * Updates the Ship each frame.
     * @param {number} delta The time difference between frames.
     */
    main(delta) {
        super.main(delta);
        this.cannonFire();
    }

    /**
     * Calculates the shot location for a fired shot.
     * @param {Explosion} shot The shot that is being fired.
     * @returns {number[]} The coordinates of the shot location.
     */
    getShotLocation(shot) {
        // Pick a random cannon location.
        let cann = randomInt(0, this.cannonLocs.length - 1);
        
        // Calculate the ship's center coordinates.
        let shipCenterX = this.x + (this.width * 0.5);
        let shipCenterY = this.y + (this.height * 0.5);
        
        // Calculate the cannon's center relative to the ship.
        let cannCenterX = this.cannonLocs[cann][0] * (100 / this.width);
        let cannCenterY = this.cannonLocs[cann][1] * (100 / this.height);
        
        // Calculate the shot's center location.
        let shotCenterX = (shot.width * 0.5) + cannCenterX;
        let shotCenterY = (shot.height * 0.5) + cannCenterY;

        // Return the final shot location offset from the ship's center.
        return [shipCenterX - shotCenterX, shipCenterY - shotCenterY];
    }

    /**
     * Handles the cannon firing logic for the Ship.
     */
    cannonFire() {
        if (!this.firing) { return; }

        // Generate a random delay for the next shot.
        const rDelay = randomInt(this.minShotFreq, this.maxShotFreq);
        const now = this.now();

        // Get a list of explosions from the world.
        this.explosions = this.world.level.effects.filter(effect => effect.name === 'Explosion');

        // If the delay is too short or the max shots are reached, skip firing.
        if (now - this.lastShot < rDelay || this.explosions.length >= this.maxShots) { return; }

        // Create a new explosion and cannonball shot.
        let shot = new Explosion(this.world, true);
        shot.scale = random(0.25, 0.1);
        let shotLoc = this.getShotLocation(shot);
        shot.x = shotLoc[0];
        shot.y = shotLoc[1];

        let cball = new Cannonball(this.world, true);
        cball.x = shot.x + (cball.x * 0.5);
        cball.y = shot.y;

        // Add the shot and cannonball to the world's effects and projectiles.
        this.world.level.effects.push(shot);
        this.world.level.projectiles.push(cball);

        // Play the cannon firing sound.
        this.world.audio.playSound(['cannon_fireA', 'cannon_fireB', 'cannon_fireC']);

        // Update the timestamp for the last shot fired.
        this.lastShot = this.now();
    }
}