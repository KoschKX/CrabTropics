class Loadicon extends icon{
	
	imgpath = './img/icons/wheel.png';

	angle = 0;

	constructor(canvas,x=0,y=0){
		super(canvas,x,y); super.init();
	}

	draw(){
		this.x = this.cvs.width - (this.width) - 16;
		this.y = this.cvs.height - (this.height) - 16;

	    const centerX = this.x + this.width * 0.5;
	    const centerY = this.y + this.height * 0.5;

	    this.angle -= 1 * Math.PI / 180; 

	    this.ctx.save();
	    this.ctx.clearRect(0,0,this.cvs.width,this.cvs.height);
	    this.ctx.translate(centerX, centerY);    
	    this.ctx.rotate(this.angle);         
	    this.ctx.drawImage(this.img, -this.width * 0.5, -this.height * 0.5, this.width, this.height);
	    this.ctx.restore();
	}

}