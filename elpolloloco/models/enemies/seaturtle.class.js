class SeaTurtle extends Enemy{

	name = 'SeaTurtle'; isBoss = true;

	health = 9;  maxHealth = 9; 

	x=0; y=0; width = 1000; height = 1000; groundOffset = 0;

	frameRate = 24; useGravity = false; static = true;
	
	boxes = []; aboxes = [];

	hostile = false; stomp; bounceoninjured = true;

	state = -1; sttInterval; retreatTimeout;

	IMAGES_SHELL = new Anim('./img/seaturtle/SHELL_001.png', 1, '');
	IMAGES_IDLE = new Anim('./img/seaturtle/IDLE_001.png', 20, '');
	IMAGES_FLING = new Anim('./img/seaturtle/FLING_001.png', 25, '');
	IMAGES_EAT = new Anim('./img/seaturtle/EAT_001.png', 25, 'repeat=0');
	IMAGES_SLAP = new Anim('./img/seaturtle/SLAP_001.png', 35, 'repeat=0');
	IMAGES_COLLAPSE = new Anim('./img/seaturtle/COLLAPSE_001.png', 20, 'repeat=0');
	IMAGES_RETREAT = new Anim('./img/seaturtle/RETREAT_001.png', 16, 'repeat=0');
	IMAGES_DIE = new Anim('./img/seaturtle/DIE_001.png', 45, 'repeat=0');

	imagesLib = [
		this.IMAGES_SHELL, this.IMAGES_IDLE, this.IMAGES_FLING, this.IMAGES_EAT, this.IMAGES_COLLAPSE, this.IMAGES_RETREAT, this.IMAGES_SLAP, this.IMAGES_DIE,
	]
	aboxesLib = [ 
		this.IMAGES_EAT, this.IMAGES_FLING, this.IMAGES_COLLAPSE, this.IMAGES_DIE 
	];

	introPlaying = false;
	introTick = 0;
	scale = 1;
	startwidth = this.width;
	startheight = this.height;
	splashes; splashType = 1; splashStopFrame = 30;

	constructor(){
		super(); 
		this.generateStamp(this.name);
		if(this.splashType==0){
			this.IMAGES_SPLASH = new Anim('./img/waves/SPLASH_001.png', 40, 'repeat=0');
			this.imagesLib.push(this.IMAGES_SPLASH);
		}
		if(this.splashType==1){
			this.splashStopFrame -= 1;
		}
	}

	destroy(){
		super.destroy();
		clearInterval(this.sttInterval); clearTimeout(this.retreatTimeout);
		this.world.level.enemies = destroy(this, this.world.level.enemies, this.world);
		if(this.splashes){ this.splashes.destroy(); this.splashes = null; }
	}

	init() {
		super.init();

		this.introPlaying=false; this.introTick = 0; this.scale = 1;
		this.width = this.startwidth; this.height = this.startheight;

		this.getAnimatedHitBoxes();
	}

	callBoss(){
		this.intro();
		//this.activate();
	}

	main(delta){
		super.main(delta);
		
		if(this.introPlaying){
			this.playIntro();
		}

		if(this.health<=0){
			this.die();
		}
	}

	isHit(){
		super.isHit(); 
		if(!this.dead){ this.currImage=0; }
		if(this.health <= 0) clearTimeout(this.reviveTimout);
		this.world.audio.playSound(['crab_hitA','crab_hitB','crab_hitC']);
	}

	handleAnimation(){
		if(this.dead && this.currImage == this.currImageSet.files.length - 1){ this.animateCollisionBoxes(); return; }

		this.playAnimation(this.currImageSet);

		if(this.appearing && this.currImage == this.currImageSet.files.length - 1){
			this.appearing = false;
		}
		if(this.state == 1 && this.currImage == 10){
			let rstate = randomInt(0,100);
			if(rstate>66){ this.collapse(); }
		}
		if((this.state == 1 || this.state == 2 || this.state == 4) && this.currImage == this.currImageSet.files.length - 1){
			this.idle();
		}
		if(this.state == 5 && this.currImage == this.currImageSet.files.length - 1){
			this.currImage == 20;
			this.retreat();
		}
		if(this.splashes){ this.playCrash(); }

		this.animateCollisionBoxes();
	}

	handleMovement(){}

	intro(){
		this.boxes = []; 
		this.state = -1;
		this.scale = 0; this.width = 320 * this.scale; this.height = 88 * this.scale; 
		this.loadImage(this.IMAGES_SHELL.files[0]);
		this.changeAnimation(this.IMAGES_SHELL);
		this.introPlaying=true;
	}

	playIntro(){
		if(!this.introPlaying){ return; }
		this.scale = Math.min(this.scale + 0.0025, 1.0);
		this.x = (this.world.level.bounds[2] - this.width) * 0.5; 
		this.y = (this.world.level.bounds[3]  - this.height) * (0.62 + (0.066 * this.scale)); 
		this.width = 320 * this.scale; this.height = 88 * this.scale; 
		if(this.scale>0.5 && !this.splashes){
			if(this.splashType==1){
				let check = document.querySelector('#cache [src="' + this.path + '"]');
				this.splashes  = new Movie('./img/waves/SPLASH_001.webm', 3, 0, 0, 0, 740, 544, 30, true);
				this.world.level.createVideo(this.splashes, './img/waves/SPLASH_001.webm', !check, false, false);
				this.splashes.pause(true);
			}else {
				this.splashes  = new Movie('./img/waves/SPLASH_001.png', 3, 40, 0, 0, 740, 544);
			}
			this.splashes.world = this.world;
			this.splashes.init();
			this.world.level.backgrounds.push(this.splashes);
		}
		if(this.scale==1.0){
			this.activate();
		}
	}

	playCrash(){
		if(!this.splashes){ return; }
		this.world.player.invincible = true; this.world.player.flickering = true;
		if(this.scale < 1.0 && this.splashes.currImage > 15){  
			this.world.level.enemies.forEach((enemy) => {
	            if(!enemy.isBoss && enemy.health>0 && enemy.hostile){ enemy.health=1; enemy.isHit(); }
	        });}
		if(this.scale < 1.0 && (this.splashes.currImage == this.splashStopFrame)){ 
			if(this.splashes.isPlaying){ this.splashes.pause(true); } 
			this.splashes.videoSeek(this.splashStopFrame);
		}
		if(this.scale >= 1.0 && !this.splashes.isPlaying){ 
			this.splashes.play(true); 
		}
		if(this.splashes.currImage>0 && this.splashes.currImage >= this.splashes.frames){ 
			this.splashes.destroy(); this.splashes=null;
			this.world.player.flickering = false; this.world.player.invincible = false;
		}
	}

	activate(){
		this.boxes = []; 

		this.width = this.startwidth; this.height = this.startheight; 
		this.x = (this.world.level.bounds[2] - this.width) * 0.5; 
		this.y = (this.world.level.bounds[3] - this.height) * 0.33; 
		this.introPlaying = false;

		this.appear(); 
		this.behavior();

		this.hostile = true;
	}

	behavior(){
		this.state = 0;
		let self = this; this.sttInterval = setInterval(function(){
			let rstate = randomInt(1,2);
			if(self.state == 0){
				self.changeState(rstate);
			}
		}, 2000 ); 	
	}

	changeState(state) {
		if (state === this.state) return;
		const actions = [
			this.idle, this.eat, this.fling, this.slap, this.retreat, this.collapse, this.die
		];
		const action = actions[state];
		if (action) action.call(this);
	}
	
	appear(){
		if(this.state == 0){ return; }
		this.state = 0; this.currImage = 0; 
		this.loadImage(this.IMAGES_IDLE.files[0]);
		this.changeAnimation(this.IMAGES_IDLE);
	}

	idle(){
		if(this.state == 0){ return; }
		this.state = 0; this.currImage = 0; 
		this.changeAnimation(this.IMAGES_IDLE);
	}

	eat(){
		if(this.state == 1){ return; }
		this.state = 1; this.currImage = 0; 
		this.changeAnimation(this.IMAGES_EAT);
	}
	
	fling(){
		if(this.state == 2){ return; }
		this.state = 2; this.currImage = 0; 
		this.changeAnimation(this.IMAGES_FLING);
	}

	slap(){
		if(this.state == 3){ return; }
		this.state = 3; this.currImage = 0; 
		this.changeAnimation(this.IMAGES_SLAP);
	}

	retreat(){
		if(this.state == 4 || this.retreatTimeout){ return; }
		clearTimeout(this.retreatTimeout);
		let self = this; this.retreatTimeout = setTimeout(function(){
			self.state = 4; 
			self.currImage = 0; 
			self.changeAnimation(self.IMAGES_RETREAT);
			self.retreatTimeout = false;
		}, 2000);
	}

	collapse(){
		if(this.state == 5){ return; }
		this.state = 5; this.currImage = 0; 
		this.changeAnimation(this.IMAGES_COLLAPSE);
	}

	die(){
		if(this.state == 6 || this.dead){ return; }
		clearTimeout(this.retreatTimeout); clearTimeout(this.reviveTimout);
		this.state = 6; this.currImage = 0; 
		this.changeAnimation(this.IMAGES_DIE);
		this.dead = true;
	}

	moveLeft(){}

	moveRight(){}

}