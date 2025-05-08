class SeaTurtle extends Enemy{

	name = 'SeaTurtle'; isboss = true;

	health = 30;

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

	IMAGES_SPLASH = new Anim('./img/waves/SPLASH_001.png', 30, 'repeat=0');
	
	imagesLib = [
		this.IMAGES_SHELL, this.IMAGES_IDLE, this.IMAGES_FLING, this.IMAGES_EAT, this.IMAGES_COLLAPSE, this.IMAGES_RETREAT, this.IMAGES_SLAP, 
		this.IMAGES_SPLASH,
	]
	aboxesLib = [this.IMAGES_EAT, this.IMAGES_COLLAPSE];

	introPlaying = false;
	introTick = 0;
	scale = 1;
	startwidth = this.width;
	startheight = this.height;

	splashes;

	constructor(){
		super(); 
	}

	init() {
		super.init();
		//this.intro();

		this.getAnimatedHitBoxes();

		this.activate();
	}

	main(){
		super.main();
		
		if(this.introPlaying){
			this.playIntro();
		}
	}

	isHit(){
		super.isHit(); 
		this.currImage=0; 
		if(this.health <= 0) clearTimeout(this.reviveTimout);
		this.world.audio.playSound(['crab_hitA','crab_hitB','crab_hitC']);
	}

	handleAnimation(){
		this.playAnimation(this.currImageSet);
		if(this.appearing && this.currImage == this.currImageSet.files.length - 1){
			this.appearing = false;
		}
		if(this.state == 1 && this.currImage == 10){
			let rstate = randomInt(0,100);
			if(rstate>66){ this.collapse(); }
		}
		if((this.state == 1 || this.state == 2 || this.state == 4 || this.state == 5) && this.currImage == this.currImageSet.files.length - 1){
			this.idle();
		}
		if(this.state == 3 && this.currImage == this.currImageSet.files.length - 1){
			this.currImage == 20;
			this.retreat();
		}
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
		this.x = (this.world.cvs.width  - this.width) * 0.5; 
		this.y = (this.world.cvs.height  - this.height) * (0.62 + (0.066 * this.scale)); 
		this.width = 320 * this.scale; this.height = 88 * this.scale; 

		if(this.scale>0.9 && !this.splashes){
			this.splashes  = new Movie('./img/waves/SPLASH_001.png', 3, 30, 0, 0, 740, 544);
			this.splashes.init();
			this.world.level.backgrounds.push(this.splashes);
		}
		if(this.scale==1.0){
			this.activate();
		}
	}

	activate(){
		this.boxes = []; 

		this.width = this.startwidth; this.height = this.startheight; 
		this.x = (this.world.cvs.width  - this.width) * 0.5; 
		this.y = (this.world.cvs.height  - this.height) * 0.33; 
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

	changeState(state){
		if(state == this.state){ return; }
		switch(state){
			case 0:
				this.idle();
				break;
			case 1:
				this.eat();
				break;
			case 2:
				this.fling();
				break;
			case 3:
				this.collapse();
				break;
			case 4:
				this.retreat();
				break;
			case 5:
				this.retreat();
				break;
			case 5:
				this.fling();
				break;
		}
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

	collapse(){
		if(this.state == 3){ return; }
		this.state = 3; this.currImage = 0; 
		this.changeAnimation(this.IMAGES_COLLAPSE);
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

	slap(){
		if(this.state == 5){ return; }
		this.state = 2; this.currImage = 0; 
		this.changeAnimation(this.IMAGES_SLAP);
	}

	destroy(){
		clearInterval(this.sttInterval); clearTimeout(this.retreatTimeout);
		this.world.level.enemies = destroy(this, this.world.level.enemies, this.world);
	}

	die(){
		this.destroy();
	}

	moveLeft(){}
	moveRight(){}

}