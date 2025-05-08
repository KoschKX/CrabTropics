class AnimatedHitbox{

	name = 'AnimatedHitbox';

	anim;

	boxes = [];

	boxcolors = [];

	buried = true;

	cachedImages = []; loadedImages = 0; totalImages = 0; loaded = false;
	
	constructor(obj, anim, generate=false){
		if(!anim.files.length || !obj.boxcolors) { return; }
		
		this.anim = anim;
		this.boxcolors = obj.boxcolors;
		
		if(generate){
			let self =this; this.cacheImages(this.anim.files, function(){
				console.log('Parsing ['+self.anim.name+'] . . .');
				self.getHitboxes(self.boxcolors);
			});
		}else{
			this.loadHitBoxes(this.anim.files[0]);
		}
	}
	
	init() { }

	loadHitBoxes(path){
		let ffldr = path.substring(0, path.lastIndexOf('/'));
		let fname = this.getAnimName(path)+'.txt';
		let fpath  = ffldr+'/hitbox/'+fname;
		let self = this; fetch(fpath).then(f => f.text()).then(txt => {
			self.boxes = eval(txt); 
		    self.loaded = true;
		});
	}

	getHitboxes(cols){
		let animboxes = [];
		let self = this; 
		let out = '[';
		for(let c = 0; c<cols.length; c++){
			animboxes = [];
			out += '[';
			this.cachedImages.forEach((img,idx) => { 
				animboxes.push(this.parseImage(img,cols[c]));
			});
			animboxes.forEach((abox,aidx) => {
				abox.forEach((box,idx) => {
					out += '['+box.join(',')+'],';
				});
			}); 
			out += '],'
		}
		out += ']'

		const data = out; 
		const blob = new Blob([out], { type: 'text/plain' });
		const link = document.createElement('a');
		link.href = URL.createObjectURL(blob);
		link.download = this.getAnimName(this.anim.files[0])+'.txt';
		link.click();
	}

	getAnimName(path){
		if (typeof path !== 'string'){return '';}
		return path.split('/').pop().split('.')[0].split('_')[0];
	}

	parseImage(img,col){
		let hbs=[];
		let hb = this.findHitBox(img, col);
			hbs.push(hb);
		return hbs;
	}

	findHitBox(img, col) {
	    const cvs = document.createElement('canvas');
	    const ctx = cvs.getContext('2d');

	    let fcol;
 		if (typeof col === 'string'){ fcol = colorToHex(col); }
 		if (typeof fcol === 'string' && fcol.includes('#')) { fcol = hexToRgb(fcol); }
 		if(!fcol){return;}

 		// if(!img){return [0, 0, 0, 0, '\''+col+'\'', false, 0, 0]; }

	    cvs.width = img.width; cvs.height = img.height;
	    ctx.drawImage(img, 0, 0);

	    const data = ctx.getImageData(0, 0, cvs.width, cvs.height).data;
	    let minX = cvs.width, minY = cvs.height; let maxX = 0, maxY = 0;
	    for (let y = 0; y < cvs.height; y++) {
	        for (let x = 0; x < cvs.width; x++) {
	            const i = (y * cvs.width + x) * 4;
	            const r = data[i]; const g = data[i + 1]; const b = data[i + 2]; const a = data[i + 3];
	            if (r === fcol.r && g === fcol.g && b === fcol.b && a === 255) {
	                minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
	            }
	        }
	    }
	    if (minX <= maxX && minY <= maxY) {
	        return [minX, minY, maxX - minX + 1, maxY - minY + 1, '\''+col+'\'', false, img.width, img.height];
	    } else {
	        return [0, 0, 0, 0, '\''+col+'\'', false, img.width, img.height]; 
	    }
	}

	cacheImages(images, callback) {

		if(!images || !images.length){ return; }
		let self = this;
		let cacheDiv = document.querySelector('#cache');
		if (cacheDiv) {
			images.forEach(function(image) {
				let checkCache = document.querySelector('#cache img[src="' + image + '"]');
				if (!checkCache) {
					let cachedImage = new Image();
					let hitboximg = image.replace(/(.*\/)([^/]+)$/, '$1' + 'hitbox' + '/$2');
					cachedImage.src = hitboximg;
					cacheDiv.appendChild(cachedImage);
					self.cachedImages.push(cachedImage);
					cachedImage.onload = function(){
						self.loadedImages += 1;
						if(self.loadedImages === self.totalImages){
							callback();
						}
						cachedImage.onload = null;
					};
					self.totalImages += 1;
				}
			});
		}	
	}

}