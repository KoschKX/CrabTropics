class ShovelHole extends Enemy{

	name = 'XMark';

	frameRate = 24; useGravity = false; speed = 0; 

	width = 64; height = 24;

	IMAGES_OPEN = new Anim('./img/misc/SHOVELHOLE_OPEN_001.png',0 , '' );
	IMAGES_CLOSE = new Anim('./img/misc/SHOVELHOLE_CLOSE_001.png',4 , '' );
	imagesLib = [
		this.IMAGES_OPEN, this.IMAGES_CLOSE,
	]

	createobj;

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
		this.loadImage(this.IMAGES_OPEN.files[0]);
		this.changeAnimation(this.IMAGES_OPEN);
		let self = this; setTimeout(function(){
			self.changeAnimation(self.IMAGES_CLOSE);
		}, 2000);
	}

	main(){
		super.main();
	}

	createCrab(){
		let self = this; setTimeout(function(){
			if(self.createobj){ return; }
			self.createobj = new Crab(0);
		  	self.createobj.world = self.world;
		  	self.createobj.init();

		  	self.createobj.x = self.x + (self.width - self.createobj.width) * 0.5; self.createobj.y = self.y;
		  	self.createobj.changeAnimation(self.createobj.IMAGES_APPEARA);
		  	self.createobj.appearing = true; self.createobj.static = true;
		  	self.world.level.enemies.push(self.createobj);
		 }, 1500);
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
        if(i==0){
        	this.createCrab();
        }
    	if(i < anim.files.length-1){
    		this.currImage++;
		}else{
			if(anim==this.IMAGES_CLOSE){
        		this.destroy();
        	}
        }
	}

}