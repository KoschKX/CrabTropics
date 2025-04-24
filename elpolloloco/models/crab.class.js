class Crab extends MovableObject{

	name = 'Crab';

	dead = false;
	dying = false;

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

	legsOffset = 0;

	box = [
		this.width*0.1,
		this.height*0.1,
		this.width*0.75,
		this.height*0.25
	];

	constructor(variant){

		switch(variant){
			case 0:
				super().loadImage('./img/crabA/MOVE_000.png');
				this.changeAnimation(this.IMAGES_MOVEA,this.IMAGES_MOVESA_OFFSETS);
				break;
			case 1:
				super().loadImage('./img/crabB/MOVE_000.png');
				this.changeAnimation(this.IMAGES_MOVEB,this.IMAGES_MOVESB_OFFSETS);
				break;
			default:
				console.log('Variant doesn\'t exist');
				break;
		}

		this.variant = variant;

		this.height = 64;
		this.width = 128
		this.x = 200 + Math.random() * 500;
		this.y += 64;

		this.speed = this.random(0.5, 1);

		this.originalspeed = this.speed;

		this.loadImages(this.currImageSet);
		this.init();

	}

	init() {
	    setInterval(() => { this.handleAnimation(); }, 1000 / 24 );
	    setInterval(() => { this.handleMovement(); }, 1000 / 60 );
	    setInterval(() => { this.main(); }, 1000 / 60 );
	}

	main(){
		if(this.dead){
			this.revive(3000);
		}
	}

	handleAnimation(){
		//this.hurt=this.isHurt();
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

	handleMovement(){
		if(this.dead){ return; }

	    if(this.currDirection===0){
	    	this.moveLeft();
	    }
	    if(this.currDirection===1){
	    	this.moveRight();
	    }

	    if(this.currDirection===0&&this.x<this.width){
	    	this.currDirection=1;
		}
	    if(this.currDirection===1&&this.x>720-this.width){
	    	this.currDirection=0;
		}

	}


}