class Movie extends Background{

	name = 'Movie';
	category = 'background';

	IMAGES_ANIM = new Anim('./img/blank.png',0,'');
	imagePath; imageCache = []; imagesLib = [];

	currImage = 0; anim = []; vid;

	frames=1; frameRate=30;

	x = 0; y = 0; width = 740; height = 480;
	
	isPlaying = false; strict = false;

	animInterval;

	constructor(imagePath,layer,frames,x,y,width,height,frameRate=30,strict=false){
		super(imagePath,layer, x, y, width, height);
		this.frames = frames;
		this.imagePath = imagePath;
		this.frameRate = frameRate;
		this.strict = strict;
		this.IMAGES_ANIM = new Anim(imagePath, frames, '' );
		this.imagesLib = [ this.IMAGES_ANIM ]; this.cacheAnim(this.IMAGES_ANIM);
		this.x = x; this.y = y; this.width = width; this.height = height;
		this.generateStamp(this.name);
	}

	destroy(){ 
		super.destroy(); this.pause(); 
		clearInterval(this.animInterval);
		this.world.level.backgrounds = destroy(this, this.world.level.backgrounds, this.world);
	}

	init(){
		let ext  = this.imagePath.split('.').pop(); 
		if(ext == 'mp4' || ext == 'webm') { 
			this.vid = document.querySelector('#cache [src="' + this.imagePath + '"]');
		}
		this.play();
	}

	play(){
		this.isPlaying=true;
		if(this.vid){
			//this.vid.play().catch(error => {} );
		} 
		clearInterval(this.animInterval); this.animInterval = setInterval(() => { this.handleAnimation(); }, 1000 / this.frameRate ); 
	}
	
	pause(){
		this.isPlaying=false;
		if(this.vid){ 
			//this.vid.pause();
		}
		clearInterval(this.animInterval);
	}

	handleAnimation(){
		if(this.isPlaying){ this.playAnimation(this.currImageSet); }
	};

	loadVideo(path){
		if(!path.startsWith('*')){ const vid = document.createElement('video');  vid.src = path; }
		this.imageCache[path] = path;
	}

	cacheAnim(anim){
		anim.files.forEach((path) => {
			if((path in this.imageCache)) return;
			this.imageCache[path] = path;
		});
	}

	getVideoFrame(){
		if(!this.vid){ return; }
		const totalFrames = Math.round(this.vid.duration * this.frameRate);
		const currentFrame = Math.round(this.vid.currentTime * this.frameRate);
		this.currImage = currentFrame % totalFrames;
		this.frames = totalFrames;
		this.time = this.currImage / this.frameRate;
	}

	videoSeek(frameIndex) {
		if(!this.vid){ return; }
	  	const time = frameIndex / this.frameRate;
	  	this.vid.currentTime = time;
	}

	playAnimation(){
		if(this.vid){
			if(!this.isPlaying){ return; }
			if(this.strict){
				this.frames = Math.round(this.vid.duration * this.frameRate);
				let i = this.currImage % this.frames; 
				this.currImage++;
				this.videoSeek(i);
			}else{
				this.getVideoFrame();
			}
		}else{
			if(!this.img || !this.isPlaying){ return; }
	    	let i = this.currImage % this.IMAGES_ANIM.files.length; 
	        let path = this.IMAGES_ANIM.files[i];
	        this.currImage++;
	        if(!(path in this.imageCache)) return;
	        this.img.src = this.imageCache[path];
	    }
	}

	draw(ctx){
		if(this.vid){
			if(this.isPlaying){ this.vid.play(); }
			ctx.drawImage(this.vid, this.x, this.y, this.width, this.height);
		}else{
			if(!this.anim || !this.img ){ return; }
	    	ctx.drawImage(this.img, this.x, this.y, this.width, this.height); 
	    }
	}

	fit(){
		this.width = this.cvs.width; this.height = this.cvs.height;
	}

}