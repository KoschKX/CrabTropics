class Crater extends Enemy{

	name = 'Crater';

	frameRate = 24; useGravity = false; speed = 0; 

	width = 64; height = 24;

	IMAGES_STATIC = new Anim('./img/misc/craterA.png');
	imagesLib = [
		this.IMAGES_STATIC,
	]

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
		this.loadImage(this.IMAGES_STATIC.files[0]);
		this.changeAnimation(this.IMAGES_STATIC);
		let self = this; setTimeout(function(){
			self.changeAnimation(self.IMAGES_CLOSE);
		}, 2000);
		this.objtype = randomInt(0,2);
	}

	main(){
		super.main();
	}

	moveLeft(){}
	moveRight(){}

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
			if(anim==this.IMAGES_CLOSE){
        		this.destroy();
        	}
        }
	}

}