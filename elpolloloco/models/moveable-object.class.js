class MovableObject{

	name = ''; 

	x = 120; y = 350;
	width = 128; height = 128;
	speed = 1;
	speedY = 0;
	acceleration =1;

	currDirection = 1;
	
	img; imageCache = [];

	box = [0,0,0,0];

	cvs; 

	loadImage(path){
		this.img = new Image(); 
		this.img.src = path;
	}

	loadImages(arr){
		this.imageCache = {};
		arr.forEach((path) => {
			const img = new Image(); 
			img.src = path;
			this.imageCache[path] = path;
			//this.img.onload = () => console.log(' + path + 'loaded');
			//this.img.onerror = () => console.error('Failed to load '+path);
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


}