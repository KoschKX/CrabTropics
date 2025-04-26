class Player extends Character{

	name = 'Character';

	health = 3; starthealth = 3;

	box = [
		this.width,
		this.height,
		this.width,
		this.height
	];

	ctrlInterval;

	init(){
		super.init();
		clearInterval(this.ctrlInterval); this.ctrlInterval = setInterval(() => { this.handleControls(); }, 1000 / 60 );
	}

	main(){
		super.main();
	}

	handleControls(){
		if(!this.world || ! this.world.keyboard){ return; }

		if(this.dead){ this.deactivateColliders(); return; } else { this.activateColliders(); }

		if(this.world.keyboard.LEFT){
    		this.moveLeft();
		}
		if(this.world.keyboard.RIGHT){
			this.moveRight();
		}
		if(this.world.keyboard.SPACE && !this.isAboveGround()){
			this.jump();
		}
	}

	drawCollider(ctx, idx){
		if(!this.dead){ super.drawCollider(ctx, idx); }
	}

}