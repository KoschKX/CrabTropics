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

	loadedCallback;
	totalAssets = 0;
	loadedAssets = 0;
	loaded = false;

	constructor(player, enemies, clouds, backgrounds, projectiles, effects, bounds, ground){
		this.player = player;
		this.enemies = enemies;
		this.clouds = clouds;
		this.backgrounds = backgrounds;
		this.projectiles = projectiles;
		this.effects = effects;
		this.bounds = bounds;
		this.ground = 410;
	}

	setWorld(world){
		this.world = world;
		this.player.world = this.world;
		this.enemies.forEach((enemy) => { enemy.world = this.world; });
		this.projectiles.forEach((projectile) => { projectile.world = this.world; });
	}

	preload(callback){

		this.loadedCallback = callback;

		this.cacheImages( concat(this.player.imagesLib) ); 
	    this.enemies.forEach((enemy) => { this.cacheImages( concat(enemy.imagesLib) ); });

	    this.backgrounds.forEach((background) => { this.cacheImages( concat(background.imagesLib) ); });

	    let self = this;
	    this.effects.forEach((effect) => { this.cacheImages( concat(effect.imagesLib) ); self.effects=[]; });
	    this.projectiles.forEach((projectile) => { this.cacheImages( concat(projectile.imagesLib) ); self.projectiles=[]; });
	}

	init(){
		if(!this.loaded){ return; }
		this.enemies.forEach((enemy) => { enemy.init(); });
		this.backgrounds.forEach((background) => { background.init(); });
	    this.projectiles.forEach((projectile) => { projectile.init(); });
		this.effects.forEach((effect) => { effect.init(); });
		this.player.init();

		if(this.loadedCallback && typeof this.loadedCallback === 'function') {
			let self = this;
			setTimeout(function(){
				self.loadedCallback();
			}, 1000);
		}
	}

	cacheImages(images) {
		if(!images){ return; }
		let self = this;
		let cacheDiv = document.querySelector('#cache');
		if (cacheDiv) {;
			images.forEach(function(image) {

				if(image.startsWith('*')){self.loadedAssets += 1; return;}

				let checkCache = document.querySelector('#cache img[src="' + image + '"]');
				if (!checkCache) {
					let cachedImage = new Image();
					cachedImage.src = image;
					cacheDiv.appendChild(cachedImage);
					cachedImage.onload = function(){
						self.loadedAssets += 1;
						if(self.loadedAssets === self.totalAssets){
							self.loaded = true;
							self.init();
						}
						cachedImage.onload = null;
					};
					self.totalAssets += 1;
				}
				
			});
		}	
	}

}
