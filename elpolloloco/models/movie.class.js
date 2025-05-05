class Movie extends Background{

	name = 'Movie';
	category = 'background';

	IMAGES_BLANK = ['./img/blank.png'];

	imagePath; imageCache = []; imagesLib = [this.IMAGES_BLANK];
	currImage = 0; anim = [];

	frames=1; frameRate=30;

	x = 0; y = 0; width = 740; height = 480;
	
	isPlaying = false;

	constructor(imagePath, layer, frames,x,y,width, height){
		super(imagePath,layer, x, y, width, height);
		this.frames = frames;
		this.imagePath = imagePath;
		for(let idx = 0; idx<frames; idx++){
			let ext = imagePath.split('.').pop();
			let name = imagePath.split('_').slice(0, -1).join('_');
			let ipath = name+"_"+String(idx+1).padStart(3, '0')+'.'+ext;
			if(this.imageCache?.[ipath]){return; };
			this.anim.push(ipath);
			this.imagesLib.push(ipath);
			this.imageCache[ipath] = ipath;

		}	
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


	playAnimation(){
		if(!this.img || !this.isPlaying){ return; }
    	let i = this.currImage % this.anim.length; 
        let path = this.anim[i];
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