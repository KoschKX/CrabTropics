class Sparkle extends MovableObject{

	name = 'Sparkle';

	frameRate = 24; useGravity = false; speed = 0.25; 

	scale = 1;

	IMAGES_SPARKLEA = new Anim('./img/sparkle/SPARKLE_GREEN_001.png', 25 , '' );
	IMAGES_SPARKLEB = new Anim('./img/sparkle/GOLD_001.png', 25 , '' )
	imagesLib = [
		this.IMAGES_SPARKLEA,
		this.IMAGES_SPARKLEB,
	]

	target = null; offset = [0,0];
	
	constructor(world, variant=0, immediate = false){
		super(world); this.generateStamp(this.name);

		if(Array.isArray(variant) && variant.length >= 2){
			this.variant = randomInt(variant[0],variant[1]);
		}else{
			this.variant = variant;
		}

		if(immediate){ this.init();}
	}

	setTarget(target, offset=[]){
		this.target = target;
		this.offset = offset;
	}
	
	destroy(){
		this.world.level.effects = destroy(this, this.world.level.effects, this.world);
	    super.destroy();
	}

	init() {
		super.init();

		const variantData = [this.IMAGES_SPARKLEA, this.IMAGES_SPARKLEB];

		this.loadImage( variantData[this.variant].files[0] );

		if(this.variant == 0){ this.width = 256; this.height = 256; }
		if(this.variant == 1){ this.width = 128; this.height = 128; }

		this.changeAnimation( variantData[this.variant] );
	}

	main(delta){
		super.main(delta);
		if(this.target){ 
			this.x = this.target.x + ((this.target.width - this.width) * 0.5) + this.offset[0]; 
			this.y = this.target.y + ((this.target.height - this.height) * 0.5) + this.offset[1]; 
		}
	}

	playAnimation(anim){
		if( !this.world || !anim ){ return; }
		let i = this.currImage % anim.files.length;
        let path = anim.files[i];
        this.img = this.getCachedImage(path);
    	if(i < anim.files.length-1){
    		this.currImage++;
		}else{
        	this.destroy();
        }
	}

}