class Level{
	world;

	player
	enemies = [];
	clouds = [];
	backgroundA;
	backgroundB;
	backgroundC;
	items = [];
	projectiles = [];
	effects = [];

	bounds = [0,0,0,0]
	ground;

	loadedCallback;
	totalAssets = 0;
	loadedAssets = 0;
	loaded = false;

	constructor(player, enemies, clouds, backgrounds, items, projectiles, effects, bounds, ground){
		this.player = player;
		this.enemies = enemies;
		this.clouds = clouds;
		this.backgrounds = backgrounds;
		this.items = items;
		this.projectiles = projectiles;
		this.effects = effects;
		this.bounds = bounds;
		this.ground = 410;
	}

	setWorld(world){
		this.world = world;
		this.player.world = this.world;
		this.enemies.forEach((enemy) => { enemy.world = this.world; });
		this.items.forEach((item) => { item.world = this.world; });
		this.projectiles.forEach((projectile) => { projectile.world = this.world; });
	}

	preload(callback){

		this.loadedCallback = callback;

		this.cacheImageLib( this.player.imagesLib ); 
	    this.enemies.forEach((enemy) => { this.cacheImageLib( enemy.imagesLib); });

	    this.backgrounds.forEach((background) => { this.cacheImageLib( background.imagesLib); });

	    let self = this;
	    this.items.forEach((item) => { this.cacheImageLib( item.imagesLib ); self.items=[]; });
	    this.effects.forEach((effect) => { this.cacheImageLib( effect.imagesLib ); self.effects=[]; });
	    this.projectiles.forEach((projectile) => { this.cacheImageLib( projectile.imagesLib ); self.projectiles=[]; });

	}

	init(){
		if(!this.loaded){ return; }
		this.enemies.forEach((enemy) => { enemy.init(); });
		this.backgrounds.forEach((background) => { background.init(); });
		this.items.forEach((item) => { item.init(); });
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

	cacheImageLib(imagesLib) {
		let libs = concat(imagesLib);
		let images = [];
		libs.forEach(lib => { 
			if(!lib.files || !lib.files.length){ return; }
			lib.files.forEach(img => { 
				images.push(img);
			});
		});
		if(images){ this.cacheImages(images); }
		//this.cacheImages(images);
		//this.effects.forEach((effect) => { this.cacheAnims( concat(effect.imagesLib) ); self.effects=[]; });
	}

	cacheImages(images) {
		if(!images || !images.length){ return; }

		let self = this;
		let cacheDiv = document.querySelector('#cache');
		if (cacheDiv) {;
			images.forEach(function(image) {

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
