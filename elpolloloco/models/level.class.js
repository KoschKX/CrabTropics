class Level{
	world;

	name = '';

	player
	enemies = [];
	clouds = [];
	items = [];
	projectiles = [];
	effects = [];
	ambient = [];
	music = [];
	tmp = [];

	bounds = [0,0,0,0]
	ground;

	loadedCallback;  onDemandCallback;
	totalAssets = 0; loadedAssets = 0;
	loaded = false;

	levelmap;

	cacheDiv;

	constructor(levelmap){
		this.cacheDiv = document.querySelector('#cache');
		this.buildMap(levelmap);
	}

	buildMap(levelmap, reset=false){
		this.levelmap 	 = levelmap;
		this.name 		 = this.parseObj(levelmap.name);
		this.backgrounds = this.parseObj(levelmap.backgrounds);
		this.player  	 = this.parseObj(levelmap.players)[0];
		this.enemies 	 = this.parseObj(levelmap.enemies);
		this.clouds  	 = this.parseObj(levelmap.clouds);
		this.bounds  	 = this.parseObj(levelmap.bounds);
		this.ambient 	 = this.parseObj(levelmap.ambient);
		this.music   	 = this.parseObj(levelmap.music);
		this.ground  	 = this.parseObj(levelmap.ground);

		if(reset){ return; }

		this.projectiles = this.parseObj(levelmap.projectiles);
		this.effects = this.parseObj(levelmap.effects);
		this.items = this.parseObj(levelmap.items);
	}

	parseObj(obj){
		let out;
		if(typeof obj === 'string') {
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
		}else if(!Number.isNaN(obj)){
			out = parseFloat(obj);
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
		this.effects.forEach((effect) => { effect.world = this.world; });
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
	    this.items.forEach((item) => { this.cacheImageLib( item, item.imagesLib ); item.destroy(); self.items=[]; });
	    this.effects.forEach((effect) => { this.cacheImageLib( effect, effect.imagesLib ); effect.destroy(); self.effects=[]; });
	    this.projectiles.forEach((projectile) => { this.cacheImageLib( projectile, projectile.imagesLib ); projectile.destroy(); self.projectiles=[]; });
	}

	unload(){
		this.player.destroy();
		this.enemies.forEach((enemy) => { enemy.destroy(); });
		this.items.forEach((item) => { item.destroy(); });
		this.projectiles.forEach((projectile) => { projectile.destroy(); });
		this.backgrounds.forEach((background) => { background.destroy(); });
		this.name='';
		this.player=null;
		this.enemies=[];
		this.clouds=[];
		this.backgrounds=[];
		this.items=[];
		this.effects=[];
		this.projectiles=[];
		this.ambient=[];
		this.music=[];
		this.bounds=[0,0,0,0];
		this.ground=0;
	}

	reset(){
		this.unload();
		this.buildMap(this.levelmap, true);
		this.init(true);
	}

	preloadBoss(callback){
		if(!this.tmp.length){ return; }
		console.log('Preloading boss');
		this.onDemandCallback = callback;
		this.tmp.forEach((boss) => { this.cacheImageLib( boss, boss.imagesLib, true); });
		//this.tmp = [];
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

	createVideo(obj, path, addToDOM = false, autoplay = true, loop = true){
		let vid = document.createElement("video");
		vid.setAttribute('object-id', obj.stamp);
		vid.classList.add('bg_video');
		vid.src = path;
		vid.preload = 'auto'; vid.autoplay = autoplay; 
		vid.muted = true; vid.loop = loop; 
		vid.playsInline = true;
		if(addToDOM){ this.cacheDiv.appendChild(vid); }
		return vid;
	}

	createImage(obj, path, addToDOM = false){
		let img = new Image();
		img.setAttribute('object_id', obj.stamp);
		img.src = path;
		if(addToDOM){ this.cacheDiv.appendChild(img); }
		return img;
	}

	sanitizeTaskName(task){
 		task = task.replaceAll('_',' ');
		return task;
	}

	updateAttributes(progress, task, loaded){
		let taskname = task.split('/').pop().split('.').shift();
 		document.querySelector('#cache').setAttribute('data-progress', progress);
		document.querySelector('#cache').setAttribute('data-file', task);
		document.querySelector('#cache').setAttribute('data-task', this.sanitizeTaskName(taskname));
		if(loaded){ document.querySelector('body').setAttribute('data-loaded', loaded ); }
	}

	checkCache(path){
		let ext  = path.split('.').pop(); 
		let check;
		if(ext == 'mp4' || ext == 'webm'){
			check = document.querySelector('#cache video[src="' + path + '"]');
		}else{
			check = document.querySelector('#cache img[src="' + path + '"]');
		}

		return check;
	}

	processAsset(image, onDemand){
		if(!image || !this.cacheDiv){ return; }
		let self = this;
		let checkCache; let cachedImage; let cachedVideo; 
		let obj  = image[0]; let path = image[1];
		let ext  = path.split('.').pop(); 
		const check= this.checkCache(path);

		if (!check) {
			if(ext == 'mp4' || ext == 'webm'){
				cachedVideo = self.createVideo(obj, path, true);
				self.loadedAssets += 1;
			}else{
				cachedImage = self.createImage(obj, path, true);
			}
			if(!cachedImage){ return; }
			cachedImage.onload = () => {
				self.loadedAssets++;
				self.updateAttributes(self.loadedAssets / self.totalAssets, cachedImage.src);
				if (self.loadedAssets === self.totalAssets) {
					
					if(onDemand){
						if(this.onDemandCallback) {
							this.onDemandCallback(); this.onDemandCallback = null;
						}
					}else{
						self.updateAttributes(1.0, 'Complete', true);
						self.loaded = true;
						self.init();
					}
				}
				cachedImage.onload = null; 
			};
			self.totalAssets += 1;
		}else if(onDemand){
			if(this.onDemandCallback) {
				this.onDemandCallback(); this.onDemandCallback = null;
			}
		}
	}

	cacheAssets(images, onDemand=false) {
		if(!images || !images.length || !this.cacheDiv){ return; }
		let self = this;
		let checkBlank = document.querySelector('#cache img[src="' + './img/blank.png' + '"]');
		if(!checkBlank){
			let blankImage = new Image(); blankImage.src = './img/blank.png'; this.cacheDiv.appendChild(blankImage);
		}
		document.querySelector('body').setAttribute('data-level', this.name );
		images.forEach(function(image) {
			self.processAsset(image, onDemand);
		});
	}

}
