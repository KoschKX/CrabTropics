class World{

	cvs; ctx; cam; hud;
	keyboard; screen; audio; loadicon;
	gameover = false; 
	cache = true; debug = false;

	level;

	constructor(cvs,scr,kbd,aud){
		this.cvs = cvs;  this.ctx = cvs.getContext('2d');
    	this.screen = scr; this.keyboard = kbd; this.audio = aud;
    	this.loadicon = new Loadicon(canvas);
    	this.cam = new Camera(this);
    	this.hud = new HUD(this);
	}

	init(){
  		if(this.cache){
    		this.draw();
    	}else{
    		if(this.player.img){
		    	this.player.img.onload = () => { this.draw(); this.player.img.onload = null; };
			}
	    };
	    this.main();
	}

	main(){
		this.checkCollisions();
	}

	load(level){
		this.level = level;

		this.player = this.level.player;
	    this.ground = this.level.ground;

		this.level.setWorld(this); 
		this.level.preload(function(){
			this.world.init();
			this.world.screen.showControls();
		}); 
	}

	checkCollisions(){
		setInterval(() => {
			this.level.projectiles.forEach((projectile) => {
				let colPA = this.player.isColliding(projectile,0,0);
				let colPB = this.player.isColliding(projectile,1,0);
				if(colPA){
					this.player.isHit(true);
				}
				if(colPB){
					if(projectile instanceof XMark){
						if(this.keyboard.DOWN) this.player.dig(projectile);
					}
				}
				this.level.enemies.forEach((enemy) => {
					let colPC = projectile.isColliding(enemy,0,0);
					if(colPC){
						if(projectile instanceof Cannonball && projectile.hostile){
							enemy.isHit();
						}
					}
				});
			});
			this.level.enemies.forEach((enemy) => {
				let colA = this.player.isColliding(enemy,0,0);
				let colB = this.player.isColliding(enemy,1,1);
				if(colB){
					if(this.player.falling && colB==1){
						if(!this.player.dead && enemy.hostile){
							this.player.bounce(17.5, enemy.y-enemy.height);
							enemy.isHit();
						}
					}
				}else if(colA){
					if(colA==4 || colA==2  && enemy.hostile){
						this.player.isHit(true);
					}
				}
			});
		}, 1000 / 60);
	}

	draw() {
		this.ctx.clearRect(0,0,this.cvs.width,this.cvs.height);

		if(!this.player.img){ this.ctx.restore(); return false; }

		this.ctx.save(); 

		this.cam.update(
			[this.player.x, this.player.y], 
			[this.player.width*0.5, 0],
			this.level.bounds,
		);

		this.addObjectsToMap(this.level.backgrounds.filter(background => background.layer === 0));
		this.addObjectsToMap(this.level.clouds);

		this.addObjectsToMap(this.level.backgrounds.filter(background => background.layer === 1));

		this.addObjectsToMap(this.level.enemies.filter(enemy => enemy.name === 'Ship'));
		this.addObjectsToMap(this.level.projectiles.filter(projectile => !projectile.falling && projectile.name === 'Cannonball'));
		this.addObjectsToMap(this.level.effects.filter(effect => effect.name === 'Explosion'));
		
		this.addObjectsToMap(this.level.backgrounds.filter(background => background.layer === 2));

		this.addObjectsToMap(this.level.projectiles.filter(projectile => projectile.name === 'XMark'));
		
		this.addObjectsToMap(this.level.enemies.filter(enemy => enemy.dead && enemy.name === 'Crab'));
		this.addToMap(this.player);
		this.addObjectsToMap(this.level.enemies.filter(enemy => !enemy.dead && enemy.name === 'Crab'));
		
		this.addObjectsToMap(this.level.projectiles.filter(projectile => projectile.falling && projectile.name === 'Cannonball'));

		this.ctx.restore();

		this.hud.print();
		this.checkDebugKey();

		self=this;
		requestAnimationFrame(function(){
			self.draw();
		});
	}

	addObjectsToMap(objects){
		objects.forEach(obj => { this.addToMap(obj); });
	}

	addToMap(mo) {

		// FLICKER IF INVINCIBLE 
			if(mo.flickering&&mo.flicker(1)){ return ;}
	    
	    this.ctx.save(); 
	    mo.draw(this.ctx);

	    if(this.debug && mo instanceof Character){
	    	mo.drawColliders(this.ctx);
	    }
	    this.ctx.restore(); 
	}

	checkDebugKey(){
		this.debug = this.keyboard.CAPSLOCK
	}
}