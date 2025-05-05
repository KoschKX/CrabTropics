class Pirate extends Player{

	name = 'Pirate';

	health = 3; starthealth = 3; 
	frameRate = 24; useGravity = true; 
	speed = 3; frameRate = 24;

	groundOffset = -64;
	//flipOffset = [-this.width*0.25, 0];

	digging = false;
	currXmark;

	boxes = [
				[this.width*0.33, this.height*0.20, this.width*0.36, this.height*0.65, 'red', true],
				[this.width*0.33, this.height*0.85, this.width*0.36, this.height*0.15, 'yellow', true]
			]


	IMAGES_IDLE = [
		'./img/kit/IDLE_001.png', './img/kit/IDLE_001.png', 
		'./img/kit/IDLE_002.png', './img/kit/IDLE_002.png', 
		'./img/kit/IDLE_003.png', './img/kit/IDLE_003.png',
		'./img/kit/IDLE_004.png', './img/kit/IDLE_004.png',
		'./img/kit/IDLE_005.png', './img/kit/IDLE_005.png',
		'./img/kit/IDLE_006.png', './img/kit/IDLE_006.png',
		'./img/kit/IDLE_007.png', './img/kit/IDLE_007.png',
		'./img/kit/IDLE_006.png', './img/kit/IDLE_006.png', 
		'./img/kit/IDLE_005.png', './img/kit/IDLE_005.png', 
		'./img/kit/IDLE_004.png', './img/kit/IDLE_004.png', 
		'./img/kit/IDLE_003.png', './img/kit/IDLE_003.png',
		'./img/kit/IDLE_002.png', './img/kit/IDLE_002.png',
	];

	IMAGES_WALK = [
		'./img/kit/RUN_001.png',
		'./img/kit/RUN_002.png',
		'./img/kit/RUN_003.png',
		'./img/kit/RUN_004.png',
		'./img/kit/RUN_005.png',
		'./img/kit/RUN_006.png',
		'./img/kit/RUN_007.png',
		'./img/kit/RUN_008.png',
		'./img/kit/RUN_009.png',
		'./img/kit/RUN_010.png',
		'./img/kit/RUN_011.png',
		'./img/kit/RUN_012.png',
		'./img/kit/RUN_013.png',
		'./img/kit/RUN_014.png',
	];

	IMAGES_JUMP = [
		'./img/kit/JUMP_001.png', './img/kit/JUMP_001.png',
		'./img/kit/JUMP_002.png', './img/kit/JUMP_002.png',
		'./img/kit/JUMP_003.png', './img/kit/JUMP_004.png',
		'./img/kit/JUMP_005.png', './img/kit/JUMP_006.png',
		'./img/kit/JUMP_007.png',
		'*norepeat',
	];

	IMAGES_HURT = [
		'./img/kit/JUMP_001.png', './img/kit/JUMP_001.png','./img/kit/JUMP_002.png',
		'./img/kit/JUMP_003.png', './img/kit/JUMP_004.png',
		//'./img/pirate/HURT_001.png', './img/pirate/HURT_002.png', './img/pirate/HURT_003.png',
		//'./img/pirate/HURT_004.png',
		//'./img/pirate/HURT_005.png',
		//'./img/pirate/HURT_006.png',
	];

	IMAGES_DIE = [
		'./img/kit/DIE_001.png', './img/kit/DIE_002.png', './img/kit/DIE_003.png',
		'./img/kit/DIE_004.png', './img/kit/DIE_005.png', './img/kit/DIE_006.png',
		'./img/kit/DIE_007.png', './img/kit/DIE_008.png', './img/kit/DIE_009.png',
		'./img/kit/DIE_010.png', './img/kit/DIE_011.png', './img/kit/DIE_012.png',
		'./img/kit/DIE_013.png', './img/kit/DIE_014.png', './img/kit/DIE_015.png',
		'./img/kit/DIE_016.png',
	];

	IMAGES_DIG = [
		'./img/kit/DIG_001.png', './img/kit/DIG_003.png',
		'./img/kit/DIG_004.png', './img/kit/DIG_006.png',
		'./img/kit/DIG_007.png', './img/kit/DIG_009.png',
		'./img/kit/DIG_010.png', './img/kit/DIG_012.png',
		'./img/kit/DIG_013.png', './img/kit/DIG_014.png',
	];

	noRepeat = ['JUMP'];

	imagesLib = [
		this.IMAGES_IDLE, this.IMAGES_WALK, this.IMAGES_JUMP, 
		this.IMAGES_HURT, this.IMAGES_DIE, this.IMAGES_DIG,
	]

	lastMark = 0; maxMarks = 3; spotting = true;

	constructor(){
		super();
	}

	init() {
		super.init();
		this.loadImage('./img/kit/IDLE_001.png');
		this.currImageSet = this.IMAGES_IDLE;
		this.loadImages(this.currImageSet);
	}

	main(){
		super.main();
		this.xMarkSpotting();
	}

	cache(){
		this.cacheImages(this.IMAGES_IDLE);
		this.cacheImages(this.IMAGES_WALK);
		this.cacheImages(this.IMAGES_JUMP);
		this.cacheImages(this.IMAGES_HURT);
		this.cacheImages(this.IMAGES_DIE);

		super.cacheImages();
	}

	handleAnimation(){
		if(!this.world){ return; }
		
		this.hurt=this.isHurt();

		if(this.dead){
			this.changeAnimation(this.IMAGES_DIE);
		}else if(this.digging){
			if(this.currImage == this.currImageSet.length -1 ){
				this.currXmark.destroy(); this.currXmark.buried=false; this.currXmark = false;
				this.invincible = false; this.digging = false; this.static=false;
			}
			this.changeAnimation(this.IMAGES_DIG);
		}else if(this.hurt && !this.invincible){
			this.changeAnimation(this.IMAGES_HURT);
		}else{
			if(this.bouncing){
				this.changeAnimation(this.IMAGES_JUMP);
	    	}else{
	    		if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT){
		    		this.changeAnimation(this.IMAGES_WALK);
		    	}else{
		    		this.changeAnimation(this.IMAGES_IDLE);
		    	}
			}
		}
		this.playAnimation(this.currImageSet);
	}

	dig(xmark){
		if(!xmark.buried || this.digging){ return; }
		this.currImage = 0;
		this.digging=true; this.static=true; this.invincible = true;
		this.currXmark=xmark;
	}

	xMarkSpotting() {

		if(!this.world || !this.world.level){ return; }
		if(!this.spotting){ return; }

	 	const rDelay = randomInt(100,100000);
	 	const now = Date.now();

  		this.xmarks = this.world.level.projectiles.filter(rojectile => rojectile.name === 'XMark');

  		if(now - this.lastMark < rDelay || this.xmarks.length>=this.maxMarks){ 
  			return;
  		}

		  	let mark = new XMark(true);

	  		let markCenterX = randomInt(0, this.world.level.bounds[2]) - (mark.width*0.5);
	  		let markCenterY = this.world.ground + (mark.height*0.5) + 36;

  			mark.x = markCenterX; mark.y = markCenterY;
	  		mark.world = this.world;

  		this.world.level.projectiles.push(mark);

  		this.world.audio.playSound('xmark_appearA');

  		this.lastMark = new Date().getTime();
		  		
	}


}