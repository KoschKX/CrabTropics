class Ship extends Enemy{

	name = 'Ship';

	health = 10; starthealth = 10; 
	frameRate = 24; useGravity = false; 
	speed = 0.25; frameRate = 24;

	scale = 1;

	IMAGES_FLOAT = [
		'./img/ship/FLOAT_001.png',
	];
	
	frameRate = 24; 

	explosions = [];

	cannonLocs = [
					[  33, 0.0 ],
					[ -33, 0.0 ],
				 ];

	lastShot = 0;
	maxShots = 2;

	
	constructor(){
		super();
		this.init();
	}
	
	init() {
		super.init();

		this.height = 128; this.width = 128
		this.x = 200 + Math.random() * 500; this.y = 156;

		this.speed = this.random(0.25, 0.5); this.originalspeed = this.speed;

		this.loadImage('./img/ship/FLOAT_001.png');
		this.changeAnimation(this.IMAGES_FLOAT);
	}

	main(){
		super.main();

		this.cannonFire();
	}
	
	handleAnimation(){
		this.playAnimation(this.currImageSet);
	}

	cannonFire() {
		if(!this.world || !this.world.level){ return; }
		let world = this.world;

	 	const rDelay = this.randomInt(100,100000);
	 	const now = Date.now();

  		this.explosions = this.world.level.effects.filter(effect => effect.name === 'Explosion');

  		if(now - this.lastShot < rDelay || this.explosions.length>=this.maxShots){ 
  			return;
  		}

	  		let cann = this.randomInt(0, this.cannonLocs.length-1);
	  		let shot = new Explosion();
	  			shot.scale = this.random(0.25, 0.1);

	  		let shipCenterX = this.x + (this.width*0.5);
	  		let shipCenterY = this.y + (this.height*0.5);

	  		let cannCenterX = this.cannonLocs[cann][0] * (100/this.width);
	  		let cannCenterY = this.cannonLocs[cann][1] * (100/this.height);

	 		let shotCenterX = (shot.width * 0.5) + cannCenterX;
	  		let shotCenterY = (shot.height * 0.1) + cannCenterY;

  		shot.x = shipCenterX - shotCenterX;
  		shot.y = shipCenterY - shotCenterY;

  		shot.world = world;
  		world.level.effects.push(shot);

  		this.lastShot = new Date().getTime();
		  		
	}

	cacheAll(){
		this.cacheImages(this.IMAGES_FLOAT);
	}


}