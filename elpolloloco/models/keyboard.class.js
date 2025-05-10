class Keyboard{
	LEFT;
	RIGHT;
	DOWN;
	UP;
	SPACE;
	ENTER;
	TAB;
	CAPSLOCK;

	BLOCKED = false;
    KEYDOWN = false;

	reset(){
		this.LEFT = false;
		this.RIGHT = false;
		this.DOWN = false;
		this.UP = false;
		this.SPACE = false;
		this.TAB = false;
		// this.CAPSLOCK = false;
	}

	setBlocked(isBlocked){
		if(isBlocked){ this.reset(); }
		this.BLOCKED = isBlocked;
	}

	keyDown(key){
		if(this.BLOCKED){ return; }
        switch (key) {
            case 37:
        	case 'ArrowLeft':
                if(!keyboard.LEFT){ keyboard.LEFT = true; }
                break;
            case 39:
            case 'ArrowRight':
                if(!keyboard.RIGHT){ keyboard.RIGHT = true; }
                break;
            case 38:
        	case 'ArrowUp':
                if(!keyboard.UP){ keyboard.UP = true; }
                break;
            case 40:
           	case 'ArrowDown':
                if(!keyboard.DOWN){ keyboard.DOWN = true; }
                break;
            case 32:
            case 'Space':
                if(!keyboard.SPACE){ keyboard.SPACE = true; }
                break;
            case 13: 
            case 'Enter':
                if(!keyboard.ENTER){ keyboard.ENTER = true; }
                break;
            case 9:
            case 'Tab':
                if(!keyboard.TAB){ keyboard.TAB = true; }
                break;
            case 20:
        	case 'CapsLock':
                keyboard.CAPSLOCK = !keyboard.CAPSLOCK;
                break;
        }
        this.KEYDOWN = true;
	}

	keyUp(key){
        if(keyboard.BLOCKED){ return; }
        switch (key) {
            case 37:
        	case 'ArrowLeft':
                if(keyboard.LEFT){ keyboard.LEFT = false; }
                break;
            case 39:
            case 'ArrowRight':
                if(keyboard.RIGHT){ keyboard.RIGHT = false; }
                break;
            case 38:
        	case 'ArrowUp':
                if(keyboard.UP){ keyboard.UP = false; }
                break;
            case 40:
           	case 'ArrowDown':
                if(keyboard.DOWN){ keyboard.DOWN = false; }
                break;
            case 32:
            case 'Space':
                if(keyboard.SPACE){ keyboard.SPACE = false; }
                break;
            case 13: 
            case 'Enter':
                if(keyboard.ENTER){ keyboard.ENTER = false; }
                break;
            case 9:
            case 'Tab':
                if(keyboard.TAB){ keyboard.TAB = false; }
                break;
            case 20:
        	case 'CapsLock':
                keyboard.CAPSLOCK = keyboard.CAPSLOCK;
                break;
            case '*': 
                if(keyboard.LEFT)  { keyboard.LEFT  = false; }
                if(keyboard.RIGHT) { keyboard.RIGHT = false; }
                if(keyboard.SPACE) { keyboard.SPACE = false; }
                if(keyboard.ENTER) { keyboard.ENTER = false; }
                if(keyboard.TAB)   { keyboard.TAB   = false; }
                break;
        }
        this.KEYDOWN = false;
    }


}
