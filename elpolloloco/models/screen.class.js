class Screen{
	cvs;
	world;

	constructor(canvas, world){
		this.cvs = canvas; this.world = world;
		this.ctx = canvas.getContext('2d');
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

    	//console.log(gameRect);
    	//let cvsW = gameRect.width; let cvsH = gameRect.height;
    	//let cvsW = window.innerWidth; let cvsH = window.innerHeight;
       	let cvsW = document.documentElement.clientWidth; let cvsH = document.documentElement.clientHeight;

        // RESTRICT TO LEVEL BOUNDS
        if(this.world && this.world.level){
            if(cvsW>this.world.level.bounds[2]){cvsW=this.world.level.bounds[2];}
            if(cvsH>this.world.level.bounds[3]){cvsH=this.world.level.bounds[3];}
            this.cvs.width = cvsW; this.cvs.height = cvsH;
        }else{
        	this.cvs.width = cvsW; this.cvs.height = cvsH;
        }

    	document.querySelector(':root').style.setProperty('--app-width', cvsW + 'px');
    	document.querySelector(':root').style.setProperty('--app-height', cvsH +'px');

        console.log("Window height:", window.innerHeight);
		console.log("Document height:", document.documentElement.clientHeight);

        /* PIXEL SCALE */
		this.cvs.style.width = cvsW + "px";
		this.cvs.style.height = cvsH + "px";
		document.querySelector('#ui').style.width = cvsW + "px";
		document.querySelector('#ui').style.height = cvsH + "px";

        if(this.world){this.world.draw();}
    }

}
