class Cloud extends MovableObject{

	name = 'Cloud';

	scale = 1.5;

	y = 50;
	speed = 1;

	randx = 720; randy = 200;
	
	constructor(world, variant, randx, randy) {
		super(world); this.generateStamp(this.name);
		
		const variants = [
			{ img: './img/beach/cloudA.png', width: 150, height: 60 },
			{ img: './img/beach/cloudB.png', width: 200, height: 75 },
			{ img: './img/beach/cloudC.png', width: 250, height: 120 },
		];
		if (variants[variant]) {
			const { img, width, height } = variants[variant];
			this.loadImage(img);
			this.width = width * this.scale; this.height = height * this.scale;
		}
		this.variant = variant;
		this.randx = randx; this.randy = randy;
		this.reset(true);
		this.animate();
	}

	reset(start){
		this.x = random(this.randx[0], this.randx[1]); this.y = random(this.randy[0], this.randy[1]); this.speed = random(0.15,0.25);
		if(!start){ this.x += 720; }
	}

	animate(){
		setInterval(() => {
			if(this.x<-this.width){
				this.reset(false);
			}else{
				this.x-=this.speed;
			}
		}, 1000 / 60);
	}

}