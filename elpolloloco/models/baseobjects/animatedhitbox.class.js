/**
 * An animated hitbox parser and generator.
 */
class AnimatedHitbox {

    /** @type {string} */
    name = 'AnimatedHitbox';

    /** @type {HTMLImageElement[]} */
    cachedImages = [];

    /** @type {number} */
    loadedImages = 0;

    /** @type {number} */
    totalImages = 0;

    /** @type {boolean} */
    loaded = false;

    /** @type {Object} */
    anim;

    /** @type {Array} */
    boxes = [];

    /** @type {string[]} */
    boxcolors = [];

    /** @type {boolean} */
    buried = true;

    /**
     * Constructs the AnimatedHitbox instance.
     * @param {Object} obj - Object containing hitbox configuration.
     * @param {Object} anim - Animation data, including file list and name.
     * @param {boolean} [generate=false] - Whether to generate hitboxes or load existing ones.
     */
    constructor(obj, anim, generate = false) {
        if (!anim.files.length || !obj.boxcolors) return;

        this.anim = anim;
        this.boxcolors = obj.boxcolors;

        if (generate) {
            let self = this;
            this.cacheImages(this.anim.files, function () {
                console.log('Parsing [' + self.anim.name + '] . . .');
                self.getHitboxes(self.boxcolors);
            });
        } else {
            this.loadHitBoxes(this.anim.files[0]);
        }
    }

    /**
     * Loads hitbox data from a file corresponding to the first animation frame.
     * @param {string} path - The file path to the animation frame.
     */
    loadHitBoxes(path) {
        let ffldr = path.substring(0, path.lastIndexOf('/'));
        let fname = this.getAnimName(path) + '.txt';
        let fpath = ffldr + '/hitbox/' + fname;
        let self = this;
        fetch(fpath)
            .then(f => f.text())
            .then(txt => {
                self.boxes = eval(txt); // Be careful with eval in production code
                self.loaded = true;
            });
    }

    /**
     * Generates hitbox data and triggers a file download with the result.
     * @param {string[]} cols - Array of color strings to parse from images.
     */
    getHitboxes(cols) {
        let animboxes = [];
        let out = '[';
        for (let c = 0; c < cols.length; c++) {
            animboxes = [];
            out += '[';
            this.cachedImages.forEach((img) => {
                animboxes.push(this.parseImage(img, cols[c]));
            });
            animboxes.forEach((abox) => {
                abox.forEach((box) => {
                    out += '[' + box.join(',') + '],';
                });
            });
            out += '],';
        }
        out += ']';

        const blob = new Blob([out], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = this.getAnimName(this.anim.files[0]) + '.txt';
        link.click();
    }

    /**
     * Extracts the base animation name from a file path.
     * @param {string} path - The file path.
     * @returns {string} - The base name of the animation.
     */
    getAnimName(path) {
        if (typeof path !== 'string') return '';
        return path.split('/').pop().split('.')[0].split('_')[0];
    }

    /**
     * Parses an image for hitboxes of a given color.
     * @param {HTMLImageElement} img - Image element to scan.
     * @param {string} col - Color string to find in image.
     * @returns {Array} - Array of hitbox data arrays.
     */
    parseImage(img, col) {
        let hbs = [];
        let hb = this.findHitBox(img, col);
        hbs.push(hb);
        return hbs;
    }

    /**
     * Finds the bounding box of a specific color within an image.
     * @param {HTMLImageElement} img - The image to scan.
     * @param {string} col - Color to look for.
     * @returns {Array|undefined} - An array representing the bounding box or undefined if not found.
     */
    findHitBox(img, col) {
        const cvs = document.createElement('canvas');
        const ctx = cvs.getContext('2d');

        let fcol;
        if (typeof col === 'string') fcol = colorToHex(col);
        if (typeof fcol === 'string' && fcol.includes('#')) fcol = hexToRgb(fcol);
        if (!fcol) return;

        cvs.width = img.width;
        cvs.height = img.height;
        ctx.drawImage(img, 0, 0);

        const data = ctx.getImageData(0, 0, cvs.width, cvs.height).data;
        let minX = cvs.width, minY = cvs.height, maxX = 0, maxY = 0;

        for (let y = 0; y < cvs.height; y++) {
            for (let x = 0; x < cvs.width; x++) {
                const i = (y * cvs.width + x) * 4;
                const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
                if (r === fcol.r && g === fcol.g && b === fcol.b && a === 255) {
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                }
            }
        }

        if (minX <= maxX && minY <= maxY) {
            return [minX, minY, maxX - minX + 1, maxY - minY + 1, `'${col}'`, false, img.width, img.height];
        } else {
            return [0, 0, 0, 0, `'${col}'`, false, img.width, img.height];
        }
    }

    /**
     * Caches hitbox images by loading them into a hidden DOM element.
     * @param {string[]} images - Array of image file paths.
     * @param {Function} callback - Function to call when all images are loaded.
     */
    cacheImages(images, callback) {
        if (!images || !images.length) return;
        let self = this;
        let cacheDiv = document.querySelector('#cache');
        if (cacheDiv) {
            images.forEach(function (image) {
                let checkCache = document.querySelector('#cache img[src="' + image + '"]');
                if (!checkCache) {
                    let cachedImage = new Image();
                    let hitboximg = image.replace(/(.*\/)([^/]+)$/, '$1' + 'hitbox' + '/$2');
                    cachedImage.src = hitboximg;
                    cacheDiv.appendChild(cachedImage);
                    self.cachedImages.push(cachedImage);
                    cachedImage.onload = function () {
                        self.loadedImages += 1;
                        if (self.loadedImages === self.totalImages) {
                            callback();
                        }
                        cachedImage.onload = null;
                    };
                    self.totalImages += 1;
                }
            });
        }
    }
}