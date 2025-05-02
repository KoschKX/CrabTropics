class Crab extends Enemy{

	name = 'Crab';

	height = 64; width = 128;

	frameRate = 24; useGravity = true; 

	speed = 3; 

	boxes_fine = [
					[this.width*0.25, this.height*0.25, this.width*0.5, this.height*0.5, 'red', true],
					[this.width*0.1, this.height*0.1, this.width*0.75, this.height*0.25, 'yellow', true]
				 ]
	boxes_hurt = [
					[this.width*0.25, this.height*0.25, this.width*0.5, this.height*0.5, 'red', true],
					[this.width*0.1, this.height*0.2, this.width*0.75, this.height*0.25, 'yellow', true]
				 ]

	boxes=this.boxes_fine;

	hostile = true;

	IMAGES_MOVEA = [
		'./img/crabA/MOVE_001.png', './img/crabA/MOVE_002.png', './img/crabA/MOVE_003.png',
		'./img/crabA/MOVE_004.png', './img/crabA/MOVE_005.png', './img/crabA/MOVE_006.png',
		'./img/crabA/MOVE_007.png', './img/crabA/MOVE_008.png', './img/crabA/MOVE_009.png',
	]; IMAGES_MOVESA_OFFSETS = [ 0, -2, -5, -5, 4, 0, 1, 2, 5 ];

	IMAGES_MOVEB = [
		'./img/crabB/MOVE_001.png', './img/crabB/MOVE_002.png', './img/crabB/MOVE_003.png',
		'./img/crabB/MOVE_004.png', './img/crabB/MOVE_005.png', './img/crabB/MOVE_006.png',
		'./img/crabB/MOVE_007.png', './img/crabB/MOVE_008.png', './img/crabB/MOVE_009.png',
	]; IMAGES_MOVESB_OFFSETS = [ 0, -2, -4, -6, -4, -2, 0, 2, 4 ];

	IMAGES_DIEA = [
		'./img/crabA/DIE_001.png', './img/crabA/DIE_002.png', './img/crabA/DIE_003.png',
		'./img/crabA/DIE_004.png', './img/crabA/DIE_005.png', './img/crabA/DIE_006.png',
		'./img/crabA/DIE_007.png', './img/crabA/DIE_008.png', './img/crabA/DIE_009.png',
	];

	IMAGES_DIEB = [
		'./img/crabB/DIE_001.png', './img/crabB/DIE_002.png', './img/crabB/DIE_003.png',
		'./img/crabB/DIE_004.png', './img/crabB/DIE_005.png', './img/crabB/DIE_006.png',
		'./img/crabB/DIE_007.png', './img/crabB/DIE_008.png', './img/crabB/DIE_009.png',
	];

	imagesLib = [
		this.IMAGES_MOVEA, this.IMAGES_MOVEB,
		this.IMAGES_DIEA, this.IMAGES_DIEB,
	]

	constructor(variant){
		super();
		this.variant=variant;
		
		this.x = 200 + random(0,  500); this.y += 64;  
		this.speed = random(0.5, 1); this.originalspeed = this.speed;

		//this.init();
	}

	main(){
		super.main();
		
		if(this.dead){
			this.revive(3000);
			
		}
		if(this.hurt || this.dead){
			this.boxes = this.boxes_hurt;
			this.toggleCollider(0,false);
		}else{
			this.boxes = this.boxes_fine;
			this.toggleCollider(0,true);
		}

	}

	isHit(){
		super.isHit();
		this.world.audio.playSound(['crab_hitA','crab_hitB','crab_hitC']);
	}

	moveLeft(){
		super.moveLeft();
		this.world.audio.playSound('crab_walkA', 0.5, false);
	}

	moveRight(){
		super.moveRight();
		this.world.audio.playSound('crab_walkA', 0.5, false);
	}

	init() {
		super.init();
		this.loadImage(this. IMAGES_BLANK);
		this.currImageSet = this.IMAGES_IDLE;
	}

	handleAnimation(){
		const variantData = {
		  0: { die: this.IMAGES_DIEA, move: this.IMAGES_MOVEA, offsets: this.IMAGES_MOVESA_OFFSETS },
		  1: { die: this.IMAGES_DIEB, move: this.IMAGES_MOVEB, offsets: this.IMAGES_MOVESB_OFFSETS }
		}[this.variant];

		if (variantData) {
		  const { move, die, offsets } = variantData;
		  this.changeAnimation(this.dead || this.hurt ? die : move, this.dead || this.hurt ? undefined : offsets);
		} else {
		  console.log('Variant doesn\'t exist');
		}

		this.playAnimation(this.currImageSet);

		if (   this.currImageSet == this.IMAGES_MOVEB 
			|| this.currImageSet == this.IMAGES_MOVEA
		){
			this.applyAnimationOffsets(this.currOffsetSet);
		}	

	}

}