class Explosion extends MovableObject{

	name = 'Explosion';

	frameRate = 24; useGravity = false; speed = 0.25; 

	scale = 1;

	IMAGES_EXPLODE = new Anim('./img/explosionA/EXPLODE_001.png', 9 , '' );
	imagesLib = [
		this.IMAGES_EXPLODE,
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
		this.speed = random(0.25, 0.5); this.originalspeed = this.speed;
		this.loadImage(this.IMAGES_EXPLODE.files[0]);
		this.changeAnimation(this.IMAGES_EXPLODE);
	}

	main(){
		super.main();
	}
	
	handleAnimation(){
		this.playAnimation(this.currImageSet);
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