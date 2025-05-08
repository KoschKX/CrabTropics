class Movie extends Background{

	name = 'Movie';
	category = 'background';

	IMAGES_ANIM = new Anim('./img/blank.png',0,'');
	imagePath; imageCache = []; imagesLib = [];

	currImage = 0; anim = [];

	frames=1; frameRate=30;

	x = 0; y = 0; width = 740; height = 480;
	
	isPlaying = false;

	constructor(imagePath,layer,frames,x,y,width,height,frameRate=30){
		super(imagePath,layer, x, y, width, height);
		this.frames = frames;
		this.imagePath = imagePath;

		this.frameRate=frameRate;

		this.IMAGES_ANIM = new Anim(imagePath, frames, '' );
		this.imagesLib = [ this.IMAGES_ANIM ]; this.cacheAnim(this.IMAGES_ANIM);

		this.x = x; this.y = y; this.width = width; this.height = height;
	}

	init(){
		clearInterval(this.animInterval); this.animInterval = setInterval(() => { this.handleAnimation(); }, 1000 / this.frameRate );
		this.play();
	}

	play(){
		this.isPlaying=true;
	}
	pause(){
		this.isPlaying=false;
	}

	cacheAnim(anim){
		anim.files.forEach((path) => {
			if((path in this.imageCache)) return;
			this.imageCache[path] = path;
		});
	}

	playAnimation(){
		if(!this.img || !this.isPlaying){ return; }
    	let i = this.currImage % this.IMAGES_ANIM.files.length; 
        let path = this.IMAGES_ANIM.files[i];
        this.currImage++;
        if(!(path in this.imageCache)) return;
        this.img.src = this.imageCache[path];
	}

	draw(ctx){
		if(!this.anim || !this.img ){ return; }
	    ctx.drawImage(this.img, this.x, this.y, this.width, this.height); 
	}

	fit(){
		this.width = this.cvs.width; this.height = this.cvs.height;
	}

}