class Cannonball extends Enemy{

	name = 'Cannonball';

	x = 120; y = 0; groundOffset = 36;

	health = 10; starthealth = 10; 
	frameRate = 24; useGravity = true; 
	speed = 0.25; frameRate = 24;

	scale = 1;
	width = 5; height = 5;
	maxWidth = 33; maxHeight = 33;
	maxZoomWidth = 66; maxZoomHeight = 66;

	IMAGES_ROLL = [
		'./img/cannonballA/ROLL_001.png',
	];
	
	imagesLib = [
		this.IMAGES_ROLL,
	]

	boxes = [[0, 0, this.width, this.height, 'red', true]];

	hostile = true;
	madeGroundContact = false;
	scaleInterval;

	constructor(immediate = false){
		super();
		if(immediate){
			this.init();
		}
	}

	destroy(){
		this.world.level.projectiles = destroy(this,this.world.level.projectiles, this.world);
		clearInterval(this.scaleInterval);
	    super.destroy();
	}
	
	init() {
		super.init();

		this.loadImage('./img/cannonballA/ROLL_001.png');
		this.changeAnimation(this.IMAGES_ROLL);

		clearInterval(this.scaleInterval); this.scaleInterval = setInterval(() => { this.handleScaling(); }, 1000 / 24 );

		this.jump();

		this.hostile = false;
	}

	main(){
		super.main();

		this.updateCollisionBoxes();

		this.checkGroundHit();
	}

	checkGroundHit(){
		if(!this.world || !this.world.level) { return; }

    	if(this.falling){
    		this.hostile = true;

    		this.world.audio.playSound(['cannon_whizzA','cannon_whizzB','cannon_whizzC'], 0.33, false);

    	}else{
    		this.hostile = false;
    	}

		if(!this.madeGroundContact&&this.isOnGround()){

	    	this.bounce(5);

	    	this.useGround = false;
	    	this.madeGroundContact=true;

	    	this.world.audio.playSound(['cannon_thudA','cannon_thudB','cannon_thudC'], 0.66, false);

	    }else if(this.madeGroundContact){

	    	this.toggleCollider(0,false);

	    	this.hostile = false;

	    	this.speedY-=0.1;
	    	this.y-=this.speedY;
	    }
	    if(this.y>=this.world.cvs.height+this.height){
	    	this.destroy();
	    }
	}

	handleScaling() {
	    let mxw, mxh;

	    if (this.madeGroundContact) {
	        mxw = this.maxZoomWidth; mxh = this.maxZoomHeight;
	        this.scale += 0.05;
	    } else {
	        mxw = this.maxWidth;  mxh = this.maxHeight;
	        this.scale += 0.01;
	    }

	    const centerX = this.x + this.width / 2;
	    const centerY = this.y + this.height / 2;

	    if (this.width * this.scale < mxw) {
	        this.width *= this.scale;
	    }
	    if (this.height * this.scale < mxh) {
	        this.height *= this.scale;
	    }

	    this.x = centerX - this.width / 2;
	    this.y = centerY - this.height / 2;
	}

	updateCollisionBoxes(){
		this.boxes[0][2] = this.width;
		this.boxes[0][3] = this.height;
	}

}