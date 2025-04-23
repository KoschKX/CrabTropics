class Character extends MovableObject{

	name = 'Character';
	category = 'character';
	world;

	dead = false;
	hurt = false;
	health = 3;
	lastHit = 0;

	IMAGES_IDLE = [
		'./img/pirate/IDLE_000.png',
		'./img/pirate/IDLE_001.png',
		'./img/pirate/IDLE_002.png',
		'./img/pirate/IDLE_003.png',
		'./img/pirate/IDLE_004.png',
		'./img/pirate/IDLE_005.png',
		'./img/pirate/IDLE_006.png',
	];

	IMAGES_WALK = [
		'./img/pirate/WALK_000.png',
		'./img/pirate/WALK_001.png',
		'./img/pirate/WALK_002.png',
		'./img/pirate/WALK_003.png',
		'./img/pirate/WALK_004.png',
		'./img/pirate/WALK_005.png',
		'./img/pirate/WALK_006.png',
	];

	IMAGES_JUMP = [
		'./img/pirate/JUMP_001.png',
		'./img/pirate/JUMP_002.png',
		'./img/pirate/JUMP_003.png',
		'./img/pirate/JUMP_004.png',
		'./img/pirate/JUMP_005.png',
		'./img/pirate/JUMP_006.png',
	];

	IMAGES_HURT = [
		'./img/pirate/HURT_001.png',
		'./img/pirate/HURT_002.png',
		'./img/pirate/HURT_003.png',
		'./img/pirate/HURT_004.png',
		'./img/pirate/HURT_005.png',
		'./img/pirate/HURT_006.png',
	];

	IMAGES_DIE = [
		'./img/pirate/DIE_001.png',
		'./img/pirate/DIE_002.png',
		'./img/pirate/DIE_003.png',
		'./img/pirate/DIE_004.png',
		'./img/pirate/DIE_005.png',
		'./img/pirate/DIE_006.png',
	];

	currImage = 0;
	currImageSet = null;

	speed = 3;
	grounded = true;
	falling = false;
	jumping = false;

	box = [
		this.width*0.25,
		this.height*0.33,
		this.width*0.25,
		this.height*0.5
	];

	y = 0;

	constructor(world){
		super().loadImage('./img/pirate/IDLE_000.png');
		this.world = world;
		this.currImageSet = this.IMAGES_IDLE;
		this.loadImages(this.currImageSet);
		this.animate();

	}

	animate() {
		this.handleGravity();
	    setInterval(() => { this.handleAnimation(); }, 1000 / 10 );
	    setInterval(() => { this.handleControls(); }, 1000 / 60 );
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
		this.hurt=this.isHurt();

		if(this.dead){
			this.changeAnimation(this.IMAGES_DIE);
		}else if(this.hurt){
			this.changeAnimation(this.IMAGES_HURT);
		}else{
			if(this.jumping){
				this.changeAnimation(this.IMAGES_JUMP);
	    	}else{
		    	if(this.world.keyboard.RIGHT || this.world.keyboard.LEFT){
		    		this.changeAnimation(this.IMAGES_WALK);
		    	}else{
		    		this.changeAnimation(this.IMAGES_IDLE);
		    	}
			}
		}
		this.playAnimation(this.currImageSet);
	}

	handleControls(){
		if(this.dead){ return; }

		if(this.world.keyboard.LEFT){
    		this.moveLeft();
		}
		if(this.world.keyboard.RIGHT){
			this.moveRight();
		}
		if(this.world.keyboard.SPACE && !this.isAboveGround()){
			this.jump();
		}
	}

	handleGravity(){
		setInterval(() => {
			if(this.isAboveGround() || this.speedY > 0){ 
				this.y -= this.speedY;
				this.speedY -= this.acceleration;
				this.jumping = false;
				if(this.speedY > 0){
					this.falling = false;
				}else{
					this.falling = true; 
				}
			}else{
				this.falling = false;
			}
			if(this.isAboveGround()  || this.speedY == 0){
				this.jumping = true;
			}
		}, 1000 / 60);
	}

	isAboveGround(){
		return this.y < this.world.ground;
	}

	moveLeft(){
		if(this.x<0-(this.width*0.5)){return;}
		if(this.currDirection==1){ this.x-=this.width*0.25; }
		this.x -= this.speed;
        this.currDirection = 0;     
	}

	moveRight(){
		if(this.x>740-(this.width*0.5)){return;}
		if(this.currDirection==0){ this.x+=this.width*0.25; }
		this.x += this.speed;
		this.currDirection = 1;     
	}

	jump(){
		if(!this.isAboveGround()){
			this.speedY = 20;
			this.jumping = true;
		}
	}

	isHurt(){
		let timepassed = new Date().getTime() - this.lastHit;
		timepassed = timepassed / 1000;
		return timepassed < 1;
	}

	deadTime(inSeconds) {
		if (this.dead) {
			let timepassed = new Date().getTime() - this.lastHit;
			timepassed = timepassed / 1000; 
			if(inSeconds){
				timepassed = timepassed.toFixed(0);
			}
			return timepassed;
		}
		return -1;
	}

	revive(){
		this.dead=false;
		this.health=3;
		this.hurt=true;
	}

	isHit(){
		if(!this.hurt){
			this.hurt=true;

			this.health--;
			if(this.health < 0){
				this.health = 0;
			} else {
				this.lastHit = new Date().getTime();
			}

			if(this.health==0){
				this.dead = true;
			}
			//console.log('hurt: '+this.health);
		}
	}

}