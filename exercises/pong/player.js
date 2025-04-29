class Player extends Drawable {
    
    // ########### Attributes ###########
    w = 6;
    h = 30;
    static print = 1;
    instanz;
    y = 20;
    spdY = 4;

    // ########### Constructor ###########
    constructor(fieldwidth) {
        super();
        if (Player.print == 1) {
            this.x = 10;
            this.instanz = true; // Die Instanzierung mit instanz = true -> player 1
            Player.print++;
        } else {
            this.x = fieldwidth - this.w - 10;
            this.instanz = false; // Die Instanzierung mit instanz = false -> player 2
        }
        this.animate();
    }

    // ########### Methods ###########
    animate() {
        setInterval(() => {
            if(this.instanz){
                if (Keyboard.KEY_W && this.y > 0) {
                    this.y -= this.spdY;
                }
                if(Keyboard.KEY_S && this.y < (this.playfield.can.height - this.h)){
                    this.y += this.spdY;
                }
            } else {
                if (Keyboard.UP && this.y > 0) {
                    this.y -= this.spdY;
                }
                if(Keyboard.DOWN && this.y < (this.playfield.can.height - this.h)){
                    this.y += this.spdY;
                }
            }
        }, 1000 / 60);
    }

}