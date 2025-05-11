class Player extends Character{

	name = 'Character';

	health = 3; starthealth = 3;

	box = [ this.width, this.height, this.width, this.height ];

	constructor(world) { super(world); }
	init() { super.init(); }
	main(world) { super.main(); this.handleControls(); }

	destroy(){
		super.destroy();
	}

	reset(){}

	handleControls(){
		if(!this.world || !this.world.keyboard){ return; }
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
			this.world.audio.playSound('pirate_dieA', 1.0, false);
		}else{
			this.world.audio.playSound(['pirate_hitA', 'pirate_hitB', 'pirate_hitC'], 1.0, false);
		}
	}

	getItem(item){
		if(item.name=="Doubloon"){
			this.doubloons+=item.value;
			this.world.audio.playSound('doubloon_getA');
			let sparkle = new Sparkle(this.world, 1, true); sparkle.setTarget(this, [0, -this.height * 0.66 ] );
			this.world.level.effects.push(sparkle);
		}else if(item.name=="Catnip"){
			this.health+=1;
			if( this.health > this.maxHealth){ this.health = this.maxHealth; }
			this.world.audio.playSound('catnip_getA');
			let sparkle = new Sparkle(this.world, 0, true); sparkle.setTarget(this,[0, -this.height * 0.5 ] );
			this.world.level.effects.push(sparkle);
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