class Explosion extends MovableObject{

	name = 'Explosion';

	frameRate = 24; useGravity = false; speed = 0.25; 

	scale = 1;

	IMAGES_EXPLODE = new Anim('./img/explosionA/EXPLODE_001.png', 9 , '' );
	imagesLib = [
		this.IMAGES_EXPLODE,
	]
	
	constructor(world, immediate = false){
		super(world); this.generateStamp(this.name);

		if(immediate){ this.init();}
	}
	
	destroy(){
		this.world.level.effects = destroy(this, this.world.level.effects, this.world);
	    super.destroy();
	}

	init() {
		super.init();
		this.speed = random(0.25, 0.5); this.originalspeed = this.speed;
		this.loadImage(this.IMAGES_EXPLODE.files[0]);
		this.changeAnimation(this.IMAGES_EXPLODE);
	}

	main(delta){
		super.main(delta);
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