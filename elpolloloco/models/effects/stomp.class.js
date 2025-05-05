class Stomp extends MovableObject{

	name = 'Stomp';

	width = 400; height = 300;

	frameRate = 24; useGravity = false; 
	speed = 0.25; frameRate = 30;

	scale = 1;

	IMAGES_STOMP = [
		'./img/stompA/STOMP_001.png', './img/stompA/STOMP_002.png', './img/stompA/STOMP_003.png',
		'./img/stompA/STOMP_004.png', './img/stompA/STOMP_005.png', './img/stompA/STOMP_006.png',
		'./img/stompA/STOMP_007.png', './img/stompA/STOMP_008.png', './img/stompA/STOMP_009.png',
		'./img/stompA/STOMP_010.png', './img/stompA/STOMP_011.png', './img/stompA/STOMP_012.png',
		'./img/stompA/STOMP_013.png', './img/stompA/STOMP_014.png', './img/stompA/STOMP_015.png',
		'./img/stompA/STOMP_016.png', './img/stompA/STOMP_017.png', './img/stompA/STOMP_018.png',
		'./img/stompA/STOMP_019.png', './img/stompA/STOMP_020.png', './img/stompA/STOMP_021.png',
		'./img/stompA/STOMP_022.png', './img/stompA/STOMP_023.png', './img/stompA/STOMP_024.png',
		'./img/stompA/STOMP_025.png', './img/stompA/STOMP_026.png', './img/stompA/STOMP_027.png',
		'./img/stompA/STOMP_028.png',
	];
	
	constructor(immediate = false){
		super();
		if(immediate){
			this.init();
		}
	}
	
	destroy(){
		this.world.level.effects = destroy(this, this.world.level.effects, this.world);
	    super.destroy();
	}

	init() {
		super.init();
		this.loadImage(this.IMAGES_STOMP[0]);
		this.changeAnimation(this.IMAGES_STOMP);
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
        	this.destroy();
        }
	}

}