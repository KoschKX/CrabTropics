class Doubloon extends Enemy{

	name = 'Doubloon';

	frameRate = 24; useGravity = false; speed = 0; 

	width = 32; height = 32;

	IMAGES_SPIN = new Anim('./img/doubloon/DOUBLOON_SPIN_001.png',29 , '');
	imagesLib = [
		this.IMAGES_SPIN,
	]
	
	boxes = [[0, 0, this.width, this.height, 'lime', true]];

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
		this.loadImage(this.IMAGES_SPIN.files[0]);
		this.changeAnimation(this.IMAGES_SPIN);
	}

	main(delta){
		super.main(delta);
	}

	moveLeft(){}

	moveRight(){}

}