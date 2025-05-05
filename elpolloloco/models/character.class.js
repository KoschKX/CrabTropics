class Character extends MovableObject{

	name = 'Character'; 

	dead = false; hurt = false;
	invincible = false; willInvincible = false; hostile = false; reviving = false; flickering = false;
	health = 1; starthealth = 1;
	lastHit = 0; lastFlicker = 0;

	useGravity = true; falling = false; bounding = false;

	boxes = []

	constructor() { super(); }
		   init() { super.init(); this.initCollisionBoxes(); }
		   main() { super.main(); }

/* COLLISIONS */

	initCollisionBoxes(){
		if(this.boxes.length){ return; }
		this.boxes = [[0, 0, this.width, this.height, 'white', false]]
	}

	getCollisionDirection(mo, boxA, boxB) {
		const [tbx, tby, tbw, tbh] = this.boxes[boxA];
		const [mbx, mby, mbw, mbh] = mo.boxes[boxB];
		
		let offset = this.getOffset(); let moffset = mo.getOffset();	//
		let tx = this.x - offset[0]; let ty = this.y - offset[1]; 		// ACCOUNT FOR OFFSETS 
		let mx = mo.x - moffset[0]; let my = mo.y - moffset[1];			//

		const thisLeft = tx + tbx; const thisRight = thisLeft + tbw;
		const thisTop  = ty + tby; const thisBottom = thisTop + tbh;

		const moLeft = mo.x + mbx; const moRight = moLeft + mbw;
		const moTop  = mo.y + mby;  const moBottom = moTop + mbh;

		const overlapX = Math.min(thisRight, moRight) - Math.max(thisLeft, moLeft);
		const overlapY = Math.min(thisBottom, moBottom) - Math.max(thisTop, moTop);

		return overlapX < overlapY ? (tx < mx ? 4 : 2) : (ty < my ? 1 : 3);
	}

	isColliding(mo,idxA,idxB) {
		if(!this.boxes || !mo || !mo.boxes){ return; }
		if(!this.boxes[idxA][5] || !this.boxes[idxB][5] || idxA>this.boxes.length-1 || idxB>mo.boxes.length-1 ){ return; }
		if((this.dead || this.invincible || !mo.hostile || mo.dead || mo.hurt) && idxA==0){ return; }

		let offset = this.getOffset(); let moffset = mo.getOffset();	//
		let tx = this.x - offset[0]; let ty = this.y - offset[1]; 		// ACCOUNT FOR SPRITE OFFSETS
		let mx = mo.x - moffset[0]; let my = mo.y - moffset[1];			//

		let dir = 0; 
		let isColliding = (
			tx + this.boxes[idxA][0] < mx + mo.boxes[idxB][0] + mo.boxes[idxB][2] &&
			tx + this.boxes[idxA][0] + this.boxes[idxA][2] > mx + mo.boxes[idxB][0] &&
			ty + this.boxes[idxA][1] < my + mo.boxes[idxB][1] + mo.boxes[idxB][3] &&
			ty + this.boxes[idxA][1] + this.boxes[idxA][3] > my + mo.boxes[idxB][1]
		);

		if(isColliding){  
			dir = this.getCollisionDirection(mo,idxA,idxB);
			if(this.world.debug){
				let tdir = '';
				if(dir==1){ tdir = 'top'; } if(dir==2){ tdir = 'right'; }
				if(dir==3){ tdir = 'bottom'; } if(dir==4){ tdir = 'left'; }
				console.log('Collision with ['+this.name+':'+idxA+']['+mo.name+':'+idxB+']'+' : '+tdir);
			}
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
	drawCollider(ctx, idx){
		if(!ctx || !this.boxes || this.boxes.length<idx){ return; }
		ctx.beginPath();
		ctx.lineWidth = "1";
		ctx.setLineDash(this.boxes[idx][5] ? [] : [3, 3]);
		ctx.strokeStyle = this.boxes[idx][5] ? this.boxes[idx][4] : 'white';
		ctx.rect(this.boxes[idx][0], this.boxes[idx][1],this.boxes[idx][2],this.boxes[idx][3]);
		ctx.stroke();
	}
	drawColliders(ctx){
		this.boxes.forEach((enemy, idx) => this.drawCollider(ctx, idx, enemy));
	}

/* SPRITE */

	playAnimation(anim){
		if(!anim || !this.img){ return; }
    	let i = this.currImage % anim.length;
        let path = anim[i]; 

        if(this.hurt||this.invincible){
        	if(this.health==0){
	        	if (i === anim.length - 1) this.hurt = false, this.dead = true;
	    	}else{
	    		if (i < anim.length - 1  ) this.hurt = false;
	    	}
        }
        if(!this.invincible&&this.hurt&&this.willInvincible){
        	if (i === anim.length - 1) this.setInvincible(1000);
        	this.willInvincible = false;
        }
        if(this.dead){
        	if (i < anim.length - 1) this.currImage++;
        }else{
        	this.currImage++;
        }

        if(!(path in this.imageCache) || path=="*norepeat") { this.currImage = anim.length - 1; return; } ;

        this.img.src = this.imageCache[path];
	}

/* MOVEMENT */

	jump(){
		if(this.dead){ return; }
		if(!this.isAboveGround()){ this.speedY = 20; this.bouncing  = true;}
	}

/* STATUS */

	isHit(makeInvincible){
		if(this.hurt || this.willInvincible){ return; }
		this.hurt=true;   this.health--;
		this.health < 0 ? this.health = 0 : this.lastHit = Date.now();
		if(makeInvincible){ this.willInvincible = true; }
	}

	isHurt(){
		let timepassed = new Date().getTime() - this.lastHit;
		timepassed = timepassed / 1000;
		return timepassed < 1;
	}

	deadTime(inSeconds) {
		if (!this.dead){ return -1; }
		let timepassed = new Date().getTime() - this.lastHit;
		timepassed = timepassed / 1000; 
		inSeconds && (timepassed = timepassed.toFixed(0));
		return timepassed;
	}

	flicker(intv){
		this.lastFlicker ||= performance.now();
	    const eTime = performance.now() - this.lastFlicker;
	    return Math.floor(eTime / intv) % 2 === 0;
	}

	setInvincible(delay, onOff){
		if(this.invincible){ return; }
		setTimeout(() => {
			this.invincible=false; this.flickering=false; this.toggleCollider(1,true);
		},delay);
		this.invincible=true; this.toggleCollider(0,false);
		this.flickering=true;
	}

	isInvincible(){
		let timepassed = new Date().getTime() - this.hit;
		timepassed = timepassed / 1000;
		return timepassed < 1;
	}

	revive(delay=0){
		if(this.reviving){ return; }
		setTimeout(() => {
			this.dead = false; this.hurt = false; this.reviving=false;
			this.health = this.starthealth;
		},delay);
		this.reviving=true;
	}

}