class Crab extends MovableObject{

	name = 'Crab';

	dead = false;

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


	currImage = 0;
	currImageSet = null;

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
				this.currImageSet=this.IMAGES_MOVEA;
				break;
			case 1:
				super().loadImage('./img/crabB/MOVE_000.png');
				this.currImageSet=this.IMAGES_MOVEB;
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

		this.loadImages(this.currImageSet);
		this.animate();

	}

	isHit() {
		if(!this.dead){
			this.dead=true;
			this.anim_change=true;
		}
	}

	animate() {
	    setInterval(() => {
	    	this.handleAnimation();
	    }, 1000 / 30);

	    setInterval(() => {
	    	this.handleMovement();
		}, 1000 / 60);
	}

	changeAnimation(anim){
		if(this.currImageSet!=anim){
			this.currImageSet=anim;
			this.loadImages(anim);	
		}
	}

	playAnimation(anim){
		if(anim){
	    	let i = this.currImage % anim.length;
	        let path = anim[i];
	        this.img.src = this.imageCache[path];
	        if(!this.dead || i < anim.length-1){
	        	this.currImage++;
	    	}
	    }
	}


	handleAnimation(){
		if(this.dead){
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
			this.dying=true;
		}else{
			switch(this.variant){
				case 0:
					this.changeAnimation(this.IMAGES_MOVEA);
					break;
				case 1:
					this.changeAnimation(this.IMAGES_MOVEB);
					break;
				default:
					break;
			}
		}
		this.playAnimation(this.currImageSet);
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

	moveLeft(){
		this.x-=this.speed;
	}

	moveRight(){
		this.x+=this.speed;
	}

}