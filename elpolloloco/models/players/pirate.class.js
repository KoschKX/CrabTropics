class Pirate extends Player{

	name = 'Pirate';

	health = 3; starthealth = 3; 
	frameRate = 24; useGravity = true; 
	speed = 3; frameRate = 24;

	groundOffset = -64;
	flipOffset = [-this.width*0.25, 0];

	boxes = [
				[this.width*0.25, this.height*0.33, this.width*0.25, this.height*0.5, 'red', true],
				[this.width*0.25, this.height*0.75, this.width*0.25, this.height*0.1, 'yellow', true]
			]

	IMAGES_IDLE = [
		'./img/pirate/IDLE_000.png',
		'./img/pirate/IDLE_001.png',
		'./img/pirate/IDLE_002.png',
		'./img/pirate/IDLE_003.png',
		'./img/pirate/IDLE_004.png',
		'./img/pirate/IDLE_005.png',
		'./img/pirate/IDLE_006.png',
	];

	IMAGES_WALK = [
		'./img/pirate/WALK_000.png',
		'./img/pirate/WALK_001.png',
		'./img/pirate/WALK_002.png',
		'./img/pirate/WALK_003.png',
		'./img/pirate/WALK_004.png',
		'./img/pirate/WALK_005.png',
		'./img/pirate/WALK_006.png',
	];

	IMAGES_JUMP = [
		'./img/pirate/JUMP_001.png',
		'./img/pirate/JUMP_002.png',
		'./img/pirate/JUMP_003.png',
		'./img/pirate/JUMP_004.png',
		'./img/pirate/JUMP_005.png',
		'./img/pirate/JUMP_006.png',
	];

	IMAGES_HURT = [
		'./img/pirate/HURT_001.png',
		'./img/pirate/HURT_002.png',
		'./img/pirate/HURT_003.png',
		//'./img/pirate/HURT_004.png',
		//'./img/pirate/HURT_005.png',
		//'./img/pirate/HURT_006.png',
	];

	IMAGES_DIE = [
		'./img/pirate/DIE_001.png',
		'./img/pirate/DIE_002.png',
		'./img/pirate/DIE_003.png',
		'./img/pirate/DIE_004.png',
		'./img/pirate/DIE_005.png',
		'./img/pirate/DIE_006.png',
	];

	imagesLib = [
		this.IMAGES_IDLE, this.IMAGES_WALK, this.IMAGES_JUMP, 
		this.IMAGES_HURT, this.IMAGES_DIE,
	]

	constructor(){
		super();
		this.init();
	}

	init() {
		super.init();
		this.loadImage('./img/pirate/IDLE_000.png');
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