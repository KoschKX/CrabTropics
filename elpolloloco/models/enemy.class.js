class Enemy extends Character{

	name = 'Enemy'; isBoss = false;
	dead = false; dying = false; 
	variant = 0;

	mvmtInterval;

	init() {
		super.init();
		clearInterval(this.mvmtInterval); this.mvmtInterval = setInterval(() => { this.handleMovement(); }, 1000 / 60 );
	}
	destroy(){ super.destroy(); clearInterval(this.mvmtInterval); }

	main(){ super.main(); }

	handleAnimation(){ super.handleAnimation();}

	handleMovement(){
		if(!this.world || this.dead){ return; }
		this.currDirection === 0 && this.moveLeft();
	    this.currDirection === 1 && this.moveRight();
	    this.currDirection === 0 && this.x < this.world.level.bounds[0] && (this.currDirection = 1);
	    this.currDirection === 1 && this.x > this.world.level.bounds[2] - this.width && (this.currDirection = 0);
	}

}