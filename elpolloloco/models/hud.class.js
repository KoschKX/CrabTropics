class HUD{
	cvs; ctx;
	world;
    player;

	constructor(world){
        this.world = world;
		this.cvs = world.cvs; this.ctx = world.ctx;
	}

    continue(){
        let self = this;
        let cTime = this.world.player.deadTime(true);
        if(cTime==0){ this.world.keyboard.setBlocked(true); }
        this.tick('<=', 10, function(t){  self.displayContinue(10-t) });
        this.tick('>',  10, function(t){  self.displayGameOver(); });
    }

    tick(op, sec, callback) {
        const dTime = this.world.player.deadTime(true);
        if (!callback) return;
        const ops = {
            '==': (a, b) => a === b,
            '<=': (a, b) => a <= b,
            '<':  (a, b) => a <  b,
            '>=': (a, b) => a >= b,
            '>':  (a, b) => a >  b,
            '!=': (a, b) => a !== b
        };
        const compare = ops[op];
        if (compare && compare(dTime, sec)) {
            callback(dTime);
        }
    }

    displayGameOver(){
        let text = 'GAME OVER';
        let font = "bold " + (this.cvs.width * 0.1) + "px Arial";
        this.world.gameover=true; 
        drawText( this.ctx,  this.cvs.width * 0.5, this.cvs.height * 0.5, 0, 0 , text, 'white', font, 'center', 'middle','black', 2 );
    }

    displayContinue(timeLeft){
        this.world.keyboard.setBlocked(false);
        let text = 'CONTINUE? '+timeLeft;
        let font = "bold " + (this.cvs.width * 0.1) + "px Arial";
        if(this.world.keyboard.SPACE){
            this.world.level.enemies.forEach((enemy) => {
                if(!enemy.isBoss){ enemy.health=1; }
                enemy.isHit(); enemy.revive(3000);
            });
            this.world.player.setInvincible(1000);
            this.world.player.revive();
        }
        drawText( this.ctx,  this.cvs.width * 0.5, this.cvs.height * 0.5, 0, 0 , text, 'white', font, 'center', 'middle','black', 2 );
    }

    displayHealth(){
        let text = '♥'.repeat(this.world.player.health);
        let font = '30px Arial';
        drawText( this.ctx,  20, 40, 0, 0 , text, 'red', font, 'left', 'middle','white', 1 );
    }

    displayWealth(){
        let text = '$' + (this.world.player.doubloons);
        let font = '30px Arial';
        drawText( this.ctx,  20, 70, 0, 0 , text, 'red', font, 'left', 'middle','white', 1 );
    }

    status(){
        this.displayHealth();
        this.displayWealth();
    }

    print(world){
        if(this.world.player.dead){
            this.continue();
        }else{
            this.status();
        }
        
    }
   
}
