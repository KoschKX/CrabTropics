class Ship extends Enemy{

	name = 'Ship';

	height = 200; width = 200;

	health = 10; starthealth = 10; 
	frameRate = 24; useGravity = false; 
	speed = 0.25; frameRate = 10;

	scale = 1;

	IMAGES_FLOAT = [
		'./img/ship/FLOAT_001.png', './img/ship/FLOAT_002.png', './img/ship/FLOAT_003.png', './img/ship/FLOAT_004.png', 
		'./img/ship/FLOAT_005.png', './img/ship/FLOAT_006.png', './img/ship/FLOAT_007.png', 

		'./img/ship/FLOAT_006.png', './img/ship/FLOAT_005.png', './img/ship/FLOAT_004.png', './img/ship/FLOAT_003.png', './img/ship/FLOAT_002.png',

		// './img/ship/FLOAT_008.png',
		// './img/ship/FLOAT_009.png', './img/ship/FLOAT_010.png', './img/ship/FLOAT_011.png', './img/ship/FLOAT_012.png',

		// './img/ship/FLOAT_013.png', './img/ship/FLOAT_014.png', './img/ship/FLOAT_015.png', './img/ship/FLOAT_016.png', 
		// './img/ship/FLOAT_017.png', './img/ship/FLOAT_018.png', './img/ship/FLOAT_019.png', 

		// './img/ship/FLOAT_020.png', 
		// './img/ship/FLOAT_021.png', './img/ship/FLOAT_022.png', './img/ship/FLOAT_023.png', './img/ship/FLOAT_024.png',

		// './img/ship/FLOAT_018.png', './img/ship/FLOAT_017.png', './img/ship/FLOAT_016.png', './img/ship/FLOAT_015.png', './img/ship/FLOAT_014.png',
	];

	imagesLib = [
		this.IMAGES_FLOAT,
	]

	explosions = [];
	cballs = [];

	cannonLocs = [[  33, 0.2 ], [ -33, 0.2 ],];

	lastShot = 0;
	maxShots = 2;

	hostile = false;

	firing = true;

	constructor(){
		super();
		//this.init();
	}
	
	init() {
		super.init();

		this.x = 200 + random(0,  500); this.y = 110;

		this.speed = random(0.25, 0.5); this.originalspeed = this.speed;

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
		if(!this.firing){ return; }

	 	const rDelay = randomInt(100,100000);
	 	const now = Date.now();

  		this.explosions = this.world.level.effects.filter(effect => effect.name === 'Explosion');

  		if(now - this.lastShot < rDelay || this.explosions.length>=this.maxShots){ 
  			return;
  		}

	  		let cann = randomInt(0, this.cannonLocs.length-1);

		  	let shot = new Explosion(true);
	  			shot.scale = random(0.25, 0.1);

	  		let shipCenterX = this.x + (this.width*0.5);
	  		let shipCenterY = this.y + (this.height*0.5);

	  		let cannCenterX = this.cannonLocs[cann][0] * (100/this.width);
	  		let cannCenterY = this.cannonLocs[cann][1] * (100/this.height);

	 		let shotCenterX = (shot.width * 0.5) + cannCenterX;
	  		let shotCenterY = (shot.height * 0.1) + cannCenterY;

  			shot.x = shipCenterX - shotCenterX;
  			shot.y = shipCenterY - shotCenterY;

  			let cball = new Cannonball(true);
  			cball.x = shot.x + (cball.x*0.5); cball.y = shot.y;
  			

  		shot.world = this.world; cball.world = this.world;

  		this.world.level.effects.push(shot);
  		this.world.level.projectiles.push(cball);

  		this.world.audio.playSound(['cannon_fireA','cannon_fireB','cannon_fireC'])

  		this.lastShot = new Date().getTime();
		  		
	}
}