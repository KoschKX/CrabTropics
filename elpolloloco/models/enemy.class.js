class Enemy extends Character{

	name = 'Enemy'; isBoss = false; attacksEnemies = false;
	dead = false; dying = false; 
	variant = 0;

	constructor(world) { super(world); }
	init() { super.init(); }
	
	destroy(){ super.destroy(); }

	main(delta){ super.main(delta); this.handleMovement(); }

	handleAnimation(){ super.handleAnimation();}

	handleMovement(){
		if(!this.initialized || this.dead){ return; }
		this.currDirection === 0 && this.moveLeft();
	    this.currDirection === 1 && this.moveRight();
	    this.currDirection === 0 && this.x < this.world.level.bounds[0] && (this.currDirection = 1);
	    this.currDirection === 1 && this.x > this.world.level.bounds[2] - this.width && (this.currDirection = 0);
	}

}