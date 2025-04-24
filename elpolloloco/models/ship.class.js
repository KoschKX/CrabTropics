class Ship extends MovableObject{

	name = 'Ship';

	scale = 1;
	speed = 0.25;


	IMAGES_FLOAT = [
		'./img/ship/FLOAT_001.png',
	];
	
	constructor(variant,randx,randy){

		super().loadImage('./img/ship/FLOAT_001.png');
		this.changeAnimation(this.IMAGES_FLOAT);

		this.variant = variant;
		this.height = 128;
		this.width = 128
		this.x = 200 + Math.random() * 500;
		this.y = 156;

		this.speed = this.random(0.25, 0.5);

		this.originalspeed = this.speed;

		this.loadImages(this.currImageSet);
		this.init();
	}

	init() {
	    setInterval(() => { this.handleAnimation(); }, 1000 / 24 );
	    setInterval(() => { this.handleMovement(); }, 1000 / 60 );
	    setInterval(() => { this.main(); }, 1000 / 60 );
	}

	handleAnimation(){
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

}