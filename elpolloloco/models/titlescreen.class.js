class Titlescreen{

	cvs; ctx;
	keyboard; screen; background; world;

	drawInterval; tlInterval;

	menuItems = ['Start', '//Settings'];
	menuFuncs = ['start', 'settings'];
	menuItemsDisabled = [];

	selected = 0;
	menuChanged = false;

	bounds = [0,0,0,0]

	constructor(cvs,scr,kbd,aud){
		this.cvs = cvs;  this.ctx = cvs.getContext('2d');
    	this.screen = scr; this.keyboard = kbd; this.audio = aud;
    	this.background = new Background('./img/ui/background2.jpg', 0 , 0);
		this.init();
	}

	destroy(){
		clearInterval(this.drawInterval); clearInterval(this.ctlInterval); 
		this.ctx.clearRect(0,0,this.cvs.width,this.cvs.height);
	}

	init(){
		this.menuItemsDisabled = this.menuItems.filter(item => item.startsWith('//'));
		let self = this;
		this.loadImage(this.background.imagePath, function(){
		    clearInterval(self.drawInterval); self.drawInterval = setInterval(() => { self.draw(); }, 1000 / 60 );
		    clearInterval(self.ctlInterval); self.ctlInterval = setInterval(() => { self.main(); }, 1000 / 60 );			
		});

		const vid = document.createElement('video');
		vid.id = 'title_video'; vid.classList.add('bg_video');
		vid.src = './mov/beachC_looped.mp4';
		vid.preload = 'auto'; vid.autoplay = true; vid.muted = true; vid.loop = true; vid.playsInline = true;

		document.querySelector('body').appendChild(vid);
		this.video = document.getElementById('title_video');
		this.video.addEventListener('loadeddata', () => { this.video.width = this.cvs.width; this.video.height = this.cvs.height;  });
		this.screen.showMenu(); this.screen.showControls();
	}

	main(){
		if( !this.keyboard.LEFT && !this.keyboard.RIGHT && !this.keyboard.DOWN && !this.keyboard.UP ) { this.menuChanged = false; }
		if( !this.menuChanged && (this.keyboard.RIGHT || this.keyboard.DOWN)) { this.selected += 1; this.menuChanged = true; }
		if( !this.menuChanged && (this.keyboard.LEFT || this.keyboard.UP))   { this.selected -= 1; this.menuChanged = true; }
    	
    	this.selected = Math.max(0, Math.min(this.selected, this.menuItems.length - 1));

    	if( !this.menuChanged && (this.keyboard.ENTER || this.keyboard.SPACE) ){ 
    		if (typeof this[this.menuFuncs[this.selected]] === 'function') {
    			this[this.menuFuncs[this.selected]](); this.menuChanged = true; this.selfDestruct(); 
    		}
    	}
	}

	selfDestruct(){ 
		this.destroy();
		this.screen.hideControls();
		this.video.remove();
	}

	start(){
    	this.world = new World(this.cvs, this.screen, this.keyboard, this.audio);
    	this.world.load(level01);
    	this.screen.setWorld(this.world);
    	this.screen.resizeCanvas(this.world);
	}

	restart(){
		this.world = null;
		init();
	}

	loadImage(path, callback){
		let img = new Image(); img.src = path;
		if(callback && typeof callback === 'function'){
			img.onload = () => { callback(); img.onload = null; };
		}
		return img;
	}


	draw(){
		this.ctx.clearRect(0,0,this.cvs.width,this.cvs.height);
		// this.addToMap(this.background);
		this.drawVideo();
		this.drawTitle(this.cvs.width * 0.5, this.cvs.height * 0.33);
		this.drawMenus(this.cvs.width * 0.5, this.cvs.height * 0.6);
	}

	drawVideo(){
		if (this.video.currentTime >= this.video.duration - 0.2) { this.video.currentTime = 0; this.video.play(); }
		this.ctx.drawImage(this.video, 0, 0, this.cvs.width, this.cvs.height);
	}

	drawTitle(x,y){
		let wpct = this.cvs.width * 0.1;
		let font = "bold "+wpct+"px Reggae";
        let text=document.title.toUpperCase();;
        drawText(this.ctx, 
				  x, y, 0, 0 , 
				  text, 'red', 
				  font, 'center', 'middle',
				  'orange',
				  1
				);
	}

	drawMenus(x, y) {
		const wpct = this.cvs.width * 0.02;
		const lineh = wpct * 3.5; 
		const pad = [ wpct * 0.25, wpct * 0.66 ];
		const font = (wpct*3)+'px Arial'; this.ctx.font = font;

		/* GET MAX WIDTH AND MENU HEIGHT */
		const maxw = this.menuItems.reduce((max, item) => { return Math.max(max, this.ctx.measureText('★  '+item+'  ★').width); }, 0);
		const mnuh = this.menuItems.length * lineh;
		const bx   = x - maxw / 2 - pad[0]; const by = y - lineh / 2;
		const bw   = maxw + pad[0] * 2;     const bh = mnuh + pad[1] * 2;
	
		// BACKGROUND
		drawRect( this.ctx, bx, by, bw, bh, 'rgba(0, 0, 0, 0.66)', '#f0b94d', 3 ); 

		// TEXT
		this.menuItems.forEach((item, idx) => {  
			const ly = y + idx * lineh + pad[1];
			const isDisabled = this.menuItemsDisabled.includes(item);
			const isSelected = idx === this.selected;

			let text = item.replace('//', '');
			if (isSelected) text = '★  '+text+'  ★';

			drawText( this.ctx, 
					  x, ly, 0, 0 , 
					  text, isDisabled ? '#FFFFFF54' : "white", 
					  font, 'center', 'middle'
					);
		}); 
	}

	addToMap(mo) {
	    this.ctx.save();  mo.draw(this.ctx); this.ctx.restore(); 
	}

}