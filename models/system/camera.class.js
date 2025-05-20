/**
 * Camera system.
 */
class Camera {

    /** IMAGE */
    cvs;
    ctx;
    bounds = [0, 0, 0, 0];
    position = [0, 0];
    offset = [0, 0];

    /** TARGET */
    target = [0, 0];

    /**
     * Creates a camera object.
     * @param {World} The World.
     */
    constructor(world) {
        this.cvs = world.cvs;
        this.ctx = world.ctx;
    }

    /**
     * Updates the camera position based on the target, offset, and world bounds.
     * Adjusts the camera to keep the target in focus while restricting movement within the world bounds.
     * @param {number[]} [target] - The new target position for the camera.
     * @param {number[]} [offset] - The new offset for the camera. 
     * @param {number[]} [bounds] - The world bounds to restrict the camera movement.
     */
    update(target, offset, bounds) {
        if (target) { this.target = target; }
        if (offset) { this.offset = offset; }
        if (bounds) { this.bounds = bounds; }

        let camX = -(this.target[0] + this.offset[0]) + (this.cvs.width * 0.5);
        let camY = -(this.target[1] + this.offset[1]) + (this.cvs.height * 0.5);

        // Restrict the camera position within the world bounds
        let minX = -(this.bounds[2] - this.cvs.width); 
        let maxX = -this.bounds[0];                  
        let minY = -(this.bounds[3] - this.cvs.height);
        let maxY = -this.bounds[1];               

        camX = Math.max(minX, Math.min(camX, maxX));
        camY = Math.max(minY, Math.min(camY, maxY));

        this.position[0] = camX;
        this.position[1] = camY;

        // Reset the transformation and apply the camera translation to the context
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.translate(camX, camY);
    }
}