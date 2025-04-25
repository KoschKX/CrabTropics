class MovableObject{

	name = ''; 

	x = 120; y = 350;
	width = 128; height = 128;
	speed = 1; speedY = 0; acceleration =1;
	
	currDirection = 1; currImage = 0;

	currImageSet = null; currOffsetSet = null;
	img; cache; imageCache = [];

	falling = false; bouncing = false;

	cvs; 

	main(){

	}

/* SPRITE */

	loadImage(path){
		this.img = new Image(); 
		this.img.src = path;
	}

	loadImages(arr,key){
		//this.imageCache = {};
		arr.forEach((path) => {
			const img = new Image(); 
			img.src = path;
			this.imageCache[path] = path;
		});
	}


	handleFlip(ctx){
		if (this.currDirection == 0) {
	        ctx.translate(this.x + this.width, this.y); 
	        ctx.scale(-1, 1); 
	        ctx.drawImage(this.img, 0, 0, this.width, this.height); 
	    } else {
	        ctx.translate(this.x, this.y); 
	        ctx.drawImage(this.img, 0, 0, this.width, this.height); 
	    }
	}

	changeAnimation(anim,offs=null){
		if(this.currImageSet!=anim){
			this.currImageSet=anim;
			this.loadImages(anim);	
			if(offs){
				this.currOffsetSet=offs;
			}else{
				this.currOffsetSet=null;
			}
		}
	}

	playAnimation(anim){
		if(anim){
	    	let i = this.currImage % anim.length;
	        let path = anim[i];
	        this.img.src = this.imageCache[path];
	        this.currImage++;
	    }
	}

	applyAnimationOffsets(oset){
		if(oset){
			let i = this.currImage % this.currImageSet.length;
			let off = oset[i];
			let fscale = 100/this.width;
			let foff = off*fscale;
			if(this.currDirection===0){
				this.x+=foff;
			}
			if(this.currDirection===1){
				this.x-=foff;
			}
		}
	}

/* MOVEMENT */

	handleGravity(){
		setInterval(() => {
			if(this.isAboveGround() || this.speedY > 0){ 
				this.y -= this.speedY;
				this.speedY -= this.acceleration;
				this.bouncing = false;
				if(this.speedY > 0){
					this.falling = false;
				}else{
					this.falling = true; 
				}
			}else{
				this.falling = false;
			}
			if(this.isAboveGround()  || this.speedY == 0){
				this.bouncing = true;
			}
			if(!this.isAboveGround()){
				this.y = this.world.ground;
			}
		}, 1000 / 60);
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

	bounce(startpoint){
		if(!this.isAboveGround()){
			this.speedY = 15;
			this.bouncing = true;
			if(startpoint){
				this.y=startpoint;
			}
		}
	}

	isAboveGround(){
		return this.y < this.world.ground;
	}

/* UTILS */

	random(min, max) {
	  return min + Math.random() * (max - min);
	}

}