class Screen{
	cvs;
	world;
    bounds;

    paused; wasPaused;

	constructor(canvas, world){
		this.cvs = canvas; this.world = world;
		this.ctx = canvas.getContext('2d');
        this.resizeCanvas();
	}

	setWorld(world){ this.world = world; }

    enterFullscreen() {
        const elem = document.querySelector('#game');
        if (elem.requestFullscreen) { elem.requestFullscreen(); this.resizeCanvas(); }
        document.querySelector('#menu #maximize').classList.remove('active');
        document.querySelector('#menu #minimize').classList.add('active');
    }

    exitFullscreen() {
      	if (document.exitFullscreen) { document.exitFullscreen(); this.resizeCanvas(); } 
        document.querySelector('#menu #maximize').classList.add('active');
        document.querySelector('#menu #minimize').classList.remove('active');
    }

    resizeCanvas() {
    	let gameRect = document.querySelector('#game').getBoundingClientRect();
       	let cvsW = document.documentElement.clientWidth; let cvsH = document.documentElement.clientHeight;

        // WINDOW BOUNDS
        if(!this.bounds){ this.bounds = [0, 0, this.cvs.width, this.cvs.height]; }
        
        // GET WORLD BOUNDS
        if(this.world && this.world.level){ bounds = this.world.level.bounds }

        // RESTRICT TO LEVEL BOUNDS
        if(cvsW>this.bounds[2]){cvsW=this.bounds[2];}
        if(cvsH>this.bounds[3]){cvsH=this.bounds[3];}
        
        this.cvs.width = cvsW; this.cvs.height = cvsH;
    	document.querySelector(':root').style.setProperty('--app-width', cvsW + 'px');
    	document.querySelector(':root').style.setProperty('--app-height', cvsH +'px');

        if(titlescreen){
            titlescreen.draw();
        }

        /* PIXEL SCALE */
		this.cvs.style.width = cvsW + "px";
		this.cvs.style.height = cvsH + "px";
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

    pause(ui=true){
        if(!this.world){ return; }
        if(!ui){ this.wasPaused = this.world.paused; }
        this.paused = this.world.pause();
        document.querySelector('#menu #pause_on').classList.remove('active');
        document.querySelector('#menu #pause_off').classList.add('active');
    }

    unpause(ui=true){
        if(!this.world){ return; }
        if(!ui){ this.wasPaused = this.world.paused; }
        this.paused = this.world.unpause();
        document.querySelector('#menu #pause_off').classList.remove('active');
        document.querySelector('#menu #pause_on').classList.add('active');
    }

}
