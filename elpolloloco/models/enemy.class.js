class Enemy extends Character{

	name = 'Enemy';

	dead = false; dying = false;

	variant = 0;

	mvmtInterval;

	init() {
		super.init();
		clearInterval(this.mvmtInterval); this.mvmtInterval = setInterval(() => { this.handleMovement(); }, 1000 / 60 );
	}
	main(){ super.main(); }

	handleAnimation(){
		this.hurt=this.isHurt();

		if(this.dead||this.hurt){
			switch(this.variant){
				case 0:
					this.changeAnimation(this.IMAGES_DIEA);
					break;
				case 1:
					this.changeAnimation(this.IMAGES_DIEB);
					break;
				default:
					break;
			}
		}else{
			switch(this.variant){
				case 0:
					this.changeAnimation(this.IMAGES_MOVEA);
					break;
				case 1:
					this.changeAnimation(this.IMAGES_MOVEB,this.IMAGES_MOVESB_OFFSETS);
					break;
				default:
					break;
			}
		}

		this.playAnimation(this.currImageSet);

		if(this.currImageSet==this.IMAGES_MOVEB || this.currImageSet==this.IMAGES_MOVEA){
			this.applyAnimationOffsets(this.currOffsetSet);
		}

	}

	handleMovement(){
		if(!this.world || this.dead){ return; }
		this.currDirection === 0 && this.moveLeft();
	    this.currDirection === 1 && this.moveRight();
	    this.currDirection === 0 && this.x < this.world.level.bounds[0] && (this.currDirection = 1);
	    this.currDirection === 1 && this.x > this.world.level.bounds[2] - this.width && (this.currDirection = 0);
	}

}