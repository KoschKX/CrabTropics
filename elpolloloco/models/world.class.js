class World{
	player = new Player(this);
	level = level01;
	keyboard;
	ground = 350;
	gameover = false;

	cvs;
	ctx;

	debug = false;
	cache = false;

	constructor(cvs, keyboard){
    	this.ctx = cvs.getContext('2d');
    	this.cvs = cvs;


  		if(this.cache){
    		this.draw();
    	}else{
	    	this.player.img.onload = () => {
		        this.draw();
		        this.player.img.onload = null;
		    };
	    };
	   
	    this.keyboard = keyboard;
	   	
	   	this.checkCollisions();
	}

	checkCollisions(){
		setInterval(() => {
			this.level.enemies.forEach((enemy) => {
				if(this.player.isColliding(enemy)){
					let dir = this.player.getCollisionDirection(enemy);
					if(this.debug){
						console.log('Collision with ' + enemy.name + " : "+dir);
					}
					if(
						this.player.falling && 
						dir=='top' && 
						enemy instanceof Crab
					){
						if(!this.player.dead){
						//if(!enemy.dead){
							this.player.bounce(enemy.y-enemy.height*2);
							enemy.isHit();
						}
						//}
					}else{
						if(
							(!this.player.hurt && !this.player.hurt && !this.player.invincible) && (!enemy.dead && !enemy.hurt) && 
							( dir=='left' || dir=='right' ) && 
							enemy instanceof Crab
						){
							this.player.isHit();
						}
					}
				}
			});
		}, 1000 / 60);
	}

	draw() {
		this.ctx.clearRect(0,0,this.cvs.width,this.cvs.height);

		this.ctx.drawImage(this.player.img, this.player.x, this.player.y, this.player.width, this.player.height);

		

		this.addToMap(this.level.backgroundA);
		this.addObjectsToMap(this.level.clouds);

		this.addToMap(this.level.backgroundB);

		this.addObjectsToMap(this.level.enemies.filter(enemy => enemy.name === 'Ship'));

		this.addToMap(this.level.backgroundC);

		this.addObjectsToMap(this.level.enemies.filter(enemy => enemy.dead && enemy.name === 'Crab'));

		this.addToMap(this.player);

		this.addObjectsToMap(this.level.enemies.filter(enemy => !enemy.dead && enemy.name === 'Crab'));

		this.printStatsBar();

		self=this;
		requestAnimationFrame(function(){
			self.draw();
		});
	}

	printStatsBar(){
		
		let statusText = '';
		if(this.player.dead){
			this.ctx.font = "bold 60px Arial";
			this.ctx.fillStyle = "white";   
			this.ctx.strokeStyle = "black";  
			this.ctx.lineWidth = 1;     

			this.ctx.textAlign = "center"; 
			this.ctx.textBaseline = "middle";

			let cTime = (this.player.deadTime(true));
			if(cTime<=10){
				statusText='CONTINUE? '+(10-cTime);
				if(this.keyboard.SPACE){
					this.level.enemies.forEach((enemy) => {
						enemy.health=1;
						enemy.isHit();
						enemy.revive(3000);
					});
					this.player.revive();
				}
			}
			if(cTime>10){
				this.gameover=true;
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

			for(let i = 0; i<this.player.health; i++){
				statusText+='♥';
			}
			this.ctx.fillText(statusText, 20, 40);
			this.ctx.strokeText(statusText, 20, 40);
		}
		
	}

	addObjectsToMap(objects){
		objects.forEach(obj => {
			this.addToMap(obj);
		});
	}

	addToMap(mo) {

		// FLICKER IF INVINCIBLE 
			if(mo.invincible&&mo.flicker(1)){ return ;}
	    
	    mo.cvs = this.cvs; 
	    this.ctx.save(); 
	    mo.handleFlip(this.ctx);
	    
	    if(this.debug){
	    	mo.drawCollider(this.ctx);
	    }
	    this.ctx.restore(); 
	   
	}


}