class HUD{
	cvs; ctx;
	world;

	constructor(world){
        this.world = world;
		this.cvs = world.cvs;
		this.ctx = world.ctx;
	}

    print(world){
        
        let statusText = '';
        if(this.world.player.dead){
            this.ctx.font = "bold 60px Arial";
            this.ctx.fillStyle = "white";   
            this.ctx.strokeStyle = "black";  
            this.ctx.lineWidth = 1;     

            this.ctx.textAlign = "center"; 
            this.ctx.textBaseline = "middle";

            let cTime =(this.world.player.deadTime(true));
            if(cTime==0){ this.world.keyboard.setBlocked(true); }
            if(cTime<=10){
                this.world.keyboard.setBlocked(false);
                statusText='CONTINUE? '+(10-cTime);
                
                if(this.world.keyboard.SPACE){
                    this.world.level.enemies.forEach((enemy) => {
                        enemy.health=1;
                        enemy.isHit();
                        enemy.revive(3000);
                    });
                    this.world.player.setInvincible(1000);
                    this.world.player.revive();
                }
            }
            if(cTime>10){
                this.world.gameover=true;
                statusText='GAME OVER';
            }
            this.ctx.fillText(statusText, this.cvs.width*.5, this.cvs.height*.5);
            this.ctx.strokeText(statusText, this.cvs.width*.5, this.cvs.height*.5);
        }else{
            this.ctx.font = "30px Arial";
            this.ctx.fillStyle = "red"; 
            this.ctx.strokeStyle = "white"; 
            this.ctx.lineWidth = 1;  

            this.ctx.textAlign = "left"; 
            this.ctx.textBaseline = "middle";

            for(let i = 0; i<this.world.player.health; i++){
                statusText+='♥';
            }
            this.ctx.fillText(statusText, 20, 40);
            this.ctx.strokeText(statusText, 20, 40);
        }
        
    }
   
}
