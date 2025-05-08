class Anim{
	repeat = 1;
    frames = [];
    files = [];
    offsets = [];

    name = '';

	constructor(startfile,frames,options){
        let ext = startfile.split('.').pop();
        let name = startfile.split('_').slice(0, -1).join('_');

        this.name = name;

        // POPULATE FRAMES 
        if(!frames){  
            if (Array.isArray(startfile)) { 
                this.files=startfile; return; 
            } else{
                this.files.push(startfile); return; 
            }
        }
        if (Array.isArray(frames)) {
            for(let idx = 0; idx<frames.length; idx++){
                let ipath = name+"_"+String(frames[idx]).padStart(3, '0')+'.'+ext;
                if(this.files?.[ipath]){ return; };
                this.files.push(ipath);
            }  
        }else if(!isNaN(frames)){
    		for(let idx = 0; idx<frames; idx++){
                let ipath = name+"_"+String(idx+1).padStart(3, '0')+'.'+ext;
                if(this.files?.[ipath]){ return; };
                this.files.push(ipath);
            }   
        }
        
        // PARSE OPTIONS
        options=options.split(',');
        options.forEach((option) => { this.parseOption(option); });
	}

    parseOption(option){
        let opt = option.split('=');
        if(opt.length<=1){ return; }
        let o = opt[0]; let v = opt[1];

        if(o == 'repeat'){ this.repeat = parseInt(v); }
    }

    getAnimName(path){
        if (typeof path !== 'string'){return '';}
        return path.split('/').pop().split('.')[0].split('_')[0];
    }
}
