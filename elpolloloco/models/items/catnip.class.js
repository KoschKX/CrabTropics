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
	
	constructor(world, immediate = false){
		super(world); this.generateStamp(this.name);
		
		if(immediate){ this.init(); }
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

	main(delta){
		super.main(delta);
	}

	moveLeft(){}

	moveRight(){}

}