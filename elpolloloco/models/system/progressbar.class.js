/**
 * Represents a progress bar rendered on a canvas.
 * Displays loading progress and a description of the current task.
 */
class ProgressBar {

    /** NAME */
    name = 'ProgressBar';

    /** IMAGE */
    x = 50;
    y = 50;
    width = 66;
    height = 20;
    centered = true;
    cvs;
    ctx;

    /** STATUS */
    active = false;
    progress = 0.0;
    task = '';

    /** INTERVAL */
    drawFramesId;

    /**
     * Creates a new ProgressBar.
     * @param {HTMLCanvasElement} The Canvas.
     * @param {number} [x=0] - X position as a percentage of canvas width.
     * @param {number} [y=0] - Y position as a percentage of canvas height.
     */
    constructor(canvas, x = 0, y = 0) {
        this.cvs = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = x;
        this.y = y;
        this.init();
    }

    /**
     * Destroys the animation loop and deactivates the progress bar.
     */
    destroy() {
        cancelAnimationFrame(this.drawFramesId);
    }

    /**
     * Initializes and starts the animation loop.
     */
    init() {
        this.active = true;
        this.drawFrames = () => {
            this.draw();
            this.drawFramesId = requestAnimationFrame(this.drawFrames);
        };
        this.drawFrames();
    }

    /**
     * Draws the progress bar on the canvas.
     * Updates from `#cache` DOM element's data attributes.
     */
    draw(){
        if (!this.active) return;
        let progress = document.querySelector('#cache').getAttribute('data-progress'); this.progress = progress;
        let task = document.querySelector('#cache').getAttribute('data-task'); this.task = task;
        this.loadingBar(progress, task);
        if(progress >= 1){ 
            let self = this; setTimeout(function(){ 
                if(self.active){ self.stop(); self.destroy(); self.active = false; }
            }, 1000);
        }
    }

    /**
     * Stops the drawing loop and deactivates the progress bar.
     */
    stop() {
        if (!this.drawFramesId) return;
        cancelAnimationFrame(this.drawFramesId);
        this.drawFramesId = null;
        this.active = false;
    }

    /**
     * Draws the visual elements of the progress bar.
     * @param {number} progress - A value from 0 to 1 representing loading progress.
     * @param {string} task - The task currently being executed (displayed as text).
     */
    loadingBar(progress, task) {
        const ctx = this.ctx;
        if(this.centered){ this.x = 50 - this.width / 2; this.y = 50 - this.height / 2; }
        const bx = this.cvs.width * (this.x / 100); const by = this.cvs.height * (this.y / 100);
        const bw = this.cvs.width * (this.width / 100); const bh = this.cvs.height * (this.height / 100);

        progress = Math.max(0, Math.min(1, progress));

        ctx.clearRect(0,0,this.cvs.width,this.cvs.height);

        drawRect( ctx, bx, by, bw, bh, 'transparent','#fff', 2 ); // BACKGROUND
        drawRect( ctx, bx, by, bw * progress, bh, '#fff');        // BAR
        drawText( ctx, bx + bw / 2, by + 5 + bh / 2, bw, bh, Math.round(progress * 100) + '%', '#000', Math.floor(bh * 0.6)+'px Arial', 'center', 'middle', '#fff'); // TEXT
        drawText( ctx, bx + bw / 2, by + bh + 30, bw, bh, task || 'Loading...', '#fff', Math.floor(bh * 0.2)+'px Arial', 'center', 'middle' )                    // TASK
    }
}