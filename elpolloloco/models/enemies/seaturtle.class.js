/**
 * A SeaTurtle. Not a Teenage Mutant.
 */
class SeaTurtle extends Enemy {

	/** START VALUES */
	name = 'SeaTurtle';
	width = 1280;
	height = 1280;	
	x = 0;
	y = 0;
	groundOffset = 0;
	frameRate = 24;
	health = 9;
	maxHealth = 9;
	useGravity = false;
	hostile = false;
	bounceoninjured = true;
	attacksEnemies = true;
	static = true;
	isBoss = true;

	/** ANIMATIONS */
	IMAGES_SHELL = new Anim('./img/seaturtle/SHELL_001.png', 25, '');
	IMAGES_IDLE = new Anim('./img/seaturtle/IDLE_001.png', 20, '');
	IMAGES_FLING = new Anim('./img/seaturtle/FLING_001.png', 25, '');
	IMAGES_EAT = new Anim('./img/seaturtle/EAT_001.png', 35, 'repeat=0');
	IMAGES_SLAP = new Anim('./img/seaturtle/SLAP_001.png', 35, 'repeat=0');
	IMAGES_COLLAPSE = new Anim('./img/seaturtle/COLLAPSE_001.png', 20, 'repeat=0');
	IMAGES_RETREAT = new Anim('./img/seaturtle/RETREAT_001.png', 16, 'repeat=0');
	IMAGES_DIE = new Anim('./img/seaturtle/DIE_001.png', 45, 'repeat=0');
	imagesLib = [
		this.IMAGES_SHELL, this.IMAGES_IDLE, this.IMAGES_FLING, this.IMAGES_EAT, this.IMAGES_COLLAPSE, this.IMAGES_RETREAT, this.IMAGES_SLAP, this.IMAGES_DIE,
	];
	aboxesLib = [ 
		this.IMAGES_EAT, this.IMAGES_FLING, this.IMAGES_COLLAPSE, this.IMAGES_DIE 
	];

	/** HITBOXES **/
	boxes = [];
	aboxes = [];

	/** UNIQUE. */
	state = -1;
	sttInterval;
	retreatTimer;
	introPlaying = false;
	introTick = 0;
	scale = 1;
	startwidth = this.width;
	startheight = this.height;
	splashes;
	splashType = 1;
	splashStopFrame = 30;
	splashFadingOut = false;
	crater;

	/**
	 * @param Creates the Sea Turtle.
	 * @param {World} The World.
	 * @param {boolean} immediate Whether to initialize immediately.
	 */
	constructor(world, immediate=false){
		super(world); 
		this.generateStamp(this.name);

		// COMPATIBILITY FOR SAFARI ON IOS
		if(vidFormat=='mp4'){ this.splashType = 0; }

		if(this.splashType == 0){
			this.IMAGES_SPLASH = new Anim('./img/waves/SPLASH_001.png', 40, 'repeat=0');
			this.imagesLib.push(this.IMAGES_SPLASH);
		}
		if(this.splashType == 1){
			this.splashStopFrame -= 1;
		}
		if(immediate){ init(); }
	}

	/**
	 * Destroys the SeaTurtle instance and cleans up.
	 */
	destroy(){
		super.destroy();
		this.world.clearRepeater(this.sttInterval); 
		this.world.clearTimer(this.retreatTimer);
		this.world.level.enemies = destroy(this, this.world.level.enemies, this.world);
		if(this.splashes){ this.splashes.destroy(); this.splashes = null; }
		if(this.crater){ this.crater.destroy(); this.crater = null; }
	}

	/**
	 * Initializes the SeaTurtle, resetting its properties.
	 */
	init() {
		super.init();
		this.introPlaying = false; 
		this.introTick = 0; 
		this.scale = 1;
		this.width = this.startwidth; 
		this.height = this.startheight;
		this.getAnimatedHitBoxes();
	}

	/**
	 * Starts the intro sequence, playing the SeaTurtle's appearance animation.
	 */
	callBoss(){
		this.world.audio.playSound('seaturtle_hornA', 0.5, true);
		this.intro();
	}

	/**
	 * Main update loop for the SeaTurtle, checks its health and handles animation.
	 * @param {number} delta Time delta for the frame update.
	 */
	main(delta){
		super.main(delta);
		if(this.introPlaying){
			this.playIntro();
		}
		if(this.health <= 0){
			this.die();
		}
	}

	/**
	 * Handles when the SeaTurtle is hit.
	 */
	isHit(){
		super.isHit(); 
		if(!this.dead && this.health > 0) { 
			this.currImage = 0; 
			this.world.audio.playSound('seaturtle_hitA', 1.0); 
		}
		if(this.health <= 0) this.world.clearTimer(this.reviveTimer);
	}

