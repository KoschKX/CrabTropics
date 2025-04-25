class Level{
	world;

	player
	enemies;
	clouds;
	backgroundA;
	backgroundB;
	backgroundC;
	ground;

	effects;

	constructor(player, enemies, clouds, backgroundA, backgroundB, backgroundC, ground){
		this.player = player;
		this.enemies = enemies;
		this.clouds = clouds;
		this.backgroundA = backgroundA;
		this.backgroundB = backgroundB;
		this.backgroundC = backgroundC;
		this.ground = ground;

		this.effects = [];
	}

	setWorld(world){
		this.world = world;
		this.player.world = this.world;
		this.enemies.forEach((enemy) => { enemy.world = this.world; });
	}

}
