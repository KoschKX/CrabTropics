class World{

	cvs; ctx; cam; hud;
	keyboard; screen; audio; loadicon;
	gameover = false; paused = false;
	cache = true; debug = false; bosstest = false;

	level; levelmap; boss;

	clsnInterval; drawFramesId;

	frameRate = 120; elapsedTime = 0; lastTime; timestamp; lastUpdateTime; 

	constructor(cvs,scr,kbd,aud){
		this.cvs = cvs;  this.ctx = cvs.getContext('2d');
    	this.screen = scr; this.keyboard = kbd; this.audio = aud;
    	this.loadicon = new LoadIcon(canvas);
    	this.loadbar = new ProgressBar(canvas);
    	this.cam = new Camera(this);
    	this.hud = new HUD(this);


	}

	destroy(){
		cancelAnimationFrame(this.drawFramesId);
	}

	init(){

    	this.frameDuration = 1000 / this.frameRate;
		this.timestamp = 0; this.lastUpdateTime = 0; 

  		if(this.cache){
    		this.draw();
    	}else{
    		if(this.player.img){
		    	this.player.img.onload = () => { this.draw(); this.player.img.onload = null; };
			}
	    };
	    this.audio.playSound(this.level.ambient[0], 1.0, false, true);
		this.audio.playSound(this.level.music[0], 0.4, false, true);
	}

	restart(){
		this.unpause();
		this.elapsedTime = 0;
		this.gameover = false; 
		this.debug = false; 
		this.bosstest = false; this.boss = null;
		this.audio.reset();
		this.level.reset();
		this.destroy();
		this.init();
		this.player = this.level.player;
		this.player.revive(0);
	}

	load(levelmap){
		let newlevel = new Level(levelmap);
		this.level = newlevel;
		this.levelmap = levelmap;
		this.player = this.level.player;
	    this.ground = this.level.ground;
		this.level.setWorld(this); 
		this.level.preload(function(){
			this.world.init();
			this.world.screen.showControls();
		}); 
	}

/* DRAW */

	draw(timestamp) {

		// if(this.paused){ 
			//requestAnimationFrame((timestamp) => this.draw(timestamp)); return; 
		// }

		this.timestamp = timestamp; this.frameDuration = 1000 / this.frameRate;

		this.ctx.clearRect(0,0,this.cvs.width,this.cvs.height);

		this.ctx.save(); 

		this.updateCamera();

		this.tick(timestamp);

		this.addObjectsToMap(this.level.backgrounds.filter(background => background.layer === 0));
		this.addObjectsToMap(this.level.clouds);

		this.addObjectsToMap(this.level.backgrounds.filter(background => background.layer === 1));

		this.addObjectsToMap(this.level.enemies.filter(enemy => enemy.name === 'Ship'));
		this.addObjectsToMap(this.level.projectiles.filter(projectile => !projectile.falling && projectile.name === 'Cannonball'));
		this.addObjectsToMap(this.level.effects.filter(effect => effect.name === 'Explosion'));

		this.addObjectsToMap(this.level.backgrounds.filter(background => background.layer === 2));

		this.addObjectsToMap(this.level.projectiles.filter(projectile => projectile.name === 'XMark'));

		this.addObjectsToMap(this.level.enemies.filter(enemy => enemy.name === 'SeaTurtle'));

		this.addObjectsToMap(this.level.items.filter(item => item.name === 'Doubloon'));
		this.addObjectsToMap(this.level.items.filter(item => item.name === 'Catnip'));

		this.addObjectsToMap(this.level.enemies.filter(enemy => enemy.dead && enemy.name === 'Crab'));
		this.addToMap(this.player);
		this.addObjectsToMap(this.level.enemies.filter(enemy => !enemy.dead && enemy.name === 'Crab'));

		this.addObjectsToMap(this.level.effects.filter(effect => effect.name === 'Stomp'));
		
		this.addObjectsToMap(this.level.projectiles.filter(projectile => projectile.falling && projectile.name === 'Cannonball'));

		this.addObjectsToMap(this.level.backgrounds.filter(background => background.layer === 3));

		this.ctx.restore();

		this.hud.print();

		this.drawFramesId = requestAnimationFrame((timestamp) => this.draw(timestamp));
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

	updateCamera(){
		this.cam.update(
			[this.player.x, this.player.y], 
			[this.player.width*0.5, 0],
			this.level.bounds,
		);
	}

/* GAME */

	tick(timestamp) {
		if (this.paused) { this.lastUpdateTime = timestamp;  return;}

		let delta = this.timestamp - this.lastUpdateTime;

		if (!this.paused && (delta >= this.frameDuration)) {

			this.elapsedTime += delta;

			this.checkCollisions();
			this.checkDebugKey();
			this.checkBossTestKey();
			this.lastUpdateTime = this.timestamp;
			this.level.backgrounds.forEach(obj => obj.main?.(delta));
			this.level.clouds.forEach(obj => obj.main?.(delta));
			this.level.enemies.forEach(obj => obj.main?.(delta));
			this.level.projectiles.forEach(obj => obj.main?.(delta));
			this.level.effects.forEach(obj => obj.main?.(delta));
			this.level.items.forEach(obj => obj.main?.(delta));
			this.player.main(delta);
		}
	}

	pause(){
		this.paused = true;
		return this.paused; 
	}

	unpause(){
		this.paused = false;
		return this.paused; 
	}

/* COLLISION DETECTION */

	checkCollisions(){
		this.checkCollisionsItem();
		this.checkCollisionsProjectile();
		this.checkCollisionsEnemy();
	}

	checkCollisionsItem(){
		this.level.items.forEach((item) => {
			let colIA = this.player.isColliding(item,0,0);
			if(colIA){
				this.player.getItem(item);
			}
		});
	}

	checkCollisionsProjectile(){
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
				if(enemy.isBoss){ return; }
				let colPC = projectile.isColliding(enemy,0,0);
				if(colPC){
					if(projectile instanceof Cannonball && projectile.hostile && (!enemy.appearing)){
						enemy.isHit();
					}
				}
			});
		});
	}

	checkCollisionsEnemy(){
		this.level.enemies.forEach((enemy) => {
			let colA = this.player.isColliding(enemy,0,0);
			let colB = this.player.isColliding(enemy,1,1);
			if(colB){
				if(this.player.falling){
					let bopPoint = enemy.y+enemy.boxes[1][1]-(this.player.boxes[1][1]);
					if(enemy.isBoss==true && enemy.dead){ 
						this.player.bounce(17.5, bopPoint); 
						enemy.isHit();
					}else {
						if(!this.player.dead && (enemy.bounceoninjured || enemy.hostile) && (!enemy.appearing)){
							if(enemy.health>0){ this.player.bounce(17.5, bopPoint); }
							enemy.isHit();
						}
					}
				}
			}else if(colA){
				if(!((this.player.falling || this.player.bouncing) && colA==1) && enemy.hostile){
					this.player.isHit(true);
				}
			}
		});
	}

/* DEBUG */

	checkBossTestKey(){
		if(!this.boss && !this.bosstest && this.keyboard.TAB){
			this.callBoss();
		}
	}

	callBoss(){
		if(this.bosstest){ return; } 
		let self = this; this.level.preloadBoss(function(){
			console.log('Boss Loaded');
			self.boss = new SeaTurtle(1);
		  	self.boss.world = self;
		  	self.boss.init();

		  	self.boss.callBoss();

		  	self.boss.appearing = false; self.boss.static = true;
		  	self.level.enemies.push(self.boss);
		});
		this.bosstest = true;
	}

	toggleDebug(onoff){
		this.debug = onoff;
	}

	checkDebugKey(){
		if(!this.keyboard.KEYDOWN){ return; }
		this.toggleDebug(this.keyboard.CAPSLOCK);
	}
}