/**
 * The Title Screen.
 */
class Titlescreen {

    /** IMAGE */
    width = 1152;
    height = 768;
    cvs;
    ctx;
    bounds = [0, 0, 0, 0];
    background;
    video; 
    vholder;

    /** INTERVALS */
    drawInterval;
    tlInterval;

    /* MENU ITEMS */
    menuItems = ['start']; 
    menuFuncs = ['start']; 
        //menuItems = ['Start', '//Settings'];
        //menuFuncs = ['start', 'settings'];
    menuItemsDisabled = [];

    /** STATUS */
    selected = 0;
    menuChanged = false;
    started = false;


    /** WORLD REFERENCE */
    world;
    keyboard;
    screen;

    /**
     * Creates an instance of the Titlescreen class.
     * @param {HTMLCanvasElement} cvs - The canvas element to render the titlescreen.
     * @param {Screen} scr - The screen object for managing the UI and world.
     * @param {Object} kbd - The keyboard input object for capturing user input.
     * @param {Audio} aud - The audio object to manage sounds and music.
     */
    constructor(cvs, scr, kbd, aud) {
        this.cvs = cvs;
        this.ctx = cvs.getContext('2d');
        this.screen = scr;
        this.keyboard = kbd;
        this.audio = aud;
        this.background = new Background(null, './img/ui/background2.jpg', 0, 0);
        this.init();
    }

    /**
     * Destroys the title screen by clearing intervals and canvas.
     */
    destroy() {
        clearInterval(this.drawInterval);
        clearInterval(this.ctlInterval);
        this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
        if(this.vholder){ document.querySelector('body').removeChild(this.vholder); }
    }

    /**
     * Initializes the title screen by loading background and video resources.
     */
    init() {
        this.menuItemsDisabled = this.menuItems.filter(item => item.startsWith('//'));
        let self = this;
        this.loadImage(this.background.imagePath, function () {
            clearInterval(self.drawInterval);
            self.drawInterval = setInterval(() => { self.draw(); }, 1000 / 60);
            clearInterval(self.ctlInterval);
            self.ctlInterval = setInterval(() => { self.main(); }, 1000 / 60);
        });

        this.createBGVideo();

        this.screen.showMenu();
        this.screen.showControls();
    }

    createBGVideo(){
        this.vholder = document.createElement('div');  
        this.vholder.id = 'title_bg'; 
        this.vholder.classList.add('bg_video');
        document.querySelector('body').appendChild(this.vholder);
        const vid = document.createElement('video');
        vid.id = 'title_video';
        vid.src = './mov/beachC_looped.'+vidFormat;
        vid.preload = 'auto';
        vid.loading="lazy" 
        vid.poster="./mov/beachC.jpg"
        vid.autoplay = true;
        vid.muted = true;
        vid.loop = true;
        vid.playsInline = true;

        const img = document.createElement('img');
        img.id = 'title_image';
        img.src = './mov/beachC.jpg';

        document.querySelector('body #title_bg').appendChild(img);
        document.querySelector('body #title_bg').appendChild(vid);

        this.bgimage = document.getElementById('title_image');
        this.bgvideo = document.getElementById('title_video');
        this.bgvideo.addEventListener('loadeddata', () => {
            this.bgvideo.width = this.cvs.width;
            this.bgvideo.height = this.cvs.height;
        });
    }

    /**
     * Main logic for updating the title screen menu based on user input.
     */
    main() {
        if(this.world){ return; }

        if (!this.keyboard.LEFT && !this.keyboard.RIGHT && !this.keyboard.DOWN && !this.keyboard.UP) {
            this.menuChanged = false;
        }
        if (!this.menuChanged && (this.keyboard.RIGHT || this.keyboard.DOWN)) {
            this.selected += 1;
            this.menuChanged = true;
        }
        if (!this.menuChanged && (this.keyboard.LEFT || this.keyboard.UP)) {
            this.selected -= 1;
            this.menuChanged = true;
        }

        this.selected = Math.max(0, Math.min(this.selected, this.menuItems.length - 1));

        if (!this.menuChanged && (this.keyboard.ENTER || this.keyboard.SPACE)) {
            if (typeof this[this.menuFuncs[this.selected]] === 'function') {
                this[this.menuFuncs[this.selected]]();
                this.menuChanged = true;
            }
        }
    }

