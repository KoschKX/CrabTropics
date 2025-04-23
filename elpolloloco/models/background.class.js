class Background extends MovableObject{

	name = 'Background';
	category = 'background';

	width = 740;
	height = 480;
	
	constructor(imagePath,x,y){
		super().loadImage(imagePath);
		
		this.x = x;
		this.y = y;

	}

	fit(){
		console.log('test');
		this.width=this.cvs.width;
		this.height=this.cvs.height;
	}

}