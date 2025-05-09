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

	init() {
		super.init();
		clearInterval(this.ctrlInterval); this.ctrlInterval = setInterval(() => { this.handleControls(); }, 1000 / 60 );
	}
	main() { super.main(); }

	handleControls(){
		if(!this.world || ! this.world.keyboard){ return; }
		if(this.dead){ this.deactivateColliders(); return; } else { this.activateColliders(); }
		if(this.world.keyboard.LEFT){
			this.facingRight=false; this.moveLeft();
		}
		if(this.world.keyboard.RIGHT){
			this.facingRight=true; this.moveRight();
		}
		if(this.world.keyboard.SPACE && !this.isAboveGround()){
			this.jump();
		}
	}

	drawCollider(ctx, idx){
		if(!this.dead){ super.drawCollider(ctx, idx); }
	}

	isHit(makeInvincible){
		super.isHit(makeInvincible);
		if(this.health==0){
			this.world.audio.playSound('pirate_dieA',1.0, false);
		}else{
			this.world.audio.playSound(['pirate_hitA', 'pirate_hitB', 'pirate_hitC'],1.0, false);
		}
	}

	getItem(item){
		if(item.name=="Doubloon"){
			this.doubloons+=1;
			this.world.audio.playSound('doubloon_getA');
		}
		 item.destroy();
	}

	bounce(spd,point){
		super.bounce(spd,point);
		this.world.audio.playSound('jump');
	}

	jump(){
		super.jump();
		this.world.audio.playSound('jump');
	}

}