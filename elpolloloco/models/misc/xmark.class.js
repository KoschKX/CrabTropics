class XMark extends Enemy{

	name = 'XMark';

	frameRate = 24; useGravity = false; speed = 0; 

	width = 64; height = 24;

	IMAGES_MARK = new Anim('./img/misc/XMARK_DISTORTED_001.png',1 , '');
	imagesLib = [
		this.IMAGES_MARK,
	]
	
	boxes = [[0, 0, this.width, this.height, 'lime', true]];

	buried = true;
	
	constructor(immediate = false){
		super();
		if(immediate){
			this.init();
		}
		this.generateStamp(this.name);
	}
	
	destroy(){
		this.world.level.projectiles = destroy(this, this.world.level.projectiles, this.world);
	    super.destroy();
	}

	init() {
		super.init();
		this.loadImage(this.IMAGES_MARK.files[0]);
		this.changeAnimation(this.IMAGES_MARK);
	}

	main(delta){
		super.main(delta);
	}

	moveLeft(){}
	
	moveRight(){}

}