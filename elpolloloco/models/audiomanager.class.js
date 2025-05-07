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
        './audio/doubloon_findA.mp3',
        './audio/doubloon_getA.mp3'
      
    ];

    MUSIC_BANK = [
        './audio/ocean.mp3',
        './audio/royalty_free.mp3'
    ];

context = null;
    gainNode = null;
    sounds = {};
    currSounds = {};
    musicSource = null;
    musicGain = null;
    isReady = false;

    mainInterval; debugInterval;

    constructor(callback) {
        this.init(callback);
        clearInterval(this.mainInterval); 
        this.mainInterval = setInterval(() => { this.main(); }, 1000 / 60 );
        clearInterval(this.debugInterval); 
        this.debugInterval = setInterval(() => { this.debug(); }, 1000 / 30 );
    }

    main(){}

    debug(){
        // this.printcurrSounds('crab_walkA');
    }

    async init(callback) {
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
    if (!this.isReady) return null;

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
    gain.connect(this.context.destination);
    source.start();

    const id = Math.random().toString(36).substr(2, 9);

    const instance = { id, source };
    this.currSounds[label].push(instance);

    source.onended = () => {
        this.currSounds[label] = this.currSounds[label].filter(s => s.id !== id);
        if (this.currSounds[label].length === 0) delete this.currSounds[label];
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

        if (this.musicSource) {
            this.musicSource.stop();
            this.musicSource.disconnect();
        }

        const source = this.context.createBufferSource();
        source.buffer = musicBuffer;
        source.loop = loop;

        const gain = this.context.createGain();
        gain.gain.value = vol;

        source.connect(gain);
        gain.connect(this.context.destination);
        source.start();

        this.musicSource = source;
        this.musicGain = gain;
    }

    stopMusic() {
        if (this.musicSource) {
            this.musicSource.stop();
            this.musicSource.disconnect();
            this.musicSource = null;
        }
    }

    setMasterVolume(vol) {
        if (this.gainNode) {
            this.gainNode.gain.value = vol;
        }
    }

/* DEBUG */

    printcurrSounds(name) {
        const allLabels = Object.keys(this.sounds);
        for (const label of allLabels) {
            if (name && label !== name) continue;
            const sources = this.currSounds[label] || [];
            console.log(`${label}: ${sources.length || 0} instance(s)`);
        }
    }
}