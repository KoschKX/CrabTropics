class ShovelHole extends Enemy{

	name = 'XMark';

	frameRate = 24; useGravity = false; speed = 0; 

	width = 64; height = 24;

	IMAGES_OPEN = new Anim('./img/misc/SHOVELHOLE_OPEN_001.png',0 , '' );
	IMAGES_CLOSE = new Anim('./img/misc/SHOVELHOLE_CLOSE_001.png',4 , '' );
	imagesLib = [
		this.IMAGES_OPEN, this.IMAGES_CLOSE,
	]

	createobj; objtype;

	constructor(immediate = false){
		super();
		if(immediate){
			this.init();
		}
		this.generateStamp(this.name);
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

		this.objtype = randomInt(0,2);
    	
	}

	main(){
		super.main();
	}

	createDoubloon(){
		let self = this; setTimeout(function(){
			if(self.createobj){ return; }
			self.createobj = new Doubloon();
		  	self.createobj.world = self.world;
		  	self.createobj.init();
		  	self.createobj.x = self.x + (self.width - self.createobj.width) * 0.5; self.createobj.y = self.y - self.height;
		  	self.createobj.changeAnimation(self.createobj.IMAGES_SPIN);
		  	self.world.level.items.push(self.createobj);
		  	self.world.audio.playSound('doubloon_findA', 1.0);
		 }, 1000);
	}

	createCrab() {
		setTimeout(() => {
			if (this.createobj) return;
			this.createobj = new Crab([0, 2]);
			this.createobj.world = this.world;
			this.createobj.init();
			this.createobj.x = this.x + (this.width - this.createobj.width) * 0.5;
			this.createobj.y = this.y;
			const animations = [
				this.createobj.IMAGES_APPEARA1, this.createobj.IMAGES_APPEARA2, this.createobj.IMAGES_APPEARA3
			];
			const anim = animations[this.createobj.variant];
			if (anim) this.createobj.changeAnimation(anim);
			this.createobj.appearing = true;
			this.createobj.static = true;
			this.world.level.enemies.push(this.createobj);
		}, 1500);
	}

	moveLeft(){}

	moveRight(){}

	handleAnimation(){
		this.playAnimation(this.currImageSet);
	}

	playAnimation(anim) {
		if (!this.world || !anim) return;
		const i = this.currImage % anim.files.length;
		const path = anim.files[i];
		if (!this.imageCache[path]) return;
		this.img.src = this.imageCache[path];
		if (i === 0) {
			const actions = {
				1: this.createCrab, 2: this.createDoubloon
			};
			const action = actions[this.objtype];
			if (action) action.call(this);
		}
		if (i < anim.files.length - 1) {
			this.currImage++;
		} else if (anim === this.IMAGES_CLOSE) {
			this.destroy();
		}
	}

}