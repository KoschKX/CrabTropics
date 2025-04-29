class Keyboard{
	LEFT;
	RIGHT;
	SPACE;
	ENTER;
	TAB;
	CAPSLOCK;

	BLOCKED = false;

	reset(){
		this.LEFT = false;
		this.RIGHT = false;
		this.SPACE = false;
		this.TAB = false;
		// this.CAPSLOCK = false;
	}

	setBlocked(isBlocked){
		if(isBlocked){ this.reset(); }
		this.BLOCKED = isBlocked;
	}
}
