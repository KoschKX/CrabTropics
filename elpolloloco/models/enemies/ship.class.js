class Ship extends Enemy{

	name = 'Ship';

	height = 200; width = 200;

	health = 10; starthealth = 10; 
	frameRate = 24; useGravity = false; 
	speed = 0.25; frameRate = 10;

	scale = 1;

	IMAGES_FLOAT = new Anim('./img/ship/FLOAT_001.png', [1,2,3,4,5,6,7,6,5,4,3,2] , '' );
	imagesLib = [
		this.IMAGES_FLOAT,
	]

	explosions = [];
	cballs = [];

	cannonLocs = [[  33, -165 ], [ -33, -165 ],];

	lastShot = 0; maxShots = 2; firing = true;

	hostile = false; 

	constructor(){
		super();
		this.generateStamp(this.name);
	}
	
	init() {
		super.init();

		this.x = 200 + random(0,  500); this.y = 110;
		this.speed = random(0.25, 0.5); this.originalspeed = this.speed;

		this.loadImage(this.IMAGES_FLOAT.files[0]);
		this.changeAnimation(this.IMAGES_FLOAT);
	}

	main(){
		super.main();
		this.cannonFire();
	}
	
	handleAnimation(){
		this.playAnimation(this.currImageSet);
	}

	getShotLocation(shot){
		let cann = randomInt(0, this.cannonLocs.length-1);
		let shipCenterX = this.x + (this.width*0.5);
	  	let shipCenterY = this.y + (this.height*0.5);
	  	let cannCenterX = this.cannonLocs[cann][0] * (100/this.width);
	  	let cannCenterY = this.cannonLocs[cann][1] * (100/this.height);
	 	let shotCenterX = (shot.width * 0.5) + cannCenterX;
	  	let shotCenterY = (shot.height * 0.5) + cannCenterY;
	  	return [shipCenterX - shotCenterX, shipCenterY - shotCenterY];
	}

	cannonFire() {
		if(!this.world || !this.world.level || !this.firing){ return; }

	 	const rDelay = randomInt(100,100000);
	 	const now = Date.now();

  		this.explosions = this.world.level.effects.filter(effect => effect.name === 'Explosion');

  		if(now - this.lastShot < rDelay || this.explosions.length>=this.maxShots){ return; }

	  	let shot = new Explosion(true);
  			shot.scale = random(0.25, 0.1);
  		let shotLoc = this.getShotLocation(shot);
  			shot.x = shotLoc[0]; shot.y = shotLoc[1];	

		let cball = new Cannonball(true);
			cball.x = shot.x + (cball.x*0.5); cball.y = shot.y;

  			shot.world = this.world; cball.world = this.world;

  		this.world.level.effects.push(shot); this.world.level.projectiles.push(cball);

  		this.world.audio.playSound(['cannon_fireA','cannon_fireB','cannon_fireC'])

  		this.lastShot = new Date().getTime();
	}
}