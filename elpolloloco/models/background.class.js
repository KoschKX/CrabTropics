class Background extends MovableObject{

	name = 'Background';
	category = 'background';

	imagePath; imagesLib = [];

	useGround = false; 

	x = 0; y = 0; width = 740; height = 480;

	layer = 0;
	
	constructor(imagePath,layer,x,y,width,height){
		super().loadImage(imagePath);
		this.imagePath=imagePath;
		this.imagesLib.push(imagePath);
		this.x = x; this.y = y; this.layer = layer;
		if(width){ this.width = width; }
		if(height){ this.height = height; }

		this.generateStamp(this.name);
	}

	fit(){
		this.width = this.cvs.width; this.height = this.cvs.height;
	}

}