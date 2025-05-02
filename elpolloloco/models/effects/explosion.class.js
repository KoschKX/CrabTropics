class Explosion extends MovableObject{

	name = 'Explosion';

	frameRate = 24; useGravity = false; 
	speed = 0.25; frameRate = 24;

	scale = 1;

	IMAGES_EXPLODE = [
		'./img/explosionA/EXPLODE_001.png', './img/explosionA/EXPLODE_002.png', './img/explosionA/EXPLODE_003.png',
		'./img/explosionA/EXPLODE_004.png', './img/explosionA/EXPLODE_005.png', './img/explosionA/EXPLODE_006.png',
		'./img/explosionA/EXPLODE_007.png', './img/explosionA/EXPLODE_008.png', './img/explosionA/EXPLODE_009.png',
	];
	
	frameRate = 24; 
	
	constructor(immediate = false){
		super();
		if(immediate){
			this.init();
		}
	}
	
	init() {
		super.init();

		this.speed = random(0.25, 0.5); this.originalspeed = this.speed;

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
		if( !this.world || !anim ){ return; }
		let i = this.currImage % anim.length;
        let path = anim[i];
        
        if(!this.imageCache[path]){ return; }

        this.img.src = this.imageCache[path];

    	if(i < anim.length-1){
    		this.currImage++;
		}else{
        	this.world.level.effects = destroy(this, this.world.level.effects, this.world);
        }
	}

	getImages(){
		let images = [];
		
		images = images.concat(this.IMAGES_EXPLODE);

		return images;
	}

}