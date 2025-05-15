/** @type {HTMLCanvasElement} */
let canvas;

/** @type {CanvasRenderingContext2D} */
let context;

/** @type {any} Represents the game world instance */
let world;

/** @type {Keyboard} Handles keyboard input */
let keyboard;

/** @type {Screen} Manages display, menu, and fullscreen handling */
let screen;

/** @type {AudioManager} Manages audio playback and mute states */
let audio;

/** @type {any} Used for tracking camera movement (if implemented elsewhere) */
let camera;

/** @type {number[]} The screen bounds [x, y, width, height] */
let bounds;

/** @type {Titlescreen} The main title screen interface */
let titlescreen;

/** @type The global Video Format (For Compatibility) */
var vidFormat = 'webm';

/**
 * Runs once the DOM is fully loaded.
 * Calls the game initializer.
 */
document.addEventListener('DOMContentLoaded', function() {
    detect_browser();
    init();
});

/**
 * Initializes the canvas, screen, input, audio, UI events, and gameplay systems.
 */
function init() {

    let platform = document.querySelector('body').getAttribute('data-platform');
    if (    
            platform && (
            platform.toLowerCase() === 'iphone' || 
            platform.toLowerCase() === 'ipad')
    )  { 
        vidFormat = 'mp4'; 
    }

    document.querySelector('body').setAttribute('video-format', vidFormat);
    document.querySelector('#debug_box #platform').innerHTML = platform;

    /** Setup canvas and context */
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    /** Create and configure screen object */
    screen = new Screen(canvas);
    screen.resizeCanvas();
    screen.showMenu();

    /** Initialize input and audio managers */
    keyboard = new Keyboard();
    audio = new AudioManager();

    /** Create title screen */
    titlescreen = new Titlescreen(canvas, screen, keyboard, audio);

    /** Keyboard input events */
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') e.preventDefault();
        keyboard.keyDown(e.keyCode);
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'Tab') e.preventDefault();
        keyboard.keyUp(e.keyCode);
    });

    /**
     * Resizes the canvas when the window changes size.
     */
    window.addEventListener('resize', function() {
        screen.resizeCanvas();
    });

    /**
     * Toggle fullscreen when the screen area is clicked.
     */
    ['click'].forEach(eventType => {
        document.querySelector('#info').addEventListener(eventType, (e) => {
            e.stopPropagation();
            e.preventDefault();
            let hlp = document.querySelector('#help');

            if(!help){ return; }
            if (hlp.classList.contains('show')) {
                screen.hideHelp();
                screen.unpause();
                document.querySelector('#info #info_go').classList.add('active');
                document.querySelector('#info #info_close').classList.remove('active');
            } else {
                screen.showHelp();
                screen.pause();
                document.querySelector('#info #info_close').classList.add('active');
                document.querySelector('#info #info_go').classList.remove('active');
            }
        }, { passive: false });
    });

    /**
     * Toggle fullscreen when the screen area is clicked.
     */
    ['click'].forEach(eventType => {
        document.querySelector('#screen').addEventListener(eventType, (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (document.fullscreenElement) {
                screen.exitFullscreen();
            } else {
                screen.enterFullscreen();
            }
        }, { passive: false });
    });

    /**
     * Toggle pause when the pause button is clicked.
     */
    ['click'].forEach(eventType => {
        document.querySelector('#pause').addEventListener(eventType, (e) => {
            e.stopPropagation();
            e.preventDefault();
            screen.paused ? screen.unpause() : screen.pause();
        }, { passive: false });
    });

    /**
     * Restart the game when the restart button is clicked.
     */
    ['click'].forEach(eventType => {
        document.querySelector('#restart').addEventListener(eventType, (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (titlescreen.world) {
                titlescreen.world.restart();
            }
        }, { passive: false });
    });

    /**
     * Toggle sound mute/unmute when the sound button is clicked.
     */
    ['click'].forEach(eventType => {
        document.querySelector('#sound').addEventListener(eventType, (e) => {
            e.stopPropagation();
            e.preventDefault();
            audio.muted ? audio.unmute() : audio.mute();
        }, { passive: false });
    });

    /**
     * Toggle debug mode when the debug button is clicked.
     */
    ['click'].forEach(eventType => {
        document.querySelector('#debug').addEventListener(eventType, (e) => {
            e.stopPropagation();
            e.preventDefault();
            if(!titlescreen|| !titlescreen.world){ return; }
            titlescreen.world.debug
                ? titlescreen.world.toggleDebug(false)
                : titlescreen.world.toggleDebug(true);
        }, { passive: false });
        document.querySelector('#debug_box').addEventListener(eventType, (e) => {
            document.querySelector('body').setAttribute('advanced-menu',true);
        });
    });

    /**
     * Trigger boss mode when the boss button is clicked.
     */
    ['click'].forEach(eventType => {
        document.querySelector('#boss').addEventListener(eventType, (e) => {
            e.stopPropagation();
            e.preventDefault();
            if (!titlescreen.world.boss) {
                titlescreen.world.callBoss();
            }
        }, { passive: false });
    });

    /** Mobile controls: LEFT */
    ['touchstart','mousedown'].forEach(eventType => {
        document.querySelector('#left_btn').addEventListener(eventType, (e) => {
            e.stopPropagation();
            e.preventDefault();
            keyboard.keyDown('ArrowLeft');
        }, { passive: false });
    });
    ['touchend','mouseup'].forEach(eventType => {
        document.querySelector('#left_btn').addEventListener(eventType, (e) => {
            e.stopPropagation();
            e.preventDefault();
            keyboard.keyUp('ArrowLeft');
        }, { passive: false });
    });

    /** Mobile controls: RIGHT */
    ['touchstart','mousedown'].forEach(eventType => {
        document.querySelector('#right_btn').addEventListener(eventType, (e) => {
            e.stopPropagation();
            e.preventDefault();
            keyboard.keyDown('ArrowRight');
        }, { passive: false });
    });
    ['touchend','mouseup'].forEach(eventType => {
        document.querySelector('#right_btn').addEventListener(eventType, (e) => {
            e.stopPropagation();
            e.preventDefault();
            keyboard.keyUp('ArrowRight');
        }, { passive: false });
    });

    /** Mobile controls: JUMP */
    ['touchstart','mousedown'].forEach(eventType => {
        document.querySelector('#jump_btn').addEventListener(eventType, (e) => {
            e.stopPropagation();
            e.preventDefault();
            keyboard.keyDown('Space');
        }, { passive: false });
    });
    ['touchend','mouseup'].forEach(eventType => {
        document.querySelector('#jump_btn').addEventListener(eventType, (e) => {
            e.stopPropagation();
            e.preventDefault();
            keyboard.keyUp('Space');
        }, { passive: false });
    });

    /** Mobile controls: DIG */
    ['touchstart','mousedown'].forEach(eventType => {
        document.querySelector('#crouch_btn').addEventListener(eventType, (e) => {
            e.stopPropagation();
            e.preventDefault();
            keyboard.keyDown('ArrowDown');
        }, { passive: false });
    });
    ['touchend','mouseup'].forEach(eventType => {
        document.querySelector('#crouch_btn').addEventListener(eventType, (e) => {
            e.stopPropagation();
            e.preventDefault();
            keyboard.keyUp('ArrowDown');
        }, { passive: false });
    });

    /**
     * General listener to reset key states when mouse is released anywhere.
     */
    ['click','mouseup'].forEach(eventType => {
        document.querySelector('body').addEventListener(eventType, (e) => {
            keyboard.keyUp('*'); // Asterisk used as catch-all release
        }, { passive: false });
    });

    /**
     * Placeholder for preventing pointer default on UI button.
     */
    document.querySelector('#controls .button').addEventListener('pointerdown', (e) => {
        // e.preventDefault(); e.stopPropagation();
    });

    /**
     * Auto mute/pause on window blur.
     */
    window.addEventListener('blur', () => {
        // Ignore unwanted pauses
            const isIframeFocused = document.activeElement && document.activeElement.tagName === 'IFRAME';
            const isTabVisible = document.visibilityState === 'visible';  
            if (isIframeFocused || isTabVisible) return;

        screen.hasFocus = false;
        audio.mute(false);
        screen.pause(false);
     });

    /**
     * Auto mute/pause on window visibility change.
     */
    document.addEventListener('visibilitychange', () => {
        // Ignore unwanted pauses
            const isTabVisible = document.visibilityState === 'visible';
            if (isTabVisible) return;

        screen.hasFocus = false;
        audio.mute(false);
        screen.pause(false);
    });


    /**
     * Restore state on window focus.
     */
    window.addEventListener('focus', () => {
        screen.hasFocus = true;
        if (audio.mute && !audio.wasMuted) {
            audio.unmute(false);
        }
        if (screen.paused && !screen.wasPaused) {
            screen.unpause(false);
        }
    });

    /** ALLOW TAP ON SCREEN TO START GAME **/
    ['touchstart','mousedown'].forEach(eventType => {
        document.querySelector('#canvas').addEventListener(eventType, (e) => {
            e.stopPropagation();
            e.preventDefault();
            if(titlescreen && !titlescreen.world){ titlescreen.start(); }
         }, { passive: false });
    });

    /** Check for hitbox grabber in URL params and initialize if needed */
    runHitBoxGrabber();
}

/**
 * Utility to generate an animation hitbox viewer via URL param (?class=ClassName).
 * Dynamically instantiates class and builds hitboxes for its animations. Exports as .txt files,
 * Place in './hitbox' folder
 */
function runHitBoxGrabber() {
    const qs = new URLSearchParams(window.location.search);
    const cname = qs.get("class");
    if (!cname) return;

    /** @type {any} */
    const inst = eval('new ' + cname + '()');
    if (inst) {
        inst.imagesLib.forEach((anim) => {
            let ahb = new AnimatedHitbox(inst, anim, true);
        });
    }
}