class Level{
	world;

	player
	enemies = [];
	clouds = [];
	backgroundA;
	backgroundB;
	backgroundC;
	projectiles = [];
	effects = [];

	bounds = [0,0,0,0]
	ground;

	constructor(player, enemies, clouds, backgroundA, backgroundB, backgroundC, projectiles, effects, bounds, ground){
		this.player = player;
		this.enemies = enemies;
		this.clouds = clouds;
		this.backgroundA = backgroundA;
		this.backgroundB = backgroundB;
		this.backgroundC = backgroundC;
		this.projectiles = projectiles;
		this.effects = effects;

		// CLOCKWISE 
		this.bounds = bounds;

		this.ground = 410;
	}

	setWorld(world){
		this.world = world;
		this.player.world = this.world;
		this.enemies.forEach((enemy) => { enemy.world = this.world; });
		this.projectiles.forEach((projectile) => { projectile.world = this.world; });
	}

	preload(){
		this.cacheImages(this.player.getImages());
	    this.enemies.forEach((enemy) => { this.cacheImages(enemy.getImages()); });

	    let self = this;
	    this.effects.forEach((effect) => { this.cacheImages(effect.getImages()); self.effects=[]; });
	    this.projectiles.forEach((projectile) => { this.cacheImages(projectile.getImages()); self.projectiles=[]; });
	}

	cacheImages(images) {
		if(!images){ return; }
		let cacheDiv = document.querySelector('#cache');
		if (cacheDiv) {;
			images.forEach(function(image) {
				let checkCache = document.querySelector('#cache img[src="' + image + '"]');
				if (!checkCache) {
					cacheDiv.innerHTML += '<img src="' + image + '" />';
				}
			});
		}	
	}

}
