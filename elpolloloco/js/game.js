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
        }
    });
}

