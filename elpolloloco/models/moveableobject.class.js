class MovableObject{

	name = ''; stamp = 0; world; initialized = false;

	x = 120; y = 350; width = 128; height = 128;
	speed = 1;  acceleration = 1; speedY = 0;
	currDirection = 1; currImage = 0;

	IMAGES_BLANK = new Anim('./img/blank.png'); imagesLib = [this.IMAGES_BLANK]; imageCache = []; 

	currImageSet=['']; noRepeat=[];
	img; cache; 
	flipOffset = [0, 0];
	
	frameRate=60; animInterval;

	groundOffset = 0; 

	facingRight = true; useGravity = false; 
	falling = false; bouncing = false; static = false; appearing = false; useGround = true;  

	constructor(world, name){ 
		this.world = world; 
		if( this.name ){ this.name = name; this.generateStamp(name); }
	}
	destroy(){ clearInterval(this.animInterval); }

	init(){
		this.delta = 0;
		this.initialized = true;
		this.loadImage(this.IMAGES_BLANK.files[0]);
		this.currImageSet = this.IMAGES_BLANK;
		clearInterval(this.animInterval); this.animInterval = setInterval(() => { this.animate(); }, 1000 / this.frameRate );
	}

	generateStamp(name) {
	  this.stamp =
	    Date.now().toString(36) + '_' +
	    Math.floor(performance.now()).toString(36) + '_' +
	    Math.random().toString(36).slice(2, 8);
	}

	main(){
		if(this.useGravity){ this.handleGravity(); }
	}

	animate(){
		if(this.world && this.world.paused){ return; }
		this.handleAnimation();
	}

	now(){
		if( !this.world ) { return 0; }
		return this.world.elapsedTime;
	}

/* SPRITE */

	loadImage(path){
		const ext = path.split('.').pop(); 
		if(ext != 'png' && ext != 'jpg') { return; }
		if(!path || path.startsWith('*')){ return; }
		let check = document.querySelector('#cache img[src="' + path + '"]');
		if(check){ this.img = check;  }
	}

	loadImages(arr){
		if(!arr){ return; }
		arr.forEach((path) => { 
			if(!path || path=='' || path.startsWith('*') || this.imageCache?.[path]){ return; };
			let check = document.querySelector('#cache img[src="' + path + '"]');
			if(!check&&this.world&&this.world.level){ 
				this.world.level.createImage(this, path, true);
			}
			this.imageCache[path] = path;
		});
		return arr;
	}

	getCachedImage(path){
		let check = document.querySelector('#cache img[src="' + path + '"]');
        if(check){ return check; }
        return this.IMAGES_BLANK.files[0];
	}

	draw(ctx){
		if(!this.img || !(this.img instanceof HTMLImageElement)){ return; }
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
		if(this.world && this.world.paused){ return; }
		this.playAnimation(this.currImageSet);
	}

	changeAnimation(anim, offs=null){
		if(this.currImageSet==anim){ return; }
		this.currImageSet=anim;
		this.currImage = 0;
		this.loadImages(anim.files);	
	}

	playAnimation(anim){
		if(this.world && this.world.paused){ return; }
		if(!anim || !anim.files || !this.img){ return; }
    	let i = this.currImage % anim.files.length; 
        let path = anim.files[i];
        this.currImage++;
        if(this.anim.offsets && this.anim.offsets.length){ this.applyAnimationOffsets(anim); }
		this.img = this.getCachedImage(path);
	}

	applyAnimationOffsets(anim){
		if(!anim){ return; }
		let i = this.currImage % anim.offets.length;
		let off = anim.offsets[i];
		let fscale = 100/this.width;
		let foff = off*fscale;
		if (this.currDirection === 0) this.x += foff;
		if (this.currDirection === 1) this.x -= foff;
	}

	getOffset(){
		return [this.flipOffset[0], this.flipOffset[1]];
	}

	getAnimName(path){
		if (typeof path !== 'string'){return '';}
		return path.split('/').pop().split('.')[0].split('_')[0];
	}

/* MOVEMENT */

	handleGravity(){
		if(!this.world){ return; }
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

	bounce(spd,point){
		this.speedY = spd;
		this.bouncing = true; this.falling = false; this.currImage = 0;
		if(point) this.y = point;
	}

	moveLeft(){
		if(!this.world || this.static || this.dead){ return; }
		if(this.x<this.world.level.bounds[0]-(this.width*0.5)){return;}
		this.x -= this.speed; this.currDirection = 0;     
	}

	moveRight(){
		if(!this.world || this.static || this.dead){ return; }
		if(this.x>this.world.level.bounds[2]-(this.width*0.5)){return;}
		this.x += this.speed; this.currDirection = 1;     
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