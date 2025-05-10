let canvas;
let context;
let world;
let keyboard;
let screen;
let audio;
let camera;
let bounds;

let titlescreen;

document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init(){
    
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    //context.imageSmoothingEnabled = true;
    //context.imageSmoothingQuality = 'high'; 
    
    screen = new Screen(canvas); 
    screen.bounds = [0,0,720,480];
    screen.showMenu();
    
    keyboard = new Keyboard();
    audio = new AudioManager();

    titlescreen = new Titlescreen(canvas, screen, keyboard, audio);

    window.addEventListener('keydown', (e) => {
        if(e.key=='Tab'){ e.preventDefault(); }
        keyboard.keyDown(e.keyCode);
    });
    window.addEventListener('keyup', (e) => {
        if(e.key=='Tab'){ e.preventDefault(); }
        keyboard.keyUp(e.keyCode);
    });

    /* WINDOW RESIZE */
    window.addEventListener('resize', function(){
        screen.resizeCanvas();
    });

    ['click'].forEach(eventType => {
        document.querySelector('#screen').addEventListener(eventType, (e) => {
            e.stopPropagation(); e.preventDefault();
            if( document.fullscreenElement){ screen.exitFullscreen(); }else{ screen.enterFullscreen(); }
        }, { passive: false });
    });

     /* PAUSE */
    ['click'].forEach(eventType => {
        document.querySelector('#pause').addEventListener(eventType, (e) => {
            e.stopPropagation(); e.preventDefault();
            if( screen.paused ){ screen.unpause(); } else {screen.pause(); }
        }, { passive: false });
    });

    /* RESTART */
    ['click'].forEach(eventType => {
        document.querySelector('#restart').addEventListener(eventType, (e) => {
            e.stopPropagation(); e.preventDefault();
            if( titlescreen.world ){ titlescreen.world.restart(); }
        }, { passive: false });
    });

    /* SOUND MUTE */
    ['click'].forEach(eventType => {
        document.querySelector('#sound').addEventListener(eventType, (e) => {
            e.stopPropagation(); e.preventDefault();
            if( audio.muted ){ audio.unmute(); }else{ audio.mute(); }
        }, { passive: false });
    });

    /* DEBUG */
    ['click'].forEach(eventType => {
        document.querySelector('#debug').addEventListener(eventType, (e) => {
            e.stopPropagation(); e.preventDefault();
            if( titlescreen.world.debug ){ titlescreen.world.toggleDebug(false); }else{ titlescreen.world.toggleDebug(true); }
        }, { passive: false });
    });

    /* BOSS */
    ['click'].forEach(eventType => {
        document.querySelector('#boss').addEventListener(eventType, (e) => {
            e.stopPropagation(); e.preventDefault();
            if( !titlescreen.world.boss ){ titlescreen.world.callBoss(); }
        }, { passive: false });
    });

    /* MOBILE */
    ['touchstart','mousedown'].forEach(eventType => {
        document.querySelector('#left_btn').addEventListener(eventType, (e) => {
            e.stopPropagation(); e.preventDefault();
            keyboard.keyDown('ArrowLeft');
        }, { passive: false });
    });
    ['touchend','mouseup'].forEach(eventType => {
        document.querySelector('#left_btn').addEventListener(eventType, (e) => {
            e.stopPropagation(); e.preventDefault();
            keyboard.keyUp('ArrowLeft');
        }, { passive: false });
    });
    ['touchstart','mousedown'].forEach(eventType => {
        document.querySelector('#right_btn').addEventListener(eventType, (e) => {
            e.stopPropagation(); e.preventDefault();
            keyboard.keyDown('ArrowRight');
        }, { passive: false });
    });
    ['touchend','mouseup'].forEach(eventType => {
        document.querySelector('#right_btn').addEventListener(eventType, (e) => {
            e.stopPropagation(); e.preventDefault();
            keyboard.keyUp('ArrowRight');
        }, { passive: false });
    });
    ['touchstart','mousedown'].forEach(eventType => {
        document.querySelector('#jump_btn').addEventListener(eventType, (e) => {
            e.stopPropagation(); e.preventDefault();
            keyboard.keyDown('Space');
        }, { passive: false });
    });
    ['touchend','mouseup'].forEach(eventType => {
        document.querySelector('#jump_btn').addEventListener(eventType, (e) => {
            e.stopPropagation(); e.preventDefault();
           keyboard.keyUp('Space');
        }, { passive: false });
    });
    ['touchstart','mousedown'].forEach(eventType => {
        document.querySelector('#crouch_btn').addEventListener(eventType, (e) => {
            e.stopPropagation(); e.preventDefault();
            keyboard.keyDown('ArrowDown');
        }, { passive: false });
    });
    ['touchend','mouseup'].forEach(eventType => {
        document.querySelector('#crouch_btn').addEventListener(eventType, (e) => {
            e.stopPropagation(); e.preventDefault();
           keyboard.keyUp('ArrowDown');
        }, { passive: false });
    });
    ['click','mouseup'].forEach(eventType => {
       document.querySelector('body').addEventListener(eventType, (e) => {
            keyboard.keyUp('*');
        }, { passive: false });
    });

    document.querySelector('#controls .button').addEventListener('pointerdown', (e) => {
       // e.preventDefault(); e.stopPropagation();
    });

    window.addEventListener('blur', () => {
        screen.hasFocus = false;
        audio.mute(false)
        screen.pause(false);
    });
    window.addEventListener('focus', () => {
        screen.hasFocus = true;
        if( audio.mute    && !audio.wasMuted )  { audio.unmute(false); }
        if( screen.paused && !screen.wasPaused ){ screen.unpause(false); }
    });

    runHitBoxGrabber();
}

function runHitBoxGrabber() {
  const qs = new URLSearchParams(window.location.search);
  const cname = qs.get("class");
  if(!cname){ return; }
  const inst = eval('new ' + cname + '()');
  if(inst){
    inst.imagesLib.forEach((anim) => { 
        let ahb = new AnimatedHitbox(inst, anim, true);
    })
  }
}
