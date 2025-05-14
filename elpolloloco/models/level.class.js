/**
 * A Level.
 */

/** NOTES
 * Because the original loading method was not present in the DOM, the images would end up in garbage collection. 
 * That caused flickering on some devices.
*/

class Level {

    /* NAME */
    name = '';

    /* INPUT */
    levelmap;

    /* BANKS */
    player;
    enemies = [];
    clouds = [];
    items = [];
    projectiles = [];
    effects = [];
    ambient = [];
    music = [];
    tmp = [];

    /* DIMENSIONS */
    bounds = [0, 0, 0, 0];
    ground;

    /* LOADER */
    totalAssets = 0;
    loadedAssets = 0;
    loaded = false;
    
    /** WORLD REFERENCE */
    world;

    /** CALLBACKS */
    loadedCallback;
    onDemandCallback;

    /** DOM REFERENCE */
    cacheDiv;

    /**
     * Creates a Level instance.
     * @param {World} The World.
     * @param {Object} levelmap - The map data for the level.
     */
    constructor(world, levelmap) {
        this.world = world;
        this.cacheDiv = document.querySelector('#cache');
        this.buildMap(levelmap);
    }

    /**
     * Builds the level map and initializes its components.
     * @param {Object} levelmap - The map data for the level.
     * @param {boolean} reset - Flag to determine if the map should be reset.
     */
    buildMap(levelmap, reset = false) {
        this.levelmap = levelmap;
        this.name = this.parseObj(levelmap.name);
        this.backgrounds = this.parseObj(levelmap.backgrounds);
        this.player = this.parseObj(levelmap.players)[0];
        this.enemies = this.parseObj(levelmap.enemies);
        this.clouds = this.parseObj(levelmap.clouds);
        this.bounds = this.parseObj(levelmap.bounds);
        this.ambient = this.parseObj(levelmap.ambient);
        this.music = this.parseObj(levelmap.music);
        this.ground = this.parseObj(levelmap.ground);

        if (reset) { return; }

        this.projectiles = this.parseObj(levelmap.projectiles);
        this.effects = this.parseObj(levelmap.effects);
        this.items = this.parseObj(levelmap.items);
    }

    /**
     * Parses an object and returns the appropriate format for the level components.
     * @param {any} obj - The object to be parsed.
     * @returns {any} The parsed object.
     */
    parseObj(obj) {
        let out;
        if (typeof obj === 'string') {
            out = obj;
        } else if (Array.isArray(obj)) {
            out = [];
            if (!obj.length) { return out; }
            for (let o = 0; o < obj.length; o++) {
                let cobj = obj[o];
                if (typeof cobj === 'string' && cobj.includes('(') && cobj.includes(')')) {
                    const nobj = cobj.replace(/\((.*)\)/, '(this.world, $1)');
                    out.push(eval('new ' + nobj));
                } else if (!Number.isNaN(cobj)) {
                    out.push(cobj);
                }
            }
        } else if (!Number.isNaN(obj)) {
            out = parseFloat(obj);
        }
        return out;
    }

    /**
     * Preloads the assets for the level.
     * @param {function} callback - The callback to be called once all assets are preloaded.
     */
    preload(callback) {
        this.loadedCallback = callback;
        this.cacheImageLib(this.player, this.player.imagesLib); 

        let minions = this.enemies.filter(enemy => !enemy.isBoss);
        minions.forEach((enemy) => { this.cacheImageLib(enemy, enemy.imagesLib); });

        let bosses = this.enemies.filter(enemy => enemy.isBoss === true);
        bosses.forEach((boss) => { this.tmp.push(boss); boss.destroy(); });

        this.backgrounds.forEach((background) => { this.cacheImageLib(background, background.imagesLib); });

        let self = this;
        this.items.forEach((item) => { this.cacheImageLib(item, item.imagesLib); item.destroy(); self.items = []; });
        this.effects.forEach((effect) => { this.cacheImageLib(effect, effect.imagesLib); effect.destroy(); self.effects = []; });
        this.projectiles.forEach((projectile) => { this.cacheImageLib(projectile, projectile.imagesLib); projectile.destroy(); self.projectiles = []; });
    }

    /**
     * Unloads the level, removing all components and resetting state.
     */
    unload() {
        this.player.destroy();
        this.enemies.forEach((enemy) => { enemy.destroy(); });
        this.items.forEach((item) => { item.destroy(); });
        this.projectiles.forEach((projectile) => { projectile.destroy(); });
        this.backgrounds.forEach((background) => { background.destroy(); });
        this.name = '';
        this.player = null;
        this.enemies = [];
        this.clouds = [];
        this.backgrounds = [];
        this.items = [];
        this.effects = [];
        this.projectiles = [];
        this.ambient = [];
        this.music = [];
        this.bounds = [0, 0, 0, 0];
        this.ground = 0;
    }

    /**
     * Resets the level, unloading and rebuilding it.
     */
    reset() {
        this.unload();
        this.buildMap(this.levelmap, true);
        this.init(true);
    }

