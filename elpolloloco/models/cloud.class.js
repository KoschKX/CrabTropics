class Cloud extends MovableObject{

	name = 'Cloud';

	scale = 1.5;

	y = 50;
	speed = 1;

	randx = 720;
	randy = 200;
	
	constructor(variant,randx,randy){

		switch(variant){
			case 0:
				super().loadImage('./img/beach/cloudA.png');
				this.width = 150*this.scale; this.height = 60*this.scale;
				break;

			case 1:
				super().loadImage('./img/beach/cloudB.png');
				this.width = 200*this.scale; this.height = 75*this.scale;
				break;
			case 2:
				super().loadImage('./img/beach/cloudC.png');
				this.width = 250*this.scale; this.height = 120*this.scale;
				break;
			default:
				console.log('Variant doesn\'t exist');
				break;
		}
		this.variant = variant;

		this.randx = randx; this.randy = randy;
		
		this.reset(true);

		this.animate();
	}

	reset(start){
		this.x = this.random(this.randx[0], this.randx[1]); this.y = this.random(this.randy[0], this.randy[1]); this.speed = this.random(0.15,0.25);
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