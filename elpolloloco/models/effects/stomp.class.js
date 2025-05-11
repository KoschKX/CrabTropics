class Stomp extends MovableObject{

	name = 'Stomp';

	width = 400; height = 300;

	frameRate = 24; useGravity = false; 
	speed = 0.25; frameRate = 30;

	scale = 1;

	IMAGES_STOMP = new Anim('./img/stompA/STOMP_001.png', 28 , '' );
	imagesLib = [
		this.IMAGES_STOMP
	]
	
	constructor(world, immediate = false){
		super(world); this.generateStamp(this.name);
		
		if(immediate){ this.init(); }
	}
	
	destroy(){
		this.world.level.effects = destroy(this, this.world.level.effects, this.world);
	    super.destroy();
	}

	init() {
		super.init();
		this.loadImage(this.IMAGES_STOMP.files[0]);
		this.changeAnimation(this.IMAGES_STOMP);
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