    /**
     * Preloads on-demand object libraries.
     * @param {Object} obj - The object to preload libraries for.
     * @param {function} callback - The callback to be called once the object libraries are preloaded.
     */
    preloadObjectLibs(obj, callback) {
        this.onDemandCallback = callback;
        this.cacheImageLib(obj, obj.imagesLib, true);
    }

    /**
     * Initializes the level by setting up all its components.
     * @param {boolean} force - Forces initialization even if not fully loaded.
     */
    init(force = false) {
        if (!this.loaded && !force) { return; }
        this.enemies.forEach((enemy) => { enemy.init(); });
        this.backgrounds.forEach((background) => { background.init(); });
        this.items.forEach((item) => { item.init(); });
        this.projectiles.forEach((projectile) => { projectile.init(); });
        this.effects.forEach((effect) => { effect.init(); });
        this.player.init();
        if (this.loadedCallback && typeof this.loadedCallback === 'function') {
            let self = this; setTimeout(function () { self.loadedCallback(); }, 1000);
        }
    }

	/**
	 * Caches the assets (images) by appending them to the cache div.
	 * It also ensures that a blank image is preloaded in case there are any missing assets.
	 * 
	 * @param {Array} images - The array of images to cache, each represented as an array with object and image path.
	 * @param {boolean} [onDemand=false] - Flag indicating whether the caching is done on demand (default is false).
	 */
	cacheAssets(images, onDemand = false) {
	    if (!images || !images.length || !this.cacheDiv) { return; }

	    let self = this;

	    // Check if the blank image is already in the cache, if not, append it
	    let checkBlank = document.querySelector('#cache img[src="' + './img/blank.png' + '"]');
	    if (!checkBlank) {
	        let blankImage = new Image();
	        blankImage.src = './img/blank.png';
	        this.cacheDiv.appendChild(blankImage);
	    }

	    // Set the data-level attribute on the body to track the level
	    document.querySelector('body').setAttribute('data-level', this.name);

	    // Process each image and add it to the cache
	    images.forEach(function (image) {
	        self.processAsset(image, onDemand);
	    });
	}

	/**
	 * Asynchronously loads a sequence of assets (images or videos) with a delay between each.
	 * This can be used to reduce performance spikes caused by loading many assets at once.
	 * @param {Array} images - An array of [object, path] pairs representing assets to load.
	 * @param {number} delay - The delay in milliseconds between loading each asset.
	 * @param {Function} [callback] - An optional callback function to call after all assets are loaded.
	 */
	async dripAssets(images, delay, callback) {
	    if (!images || !images.length || !this.cacheDiv) return;
	    const self = this;
	    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
	    let loadPromises = [];
	    for (let i = 0; i < images.length; i++) {
	        const [obj, path] = images[i];
	        const startDelay = i * delay;
	        const promise = (async () => {
	            await wait(startDelay);
	            let [asset, type] = self.createAsset(obj, path, true);
	            if (type === 'video') {
	                self.loadedAssets += 1;
	                return;
	            }
	            if (type !== 'image' || !asset) return;
	            return new Promise(resolve => {
	                asset.onload = resolve;
	                asset.onerror = resolve;
	            });
	        })();
	        loadPromises.push(promise);
	    }
	    await Promise.all(loadPromises);
	    if (typeof callback === 'function') callback();
	}

    /**
     * Drips image libraries to gradually load assets with a delay.
     * @param {any[]} obj - The object whose images need to be loaded.
     * @param {any[]} imagesLib - The image library to be used for the loading.
     * @param {number} delay - The delay in milliseconds between each image load.
     * @param {function} callback - The callback to be called once all images are loaded.
     */
    dripImageLib(obj, imagesLib, delay, callback) {
        let libs = concat(imagesLib);
        let images = [];
        libs.forEach(lib => {
            if (!lib.files || !lib.files.length) { return; }
            lib.files.forEach(img => { images.push([obj, img]); });
        });
        if (images) { this.dripAssets(images, delay, callback); }
    }

    /**
     * Caches the image library for a given object.
     * @param {Object} obj - The object whose images need to be cached.
     * @param {any[]} imagesLib - The image library to be cached.
     * @param {boolean} [onDemand=false] - Flag to indicate if the loading is on-demand.
     */
    cacheImageLib(obj, imagesLib, onDemand = false) {
        let libs = concat(imagesLib);
        let images = [];
        libs.forEach(lib => {
            if (!lib.files || !lib.files.length) { return; }
            lib.files.forEach(img => { images.push([obj, img]); });
        });
        if (images) { this.cacheAssets(images, onDemand); }
    }


