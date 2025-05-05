class XMark extends Enemy{

	name = 'XMark';

	frameRate = 24; useGravity = false; speed = 0; 

	width = 64; height = 24;

	IMAGES_MARK = [
		'./img/misc/XMARK_DISTORTED_000.png',
	];

	boxes = [[0, 0, this.width, this.height, 'lime', true]];

	buried = true;
	
	constructor(immediate = false){
		super();
		if(immediate){
			this.init();
		}
	}
	
	destroy(){
		this.world.level.projectiles = destroy(this, this.world.level.projectiles, this.world);
	    super.destroy();
	}

	init() {
		super.init();

		this.loadImage(this.IMAGES_MARK[0]);
		this.changeAnimation(this.IMAGES_MARK);
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