class Character extends MovableObject{

	name = 'Character'; 

	dead = false; hurt = false;
	invincible = false; hostile = false; reviving = false;
	health = 1; starthealth = 1;
	lastHit = 0; lastFlicker = 0;

	useGravity = true; falling = false; jumping = false;

	boxes = [
				[0, 0, this.width, this.height, 'white', false],
			]

	constructor(){
		super();
	}


	init() {
		super.init();
	}

	main(){
		super.main();
	}

/* COLLISIONS */

	getCollisionDirection(mo, boxA, boxB) {
		const [bx, by, bw, bh] = this.boxes[boxA];
		const [mx, my, mw, mh] = mo.boxes[boxB];

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
			if (this.x < mo.x) return 4; 
			else return 2; 
		} else {
			if (this.y < mo.y) return 1; 
			else return 3; 
		}
	}

	isColliding(mo,idxA,idxB) {
		if(!this.world){ return; }
		if(!this.boxes || !mo || !mo.boxes){ return; }
		if(idxA>this.boxes.length-1 || idxB>mo.boxes.length-1){ return; }
		if(!this.boxes[idxA][5] || !this.boxes[idxB][5]){ return; }

		if((this.dead || this.invincible || !mo.hostile) && idxA==0){ return; }

		let dir;
		let isColliding = (
			this.x + this.boxes[idxA][0] < mo.x + mo.boxes[idxB][0] + mo.boxes[idxB][2] &&
			this.x + this.boxes[idxA][0] + this.boxes[idxA][2] > mo.x + mo.boxes[idxB][0] &&
			this.y + this.boxes[idxA][1] < mo.y + mo.boxes[idxB][1] + mo.boxes[idxB][3] &&
			this.y + this.boxes[idxA][1] + this.boxes[idxA][3] > mo.y + mo.boxes[idxB][1]
		);

		if(isColliding){  
			dir = this.getCollisionDirection(mo,idxA,idxB);
			if(this.world.debug){
				let tdir = '';
				if(dir==1){ tdir = 'top'; }
				if(dir==2){ tdir = 'right'; }
				if(dir==3){ tdir = 'bottom'; }
				if(dir==4){ tdir = 'left'; }
				console.log('Collision with ['+this.name+':'+idxA+']['+mo.name+':'+idxB+']'+' : '+tdir);
			}
		}else{
			dir=0; 
		}

		return dir;
	}

	toggleCollider(idx, onOff){
		if(!this.boxes || !this.boxes[idx]){ return; }
		this.boxes[idx][5] = onOff;
	}

	activateColliders(){
		this.boxes.forEach((box) => { box[5]=true;});
	}
	deactivateColliders(){
		this.boxes.forEach((box) => { box[5]=false;});
	}

	drawColliders(ctx){
		this.boxes.forEach((enemy,idx) => {
			this.drawCollider(ctx, idx);
		});
	}

	drawCollider(ctx, idx){
		if(!ctx || !this.boxes || this.boxes.length<idx){ return; }
		ctx.beginPath();
		ctx.lineWidth = "1";
			
		if(!this.boxes[idx][5]){
			ctx.setLineDash([3, 3]);
			ctx.strokeStyle = 'white';
		}else{
			ctx.setLineDash([]);
			ctx.strokeStyle = this.boxes[idx][4];
		}
		
		ctx.rect(this.boxes[idx][0], this.boxes[idx][1],this.boxes[idx][2],this.boxes[idx][3]);
		ctx.stroke();
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
	        
	        if(!this.imageCache[path]){ return; }

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

/* MOVEMENT */

	handleGravity(){
		if(!this.world){ return; }
		if(this.isAboveGround() || this.isOnGround() || this.speedY > 0){ 
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
		if(this.useGround && !this.isAboveGround()){
			this.y = this.world.ground + this.groundOffset;
		}
	}

	moveLeft(){
		if(!this.world){ return; }
		if(this.x<0-(this.width*0.5)){ return; }
		if(this.currDirection==1){ this.x-=this.width*0.25; }
		this.x -= this.speed;
        this.currDirection = 0;     
	}

	moveRight(){
		if(!this.world){ return; }
		if(this.x>this.world.cvs.width-(this.width*0.5)){ return; }
		if(this.currDirection==0){ this.x+=this.width*0.25; }
		this.x += this.speed;
		this.currDirection = 1;     
	}

	jump(){
		if(this.dead){ return; }
		if(!this.isAboveGround()){
			this.speedY = 20;
			this.jumping = true;
		}
	}

/* STATUS */

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

	setInvincible(delay, onOff){
		if(!this.invincible){
			setTimeout(() => {
				this.invincible=false;
				this.toggleCollider(1,true);
			},delay);
			this.invincible=true;

			this.toggleCollider(0,false);
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