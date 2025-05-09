class ProgressBar{
	name = 'ProgressBar';

	x = 50; y = 50; width = 66; height = 20;

	cvs; ctx;

	drawFramesId;

	centered = true;
	activated = false;

	constructor(canvas,x=0,y=0){
		this.cvs = canvas;
		this.ctx = canvas.getContext('2d');
		this.x = x; this.y = y;

		this.init();
	}

	init(){
		this.activated = true;
		this.drawFrames = () => {
			this.draw();
			this.drawFramesId = requestAnimationFrame(this.drawFrames);
		};
		this.drawFrames();
	}

	draw(){
		if(!this.activated){ return; }
		let progress = document.querySelector('#cache').getAttribute('data-progress');
    	let task = document.querySelector('#cache').getAttribute('data-task')
    	this.loadingBar(progress, task);
    	if(progress == 1){ this.stop(); }
	}

	stop() {
	    if (this.drawFramesId !== null) {
	        cancelAnimationFrame(this.drawFramesId);
	        this.drawFramesId = null;
	        this.activated = false;
	    }
	}

	loadingBar(progress, task) {

		const ctx = this.ctx;

		if(this.centered){
			this.x = 50 - this.width / 2; this.y = 50 - this.height / 2;
		}

		const bx = this.cvs.width * (this.x / 100);
		const by = this.cvs.height * (this.y / 100);
		const bwidth = this.cvs.width * (this.width / 100);
		const bheight = this.cvs.height * (this.height / 100);

		//CLAMP
		progress = Math.max(0, Math.min(1, progress));

		// BACKGROUND
		ctx.fillStyle = 'transparent';
		ctx.fillRect(bx, by, bwidth, bheight);

		// OUTLINE
		ctx.strokeStyle = '#ffffff';
		ctx.lineWidth = 2;
		ctx.strokeRect(bx, by, bwidth, bheight);

		// BAR
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(bx, by, bwidth * progress, bheight);

		// TEXT
		ctx.fillStyle = '#000';
		ctx.font = Math.floor(bheight * 0.6)+'px Arial'; 
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(
			Math.round(progress * 100) + '%',
			bx + bwidth / 2,
			by + bheight / 2
		);

		// TEXT OUTLINE
		ctx.strokeStyle = '#fff';
		ctx.lineWidth = 2;
		ctx.strokeText(
			Math.round(progress * 100) + '%', 
			bx + bwidth / 2, 
			by + bheight / 2
		);

		// TASK
		const textY = by + bheight + 20; 
		ctx.fillStyle = '#fff';
		ctx.font = '16px Arial'; 
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(
			task || 'Loading...', 
			bx + bwidth / 2,
			textY
		);

	}

}