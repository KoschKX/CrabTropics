class MovableObject{

	name = ''; 

	x = 120; y = 350;
	width = 128; height = 128;
	speed = 1;
	speedY = 0;
	acceleration =1;
	
	currDirection = 1;
	currImage = 0;

	currImageSet = null;
	currOffsetSet = null;
	img; cache; imageCache = [];

	box = [0,0,0,0];z

	cvs; 

	dead = false;
	hurt = false;
	invincible = false;
	reviving = false;
	health = 1;
	starthealth = 1;
	lastHit = 0;
	lastFlicker = 0;

	falling = false;
	jumping = false;

	main(){

	}

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

	random(min, max) {
	  return min + Math.random() * (max - min);
	}

	getCollisionDirection(mo) {
		const [bx, by, bw, bh] = this.box;
		const [mx, my, mw, mh] = mo.box;

		const thisLeft = this.x + bx;
		const thisRight = thisLeft + bw;
		const thisTop = this.y + by;
		const thisBottom = thisTop + bh;

		const moLeft = mo.x + mx;
		const moRight = moLeft + mw;
		const moTop = mo.y + my;
		const moBottom = moTop + mh;

		const overlapX = Math.min(thisRight, moRight) - Math.max(thisLeft, moLeft);
		const overlapY = Math.min(thisBottom, moBottom) - Math.max(thisTop, moTop);

		if (overlapX < overlapY) {
			if (this.x < mo.x) return "left"; 
			else return "right"; 
		} else {
			if (this.y < mo.y) return "top"; 
			else return "bottom"; 
		}
	}

	isColliding(mo) {
		return (
			this.x + this.box[0] < mo.x + mo.box[0] + mo.box[2] &&
			this.x + this.box[0] + this.box[2] > mo.x + mo.box[0] &&
			this.y + this.box[1] < mo.y + mo.box[1] + mo.box[3] &&
			this.y + this.box[1] + this.box[3] > mo.y + mo.box[1]
		);
	}

	drawCollider(ctx){
		if(this instanceof Character || this instanceof Crab){
			ctx.beginPath();
			ctx.lineWidth = "1";
			
			if (this instanceof Character) {
				ctx.strokeStyle = "yellow";
			} else if (this instanceof Crab) {
				ctx.strokeStyle = "red";
			}
				
			ctx.rect(this.box[0], this.box[1],this.box[2],this.box[3]);
			ctx.stroke();
		}
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

	/* SPRITE */

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
	        if(this.hurt||this.invincible){
	        	if(this.health==0){
		        	if(i == anim.length-1){
		    			this.hurt=false;
		        		this.dead=true;
		    		}
		    	}else{
		    		if(i < anim.length-1){
		    			this.setInvincible(1000);
		    			this.hurt=false;
		    		}
		    	}
	        }
	        if(this.dead){
	        	if(i < anim.length-1){
	        		this.currImage++;
	    		}
	        }else{
	        	this.currImage++;
	        }
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

	bounce(mo){
		if(this.dead){return;}
		if(!this.isAboveGround()){
			this.speedY = 15;
			this.jumping = true;
			if(mo){
				this.y=mo.y-mo.height-(this.speedY*2);
			}
		}
	}

	isAboveGround(){
		return this.y < this.world.ground;
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
				//this.dead = true;
			}
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

	flicker(intv){
		this.lastFlicker ||= performance.now();
	    const eTime = performance.now() - this.lastFlicker;
	    return Math.floor(eTime / intv) % 2 === 0;
	}

	setInvincible(delay){
		if(!this.invincible){
			setTimeout(() => {
				this.invincible=false;
			},delay);
			this.invincible=true;
		}
	}

	isInvincible(){
		let timepassed = new Date().getTime() - this.hit;
		timepassed = timepassed / 1000;
		return timepassed < 1;
	}

	revive(delay=0){
		if(!this.reviving){
			setTimeout(() => {
				this.dead=false; this.hurt=false; this.health=this.starthealth;
				this.reviving=false;
			},delay);
			this.reviving=true;
		}
	}



}