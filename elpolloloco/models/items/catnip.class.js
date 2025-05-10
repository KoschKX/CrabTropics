class Catnip extends Enemy{

	name = 'Catnip';

	frameRate = 24; useGravity = false; speed = 0; 

	width = 64; height = 64;

	IMAGES_SPARKLE = new Anim('./img/catnip/SPARKLE_001.png',1, '');
	imagesLib = [
		this.IMAGES_SPARKLE,
	]
	
	boxes = [[this.width * 0.25, 0, this.width * 0.5, this.height, 'lime', true]];

	buried = true; hostile = true;
	
	constructor(immediate = false){
		super();
		if(immediate){ this.init(); }
		this.generateStamp(this.name);
	}
	
	destroy(){
		this.world.level.items = destroy(this, this.world.level.items, this.world);
	    super.destroy();
	}

	init() {
		super.init();
		this.loadImage(this.IMAGES_SPARKLE.files[0]);
		this.changeAnimation(this.IMAGES_SPARKLE);
	}

	main(){
		super.main();
	}

	moveLeft(){}

	moveRight(){}

	handleAnimation(){
		this.playAnimation(this.currImageSet);
	}

}