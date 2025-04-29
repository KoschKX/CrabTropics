let canvas;
let world;
let keyboard

document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init(){
    
    keyboard = new Keyboard();

    canvas = document.getElementById('canvas');
    world = new World(canvas,keyboard);

    window.addEventListener('keydown', (e) => {
        switch (e.keyCode) {
            case 37:
                keyboard.LEFT = true;
                break;
            case 39: 
                keyboard.RIGHT = true;
                break;
            case 32: 
                keyboard.SPACE = true;
                break;
            case 13:
                keyboard.ENTER = true;
                break;
            case 9:
                keyboard.TAB = true;
                    e.preventDefault();
            case 20: 
                keyboard.CAPSLOCK = !keyboard.CAPSLOCK;
                break;
        }
    });

    window.addEventListener('keyup', (e) => {
        switch (e.keyCode) {
            case 37:
                keyboard.LEFT = false;
                break;
            case 39:
                keyboard.RIGHT = false;
                break;
            case 32:
                keyboard.SPACE = false;
                break;
            case 13:
                keyboard.ENTER = false;
                break;
            case 9:
                keyboard.TAB = false;
                    e.preventDefault();
            case 20: 
                keyboard.CAPSLOCK = keyboard.CAPSLOCK;
                break;          
        }
    });


    /* MOBILE */

    document.querySelector('#left_btn').addEventListener('touchstart', (e) => {
        e.stopPropagation(); e.preventDefault();
        if(!keyboard.LEFT){ keyboard.LEFT = true };
    }, { passive: false });
    document.querySelector('#left_btn').addEventListener('touchend', (e) => {
        e.stopPropagation(); e.preventDefault();
        if(keyboard.LEFT){ keyboard.LEFT = false };
    }, { passive: false });
    document.querySelector('#right_btn').addEventListener('touchstart', (e) => {
        e.stopPropagation(); e.preventDefault();
        if(!keyboard.RIGHT){ keyboard.RIGHT = true };
    }, { passive: false });
    document.querySelector('#right_btn').addEventListener('touchend', (e) => {
        e.stopPropagation(); e.preventDefault();
        if(keyboard.RIGHT){ keyboard.RIGHT = false };
    });
    document.querySelector('#jump_btn').addEventListener('touchstart', (e) => {
        e.stopPropagation(); e.preventDefault();
        if(!keyboard.SPACE){ keyboard.SPACE = true };
    }, { passive: false });
    document.querySelector('#jump_btn').addEventListener('touchend', (e) => {
        e.stopPropagation(); e.preventDefault();
        if(keyboard.SPACE){ keyboard.SPACE = false };
    }, { passive: false });

    document.querySelector('#controls .button').addEventListener('pointerdown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    window.addEventListener('resize', function(){
            world.resizeCanvas();
    });
}

