/**
 * A Movie object that plays an animated image sequence or a video as a background element.
 * Inherits from Background.
 */
class Movie extends Background {

    /** @type {string} */
    name = 'Movie';
    
    /** @type {string} */
    category = 'background';

    /** @type {Anim} */
    IMAGES_ANIM = new Anim('./img/blank.png', 0, '');

    /** @type {string} */
    imagePath;

    /** @type {Object<string, string>} */
    imageCache = [];

    /** @type {Anim[]} */
    imagesLib = [];

    /** @type {number} */
    currImage = 0;

    /** @type {string[]} */
    anim = [];

    /** @type {HTMLVideoElement|null} */
    vid;

    /** @type {number} */
    frames = 1;

    /** @type {number} */
    frameRate = 30;

    /** @type {number} */
    x = 0;

    /** @type {number} */
    y = 0;

    /** @type {number} */
    width = 740;

    /** @type {number} */
    height = 480;

    /** @type {boolean} */
    isPlaying = false;

    /** @type {boolean} */
    strict = false;

    /**
     * Constructs a new Movie background.
     * @param {World} world - The game world.
     * @param {string} imagePath - The path to the video or image sequence.
     * @param {number} layer - The layer index.
     * @param {number} frames - Number of frames in the animation.
     * @param {number} x - X position.
     * @param {number} y - Y position.
     * @param {number} width - Width of the movie.
     * @param {number} height - Height of the movie.
     * @param {number} [frameRate=30] - Frame rate for animation.
     * @param {boolean} [strict=false] - Whether to strictly control frame playback.
     */
    constructor(world, imagePath, layer, frames, x, y, width, height, frameRate = 30, strict = false) {
        super(world, imagePath, layer, x, y, width, height);
        this.frames = frames;
        this.imagePath = imagePath;
        this.frameRate = frameRate;
        this.strict = strict;
        this.IMAGES_ANIM = new Anim(imagePath, frames, '');
        this.imagesLib = [this.IMAGES_ANIM];
        this.cacheAnim(this.IMAGES_ANIM);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.generateStamp(this.name);
    }

    /**
     * Destroys the Movie instance and cleans up resources.
     */
    destroy() {
        super.destroy();
        this.pause();
        clearInterval(this.animInterval);
        this.world.level.backgrounds = destroy(this, this.world.level.backgrounds, this.world);
    }

    /**
     * Initializes the Movie playback.
     */
    init() {
        const ext = this.imagePath.split('.').pop();
        if (ext === 'mp4' || ext === 'webm') {
            this.vid = document.querySelector('#cache [src="' + this.imagePath + '"]');
        }
        this.play();
    }

    /**
     * Starts playback of the movie or animation.
     * @param {boolean} [force=false] - Whether to forcibly play the video.
     */
    play(force = false) {
        this.isPlaying = true;
        if (this.vid && !this.isVideoPlaying() && force) {
            this.vid.play().catch(() => {});
        }
        clearInterval(this.animInterval);
        this.animInterval = setInterval(() => { this.animate(); }, 1000 / this.frameRate);
    }

    /**
     * Pauses playback of the movie or animation.
     * @param {boolean} [force=false] - Whether to forcibly pause the video.
     */
    pause(force = false) {
        this.isPlaying = false;
        if (this.vid && force) {
            this.vid.pause();
        }
        clearInterval(this.animInterval);
    }

    /**
     * Handles the animation step based on playback status.
     */
    handleAnimation() {
        if (this.world.paused) return;
        if (this.isPlaying) this.playAnimation(this.currImageSet);
    }

    /**
     * Loads a video into the DOM cache.
     * @param {string} path - Path to the video file.
     */
    loadVideo(path) {
        if (!path.startsWith('*')) {
            const vid = document.createElement('video');
            vid.src = path;
        }
        this.imageCache[path] = path;
    }

    /**
     * Caches the animation frames.
     * @param {Anim} anim - Animation object to cache.
     */
    cacheAnim(anim) {
        anim.files.forEach((path) => {
            if ((path in this.imageCache)) return;
            this.imageCache[path] = path;
        });
    }

    /**
     * Updates current frame based on video time.
     */
    getVideoFrame() {
        if (!this.vid) return;
        const totalFrames = Math.round(this.vid.duration * this.frameRate);
        const currentFrame = Math.round(this.vid.currentTime * this.frameRate);
        this.currImage = currentFrame % totalFrames;
        this.frames = totalFrames;
        this.time = this.currImage / this.frameRate;
    }

    /**
     * Checks if the video is currently playing.
     * @returns {boolean} True if video is playing.
     */
    isVideoPlaying() {
        return (
            this.vid &&
            this.vid.currentTime > 0 &&
            !this.vid.paused &&
            !this.vid.ended &&
            this.vid.readyState >= 2
        );
    }

    /**
     * Seeks the video to a specific frame index.
     * @param {number} frameIndex - Index of frame to seek to.
     */
    videoSeek(frameIndex) {
        if (!this.vid) return;
        const time = frameIndex / this.frameRate;
        if (time) this.vid.currentTime = time;
    }

    /**
     * Advances and renders the next animation frame.
     */
    playAnimation() {
        if (this.vid) {
            if (!this.isPlaying) return;
            if (this.strict) {
                this.frames = Math.round(this.vid.duration * this.frameRate);
                const i = this.currImage % this.frames;
                this.currImage++;
                this.videoSeek(i);
            } else {
                this.getVideoFrame();
            }
        } else {
            if (!this.img || !this.isPlaying) return;
            const i = this.currImage % this.IMAGES_ANIM.files.length;
            const path = this.IMAGES_ANIM.files[i];
            this.currImage++;
            if (!(path in this.imageCache)) return;
            this.img.src = this.imageCache[path];
        }
    }

    /**
     * Draws the current frame or video frame onto the canvas.
     * @param {CanvasRenderingContext2D} ctx - The canvas context to draw to.
     */
    draw(ctx) {
        if (this.vid) {
            if (this.isPlaying) this.vid.play();
            ctx.drawImage(this.vid, this.x, this.y, this.width, this.height);
        } else {
            if (!this.anim || !this.img) return;
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Resizes the movie to fit the canvas.
     */
    fit() {
        this.width = this.cvs.width;
        this.height = this.cvs.height;
    }
}