class Crab extends Enemy{

	name = 'Crab';

	height = 64; width = 128;

	frameRate = 24; useGravity = true; 
	speed = 3; frameRate = 24;

	boxes = [
				[this.width*0.25, this.height*0.25, this.width*0.5, this.height*0.5, 'red'],
				[this.width*0.1, this.height*0.1, this.width*0.75, this.height*0.25, 'yellow']
			]


	IMAGES_MOVEA = [
		'./img/crabA/MOVE_001.png',
		'./img/crabA/MOVE_002.png',
		'./img/crabA/MOVE_003.png',
		'./img/crabA/MOVE_004.png',
		'./img/crabA/MOVE_005.png',
		'./img/crabA/MOVE_006.png',
		'./img/crabA/MOVE_007.png',
		'./img/crabA/MOVE_008.png',
		'./img/crabA/MOVE_009.png',
	];
	IMAGES_MOVESA_OFFSETS = [ 0, -2, -5, -5, 4, 0, 1, 2, 5 ];

	IMAGES_MOVEB = [
		'./img/crabB/MOVE_001.png',
		'./img/crabB/MOVE_002.png',
		'./img/crabB/MOVE_003.png',
		'./img/crabB/MOVE_004.png',
		'./img/crabB/MOVE_005.png',
		'./img/crabB/MOVE_006.png',
		'./img/crabB/MOVE_007.png',
		'./img/crabB/MOVE_008.png',
		'./img/crabB/MOVE_009.png',
	];
	IMAGES_MOVESB_OFFSETS = [ 0, -2, -4, -6, -4, -2, 0, 2, 4 ];

	IMAGES_DIEA = [
		'./img/crabA/DIE_001.png',
		'./img/crabA/DIE_002.png',
		'./img/crabA/DIE_003.png',
		'./img/crabA/DIE_004.png',
		'./img/crabA/DIE_005.png',
		'./img/crabA/DIE_006.png',
		'./img/crabA/DIE_007.png',
		'./img/crabA/DIE_008.png',
		'./img/crabA/DIE_009.png',
	];

	IMAGES_DIEB = [
		'./img/crabB/DIE_001.png',
		'./img/crabB/DIE_002.png',
		'./img/crabB/DIE_003.png',
		'./img/crabB/DIE_004.png',
		'./img/crabB/DIE_005.png',
		'./img/crabB/DIE_006.png',
		'./img/crabB/DIE_007.png',
		'./img/crabB/DIE_008.png',
		'./img/crabB/DIE_009.png',
	];

	constructor(variant){
		super();
		this.variant=variant;
		
		this.x = 200 + Math.random() * 500; this.y += 64;  
		this.speed = this.random(0.5, 1); this.originalspeed = this.speed;

		this.init();
	}

	main(){
		super.main();
		
		if(this.dead){
			this.revive(3000);
		}
	}

	init() {
		super.init();

		switch(this.variant){
			case 0:
				this.loadImage('./img/crabA/MOVE_000.png');
				this.changeAnimation(this.IMAGES_MOVEA,this.IMAGES_MOVESA_OFFSETS);
				break;
			case 1:
				this.loadImage('./img/crabB/MOVE_000.png');
				this.changeAnimation(this.IMAGES_MOVEB,this.IMAGES_MOVESB_OFFSETS);
				break;
			default:
				console.log('Variant doesn\'t exist');
				break;
		}

		this.loadImage(this.currImageSet[0]);
		this.changeAnimation(this.currImageSet, this.currOffsetSet);

		this.currImageSet = this.IMAGES_IDLE;
		this.loadImages(this.currImageSet);
	}

	handleAnimation(){
		if(!this.world){ return; }

		if(this.dead||this.hurt){
			switch(this.variant){
				case 0:
					this.changeAnimation(this.IMAGES_DIEA);
					break;
				case 1:
					this.changeAnimation(this.IMAGES_DIEB);
					break;
				default:
					break;
			}
		}else{
			switch(this.variant){
				case 0:
					this.changeAnimation(this.IMAGES_MOVEA);
					break;
				case 1:
					this.changeAnimation(this.IMAGES_MOVEB,this.IMAGES_MOVESB_OFFSETS);
					break;
				default:
					break;
			}
		}
		this.playAnimation(this.currImageSet);

		if(this.currImageSet==this.IMAGES_MOVEB || this.currImageSet==this.IMAGES_MOVEA){
			this.applyAnimationOffsets(this.currOffsetSet);
		}

	}

	getImages(){
		let images = [];
		
		images = images.concat(this.IMAGES_MOVEA);
		images = images.concat(this.IMAGES_MOVEB);
		images = images.concat(this.IMAGES_DIEA);
		images = images.concat(this.IMAGES_DIEB);

		return images;
	}


}