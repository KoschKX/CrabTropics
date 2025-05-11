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

	constructor(world,levelmap){
		this.world = world;
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
					const nobj = cobj.replace(/\((.*)\)/, '(this.world, $1)');
					out.push( eval('new '+nobj));
				}else if(!Number.isNaN(cobj)){
					out.push(cobj);
				}
			}
		}else if(!Number.isNaN(obj)){
			out = parseFloat(obj);
		}
		return out;
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

	preloadObjectLibs(obj, callback){
		this.onDemandCallback = callback;
		this.cacheImageLib( obj,obj.imagesLib, true);
	}

	init(force = false){
		if(!this.loaded && !force){ return; }
		this.enemies.forEach((enemy) => { enemy.init(); });
		this.backgrounds.forEach((background) => { background.init(); });
		this.items.forEach((item) => { item.init(); });
	    this.projectiles.forEach((projectile) => { projectile.init(); });
		this.effects.forEach((effect) => { effect.init(); });
		this.player.init();
		if(this.loadedCallback && typeof this.loadedCallback === 'function') {
			let self = this; setTimeout(function(){ self.loadedCallback(); }, 1000);
		}
	}

	dripImageLib(obj, imagesLib, delay, callback) {
		let libs = concat(imagesLib);
		let images = [];
		libs.forEach(lib => { 
			if(!lib.files || !lib.files.length){ return; }
			lib.files.forEach(img => {  images.push([obj, img]); });
		});
		if(images){ this.dripAssets(images, delay, callback); }
	}

	cacheImageLib(obj, imagesLib, onDemand=false) {
		let libs = concat(imagesLib);
		let images = [];
		libs.forEach(lib => { 
			if(!lib.files || !lib.files.length){ return; }
			lib.files.forEach(img => {  images.push([obj, img]); });
		});
		if(images){ this.cacheAssets(images, onDemand); }
	}

	createVideo(obj, path, addToDOM = false, autoplay = true, loop = true){
		if( this.checkCache(path) ){ return obj; }
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
		if( this.checkCache(path) ){ return; }
		let img = new Image();
		img.setAttribute('object_id', obj.stamp);
		img.src = path;
		if(addToDOM){ this.cacheDiv.appendChild(img); }
		return img;
	}

	createAsset(obj, path, addToDOM = false){
		let asset; let type = '';
		const ext = path.split('.').pop().toLowerCase();
		if (ext === 'mp4' || ext === 'webm') {
			asset = this.createVideo(obj, path, addToDOM);
			type = 'video';
		} else if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) {
			asset = this.createImage(obj, path, addToDOM);
			type = 'image';
		}
		return [asset,type];
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
		const obj  = image[0]; let path = image[1];
		const check= this.checkCache(path);
		if (!check) {
			let [asset, type] = self.createAsset(obj, path, true);
			if (type === 'video'){ self.loadedAssets += 1; }
			if (type !== 'image'){ return; }
			asset.onload = () => {
				self.loadedAssets++;
				let progress = (self.loadedAssets / self.totalAssets).toFixed(2);
					self.updateAttributes(progress, asset.src);
				if (self.loadedAssets >= self.totalAssets) {
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
				asset.onload = null; 
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

	async dripAssets(images, delay, callback) {
		if (!images || !images.length || !this.cacheDiv) return;
		const self = this;
		const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
		let loadPromises = [];
		for (let i = 0; i < images.length; i++) {
			const [obj, path] = images[i];
			const startDelay = i * delay;
			const promise = (async () => {
				await wait(startDelay);
				let [asset, type] = self.createAsset(obj, path, true);
				if (type === 'video') { self.loadedAssets += 1; return; }
				if (type !== 'image' || !asset) return;
				return new Promise(resolve => { asset.onload = resolve; asset.onerror = resolve; });
			})();
			loadPromises.push(promise);
		}
		await Promise.all(loadPromises); 
		if (typeof callback === 'function') callback();
	}

}
