class MovableObject{

	name = ''; stamp = 0; world;

	x = 120; y = 350; width = 128; height = 128;
	speed = 1; speedY = 0; acceleration =1;
	currDirection = 1; currImage = 0;

	currImageSet=['']; currOffsetSet = null;
	img; cache; imageCache = []; imagesLib = [];
	flipOffset = [0, 0];
	
	frameRate=60;

	gvtyInterval; animInterval; mainInterval;

	groundOffset = 0; 

	facingRight = true; useGravity = false; 
	falling = false; bouncing = false; useGround = true; 

	constructor(world){
		if(world){
			this.world = world;
			this.ground = world.ground;
		}
		this.stamp = new Date();
	}

	init(){
		if(this.useGravity){
			clearInterval(this.gvtyInterval); this.gvtyInterval = setInterval(() => { this.handleGravity(); }, 1000 / 60 );
		}
		clearInterval(this.animInterval); this.animInterval = setInterval(() => { this.handleAnimation(); }, 1000 / this.frameRate );
	    clearInterval(this.mainInterval); this.mainInterval = setInterval(() => { this.main(); }, 1000 / 60 );
	}

	main(){}

/* SPRITE */

	loadImage(path){
		this.img = new Image(); 
		this.img.src = path;
	}

	loadImages(arr){
		if(!arr){ return; }
		arr.forEach((path) => {
			if(!path || path==''){ return; }
			const img = new Image(); 
			img.src = path;
			this.imageCache[path] = path;
		});
		return arr;
	}

	draw(ctx){
		if(!this.img){ return; }
		let offX = 0;
		if(this.facingRight){ offX = this.flipOffset[0]; }
		if (this.currDirection == 0) {
	        ctx.translate(this.x + this.width + offX, this.y); 
	        ctx.scale(-1, 1); 
	        ctx.drawImage(this.img, 0, 0, this.width, this.height); 
	    } else {
	        ctx.translate(this.x - offX, this.y); 
	        ctx.drawImage(this.img, 0, 0, this.width, this.height); 
	    }
	}

	handleAnimation(){
		this.playAnimation(this.currImageSet);
	}

	changeAnimation(anim,offs=null){
		if(this.currImageSet!=anim){
			this.currImageSet=anim;
			this.loadImages(anim);	
			this.currOffsetSet = offs || null;
		}
	}

	playAnimation(anim){
    	let i = this.currImage % anim.length;
        let path = anim[i];
        this.img.src = this.imageCache[path];
        this.currImage++;
        this.currOffsetSet && this.applyAnimationOffsets(this.currOffsetSet);
	}

	applyAnimationOffsets(oset){
		if(oset){
			let i = this.currImage % this.currImageSet.length;
			let off = oset[i];
			let fscale = 100/this.width;
			let foff = off*fscale;
			if (this.currDirection === 0) this.x += foff;
			if (this.currDirection === 1) this.x -= foff;
		}
	}

	getOffset(){
		let offX = this.flipOffset[0];
		let offY = this.flipOffset[1];
		return [offX, offY];
	}

/* MOVEMENT */

	handleGravity(){
		if(this.isAboveGround() || this.speedY > 0){ 
			this.y -= this.speedY;
			this.speedY -= this.acceleration;
			this.falling = this.speedY > 0 ? false : true;
		}else{
			this.falling = false;
		}
		if (this.isAboveGround() || this.speedY === 0) this.bouncing = true;
		if(this.useGround && !this.isAboveGround()){
			this.falling = false; this.bouncing = false;
			this.y = this.world.ground + this.groundOffset;
		}
	}

	moveLeft(){
		if(!this.world){ return; }
		if(this.x<this.world.level.bounds[0]-(this.width*0.5)){return;}
		this.x -= this.speed; this.currDirection = 0;     
	}

	moveRight(){
		if(!this.world){ return; }
		if(this.x>this.world.level.bounds[2]-(this.width)){return;}
		this.x += this.speed; this.currDirection = 1;     
	}

	bounce(spd,point){
		this.speedY = spd;
		this.bouncing = true; this.falling = false;
		if(point) this.y = point;
	}

	isAboveGround(){
		if(!this.world){ return false; }
		return this.y < this.world.ground + this.groundOffset;
	}

	isOnGround(){
		if(!this.world){ return false; }
		return this.y == this.world.ground + this.groundOffset;
	}

}