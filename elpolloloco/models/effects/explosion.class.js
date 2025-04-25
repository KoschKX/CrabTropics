class Explosion extends MovableObject{

	name = 'Explosion';

	frameRate = 24; useGravity = false; 
	speed = 0.25; frameRate = 24;

	scale = 1;

	IMAGES_EXPLODE = [
		'./img/explosionA/EXPLODE_001.png',
		'./img/explosionA/EXPLODE_002.png',
		'./img/explosionA/EXPLODE_003.png',
		'./img/explosionA/EXPLODE_004.png',
		'./img/explosionA/EXPLODE_005.png',
		'./img/explosionA/EXPLODE_006.png',
		'./img/explosionA/EXPLODE_007.png',
		'./img/explosionA/EXPLODE_008.png',
		'./img/explosionA/EXPLODE_009.png',
	];
	
	frameRate = 24; 
	
	constructor(){
		super();
		this.init();
	}
	
	init() {
		super.init();

		this.speed = this.random(0.25, 0.5); this.originalspeed = this.speed;

		this.loadImage('./img/explosionA/EXPLODE_001.png');
		this.changeAnimation(this.IMAGES_EXPLODE);
	}

	main(){
		super.main();
	}
	
	handleAnimation(){
		this.playAnimation(this.currImageSet);
	}

	playAnimation(anim){
		if(anim){
	    	let i = this.currImage % anim.length;
	        let path = anim[i];
	        
	        if(!this.imageCache[path]){ return; }

	        this.img.src = this.imageCache[path];

        	if(i < anim.length-1){
        		this.currImage++;
    		}else{
	        	this.destroy();
	        }
	    }
	}

	destroy(){
		let toRemove = world.level.effects.find(obj => obj.stamp === this.stamp);
		world.level.effects = world.level.effects.filter(obj => obj !== toRemove);
	}

}