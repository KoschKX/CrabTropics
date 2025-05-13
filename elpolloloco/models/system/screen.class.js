/**
 * Screen for handling UI interactions.
 */
class Screen {

    /** IMAGE */
    cvs;
    ctx;
    bounds;

    /** WORLD */
    world;

    /** STATUS */
    paused;
    wasPaused;

    /**
     * Constructs a Screen manager for handling canvas display and UI adjustments.
     * @param {HTMLCanvasElement} The Canvas.
     */
    constructor(canvas) {
        this.cvs = canvas;
        this.ctx = canvas.getContext('2d');
        this.resizeCanvas();
    }

    /**
     * Assigns the game world to the screen for access to bounds and pause control.
     * @param {World} world - The world instance.
     */
    setWorld(world) {
        this.world = world;
    }

    /**
     * Attempts to enter fullscreen mode and adjusts UI elements accordingly.
     */
    enterFullscreen() {
        const scrn = document.querySelector('#holder');
        if (scrn.requestFullscreen) {
            scrn.requestFullscreen();
            this.resizeCanvas();
        }
        document.querySelector('#menu #maximize').classList.remove('active');
        document.querySelector('#menu #minimize').classList.add('active');
        document.querySelector('#game').classList.add('fullscreen');
    }

    /**
     * Exits fullscreen mode and adjusts UI elements accordingly.
     */
    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            this.resizeCanvas();
        }
        document.querySelector('#menu #maximize').classList.add('active');
        document.querySelector('#menu #minimize').classList.remove('active');
        document.querySelector('#game').classList.remove('fullscreen');
    }

    /**
     * Resizes the canvas based on screen dimensions and game/world constraints.
     */
    resizeCanvas() {
        const gameRect = document.querySelector('#game').getBoundingClientRect();
        let cvsW = document.documentElement.clientWidth;
        let cvsH = document.documentElement.clientHeight;

        if (!this.bounds) {
            this.bounds = [0, 0, this.cvs.width, this.cvs.height];
        }

        if (this.world && this.world.level) {
            this.bounds = this.world.level.bounds;
        }

        this.checkOrientation();

        if (cvsW > this.bounds[2]) cvsW = this.bounds[2];
        if (cvsH > this.bounds[3]) cvsH = this.bounds[3];

        this.cvs.width = cvsW;
        this.cvs.height = cvsH;

        document.documentElement.style.setProperty('--app-width', cvsW + 'px');
        document.documentElement.style.setProperty('--app-height', cvsH + 'px');

        if (typeof titlescreen !== 'undefined') {
            titlescreen.draw();
        }

        this.cvs.style.width = cvsW + 'px';
        this.cvs.style.height = cvsH + 'px';
    }

    /**
     * Detects orientation and repositions UI controls if necessary.
     */
    checkOrientation() {
        this.attachControls();
        document.querySelector('#game').classList.add('attached');
        document.querySelector('#game').classList.remove('detached');

        if (window.innerWidth < window.innerHeight) {
            document.querySelector('#game').classList.add('portrait');
            document.querySelector('#game').classList.remove('landscape');

            if (
                window.innerWidth < this.bounds[2] &&
                window.innerWidth < window.innerHeight
            ) {
                this.detachControls();
                document.querySelector('#game').classList.add('detached');
                document.querySelector('#game').classList.remove('attached');
            }
        } else {
            document.querySelector('#game').classList.remove('portrait');
            document.querySelector('#game').classList.add('landscape');
        }
    }

    /**
     * Attaches the control UI to the main interface.
     */
    attachControls() {
        if (document.querySelector('#ui #controls')) return;
        document.querySelector('#ui').append(document.querySelector('#controls'));
    }

    /**
     * Moves the control UI to the mobile container.
     */
    detachControls() {
        if (document.querySelector('#mcontrols #controls')) return;
        document.querySelector('#mcontrols').append(document.querySelector('#controls'));
    }

    /**
     * Hides the menu UI element.
     */
    hideMenu() {
        document.querySelector('#menu').classList.remove('show');
    }

    /**
     * Shows the menu UI element.
     */
    showMenu() {
        document.querySelector('#menu').classList.add('show');
    }

    /**
     * Hides control UI and shows standby message.
     */
    hideControls() {
        document.querySelector('#controls').classList.remove('show');
        document.querySelector('#mcontrols #standby').classList.add('show');
    }

    /**
     * Shows control UI and hides standby message.
     */
    showControls() {
        document.querySelector('#controls').classList.add('show');
        document.querySelector('#mcontrols #standby').classList.remove('show');
    }

    /**
     * Hides the Help panel and shows standby message.
     */
    hideHelp() {
        document.querySelector('#help').classList.remove('show');
    }

    /**
     * Showsthe Help panel and hides standby message.
     */
    showHelp() {
        document.querySelector('#help').classList.add('show');
    }

    /**
     * Pauses the game world.
     * @param {boolean} [fromButton=true] - Whether the pause was triggered by UI interaction.
     */
    pause(fromButton = true) {
        if (!this.world) return;
        if (!fromButton) this.wasPaused = this.world.paused;
        this.paused = this.world.pause();
    }

    /**
     * Unpauses the game world.
     * @param {boolean} [fromButton=true] - Whether the unpause was triggered by UI interaction.
     */
    unpause(fromButton = true) {
        if (!this.world) return;
        if (!fromButton) this.wasPaused = this.world.paused;
        this.paused = this.world.unpause();
    }
}