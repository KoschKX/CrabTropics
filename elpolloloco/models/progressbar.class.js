class ProgressBar{
	name = 'ProgressBar';

	x = 50; y = 50; width = 66; height = 20;

	cvs; ctx;

	drawFramesId;

	centered = true;
	active = false;

	progress = 0.0;
	task = '';

	constructor(canvas,x=0,y=0){
		this.cvs = canvas;
		this.ctx = canvas.getContext('2d');
		this.x = x; this.y = y;
		this.init();
	}

	destroy(){
		cancelAnimationFrame(this.drawFramesId);
	}

	init(){
		this.active = true;
		this.drawFrames = () => {
			this.draw();
			this.drawFramesId = requestAnimationFrame(this.drawFrames);
		};
		this.drawFrames();
	}

	draw(){
		if(!this.active){ return; }
		let progress = document.querySelector('#cache').getAttribute('data-progress'); this.progress = progress;
    	let task = document.querySelector('#cache').getAttribute('data-task'); this.task = task;
    	this.loadingBar(progress, task);
    	if(progress >= 1){ 
    		let self = this; setTimeout(function(){ 
    			if(self.active){ self.stop(); self.destroy(); self.active = false; }
    		}, 1000);
    	}
	}

	stop() {
	    if (!this.drawFramesId) { return; }
	    cancelAnimationFrame(this.drawFramesId);
	    this.drawFramesId = null;
	    this.active = false;
	}

	loadingBar(progress, task) {
		const ctx = this.ctx;
		if(this.centered){ this.x = 50 - this.width / 2; this.y = 50 - this.height / 2; }
		const bx = this.cvs.width * (this.x / 100); const by = this.cvs.height * (this.y / 100);
		const bw = this.cvs.width * (this.width / 100); const bh = this.cvs.height * (this.height / 100);

		progress = Math.max(0, Math.min(1, progress));

		ctx.clearRect(0,0,this.cvs.width,this.cvs.height);

		drawRect( ctx, bx, by, bw, bh, 'transparent','#fff', 2 ); // BACKGROUND
		drawRect( ctx, bx, by, bw * progress, bh, '#fff'); 		  // BAR
		drawText( ctx, bx + bw / 2, by + bh / 2, bw, bh, Math.round(progress * 100) + '%', '#000', Math.floor(bh * 0.6)+'px Arial', 'center', 'middle', '#fff'); // TEXT
		drawText( ctx, bx + bw / 2, by + bh + 20, bw, bh, task || 'Loading...', '#fff', Math.floor(bh * 0.2)+'px Arial', 'center', 'middle' ) 					 // TASK

	}

}