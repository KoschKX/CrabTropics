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
            document.querySelector('#menu #maximize').classList.remove('active');
            document.querySelector('#menu #minimize').classList.add('active');
            document.querySelector('#game').classList.add('fullscreen');
            document.querySelector('body').setAttribute('data-fullscreen',true);
            this.resizeCanvas();
        }
    }

    /**
     * Exits fullscreen mode and adjusts UI elements accordingly.
     */
    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            document.querySelector('#menu #maximize').classList.add('active');
            document.querySelector('#menu #minimize').classList.remove('active');
            document.querySelector('#game').classList.remove('fullscreen');
            document.querySelector('body').setAttribute('data-fullscreen',false);
            this.resizeCanvas();
         }
    }

    /**
     * Resizes the canvas based on screen dimensions and game/world constraints.
     */
    resizeCanvas() {
        const game = document.querySelector('#game');
        const bottom = document.querySelector('#bottom');
        const canvas = this.cvs;

        let [cvsW, cvsH] = [document.documentElement.clientWidth, document.documentElement.clientHeight];
        this.bounds ||= [0, 0, canvas.width, canvas.height];
        if (this.world?.level) this.bounds = this.world.level.bounds;

        this.checkOrientation();
        cvsW = Math.min(cvsW, this.bounds[2]); cvsH = Math.min(cvsH, this.bounds[3]);
        if (game.classList.contains('detached')) cvsH -= bottom.offsetHeight;

        canvas.width = cvsW; canvas.height = cvsH;
        canvas.style.cssText = 'height:' + cvsH + 'px';

        document.documentElement.style.setProperty('--app-width', cvsW + 'px');
        document.documentElement.style.setProperty('--app-height', cvsH + 'px');

        titlescreen?.draw();
        const ui = document.querySelector('#canvas');
        document.documentElement.style.setProperty('--ui-width', ui.offsetWidth + 'px');
        document.documentElement.style.setProperty('--ui-height', ui.offsetHeight + 'px');
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
        this.showControls();
    }

    /**
     * Showsthe Help panel and hides standby message.
     */
    showHelp() {
        document.querySelector('#help').classList.add('show');
        this.hideControls();
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