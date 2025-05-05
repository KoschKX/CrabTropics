class ShovelHole extends Enemy{

	name = 'XMark';

	frameRate = 24; useGravity = false; speed = 0; 

	width = 64; height = 24;

	IMAGES_OPEN = [
		'./img/misc/SHOVELHOLE_OPEN_000.png',
	];

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
		this.loadImage(this.IMAGES_OPEN[0]);
		this.changeAnimation(this.IMAGES_OPEN);
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