class Screen{
	cvs;
	world;

	constructor(canvas, world){
		this.cvs = canvas; this.world = world;
		this.ctx = canvas.getContext('2d');

        this.resizeCanvas();
	}

	setWorld(world){ this.world = world; }

    enterFullscreen() {
        const elem = document.querySelector('#game');
        if (elem.requestFullscreen) { elem.requestFullscreen(); this.resizeCanvas(); }
    }
    exitFullscreen() {
      	if (document.exitFullscreen) { document.exitFullscreen(); this.resizeCanvas(); } 
    }

    resizeCanvas() {
    	let gameRect = document.querySelector('#game').getBoundingClientRect();
       	let cvsW = document.documentElement.clientWidth; let cvsH = document.documentElement.clientHeight;

        let bounds = [0, 0, this.cvs.width, this.cvs.height];
        
        if(this.world && this.world.level){
            bounds = this.world.level.bounds
        }

        // RESTRICT TO LEVEL BOUNDS
        if(cvsW>bounds[2]){cvsW=bounds[2];}
        if(cvsH>bounds[3]){cvsH=bounds[3];}
        
        this.cvs.width = cvsW; this.cvs.height = cvsH;
        
    	document.querySelector(':root').style.setProperty('--app-width', cvsW + 'px');
    	document.querySelector(':root').style.setProperty('--app-height', cvsH +'px');

        /* PIXEL SCALE */
		this.cvs.style.width = cvsW + "px";
		this.cvs.style.height = cvsH + "px";
	
        //if(this.world){this.world.draw();}
    }

    hideMenu(){
        document.querySelector('#menu').classList.remove('show');    
    }
    showMenu(){
        document.querySelector('#menu').classList.add('show');    
    }

    hideControls(){
        document.querySelector('#controls').classList.remove('show');    
    }
    showControls(){
        document.querySelector('#controls').classList.add('show');    
    }

}
