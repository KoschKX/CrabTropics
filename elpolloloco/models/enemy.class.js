class Enemy extends Character{

	name = 'Enemy';

	dead = false; dying = false;

	variant = 0;

	mvmtInterval;

	init() {
		super.init();
		//console.log('test');
		clearInterval(this.mvmtInterval); this.mvmtInterval = setInterval(() => { this.handleMovement(); }, 1000 / 60 );
	}

	main(){
		super.main();
	}

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
		if(!this.world){ return; }
		if(this.dead){ return; }

	    if(this.currDirection===0){
	    	this.moveLeft();
	    }
	    if(this.currDirection===1){
	    	this.moveRight();
	    }

	    if(this.currDirection===0&&this.x<this.width){
	    	this.currDirection=1;
		}
	    if(this.currDirection===1&&this.x>this.world.cvs.width-this.width){
	    	this.currDirection=0;
		}

	}


}