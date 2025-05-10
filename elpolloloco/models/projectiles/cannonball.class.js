class Cannonball extends Enemy{

	name = 'Cannonball';

	x = 120; y = 0; groundOffset = 36;

	health = 10; starthealth = 10; 
	frameRate = 24; useGravity = true; 
	speed = 0.25; frameRate = 24;

	scale = 1;
	width = 5; height = 5;
	maxSize = 33; maxZoomSize = 66; 

	IMAGES_ROLL = new Anim('./img/cannonballA/ROLL_001.png'	,1 , '' );
	imagesLib = [
		this.IMAGES_ROLL.files,
	]
	
	boxes = [[0, 0, this.width, this.height, 'red', true]];

	hostile = true;
	madeGroundContact = false;

	constructor(immediate = false){
		super();
		if(immediate){
			this.init();
		}
	}

	destroy(){
		this.world.level.projectiles = destroy(this,this.world.level.projectiles, this.world);
	    super.destroy();
	}
	
	init() {
		super.init();

		this.loadImage(this.IMAGES_ROLL.files[0]);
		this.changeAnimation(this.IMAGES_ROLL);

		this.jump();

		this.hostile = false;
	}

	main(delta){
		super.main(delta);

		this.handleScaling(delta); 

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

	handleScaling(delta) {
		let mxw, mxh;
		let scaleRate;

		if (this.madeGroundContact) {
			mxw = this.maxZoomSize; mxh = this.maxZoomSize;
			scaleRate = 0.25;
		} else {
			mxw = this.maxSize; mxh = this.maxSize;
			scaleRate = 0.1;
		}

		const scaleIncrement = scaleRate * (delta / 1000);
		this.scale += scaleIncrement;

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