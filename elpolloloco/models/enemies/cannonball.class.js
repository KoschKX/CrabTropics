class Cannonball extends Enemy{

	name = 'Cannonball';

	health = 10; starthealth = 10; 
	frameRate = 24; useGravity = true; 
	speed = 0.25; frameRate = 24;

	scale = 0.13;
	maxScale = 1.1;
	scaleInterval;

	IMAGES_ROLL = [
		'./img/cannonballA/ROLL_001.png',
	];
	
	frameRate = 24; 

	boxes = [
		[0, 0, this.width, this.height, 'red'],
	]

	constructor(){
		super();
		this.init();
	}
	
	init() {
		super.init();

		this.loadImage('./img/cannonballA/ROLL_001.png');
		this.changeAnimation(this.IMAGES_ROLL);

		this.width *= this.scale; this.height *= this.scale;

		clearInterval(this.scaleInterval); this.scaleInterval = setInterval(() => { this.handleScaling(); }, 1000 / 24 );

		this.jump();
	}

	main(){
		super.main();

		this.updateCollisionBoxes();
	}

	jump(){
		if(!this.isAboveGround()){
			this.speedY = 20;
			this.jumping = true;
		}
	}

	getImages(){
		let images = [];

		images = images.concat(this.IMAGES_ROLL);
		
		return images;
	}


	handleScaling() {
	    this.scale += 0.5;
	    if(this.scale>this.maxScale){this.scale=this.maxScale;}
	    this.y -= 1.5; 
	    //this.x += Math.sin(this.scale * 5) * 1.15;
	    this.width *= this.scale; this.height *= this.scale;
	}


	updateCollisionBoxes(){
		this.boxes = [
			[0, 0, this.width, this.height, 'red'],
		]
		if(!this.isAboveGround()){
			this.boxes = []
		}
	}

}