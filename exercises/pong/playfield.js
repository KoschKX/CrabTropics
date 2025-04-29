class Playfield {

    // ########### Attributes ###########
    keyboard = Keyboard;
    ball = new Ball();
    can;
    ctx;

    // ########### Constructor ###########
    constructor(canvas) {
        this.can = canvas;
        this.ctx = this.can.getContext("2d");
        this.player1 = new Player(this.can.width);
        this.player2 = new Player(this.can.width);
        this.ball = new Ball(this.can.width, this.can.height);
        this.player1.playfield = this;
        this.player2.playfield = this;
        this.ball.playfield = this;
        this.draw();
        // \o/ fehlt hier was? hm... \o/
        this.player1.animate();
        this.player2.animate();
        this.checkCollision();
    }

    // ########### Methods ###########
    draw() {
        this.ctx.clearRect(0, 0, this.can.width, this.can.height);
        this.drawSingleObject(this.player1);
        this.drawSingleObject(this.player2);
        this.drawSingleObject(this.ball);
        let self = this;
        requestAnimationFrame(() => self.draw());
    }


    drawSingleObject(single) {
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(single.x, single.y, single.w, single.h);
    }

    checkCollision() {
        setInterval(() => {
            // \o/ hier fehlen Bedingungen die von einem Objekts ausgehen <ball> \o/
            if (this.ball.isColliding(this.player1) || this.ball.isColliding(this.player2)) { 
                this.ball.changeDirection();
                this.ball.ponged = true;
                setTimeout(() => {
                    this.ball.ponged = false;
                }, 100);
            }
        }, 1000 / 60);
    }
}