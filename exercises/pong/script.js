let canvas = document.getElementById("cnvs");

let playfield = new Playfield(canvas);

window.addEventListener("keydown", (e) => {
    if(e.code == "KeyW"){
        Keyboard.KEY_W = true;
    }
    if(e.code == "KeyS"){
        Keyboard.KEY_S = true;
    }
    if(e.key == "ArrowUp"){
        Keyboard.UP = true;
    }
    if(e.key == "ArrowDown"){
        Keyboard.DOWN = true;
    }
});

window.addEventListener("keyup", (e) => {
    if(e.code == "KeyW"){
        Keyboard.KEY_W = false;
    }
    if(e.code == "KeyS"){
        Keyboard.KEY_S = false;
    }
    if(e.key == "ArrowUp"){
        Keyboard.UP = false;
    }
    if(e.key == "ArrowDown"){
        Keyboard.DOWN = false;
    }
})