    /**
     * Cleans up resources when the title screen is no longer needed.
     */
    selfDestruct() {
        this.destroy();
        this.screen.hideControls();
    }

    /**
     * Starts the game by loading the world and setting up the game screen.
     */
    start() {
        this.selfDestruct();
        if(this.world){ return; }
        this.world = new World(this.cvs, this.screen, this.keyboard, this.audio);
        this.world.load(level01);
        this.screen.setWorld(this.world);
        this.screen.resizeCanvas(this.world);
        this.started=true;
    }

    /**
     * Restarts the game by resetting the world and re-initializing the game.
     */
    restart() {
        this.world = null;
        init();
    }

    /**
     * Loads an image and executes a callback function when the image is fully loaded.
     * @param {string} path - The path to the image to load.
     * @param {Function} callback - The callback function to execute once the image is loaded.
     * @returns {HTMLImageElement} - The loaded image element.
     */
    loadImage(path, callback) {
        let img = new Image();
        img.src = path;
        if (callback && typeof callback === 'function') {
            img.onload = () => { callback(); img.onload = null; };
        }
        return img;
    }

    /**
     * Renders the title screen, including the background, title text, and menu.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
        this.drawVideo();
        this.drawTitle(this.cvs.width * 0.5, this.cvs.height * 0.33);
        this.drawMenus(this.cvs.width * 0.5, this.cvs.height * 0.6);
    }

    /**
     * Draws the background video onto the canvas.
     */
    drawVideo() {
        const hasVid = document.querySelector('#title_video');
        const videoReady = hasVid && this.bgvideo && this.bgvideo.readyState >= 2;
        const drawTarget = videoReady ? this.bgvideo : this.bgimage;
        if (!drawTarget) return;
        if (videoReady && this.bgvideo.currentTime >= this.bgvideo.duration - 0.2) {
            this.bgvideo.currentTime = 0;
        }
        this.ctx.drawImage(
            drawTarget,
            (this.cvs.width - this.width) * 0.5,
            (this.cvs.height - this.height) * 0.5,
            this.width,
            this.height
        );
    }

    /**
     * Draws the title text in the center of the canvas.
     * @param {number} x - The x-coordinate of the title's position.
     * @param {number} y - The y-coordinate of the title's position.
     */
    drawTitle(x, y) {
        let wpct = this.cvs.width * 0.1;
        let font = "bold " + wpct + "px Reggae";
        let text = document.title.toUpperCase();
        drawText(this.ctx,
            x, y, 0, 0,
            text, 'red',
            font, 'center', 'middle',
            'orange',
            5
        );
    }

    /**
     * Draws the menu items on the canvas.
     * @param {number} x - The x-coordinate for the menu's position.
     * @param {number} y - The y-coordinate for the menu's position.
     */
    drawMenus(x, y) {
        const wpct = this.cvs.width * 0.02;
        const lineh = wpct * 3.5;
        const pad = [wpct * 1, wpct * 1];
        const font = (wpct * 3) + 'px Arial';
        this.ctx.font = font;

        // GET MAX WIDTH AND MENU HEIGHT
        const maxw = this.menuItems.reduce((max, item) => {
            return Math.max(max, this.ctx.measureText('★  ' + item + '  ★').width);
        }, 0);
        const mnuh = this.menuItems.length * lineh;
        const bx = x - maxw / 2 - pad[0];
        const by = y - lineh / 2;
        const bw = maxw + pad[0] * 2;
        const bh = mnuh + pad[1] * 2;

        // BACKGROUND
        drawRect(this.ctx, bx, by, bw, bh, 'rgba(0, 0, 0, 0.66)', '#f0b94d', 3);

        // TEXT
        this.menuItems.forEach((item, idx) => {
            const ly = y + idx * lineh + pad[1];
            const isDisabled = this.menuItemsDisabled.includes(item);
            const isSelected = idx === this.selected;

            let text = item.replace('//', '');
            if (isSelected) text = '★  ' + text + '  ★';

            drawText(this.ctx,
                x, ly, 0, 0,
                text, isDisabled ? '#FFFFFF54' : "white",
                font, 'center', 'middle'
            );
        });
    }

    /**
     * Adds an object (such as a background) to the render map.
     * @param {Object} mo - The object to render (e.g., background).
     */
    addToMap(mo) {
        this.ctx.save();
        mo.draw(this.ctx);
        this.ctx.restore();
    }
}