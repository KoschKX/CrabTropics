/**
 * Represents a cloud object that moves across the screen.
 * 
 * @class Cloud
 * @extends MovableObject
 */
class Cloud extends MovableObject {

  /**
   * The name of the cloud object.
   * @type {string}
   */
  name = 'Cloud';

  /**
   * The scale factor of the cloud.
   * @type {number}
   */
  scale = 1.5;

  /**
   * The vertical position of the cloud.
   * @type {number}
   */
  y = 50;

  /**
   * The speed at which the cloud moves.
   * @type {number}
   */
  speed = 1;

  /**
   * The range of X position for cloud's random spawn location.
   * @type {[number, number]}
   */
  randx = 720;

  /**
   * The range of Y position for cloud's random spawn location.
   * @type {[number, number]}
   */
  randy = 200;

  /**
   * Creates an instance of the Cloud class.
   * 
   * @param The World.
   * @param {number} variant - The variant index of the cloud.
   * @param {[number, number]} randx - The X range for random spawning position.
   * @param {[number, number]} randy - The Y range for random spawning position.
   */
  constructor(world, variant, randx, randy) {
    super(world);
    this.generateStamp(this.name);

    const variants = [
      { img: './img/beach/cloudA.png', width: 150, height: 60 },
      { img: './img/beach/cloudB.png', width: 200, height: 75 },
      { img: './img/beach/cloudC.png', width: 250, height: 120 },
    ];

    if (variants[variant]) {
      const { img, width, height } = variants[variant];
      this.loadImage(img);
      this.width = width * this.scale;
      this.height = height * this.scale;
    }

    this.variant = variant;

    // Set random spawn ranges
    this.randx = randx || this.randx;
    this.randy = randy || this.randy;

    this.reset(true);
    this.animate();
  }

  /**
   * Resets the position and speed of the cloud.
   * 
   * @param {boolean} start - If true, initializes the cloud's starting position.
   */
  reset(start) {
    this.x = this.random(this.randx[0], this.randx[1]);
    this.y = this.random(this.randy[0], this.randy[1]);
    this.speed = this.random(0.15, 0.25);
    if (!start) {
      this.x += 720;
    }
  }

  /**
   * Generates a random number between the given range.
   * 
   * @param {number} min - The minimum value of the random range.
   * @param {number} max - The maximum value of the random range.
   * @returns {number} - A random number between min and max.
   */
  random(min, max) {
    return Math.random() * (max - min) + min;
  }

  /**
   * Starts the cloud's animation by periodically updating its position.
   * It resets the cloud's position when it moves off-screen.
   */
  animate() {
    setInterval(() => {
      if (this.x < -this.width) {
        this.reset(false);
      } else {
        this.x -= this.speed;
      }
    }, 1000 / 60);
  }
}