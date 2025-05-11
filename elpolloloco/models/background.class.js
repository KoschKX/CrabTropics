class Background extends MovableObject{

	name = 'Background';
	category = 'background';

	imagePath; imagesLib = [];
	IMAGES_BG = new Anim('./img/blank.png'); imagesLib = [this.IMAGES_BG]; imageCache = []; 

	useGround = false; 

	x = 0; y = 0; width = 740; height = 480;

	layer = 0;
	
	constructor(world,imagePath,layer,x,y,width,height){
		super(world);
		this.loadImage(imagePath);
		this.imagePath=imagePath;
		this.imagesLib[0].files[0]=imagePath;
		this.x = x; this.y = y; this.layer = layer;
		if(width){ this.width = width; }
		if(height){ this.height = height; }
		this.generateStamp(this.name);
		this.init();
	}

	init(){
		this.initialized = true;
		this.loadImage(this.IMAGES_BG.files[0]);
		this.changeAnimation(this.IMAGES_BG);
	}

	fit(){
		this.width = this.cvs.width; this.height = this.cvs.height;
	}

}