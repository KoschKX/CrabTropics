class SeaTurtle extends Enemy{

	name = 'SeaTurtle'; isboss = true;

	health = 30;

	x=0; y=0; width = 1000; height = 1000; groundOffset = 0;

	frameRate = 24; useGravity = false; static = true;

	boxes_fine = [
					[this.width*0.25, this.height*0.35, this.width*0.50, this.height*0.60, 'red', true],
					[this.width*0.15, this.height*0.10, this.width*0.7, this.height*0.25, 'yellow', true]
					//[this.width*0.33, this.height*0.25, this.width*0.34, this.height*0.20, 'yellow', true]
				 ]
	boxes_hurt = [
					[this.width*0.25, this.height*0.46, this.width*0.50, this.height*0.48, 'red', true],
					//[this.width*0.15, this.height*0.25, this.width*0.7, this.height*0.20, 'yellow', true]
					[this.width*0.37, this.height*0.25, this.width*0.25, this.height*0.20, 'yellow', true]
				 ]

	boxes=this.boxes_fine;

	hostile = false; stomp; bounceoninjured = true;

	state = 0; sttInterval; retreatTimeout;

	IMAGES_WALK = new Anim('./img/seaturtle/WALK_001.png', 40, '');
	IMAGES_EAT = new Anim('./img/seaturtle/EAT_001.png', 35, 'repeat=0');
	IMAGES_SLAP = new Anim('./img/seaturtle/SLAP_001.png', 35, 'repeat=0');
	IMAGES_COLLAPSE = new Anim('./img/seaturtle/COLLAPSE_001.png', 12, 'repeat=0');
	IMAGES_RETREAT = new Anim('./img/seaturtle/RETREAT_001.png', 11, 'repeat=0');
	imagesLib = [
		this.IMAGES_WALK, this.IMAGES_EAT, this.IMAGES_COLLAPSE, this.IMAGES_RETREAT, this.IMAGES_SLAP, 
	]

	constructor(){
		super(); 
	}

	init() {
		super.init();
		this.loadImage(this.IMAGES_WALK.files[0]);
		this.changeAnimation(this.IMAGES_WALK);

		this.x = (this.world.cvs.width  - this.width) * 0.5; 
		this.y = (this.world.cvs.height  - this.height) * 0.33; 

		let self = this; this.sttInterval = setInterval(function(){
			let rstate = randomInt(1,1);
			if(self.state == 0){
				self.changeState(rstate);
			}
		}, 2000 ); 
	}

	main(){
		super.main();
	}

	isHit(){
		super.isHit(); 
		this.world.audio.playSound(['crab_hitA','crab_hitB','crab_hitC']);
	}


	handleAnimation(){
		this.playAnimation(this.currImageSet);
		if(this.appearing && this.currImage == this.currImageSet.files.length - 1){
			this.appearing = false;
		}
		if(this.state == 1 && this.currImage == 20){
			let rstate = randomInt(0,100);
			if(rstate>66){ this.collapse(); }
		}
		if((this.state == 1 || this.state == 4) && this.currImage == this.currImageSet.files.length - 1){
			this.walk();
		}
		if(this.state == 3 && this.currImage == this.currImageSet.files.length - 1){
			this.currImage == 20;
			this.retreat();
		}
	}

	handleMovement(){}


	changeState(state){
		if(state == this.state){ return; }
		switch(state){
			case 0:
				this.walk();
				break;
			case 1:
				this.eat();
				break;
			case 2:
				this.slap();
				break;
			case 3:
				this.collapse();
				break;
			case 4:
				this.retreat();
				break;
		}
		if(state==0){
			
		}
	}

	walk(){
		if(this.state == 0){ return; }
		this.state = 0; this.currImage = 0; 
		this.changeAnimation(this.IMAGES_WALK);
	}

	eat(){
		if(this.state == 1){ return; }
		this.state = 1; this.currImage = 0; 
		this.changeAnimation(this.IMAGES_EAT);
	}
	
	slap(){
		if(this.state == 2){ return; }
		this.state = 2; this.currImage = 0; 
		this.changeAnimation(this.IMAGES_SLAP);
	}

	collapse(){
		if(this.state == 3){ return; }
		this.state = 3; this.currImage = 0; 
		this.changeAnimation(this.IMAGES_COLLAPSE);
	}

	retreat(){
		if(this.state == 4 || this.retreatTimeout){ return; }
		clearTimeout(this.retreatTimeout);
		let self = this; this.retreatTimeout = setTimeout(function(){
			self.state = 4; 
			self.currImage = 0; 
			self.changeAnimation(self.IMAGES_RETREAT);
			self.retreatTimeout = false;
		}, 2000);
	}



	destroy(){
		clearInterval(this.sttInterval); clearTimeout(this.retreatTimeout);
		this.world.level.enemies = destroy(this, this.world.level.enemies, this.world);
	}

	die(){
		this.destroy();
	}

	moveLeft(){}
	moveRight(){}

}