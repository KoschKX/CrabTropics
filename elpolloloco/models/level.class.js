class Level{
	world;

	name = '';

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

	levelmap;

	constructor(levelmap){
		this.buildMap(levelmap);
	}

	buildMap(levelmap, reset=false){
		this.levelmap = levelmap;
		this.name = this.parseObj(levelmap.name);
		this.backgrounds = this.parseObj(levelmap.backgrounds);
		this.player = this.parseObj(levelmap.players)[0];
		this.enemies = this.parseObj(levelmap.enemies);
		this.clouds = this.parseObj(levelmap.clouds);
		this.bounds = this.parseObj(levelmap.bounds);
		this.ground = 410;

		if(reset){ return;}

		this.projectiles = this.parseObj(levelmap.projectiles);
		this.effects = this.parseObj(levelmap.effects);
		this.items = this.parseObj(levelmap.items);
	}

	parseObj(obj){
		let out;
		if(Number.isNaN(obj)){
			out = obj;
		}else if(typeof obj === 'string') {
			out = obj;
		}else if(Array.isArray(obj)){
			out = [];
			if(!obj.length){ return out; }
			for(let o = 0; o<obj.length; o++){
				let cobj=obj[o];
				if (typeof cobj === 'string' && cobj.includes('(') && cobj.includes(')')) {
					out.push( eval('new '+cobj));
				}else if(!Number.isNaN(cobj)){
					out.push(cobj);
				}
			}
		}
		return out;
	}

	setWorld(world){
		if(!world){ return; }
		this.world = world;
		this.player.world = this.world;
		this.backgrounds.forEach((background) => { background.world = this.world; });
		this.enemies.forEach((enemy) => { enemy.world = this.world; });
		this.items.forEach((item) => { item.world = this.world; });
		this.projectiles.forEach((projectile) => { projectile.world = this.world; });
	}

	preload(callback){

		this.loadedCallback = callback;

		this.cacheImageLib( this.player, this.player.imagesLib ); 

		let minions = this.enemies.filter(enemy => !enemy.isBoss);
	   		minions.forEach((enemy) => { this.cacheImageLib( enemy, enemy.imagesLib); });

	   	let bosses = this.enemies.filter(enemy => enemy.isBoss === true);
			bosses.forEach((boss) => { this.tmp.push(boss); boss.destroy(); });

	    this.backgrounds.forEach((background) => { this.cacheImageLib( background, background.imagesLib); });

	    let self = this;
	    this.items.forEach((item) => { this.cacheImageLib( item, item.imagesLib ); self.items=[]; });
	    this.effects.forEach((effect) => { this.cacheImageLib( effect, effect.imagesLib ); self.effects=[]; });
	    this.projectiles.forEach((projectile) => { this.cacheImageLib( projectile, projectile.imagesLib ); self.projectiles=[]; });
	}

	unload(){

		this.enemies.forEach((enemy) => { enemy.destroy(); });
		this.items.forEach((item) => { item.destroy(); });
		this.projectiles.forEach((projectile) => { projectile.destroy(); });
		this.backgrounds.forEach((background) => { background.destroy(); });

		this.name='';
		this.player=[];
		this.enemies=[];
		this.clouds=[];
		this.backgrounds=[];
		this.items=[];
		this.effects=[];
		this.projectiles=[];
		this.bounds=[0,0,0,0];
		this.ground=0;
	}

	reset(){
		//this.loaded = false; this.loadedCallback =null; 
		//this.totalAssets = 0; this.loadedAssets = 0;
		this.unload();
		this.buildMap(this.levelmap, true);
		this.init(true);
	}

	preloadBoss(callback){
		if(!this.tmp.length){ return; }
		console.log('preloading boss');
		this.tmp.forEach((boss) => { this.cacheImageLib( boss, boss.imagesLib, true); });
		this.tmp = [];
		if(callback && typeof callback === 'function') {
			let self = this;
			setTimeout(function(){
				callback();
			}, 1000);
		}
	}

	init(force = false){
		if(!this.loaded && !force){ return; }
		this.setWorld(this.world);
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

	cacheImageLib(obj, imagesLib, onDemand=false) {
		let libs = concat(imagesLib);
		let images = [];
		libs.forEach(lib => { 
			if(!lib.files || !lib.files.length){ return; }
			lib.files.forEach(img => { 
				images.push([obj, img]);
			});
		});
		if(images){ this.cacheAssets(images, onDemand); }
	}

	createVideo(obj, path){
		let vid = document.createElement("video");
		vid.id = obj.stamp;
		vid.classList.add('bg_video');
		vid.src = path;
		vid.preload = 'auto'; vid.autoplay = true; 
		vid.muted = true; vid.loop = true; 
		vid.playsInline = true;
		return vid;
	}

	createImage(obj, path){
		let img = new Image();
		img.id = obj.stamp;
		img.src = path;
		return img;
	}

	cacheAssets(images, onDemand=false) {
		if(!images || !images.length){ return; }
		let self = this;
		let cacheDiv = document.querySelector('#cache');
		if (cacheDiv) {
			
			let checkBlank = document.querySelector('#cache img[src="' + './img/blank.png' + '"]');
			if(!checkBlank){
				let blankImage = new Image(); blankImage.src = './img/blank.png'; cacheDiv.appendChild(blankImage);
			}
			document.querySelector('body').setAttribute('data-level', this.name );

			images.forEach(function(image) {
				let checkCache;
				let cachedImage; let cachedVideo;
				let obj  = image[0];
				let path = image[1];
				let ext  = path.split('.').pop(); 

				if(ext == 'mp4'){
					checkCache = document.querySelector('#cache video[src="' + path + '"]');
				}else{
					checkCache = document.querySelector('#cache img[src="' + path + '"]');
				}

				if (!checkCache) {
					if(ext == 'mp4'){
						cachedVideo=self.createVideo(obj, path);
						cacheDiv.appendChild(cachedVideo);
						self.loadedAssets += 1;
					}else{
						cachedImage=self.createImage(obj, path);
						cacheDiv.appendChild(cachedImage);
					}
					
					if(!cachedImage || onDemand){ return; }

					cachedImage.onload = function(){
						self.loadedAssets += 1;

						let name = this.src.split('/').pop().split('.').shift();

						document.querySelector('#cache').setAttribute('data-progress',self.loadedAssets / self.totalAssets);
						document.querySelector('#cache').setAttribute('data-task', name);

						if(self.loadedAssets === self.totalAssets){

							document.querySelector('#cache').setAttribute('data-task', 'Complete');
							//setTimeout(function(){
								self.loaded = true; self.init();
							//}, 100);

							document.querySelector('body').setAttribute('data-loaded', 'true' );
							
						}
						cachedImage.onload = null;
					};
					self.totalAssets += 1;
				}
				
			});
		}	
	}

}
