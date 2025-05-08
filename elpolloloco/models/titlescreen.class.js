class Titlescreen{

	cvs; ctx;
	keyboard; screen; background;

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
		clearInterval(this.drawInterval); clearInterval(this.ctlInterval); 
		this.ctx.clearRect(0,0,this.cvs.width,this.cvs.height);
		this.audio.playSound('ocean',1.0, false, true);
		this.audio.playSound('royalty_free',0.4, false, true);
		this.screen.hideControls();
		this.video.remove();
	}

	start(){
    	this.world = new World(this.cvs,this.screen,this.keyboard,this.audio);
    	bounds = level01.bounds;
    	this.world.load(level01);
    	this.screen.setWorld(this.world);
    	this.screen.resizeCanvas(this.world);
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
		this.ctx.font = "bold "+wpct+"px Reggae";
        this.ctx.fillStyle = "red";   
        this.ctx.strokeStyle = "#f0b94d";  
        this.ctx.lineWidth = 1;     

        this.ctx.textAlign = "center"; 
        this.ctx.textBaseline = "middle";

        let titleText=document.title.toUpperCase();;
        
        this.ctx.fillText(titleText, x, y);
        this.ctx.strokeText(titleText, x, y);
	}

	drawMenus(x, y) {
	    let wpct = this.cvs.width * 0.05;
	    this.ctx.font = "bold " + wpct + "px Arial";
	    this.ctx.fillStyle = "white"; this.ctx.strokeStyle = "black"; this.ctx.lineWidth = 1;     

	    this.ctx.textAlign = "center"; 
	    this.ctx.textBaseline = "middle";

	    let lineHeight = wpct * 1.2;
	    let menuHeight = this.menuItems.length * lineHeight;

	    let maxWidth = 0;
	    this.menuItems.forEach(item => {
	        let width = this.ctx.measureText(item).width;
	        if (width > maxWidth) maxWidth = width;
	    });

	    let padding = [ 66, 25 ];
	    let bgRect =  [x - maxWidth / 2 - padding[0], y - lineHeight / 2, maxWidth + padding[0] * 2, menuHeight + (padding[1] *2)];

	    this.ctx.fillStyle = "rgba(0, 0, 0, 0.66)";
	    this.ctx.fillRect(bgRect[0],bgRect[1],bgRect[2],bgRect[3]);
	    this.ctx.strokeStyle = "#f0b94d"; this.ctx.lineWidth = 2; 
	    this.ctx.strokeRect(bgRect[0],bgRect[1],bgRect[2],bgRect[3]);
	    this.ctx.strokeStyle = "transparent";  
	    
	    this.menuItems.forEach((item, idx) => {
	        let lineY = y + idx * lineHeight + padding[1];
	        if(this.menuItemsDisabled.includes(this.menuItems[idx])){
	        	this.ctx.fillStyle = "rgba(255,255, 255, 0.33)";   
	    	}else{
	    		this.ctx.fillStyle = "white";  
	    	}

	    	let mtext = item.replace('//','');
	        if(idx === this.selected){ mtext = "★  " +mtext + "  ★"; }

	        this.ctx.fillText(mtext, x, lineY);
	        this.ctx.strokeText(mtext, x, lineY);
	    });
	}

	addToMap(mo) {
	    this.ctx.save();  mo.draw(this.ctx); this.ctx.restore(); 
	}

}