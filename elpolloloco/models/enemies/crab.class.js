class Crab extends Enemy{

	name = 'Crab';

	health = 3;

	height = 64; width = 192; groundOffset = 0;

	frameRate = 24; useGravity = true; 

	speed = 3; 

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

	hostile = true; bounceoninjured = true;

	IMAGES_MOVEA 	= new Anim('./img/crabA/YELLOW_MOVE_001.png',   12, 					 ''				);
	IMAGES_MOVEB 	= new Anim('./img/crabB/RED_MOVE_001.png',      12,						 ''				);
	IMAGES_DIEA  	= new Anim('./img/crabA/YELLOW_DIE_004.png',    [4,5,6,7,8,9,10,11,12],  'repeat=0'		);
	IMAGES_DIEB  	= new Anim('./img/crabB/RED_DIE_004.png',     	 [4,5,6,7,8,9,10,11,12], 'repeat=0' 	);
	IMAGES_APPEARA  = new Anim('./img/crabA/YELLOW_APPEAR_001.png', [4,5,6,7,8,9,10,11,12],  'repeat=0'		);
	imagesLib = [
		this.IMAGES_MOVEA, this.IMAGES_MOVEB,
		this.IMAGES_DIEA, this.IMAGES_DIEB,
		this.IMAGES_APPEARA,
	]

	stomp; walksound;

	constructor(variant){
		super();
		this.variant=variant;
		
		this.x = 200 + random(0,  500); this.y = 64;  
		this.speed = random(0.5, 1); this.originalspeed = this.speed;

		//this.init();
	}

	init() {
		super.init();
		this.loadImage(this.IMAGES_BLANK.files[0]);
		this.currImageSet = this.IMAGES_IDLE;
	}

	main(){
		super.main();
		
		if(this.invincible && !this.dead){
			this.static = true; 
			let self = this; this.revive(3000, function(){
				self.static = false; self.invincible = false;  self.hostile = true;
			});
		}

		if(this.dead){
			let self = this; this.dieTimeout = setTimeout(function(){ self.die(); }, 1000);
		}
		if(this.hurt || this.dead){
			this.boxes = this.boxes_hurt;
			this.toggleCollider(0,false);
		}else{
			this.boxes = this.boxes_fine;
			this.toggleCollider(0,true);
		}

	}

	isHit(){
		super.isHit(); 
		this.currImage=0; this.invincible = true; this.static = true; this.hostile=false;
		if(this.health <= 0) clearTimeout(this.reviveTimout);
		this.world.audio.playSound(['crab_hitA','crab_hitB','crab_hitC']);
	}

	moveLeft() {
	    if (!this.world || this.static || this.dead) { return; }
	    super.moveLeft();
		if (!this.walksound || !this.world.audio.isSpecificSoundPlaying('crab_walkA', this.walksound)) {
		    this.walksound = this.world.audio.playSound('crab_walkA', 0.25, true);
		}
	}

	moveRight() {
	    if (!this.world || this.static || this.dead) { return; }
	    super.moveRight();
		if (!this.walksound || !this.world.audio.isSpecificSoundPlaying('crab_walkA', this.walksound)) {
		    this.walksound = this.world.audio.playSound('crab_walkA', 0.25, true);
		}
	}

	handleAnimation(){
		if(!this.appearing){ 
			const variantData = {
			  0: { invincible: this.IMAGES_DIEA, move: this.IMAGES_MOVEA },
			  1: { invincible: this.IMAGES_DIEB, move: this.IMAGES_MOVEB }
			}[this.variant];

			if (variantData) {
			  const { move, invincible, offsets } = variantData;
			  this.changeAnimation((this.invincible || this.dead) || this.hurt ? invincible : move, (this.invincible || this.dead) || this.hurt ? undefined : offsets);
			} else {
			  console.log('Variant doesn\'t exist');
			}
		}

		this.playAnimation(this.currImageSet);

		if (   this.currImageSet == this.IMAGES_MOVEB 
			|| this.currImageSet == this.IMAGES_MOVEA
		){
			this.applyAnimationOffsets(this.currOffsetSet);
		}	

		if(this.appearing && this.currImage == this.currImageSet.files.length - 1){
			this.appearing = false; this.static=false;
		}
	}

	destroy(){
		super.destroy();
		clearTimeout(this.dieTimeout); clearTimeout(this.reviveTimout);
	}


	die(){
		if(this.stomp) { return; }
		this.stomp = new Stomp(true);
		this.stomp.world = this.world;
		this.stomp.x = (this.x + (this.width - this.stomp.width) * 0.5);
		this.stomp.y = (this.y + (this.height - this.stomp.height) * 0.5) - 20;
		this.world.level.effects.push(this.stomp);
		this.world.level.enemies = destroy(this, this.world.level.enemies, this.world);
		this.destroy();
	}

}