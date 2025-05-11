class Doubloon extends Enemy{

	name = 'Doubloon';

	frameRate = 24; useGravity = false; speed = 0; 

	width = 32; height = 32;

	IMAGES_SPINA = new Anim('./img/doubloon/SMALL_GOLD_SPIN_001.png', 29 , '');
	IMAGES_SPINB = new Anim('./img/doubloon/SMALL_SILVER_SPIN_001.png', 29 , '');
	imagesLib = [
		this.IMAGES_SPINA, this.IMAGES_SPINB
	]
	
	boxes = [[0, 0, this.width, this.height, 'lime', true]];

	buried = true; hostile = true; value = 0;
	
	constructor(world, variant=0, immediate = false){
		super(world); this.generateStamp(this.name);
		
		if(Array.isArray(variant) && variant.length >= 2){
			this.variant = randomInt(variant[0],variant[1]);
		}else{
			this.variant = variant;
		}

		if(immediate){ this.init(); }
	}
	
	destroy(){
		this.world.level.items = destroy(this, this.world.level.items, this.world);
	    super.destroy();
	}

	init() {
		super.init();

		const variantData = [this.IMAGES_SPINA, this.IMAGES_SPINB];

		this.loadImage( variantData[this.variant].files[0] );

		if(this.variant == 0){ this.value = 1; }
		if(this.variant == 1){ this.value = 5; }

		this.changeAnimation( variantData[this.variant] );
	}

	main(delta){
		super.main(delta);
	}

	moveLeft(){}

	moveRight(){}

}