	/**
	 * Processes and caches an asset (image or video) by checking if it is already cached.
	 * Loads an asset and tracks the loading progress.
	 * 
	 * @param {Array} image - An array where the first element is the object associated with the asset,
	 *                        and the second element is the path to the image or video file.
	 * @param {boolean} onDemand - A flag indicating whether the asset is being loaded on-demand (default is false).
	 */
    processAsset(image, onDemand){
        if(!image || !this.cacheDiv){ return; }
        let self = this;
        const obj  = image[0]; let path = image[1];
        const check= this.checkCache(path);
        if (!check) {
            let [asset, type] = self.createAsset(obj, path, true);
            if (type === 'video'){ self.loadedAssets += 1; }
            if (type !== 'image'){ return; }
            asset.onload = () => {
                self.loadedAssets++;
                let progress = (self.loadedAssets / self.totalAssets).toFixed(2);
                    self.updateAttributes(progress, asset.src);
                if (self.loadedAssets >= self.totalAssets) {
                    if(onDemand){
                        if(this.onDemandCallback) { this.onDemandCallback(); this.onDemandCallback = null; }
                    }else{
                        self.updateAttributes(1.0, 'Complete', true);
                        self.loaded = true; self.init();
                    }
                }
                asset.onload = null; 
            };
            self.totalAssets += 1;
        }else if(onDemand){
            if(this.onDemandCallback) {
                this.onDemandCallback(); this.onDemandCallback = null;
            }
        }
    }

    /**
     * Creates and adds a video element to the DOM.
     * @param {Object} obj - The object associated with the video.
     * @param {string} path - The video file path.
     * @param {boolean} addToDOM - Flag to indicate if the video should be added to the DOM.
     * @param {boolean} autoplay - Flag to indicate if the video should autoplay.
     * @param {boolean} loop - Flag to indicate if the video should loop.
     * @returns {HTMLVideoElement} The created video element.
     */
    createVideo(obj, path, addToDOM = false, autoplay = true, loop = true) {
        if (this.checkCache(path)) { return obj; }
        let vid = document.createElement("video");
        vid.setAttribute('object-id', obj.stamp);
        vid.classList.add('bg_video');
        vid.src = path;
        vid.preload = 'auto'; vid.autoplay = autoplay; 
        vid.muted = true; vid.loop = loop; 
        vid.playsInline = true;
        if (addToDOM) { this.cacheDiv.appendChild(vid); }
        return vid;
    }

    /**
     * Creates and adds an image element to the DOM.
     * @param {Object} obj - The object associated with the image.
     * @param {string} path - The image file path.
     * @param {boolean} addToDOM - Flag to indicate if the image should be added to the DOM.
     * @returns {HTMLImageElement} The created image element.
     */
    createImage(obj, path, addToDOM = false) {
        if (this.checkCache(path)) { return; }
        let img = new Image();
        img.setAttribute('object_id', obj.stamp);
        img.src = path;
        if (addToDOM) { this.cacheDiv.appendChild(img); }
        return img;
    }

    /**
     * Creates an asset (video or image) and adds it to the DOM.
     * @param {Object} obj - The object associated with the asset.
     * @param {string} path - The asset file path.
     * @param {boolean} addToDOM - Flag to indicate if the asset should be added to the DOM.
     * @returns {[HTMLElement, string]} The created asset and its type.
     */
    createAsset(obj, path, addToDOM = false) {
        let asset; 
        let type = '';
        const ext = path.split('.').pop().toLowerCase();
        if (ext === 'mp4' || ext === 'webm') {
            asset = this.createVideo(obj, path, addToDOM);
            type = 'video';
        } else if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
            asset = this.createImage(obj, path, addToDOM);
            type = 'image';
        }
        return [asset, type];
    }

    /**
     * Checks whether a given asset path is cached.
     * @param {string} path - The asset file path to check.
     * @returns {boolean} True if the asset is cached, false otherwise.
     */
    checkCache(path) {
        return this.cacheDiv.querySelector('img[src="'+path+'"]') || this.cacheDiv.querySelector(`video[src='${path}']`);
    }

	/**
	 * Converts a task name for displaying progress.
	 *
	 * @param {string} task - The task name string to sanitize.
	 * @returns {string} - The sanitized task name with underscores replaced by spaces.
	 */
	sanitizeTaskName(task) {
	    task = task.replaceAll('_', ' ');
	    return task;
	}

	/**
	 * Updates the attributes of the cache container.
	 * The method sets the progress, task name, and the file path
	 * on the body element when loading is complete.
	 * 
	 * @param {number} progress - A decimal value representing the progress of asset loading (e.g., 0.5 for 50%).
	 * @param {string} task - The path or name of the task or file being loaded. Used to derive the task name.
	 * @param {boolean} [loaded] - A flag indicating whether the loading is complete. If true, sets a 'data-loaded' attribute on the body.
	 */
    updateAttributes(progress, task, loaded) {
        let taskname = task.split('/').pop().split('.').shift();
        document.querySelector('#cache').setAttribute('data-progress', progress);
        document.querySelector('#cache').setAttribute('data-file', task);
        document.querySelector('#cache').setAttribute('data-task', this.sanitizeTaskName(taskname));
        if(loaded){ document.querySelector('body').setAttribute('data-loaded', loaded ); }
    }

}