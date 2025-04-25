class World{
	
	level = level01;

	keyboard;
	ground = 350;
	gameover = false;

	cvs;
	ctx;

	debug = false;
	cache = true;

	constructor(cvs, keyboard){
		this.ctx = cvs.getContext('2d');
    	this.cvs = cvs;
	    this.keyboard = keyboard;

	    this.level.setWorld(this);
	    this.level.preload();

	    this.player = this.level.player;

	    this.init();
	}

	init(){
  		if(this.cache){
    		this.draw();
    	}else{
    		if(this.player.img){
		    	this.player.img.onload = () => {
			        this.draw();
			        this.player.img.onload = null;
			    };
			}
	    };

	    this.main();
	}

	main(){
		this.checkCollisions();
	}

	checkCollisions(){
		setInterval(() => {
			this.level.enemies.forEach((enemy) => {
				let colA = this.player.isColliding(enemy,0,0);
				let colB = this.player.isColliding(enemy,1,1);
				if(colB){
					
					if(
						this.player.falling && 
						colB==1 && 
						enemy instanceof Crab
					){

						if(!this.player.dead){
							//if(!enemy.dead){
								this.player.bounce(17.5, enemy.y-enemy.height);
								enemy.isHit();
							//}
						}
						
					}
				}else if(colA){
					if(
						(!this.player.hurt && !this.player.hurt && !this.player.invincible) && (!enemy.dead && !enemy.hurt) && 
						( colA==4 || colA==2 ) && 
						enemy instanceof Crab
					){
						this.player.isHit();
					}
				};
				
			});
		}, 1000 / 60);
	}

	draw() {
		this.ctx.clearRect(0,0,this.cvs.width,this.cvs.height);

		if(!this.player.img){ return false; }

		this.ctx.drawImage(this.player.img, this.player.x, this.player.y, this.player.width, this.player.height);

		this.addToMap(this.level.backgroundA);
		this.addObjectsToMap(this.level.clouds);

		this.addToMap(this.level.backgroundB);

		this.addObjectsToMap(this.level.enemies.filter(enemy => enemy.name === 'Ship'));

		this.addObjectsToMap(this.level.effects.filter(effect => effect.name === 'Explosion'));

		this.addToMap(this.level.backgroundC);

		this.addObjectsToMap(this.level.enemies.filter(enemy => enemy.dead && enemy.name === 'Crab'));

		this.addToMap(this.player);

		this.addObjectsToMap(this.level.enemies.filter(enemy => !enemy.dead && enemy.name === 'Crab'));

		this.printStatsBar();

		this.checkDebugKey();

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
		
		//mo.world=this;

		// FLICKER IF INVINCIBLE 
			if(mo.invincible&&mo.flicker(1)){ return ;}
	    
	    mo.cvs = this.cvs; 
	    this.ctx.save(); 
	    mo.handleFlip(this.ctx);
	    
	    if(this.debug && mo instanceof Character){
	    	mo.drawColliders(this.ctx);
	    }
	    this.ctx.restore(); 
	   
	}

	checkDebugKey(){
		this.debug = this.keyboard.CAPSLOCK
	}



}