	/**
	 * Handles the SeaTurtle's animations based on its current state.
	 */
	handleAnimation(){

		if(this.world.debug && this.world.keyboard.ENTER){
			this.die();
		}

		if(this.dead && this.currImage == this.currImageSet.files.length - 1){ 
			this.animateCollisionBoxes(); 
			return; 
		}

		if(this.appearing && this.currImage == this.currImageSet.files.length - 1){
			this.appearing = false;
		}
		if(this.state == 1 && this.currImage == 25){
			let rstate = randomInt(0,100);
			if(rstate>66){ 
				this.collapse(); 
			} else { 
				this.world.audio.playSound('seaturtle_biteA', 0.66); 
			}
		}
		if(this.state == 2 && this.currImage == 15){
			this.world.audio.playSound('seaturtle_flingA', 1.0);
		}
		if(this.state == 5 && this.currImage == 0){
			this.world.audio.playSound('seaturtle_collapseA', 0.33);
		}
		if((this.state == 1 || this.state == 2 || this.state == 4) && 
			this.currImage == this.currImageSet.files.length - 1){
			this.idle();
		}
		if(this.state == 5 && this.currImage == this.currImageSet.files.length - 1){
			this.retreat();
		}
		if(this.splashes){ this.playCrash(); }

		this.playAnimation(this.currImageSet);
		this.animateCollisionBoxes();
	}

	/**
	 * Handles the SeaTurtle's movement. (Currently not implemented)
	 */
	handleMovement(){}

	/**
	 * Handles the intro animation of the SeaTurtle.
	 */
	intro(){
		this.boxes = []; 
		this.state = -1;
		this.scale = 0; 
		this.width = 320 * this.scale; 
		this.height = 88 * this.scale; 
		this.loadImage(this.IMAGES_SHELL.files[0]);
		this.changeAnimation(this.IMAGES_SHELL);
		this.introPlaying = true;
	}

	/**
	 * Plays the intro animation.
	 */
	playIntro(){
		if(!this.introPlaying){ return; }
		this.scale = Math.min(this.scale + 0.0025, 1.0);
		this.x = (this.world.level.bounds[2] - this.width) * 0.5; 
		this.y = (this.world.level.bounds[3]  - this.height) * (0.645 + (0.066 * this.scale)); 
		this.width = 720 * this.scale; 
		this.height = 100 * this.scale; 
		if(this.scale > 0.75 && !this.splashes){
			if(this.splashType == 1){
				let check = document.querySelector('#cache [src="' + this.path + '"]');
				this.splashes = new Movie(this.world, './img/waves/SPLASH_001.webm', 4, 0, this.world.level.bounds[0], this.world.level.bounds[1], this.world.level.bounds[2], this.world.level.bounds[3] * 1.133, 30, true);
				this.world.level.createVideo(this.splashes, './img/waves/SPLASH_001.webm', !check, false, false);
				this.splashes.pause(true);
			}else {
				this.splashes  = new Movie(this.world, './img/waves/SPLASH_001.png', 4, 40, this.world.level.bounds[0], this.world.level.bounds[1], this.world.level.bounds[2], this.world.level.bounds[3] * 1.133);
			}
			this.splashes.world = this.world;
			this.splashes.init();
			this.world.level.backgrounds.push(this.splashes);
		}
		if(this.scale == 1.0){
			this.activate();
		}
	}

	/**
	 * Plays the crash animation when the SeaTurtle lands.
	 */
	playCrash(){
		if(!this.splashes){ return; }
		this.world.player.invincible = true; 
		this.world.player.flickering = true;
		if(this.scale > 0.75 && this.scale < 1.0){  
			this.world.level.enemies.forEach((enemy) => {
	            if(!enemy.isBoss && enemy.health > 0 && enemy.hostile){ 
					enemy.health = 1; 
					enemy.isHit(); 
				}
	        });
		}
		/*
		if(!this.splashes.isPlaying && this.scale >= 1.0 && !this.splashes.isPlaying){ 
			this.splashes.play(true); 
		}
		*/
		if(!this.splashFadingOut && this.splashes.currImage >= this.splashStopFrame){ 
			if(this.scale >= 1.0){
				this.splashFadingOut = true;
				this.splashes.play(true); 
				console.log('play');
			}else{
				if(this.splashes.isPlaying){ 
					this.splashes.pause(true); 
					console.log('pause');
				} 
				this.splashes.videoSeek(this.splashStopFrame);
			}
		}
		if(this.splashes.currImage > 0 && this.splashes.currImage >= this.splashes.frames -1){ 
			this.splashes.destroy(); 
			this.splashes = null;
			this.world.player.flickering = false; 
			this.world.player.invincible = false;
			console.log('destroyed');
		}
	}

