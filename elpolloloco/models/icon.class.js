class Icon{
	name = 'Icon';
	category = 'icon';

	x = 0; y = 0; width = 64; height = 64;

	cvs; ctx; img; imgpath;

	drawInterval;

	constructor(canvas,x=0,y=0){
		this.cvs = canvas;
		this.ctx = canvas.getContext('2d');
		this.x = x; this.y = y;
	}


	loadImage(path, callback){
		let img = new Image(); img.src = path;
		if(callback && typeof callback === 'function'){
			img.onload = () => { callback(); img.onload = null; };
		}
		return img;
	}

	init(){
		if(this.imgpath) {  
			let self = this;
			this.img = this.loadImage(this.imgpath, function(){
		    	clearInterval(self.drawInterval); self.drawInterval = setInterval(() => { self.draw(); }, 1000 / 60 );
			});
		}
	}

	draw(){
		this.ctx.clearRect(0,0,this.cvs.width,this.cvs.height);
	    this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height); 
	}
}