/**
 * Keyboard System.
 */
class Keyboard {
    /** @type {boolean} State of the LEFT arrow key (pressed or not). */
    LEFT;
    /** @type {boolean} State of the RIGHT arrow key (pressed or not). */
    RIGHT;
    /** @type {boolean} State of the DOWN arrow key (pressed or not). */
    DOWN;
    /** @type {boolean} State of the UP arrow key (pressed or not). */
    UP;
    /** @type {boolean} State of the SPACE key (pressed or not). */
    SPACE;
    /** @type {boolean} State of the ENTER key (pressed or not). */
    ENTER;
    /** @type {boolean} State of the TAB key (pressed or not). */
    TAB;
    /** @type {boolean} State of the CAPSLOCK key (pressed or not). */
    CAPSLOCK;

    /** @type {boolean} If the keyboard is currently blocked from input. */
    BLOCKED = false;
    /** @type {boolean} If any key is pressed. */
    KEYDOWN = false;

    /**
     * Resets the state of all keys to false (not pressed).
     */
    reset() {
        this.LEFT = false;
        this.RIGHT = false;
        this.DOWN = false;
        this.UP = false;
        this.SPACE = false;
        this.TAB = false;
        // this.CAPSLOCK = false;  // CapsLock state is not reset here
    }

    /**
     * Sets the keyboard's blocked state.
     * If blocked, all keys are reset and no input will be accepted.
     * @param {boolean} isBlocked - Whether the keyboard input should be blocked or not.
     */
    setBlocked(isBlocked) {
        if (isBlocked) {
            this.reset();  // Reset keys when blocked
        }
        this.BLOCKED = isBlocked;
    }

    /**
     * Handles key press events.
     * Updates the state of the keys based on the key that is pressed.
     * @param {string | number} key - The key that was pressed, either as a key code or a string.
     */
    keyDown(key) {
        if (this.BLOCKED) { return; }  // Ignore input if blocked

        switch (key) {
            case 37:
            case 'ArrowLeft':
                if (!this.LEFT) { this.LEFT = true; }
                break;
            case 39:
            case 'ArrowRight':
                if (!this.RIGHT) { this.RIGHT = true; }
                break;
            case 38:
            case 'ArrowUp':
                if (!this.UP) { this.UP = true; }
                break;
            case 40:
            case 'ArrowDown':
                if (!this.DOWN) { this.DOWN = true; }
                break;
            case 32:
            case 'Space':
                if (!this.SPACE) { this.SPACE = true; }
                break;
            case 13:
            case 'Enter':
                if (!this.ENTER) { this.ENTER = true; }
                break;
            case 9:
            case 'Tab':
                if (!this.TAB) { this.TAB = true; }
                break;
            case 20:
            case 'CapsLock':
                this.CAPSLOCK = !this.CAPSLOCK;
                break;
        }
        this.KEYDOWN = true;
    }

    /**
     * Handles key release events.
     * Updates the state of the keys based on the key that was released.
     * @param {string | number} key - The key that was released, either as a key code or a string.
     */
    keyUp(key) {
        if (this.BLOCKED) { return; }  // Ignore input if blocked

        switch (key) {
            case 37:
            case 'ArrowLeft':
                if (this.LEFT) { this.LEFT = false; }
                break;
            case 39:
            case 'ArrowRight':
                if (this.RIGHT) { this.RIGHT = false; }
                break;
            case 38:
            case 'ArrowUp':
                if (this.UP) { this.UP = false; }
                break;
            case 40:
            case 'ArrowDown':
                if (this.DOWN) { this.DOWN = false; }
                break;
            case 32:
            case 'Space':
                if (this.SPACE) { this.SPACE = false; }
                break;
            case 13:
            case 'Enter':
                if (this.ENTER) { this.ENTER = false; }
                break;
            case 9:
            case 'Tab':
                if (this.TAB) { this.TAB = false; }
                break;
            case 20:
            case 'CapsLock':
                this.CAPSLOCK = this.CAPSLOCK; 
                break;
            case '*':  // Reset all keys
                if (this.LEFT) { this.LEFT = false; }
                if (this.RIGHT) { this.RIGHT = false; }
                if (this.SPACE) { this.SPACE = false; }
                if (this.ENTER) { this.ENTER = false; }
                if (this.TAB) { this.TAB = false; }
                break;
        }
        this.KEYDOWN = false;
    }
}