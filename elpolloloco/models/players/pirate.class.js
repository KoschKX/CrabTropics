class Pirate extends Player{

	name = 'Pirate';

	health = 3; starthealth = 3; 
	frameRate = 24; useGravity = true; 
	speed = 3; frameRate = 24;

	groundOffset = -64;
	//flipOffset = [-this.width*0.25, 0];

	boxes = [
				[this.width*0.33, this.height*0.25, this.width*0.36, this.height*0.5, 'red', true],
				[this.width*0.33, this.height*0.75, this.width*0.36, this.height*0.1, 'yellow', true]
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

	noRepeat = ['JUMP'];

	imagesLib = [
		this.IMAGES_IDLE, this.IMAGES_WALK, this.IMAGES_JUMP, 
		this.IMAGES_HURT, this.IMAGES_DIE,
	]

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

}