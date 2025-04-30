class Camera{
	cvs;
	world;

    target = [0,0]; 
    bounds = [0,0,0,0];
    offset = [0,0];

    position = [0,0];

	constructor(world){
		this.cvs = world.cvs;
		this.ctx = world.ctx;
	}

    update(target, offset, bounds){
        if(target){ this.target=target; }
        if(offset){ this.offset=offset; }
        if(bounds){ this.bounds=bounds; }

        this.bounds=bounds; this.offset=offset;
        
        let camX = -( this.target[0] + this.offset[0]) + (this.cvs.width * 0.5);
        let camY = -( this.target[1] + this.offset[1]) + (this.cvs.height * 0.5);

        // RESTRICT TO LEVEL BOUNDS
        let minX = -(this.bounds[2] - this.cvs.width); 
            let maxX = -this.bounds[0];                  
            let minY = -(this.bounds[3] - this.cvs.height);
            let maxY = -this.bounds[1];               

            camX = Math.max(minX, Math.min(camX, maxX));
            camY = Math.max(minY, Math.min(camY, maxY));

        this.position[0] = camX; this.position[1] = camY;

        this.ctx.setTransform(1, 0, 0, 1, 0, 0); 
        this.ctx.translate(camX, camY);
    }
   
}
