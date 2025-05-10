class AudioManager {
    
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
        './audio/xmark_appearA.mp3',
        './audio/shovel_digA.mp3',
        './audio/catnip_findA.mp3',
        './audio/catnip_getA.mp3',
        './audio/doubloon_findA.mp3',
        './audio/doubloon_getA.mp3',
        './audio/seaturtle_hornA.mp3',
        './audio/seaturtle_hitA.mp3',
        './audio/seaturtle_biteA.mp3',
        './audio/seaturtle_flingA.mp3',
        './audio/seaturtle_collapseA.mp3',
        './audio/seaturtle_growlA.mp3',
    ];

    MUSIC_BANK = [
        './audio/ocean.mp3',
        './audio/island_lover.mp3',
        './audio/sueno_tropical.mp3'
    ];

	context = null;
    gainNode = null;
    sounds = {};
    currSounds = {};
    activeMusicSources = [];
    musicSource = null;
    musicGain = null;
    isReady = false;

    muted = false; wasMuted = false;

    mainInterval; debugInterval;

    constructor(callback) {
        this.init(callback);
    }

    main(){}

    debug(){
       // this.printCurrSounds('jump');
    }

    async init(callback) {
        clearInterval(this.mainInterval); 
        this.mainInterval = setInterval(() => { this.main(); }, 1000 / 60 );
        clearInterval(this.debugInterval); 
        this.debugInterval = setInterval(() => { this.debug(); }, 1000 / 30 );
        if (!this.context) {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.context.createGain();
            this.gainNode.connect(this.context.destination);
            await this.loadSounds();
            this.isReady = true;
            if (callback && typeof callback === 'function') callback();
        }
    }

    async loadSounds() {
        const allFiles = [...this.SOUND_BANK, ...this.MUSIC_BANK];
        const promises = allFiles.map(async (path) => {
            const response = await fetch(path);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
            const label = path.split('/').pop().split('.')[0];
            this.sounds[label] = audioBuffer;
        });
        await Promise.all(promises);
    }

	playSound(name, vol = 1.0, overlap = true, loop = false) {
	    if (!this.isReady || !this.context || this.context.state === 'closed') { return null; }

       // if(name=='jump'){ console.trace();}

	    let label = Array.isArray(name) ? name[Math.floor(Math.random() * name.length)] : name;
	    const soundBuffer = this.sounds[label];
	    if (!soundBuffer) return null;

	    if (!this.currSounds[label]) this.currSounds[label] = [];

	    if (!overlap && this.currSounds[label].length > 0) return null;

	    const source = this.context.createBufferSource();
	    source.buffer = soundBuffer;
	    source.loop = loop;

	    const gain = this.context.createGain();
	    gain.gain.value = vol;

	    source.connect(gain);
	    gain.connect(this.gainNode);
	    source.start();

	    const id = Math.random().toString(36).substr(2, 9);

	    const instance = { id, source };
	    this.currSounds[label].push(instance);


        source.onended = () => {
            if (this.currSounds[label]) {
                this.currSounds[label] = this.currSounds[label].filter(s => s.id !== id);
                if (this.currSounds[label].length === 0) delete this.currSounds[label];
            }
        };

	    return id;
	}

    stopSound(name) {
        const sources = this.currSounds[name];
        if (Array.isArray(sources)) {
            sources.forEach(source => {
                source.stop();
                source.disconnect();
            });
            delete this.currSounds[name];
        }
    }

    isSoundPlaying(name) {
        return Array.isArray(this.currSounds[name]) && this.currSounds[name].length > 0;
    }

	isSpecificSoundPlaying(label, id) {
	    const sounds = this.currSounds[label];
	    if (!sounds) return false;
	    return sounds.some(sound => sound.id === id);
	}

    playMusic(name, vol = 1.0, loop = true) {
        if (!this.isReady) return;

        const musicBuffer = this.sounds[name];
        if (!musicBuffer) return;

        this.stopAllMusic();

        const source = this.context.createBufferSource();
        source.buffer = musicBuffer;
        source.loop = loop;
        const gain = this.context.createGain();
        gain.gain.value = vol;
        source.connect(gain);
        gain.connect(this.gainNode);
        source.start();
        this.activeMusicSources.push(source);
        this.musicGain = gain;
    }

    stopMusic() {
        if (this.musicSource) {
            this.musicSource.stop();
            this.musicSource.disconnect();
            this.musicSource = null;
        }
    }

    stopAllSounds() {
        for (const label in this.currSounds) {
            const sources = this.currSounds[label];
            if (Array.isArray(sources)) {
                sources.forEach(sound => {
                    sound.source.stop();
                    sound.source.disconnect();
                });
            }
        }
    }

    stopAllMusic() {
        this.activeMusicSources.forEach(source => {
            source.stop();
            source.disconnect();
        });
        this.activeMusicSources = []; 
    }

    reset() {
        this.destroy();
        if (this.context) { this.context.close(); }
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.gainNode = this.context.createGain();
        this.gainNode.connect(this.context.destination); 
        this.sounds = {};
        this.loadSounds(); 
    }

    destroy() {
        this.stopAllSounds();
        if (this.musicSource) {
            this.musicSource.stop();
            this.musicSource.disconnect();
            this.musicSource = null;
        }
        this.currSounds = {};
        this.muted = false;
        this.setMasterVolume(1);
        if (this.context) {
            this.context.close(); 
            this.context = null;
        }
        this.sounds = {};
    }

    setMasterVolume(vol) {
        if (this.gainNode) {
            this.gainNode.gain.value = vol;
        }
    }

/* EVENTS */

    mute(ui=true) {
        if(!ui){ this.wasMuted = this.muted; }
    	this.muted = true;
        this.setMasterVolume(0);
        document.querySelector('#menu #sound_on').classList.remove('active');
        document.querySelector('#menu #sound_off').classList.add('active');
    }
    
    unmute(ui=true) {
        if(!ui){ this.wasMuted = this.muted; }
    	this.muted = this.false;
      	this.setMasterVolume(1);
        document.querySelector('#menu #sound_on').classList.add('active');
        document.querySelector('#menu #sound_off').classList.remove('active');
    }


/* DEBUG */

    printCurrSounds(name) {
        const allLabels = Object.keys(this.sounds);
        for (const label of allLabels) {
            if (name && label !== name) continue;
            const sources = this.currSounds[label] || [];
            console.log(`${label}: ${sources.length || 0} instance(s)`);
        }
    }
}