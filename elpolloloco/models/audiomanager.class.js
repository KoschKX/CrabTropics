class Audiomanager{

	SOUND_BANK = [
		'./audio/jump.mp3',
		'./audio/pirate_hitA.mp3',
		'./audio/pirate_hitB.mp3',
		'./audio/pirate_hitC.mp3',
		'./audio/pirate_dieA.mp3',
		'./audio/crab_hitA.mp3',
		'./audio/crab_hitB.mp3',
		'./audio/crab_hitC.mp3',
		'./audio/crab_walkA.mp3',
		'./audio/crab_walkB.mp3',
		'./audio/cannon_fireA.mp3',
		'./audio/cannon_fireB.mp3',
		'./audio/cannon_fireC.mp3',
		'./audio/cannon_whizzA.mp3',
		'./audio/cannon_whizzB.mp3',
		'./audio/cannon_whizzC.mp3',
		'./audio/cannon_thudA.mp3',
		'./audio/cannon_thudB.mp3',
		'./audio/cannon_thudC.mp3',
		'./audio/ocean.mp3',
		'./audio/royalty_free.mp3'
	]

	sounds = [];
	
	constructor(){
		this.init();
	}

	init(){
		this.populateSoundLib();
		this.preload();
	}

    populateSoundLib() {
        this.SOUND_BANK.forEach((soundPath) => {
            const label = soundPath.split('/').pop().split('.')[0];
            this.sounds[label] = new Audio(soundPath);
        });
    }

    preload(callback) {
        let loadedCount = 0;
        const total = this.SOUND_BANK.length;
        this.SOUND_BANK.forEach((path) => {
            const label = path.split('/').pop().split('.')[0];
            const audio = new Audio(path);
            audio.preload = 'auto';
            audio.addEventListener('canplaythrough', () => {
                loadedCount++; if (loadedCount === total && callback && typeof callback === 'function') { callback(); }
            }, { once: true });
            audio.load(); 
            this.sounds[label] = audio;
        });
    }

 	playSound(name, vol = 1.0, overlap=true, loop=false) {
 		let sound; let rndsnd;
 		if (Array.isArray(name)) {
 			let rndsnd = randomInt(0,name.length-1);
 			sound = this.sounds[name[rndsnd]];
 		}else{
 			sound = this.sounds[name];
 		}	
        if (sound) {
	 		if (!sound.paused && sound.currentTime > 0 && !overlap) {
			    return;
			}
			if(loop){ sound.loop = true; }
			sound.volume = vol;
            sound.currentTime = 0; 
            sound.play();
        }
    }

    setSoundVolume(name, vol = 1.0) {
 		let sound;
 		if (Array.isArray(name)) {
 			name.forEach((nm) => { 
 				nm.volume = vol;
 			});
 		}else{
 			sound = this.sounds[name];
 			if (sound) {
				sound.volume = vol;
	        }
 		}	
        
    }

    stopSound(name) {
 		let sound; let rndsnd;
 		if (Array.isArray(name)) {
 			name.forEach((nm) => { 
 				nm.pause(); 
 				nm.currentTime = 0; 
 			});
 		}else{
 			sound = this.sounds[name];
	        if (sound) {
		 		sound.pause(); 
				sound.currentTime = 0;

	        }
 		}	
    }


}
