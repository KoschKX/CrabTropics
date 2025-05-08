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
	tmp = [];

	bounds = [0,0,0,0]
	ground;

	loadedCallback;
	totalAssets = 0; loadedAssets = 0;
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

		let minions = this.enemies.filter(enemy => !enemy.isBoss);
	   		minions.forEach((enemy) => { this.cacheImageLib( enemy.imagesLib); });

	   	let bosses = this.enemies.filter(enemy => enemy.isBoss === true);
			bosses.forEach((boss) => { this.tmp.push(boss); boss.destroy(); });

	    this.backgrounds.forEach((background) => { this.cacheImageLib( background.imagesLib); });

	    let self = this;
	    this.items.forEach((item) => { this.cacheImageLib( item.imagesLib ); self.items=[]; });
	    this.effects.forEach((effect) => { this.cacheImageLib( effect.imagesLib ); self.effects=[]; });
	    this.projectiles.forEach((projectile) => { this.cacheImageLib( projectile.imagesLib ); self.projectiles=[]; });

	}

	preloadBoss(callback){
		if(!this.tmp.length){ return; }
		console.log('preloading boss');
		this.tmp.forEach((boss) => { this.cacheImageLib( boss.imagesLib, true); });
		this.tmp = [];
		if(callback && typeof callback === 'function') {
			let self = this;
			setTimeout(function(){
				callback();
			}, 1000);
		}
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
			let self = this; setTimeout(function(){
				self.loadedCallback();
			}, 1000);
		}
	}


	cacheImageLib(imagesLib, onDemand=false) {
		let libs = concat(imagesLib);
		let images = [];
		libs.forEach(lib => { 
			if(!lib.files || !lib.files.length){ return; }
			lib.files.forEach(img => { 
				images.push(img);
			});
		});
		if(images){ this.cacheImages(images, onDemand); }
	}

	cacheImages(images, onDemand=false) {
		if(!images || !images.length){ return; }
		let self = this;
		let cacheDiv = document.querySelector('#cache');
		if (cacheDiv) {
			
			let checkBlank = document.querySelector('#cache img[src="' + './img/blank.png' + '"]');
			if(!checkBlank){
				let blankImage = new Image(); blankImage.src = './img/blank.png'; cacheDiv.appendChild(blankImage);
			}

			images.forEach(function(image) {
				let checkCache = document.querySelector('#cache img[src="' + image + '"]');
				

				if (!checkCache) {
					let cachedImage = new Image();
					cachedImage.src = image;
					cacheDiv.appendChild(cachedImage);

					if(onDemand){ return; }

					cachedImage.onload = function(){
						self.loadedAssets += 1;

						let name = this.src.split('/').pop().split('.').shift();

						document.querySelector('#cache').setAttribute('data-progress',self.loadedAssets / self.totalAssets);
						document.querySelector('#cache').setAttribute('data-task', name);

						if(self.loadedAssets === self.totalAssets){

							document.querySelector('#cache').setAttribute('data-task', 'Complete');
							//setTimeout(function(){
								self.loaded = true;
								self.init();
							//}, 100);
							
						}
						cachedImage.onload = null;
					};
					self.totalAssets += 1;
				}
				
			});
		}	
	}

}
