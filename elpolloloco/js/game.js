let canvas;
let world;
let keyboard;
let screen;

document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init(){
    
    canvas = document.getElementById('canvas');
    screen = new Screen(canvas); 
    keyboard = new Keyboard();
    world = new World(canvas,screen,keyboard);
    screen.setWorld(world);
    screen.resizeCanvas(world);

    window.addEventListener('keydown', (e) => {
        if(keyboard.BLOCKED){ return; }
        switch (e.keyCode) {
            case 37:
                if(!keyboard.LEFT){ keyboard.LEFT = true; }
                break;
            case 39: 
                if(!keyboard.RIGHT){ keyboard.RIGHT = true; }
                break;
            case 32: 
                if(!keyboard.SPACE){ keyboard.SPACE = true; }
                break;
            case 13:
                if(!keyboard.ENTER){ keyboard.ENTER = true; }
                break;
            case 9:
                if(!keyboard.TAB){ keyboard.TAB = true; }
                    e.preventDefault();
            case 20: 
                keyboard.CAPSLOCK = !keyboard.CAPSLOCK;
                break;
        }
    });
    window.addEventListener('keyup', (e) => {
        if(keyboard.BLOCKED){ return; }
        switch (e.keyCode) {
            case 37:
                if(keyboard.LEFT){ keyboard.LEFT = false };
                break;
            case 39:
                if(keyboard.RIGHT){ keyboard.RIGHT = false; }
                break;
            case 32:
                if(keyboard.SPACE){ keyboard.SPACE = false; }
                break;
            case 13:
                if(keyboard.ENTER){ keyboard.ENTER = false; }
                break;
            case 9:
                if(keyboard.TAB){ keyboard.TAB = false; }
                    e.preventDefault();
            case 20: 
                keyboard.CAPSLOCK = keyboard.CAPSLOCK;
                break;          
        }
    });

    /* WINDOW RESIZE */

    window.addEventListener('resize', function(){
        screen.resizeCanvas(world);
    });

    ['click'].forEach(eventType => {
        document.querySelector('#full_screen').addEventListener(eventType, (e) => {
            e.stopPropagation(); e.preventDefault();
            if( document.fullscreenElement){ screen.exitFullscreen(); }else{ screen.enterFullscreen(); }
        }, { passive: false });
    });

    /* MOBILE */
    ['touchstart','mousedown'].forEach(eventType => {
        document.querySelector('#left_btn').addEventListener(eventType, (e) => {
            e.stopPropagation(); e.preventDefault();
            if(!keyboard.LEFT){ keyboard.LEFT = true };
        }, { passive: false });
    });
    ['touchend','mouseup'].forEach(eventType => {
        document.querySelector('#left_btn').addEventListener(eventType, (e) => {
            e.stopPropagation(); e.preventDefault();
            if(keyboard.LEFT){ keyboard.LEFT = false };
        }, { passive: false });
    });
    ['touchstart','mousedown'].forEach(eventType => {
        document.querySelector('#right_btn').addEventListener(eventType, (e) => {
            e.stopPropagation(); e.preventDefault();
            if(!keyboard.RIGHT){ keyboard.RIGHT = true };
        }, { passive: false });
    });
    ['touchend','mouseup'].forEach(eventType => {
        document.querySelector('#right_btn').addEventListener(eventType, (e) => {
            e.stopPropagation(); e.preventDefault();
            if(keyboard.RIGHT){ keyboard.RIGHT = false };
        }, { passive: false });
    });
    ['touchstart','mousedown'].forEach(eventType => {
        document.querySelector('#jump_btn').addEventListener(eventType, (e) => {
            e.stopPropagation(); e.preventDefault();
            if(!keyboard.SPACE){ keyboard.SPACE = true };
        }, { passive: false });
    });
    ['touchend','mouseup'].forEach(eventType => {
        document.querySelector('#jump_btn').addEventListener(eventType, (e) => {
            e.stopPropagation(); e.preventDefault();
            if(keyboard.SPACE){ keyboard.SPACE = false };
        }, { passive: false });
    });

    document.querySelector('#controls .button').addEventListener('pointerdown', (e) => {
       // e.preventDefault(); e.stopPropagation();
    });
}

