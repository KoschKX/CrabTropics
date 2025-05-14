/**
 * An Animation from image files.
 */
class Anim {

    /** NAME */
    name = '';

    /** BANKS */
    frames = [];
    files = [];
    offsets = [];
    
    /** REPEAT */
    repeat = 1;
    
    /**
     * Constructs an Animation instance.
     * @param {string|string[]} startfile - Initial file or array of file paths.
     * @param {number|number[]=} frames - Number of frames or specific frame indices.
     * @param {string=} options - Comma-separated string of options (e.g. "repeat=3").
     */
    constructor(startfile, frames, options) {
        let ext = startfile.split('.').pop();
        let name = startfile.split('_').slice(0, -1).join('_');
        this.name = name;

        // Populate file list based on frame input
        if (!frames) {
            if (Array.isArray(startfile)) {
                this.files = startfile;
                return;
            } else {
                this.files.push(startfile);
                return;
            }
        }

        if (Array.isArray(frames)) {
            for (let idx = 0; idx < frames.length; idx++) {
                let ipath = name + "_" + String(frames[idx]).padStart(3, '0') + '.' + ext;
                if (this.files?.[ipath]) { return; }
                this.files.push(ipath);
            }
        } else if (!isNaN(frames)) {
            for (let idx = 0; idx < frames; idx++) {
                let ipath = name + "_" + String(idx + 1).padStart(3, '0') + '.' + ext;
                if (this.files?.[ipath]) { return; }
                this.files.push(ipath);
            }
        }

        // Parse options if provided
        if (typeof options === 'string') {
            options = options.split(',');
            options.forEach((option) => { this.parseOption(option); });
        }
    }

    /**
     * Parses a single animation option (e.g., "repeat=2").
     * @param {string} option - The option string.
     */
    parseOption(option) {
        let opt = option.split('=');
        if (opt.length <= 1) { return; }
        let o = opt[0];
        let v = opt[1];

        if (o === 'repeat') {
            this.repeat = parseInt(v);
        }
    }

    /**
     * Extracts the animation name from a file path.
     * @param {string} path - The file path.
     * @returns {string} The animation name.
     */
    getAnimName(path) {
        if (typeof path !== 'string') { return ''; }
        return path.split('/').pop().split('.')[0].split('_')[0];
    }
}