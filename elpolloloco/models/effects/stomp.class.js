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
	
	constructor(immediate = false){
		super();
		if(immediate){
			this.init();
		}
		this.generateStamp(this.name);
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
        if(!this.imageCache[path]){ return; }
        this.img.src = this.imageCache[path];
    	if(i < anim.files.length-1){
    		this.currImage++;
		}else{
        	this.destroy();
        }
	}

}