	/**
	 * Activates the SeaTurtle, starting its behavior and animations.
	 */
	activate(){
		this.boxes = []; 
		this.width = this.startwidth; 
		this.height = this.startheight; 
		this.x = (this.world.level.bounds[2] - this.width) * 0.5; 
		this.y = (this.world.level.bounds[3] - this.height) * 0.15; 
		this.introPlaying = false;

		this.crater = new Background(this.world, './img/misc/craterA.png', 2, 0, 0, this.width * 0.512, this.height * 0.192);
		this.crater.x = this.x + ((this.width - this.crater.width) * 0.5); 
		this.crater.y = this.y + ((this.height - this.crater.height) * 0.5) + this.crater.height * 0.45;
		this.world.level.backgrounds.push(this.crater);
		this.crater.init();

		this.appear(); 
		this.behavior();

		this.world.audio.stopAllMusic();
		this.world.audio.playMusic('sueno_tropical');

		this.hostile = true;
	}

	/**
	 * The SeaTurtle's behavior during the fight.
	 */
	behavior(){
		this.state = 0;
		let self = this; 
		this.sttInterval = this.world.setRepeater(function(){
			let rstate = randomInt(1, 2);
			if(self.state == 0){
				self.changeState(rstate);
			}
		}, 2000 ); 	
	}

	/**
	 * Changes the SeaTurtle's state and triggers the corresponding animation.
	 * @param {number} state The new state for the SeaTurtle.
	 */
	changeState(state) {
		if (state === this.state) return;
		const actions = [
			this.idle, this.bite, this.fling, this.slap, this.retreat, this.collapse, this.die
		];
		const action = actions[state];
		if (action) action.call(this);
	}
	
	/**
	 * Makes the SeaTurtle appear.
	 */
	appear(){
		if(this.state == 0){ return; }
		this.state = 0; 
		this.currImage = 0; 
		this.loadImage(this.IMAGES_IDLE.files[0]);
		this.changeAnimation(this.IMAGES_IDLE);
	}

	/**
	 * Makes the SeaTurtle idle.
	 */
	idle(){
		if(this.state == 0){ return; }
		this.state = 0; 
		this.currImage = 0; 
		this.changeAnimation(this.IMAGES_IDLE);
	}

	/**
	 * Makes the SeaTurtle bite.
	 */
	bite(){
		if(this.state == 1){ return; }
		this.state = 1; 
		this.currImage = 0; 
		this.changeAnimation(this.IMAGES_EAT);
	}
	
	/**
	 * Makes the SeaTurtle fling.
	 */
	fling(){
		if(this.state == 2){ return; }
		this.state = 2; 
		this.currImage = 0; 
		this.changeAnimation(this.IMAGES_FLING);
	}

	/**
	 * Makes the SeaTurtle slap.
	 */
	slap(){
		if(this.state == 3){ return; }
		this.state = 3; 
		this.currImage = 0; 
		this.changeAnimation(this.IMAGES_SLAP);
	}

	/**
	 * Makes the SeaTurtle retreat.
	 */
	retreat(){
		if(this.state == 4 || this.retreatTimer){ return; }
		this.world.clearTimer(this.retreatTimer);
		let self = this; 
		this.retreatTimer = this.world.setTimer(function(){
			self.state = 4; 
			self.currImage = 0; 
			self.changeAnimation(self.IMAGES_RETREAT);
			self.retreatTimer = false;
		}, 2000);
	}

	/**
	 * Makes the SeaTurtle collapse.
	 */
	collapse(){
		if(this.state == 5){ return; }
		this.state = 5; 
		this.currImage = 0; 
		this.changeAnimation(this.IMAGES_COLLAPSE);
	}

	/**
	 * Makes the SeaTurtle die.
	 */
	die(){
		if(this.state == 6 || this.dead){ return; }
		this.world.clearTimer(this.retreatTimer); 
		this.world.clearTimer(this.reviveTimer);
		this.state = 6; 
		this.currImage = 0; 
		this.changeAnimation(this.IMAGES_DIE);
		this.dead = true;
		this.world.audio.playSound('seaturtle_growlA', 1.0);
	}

	/**
	 * No Movement for ol' turtle man.
	 */
	moveLeft(){}
	moveRight(){}

	/**
	 * No Revive.
	 */
	revive(){}

}