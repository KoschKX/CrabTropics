/**
 * Audio System for sounds and music.
 */

/** NOTES
 * Because the original audio system was incompatible with safari. It was syncronous and caused lagging and delays.
*/

class AudioManager {

    /** LIBRARIES */
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

    /** AUDIO CONTEXT */
    context = null;
    soundGain = null;
    musicGain = null;

    /** STATE */
    isReady = false;
    muted = false;
    wasMuted = false;

    /** CURRENT INSTANCES */
    sounds = {};
    currSounds = {};
    currMusics = [];

    /** INTERVALS */
    mainInterval = null;
    debugInterval = null;

    constructor(callback) {
        this.init(callback);
    }

    async init(callback) {
        clearInterval(this.mainInterval);
        clearInterval(this.debugInterval);

        this.mainInterval = setInterval(() => this.main(), 1000 / 60);
        this.debugInterval = setInterval(() => this.debug(), 1000 / 30);

        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.soundGain = this.context.createGain();
        this.soundGain.connect(this.context.destination);

        await this.loadSounds();
        this.isReady = true;

        if (typeof callback === 'function') callback();
    }

    /**
     * Loads all sound and music files.
     * @returns {Promise<void>}
     */
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

    main() {}
    debug() {}

    /**
     * Plays a sound effect.
     * @param {string|string[]} name - Sound label or list of labels.
     * @param {number} [vol=1.0] - Volume.
     * @param {boolean} [overlap=true] - Allow overlapping?
     * @param {boolean} [loop=false] - Should the sound loop?
     * @returns {string|null} ID of the sound instance.
     */
    playSound(name, vol = 1.0, overlap = true, loop = false) {
        if (!this.isReady || !this.context || this.context.state === 'closed') return null;

        const label = Array.isArray(name) ? name[Math.floor(Math.random() * name.length)] : name;
        const soundBuffer = this.sounds[label];
        if (!soundBuffer) return null;

        if (!this.currSounds[label]) this.currSounds[label] = [];
        if (!overlap && this.currSounds[label].length > 0) return null;

        const source = this.context.createBufferSource();
        const gain = this.context.createGain();

        source.buffer = soundBuffer;
        source.loop = loop;
        gain.gain.value = vol;

        source.connect(gain);
        gain.connect(this.soundGain);
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

    /**
     * Stops all instances of a sound.
     * @param {string} name - Sound label.
     */
    stopSound(name) {
        const sources = this.currSounds[name];
        if (Array.isArray(sources)) {
            sources.forEach(({ source }) => {
                source.stop();
                source.disconnect();
            });
            delete this.currSounds[name];
        }
    }

    /**
     * Checks if a sound is currently playing.
     * @param {string} name - Sound label.
     * @returns {boolean}
     */
    isSoundPlaying(name) {
        return Array.isArray(this.currSounds[name]) && this.currSounds[name].length > 0;
    }

    /**
     * Checks if a specific sound instance is playing.
     * @param {string} label - Sound label.
     * @param {string} id - Sound instance ID.
     * @returns {boolean}
     */
    isSpecificSoundPlaying(label, id) {
        return (this.currSounds[label] || []).some(sound => sound.id === id);
    }

    /**
     * Plays a music track.
     * @param {string} name - Track label.
     * @param {number} [vol=1.0] - Volume.
     * @param {boolean} [loop=true] - Should it loop?
     */
    playMusic(name, vol = 1.0, loop = true) {
        if (!this.isReady) return;

        const musicBuffer = this.sounds[name];
        if (!musicBuffer) return;

        this.stopAllMusic();

        const source = this.context.createBufferSource();
        const gain = this.context.createGain();

        source.buffer = musicBuffer;
        source.loop = loop;
        gain.gain.value = vol;

        source.connect(gain);
        gain.connect(this.soundGain);
        source.start();

        this.currMusics.push({ name, source });
        this.musicGain = gain;
    }

    /**
     * Stops music by name.
     * @param {string} name - Music label.
     */
    stopMusic(name) {
        this.currMusics = this.currMusics.filter(entry => {
            if (entry.name === name) {
                entry.source.stop();
                entry.source.disconnect();
                return false;
            }
            return true;
        });
    }

    /**
     * Stops all currently playing sounds.
     */
    stopAllSounds() {
        Object.values(this.currSounds).flat().forEach(({ source }) => {
            source.stop();
            source.disconnect();
        });
        this.currSounds = {};
    }

    /**
     * Stops all currently playing music.
     */
    stopAllMusic() {
        this.currMusics.forEach(({ source }) => {
            source.stop();
            source.disconnect();
        });
        this.currMusics = [];
    }

    /**
     * Resets audio system and reloads sounds.
     */
    reset() {
        this.destroy();
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.soundGain = this.context.createGain();
        this.soundGain.connect(this.context.destination);
        this.sounds = {};
        this.loadSounds();
    }

    /**
     * Destroys and cleans up the audio context.
     */
    destroy() {
        this.stopAllSounds();
        this.stopAllMusic();
        this.currSounds = {};
        this.muted = false;
        this.setMasterVolume(1);

        if (this.context) {
            this.context.close();
            this.context = null;
        }

        this.sounds = {};
    }

    /**
     * Sets the global audio volume.
     * @param {number} vol - Volume [0, 1].
     */
    setMasterVolume(vol) {
        if (this.soundGain) {
            this.soundGain.gain.value = vol;
        }
    }

    /**
     * Mutes all audio and updates UI.
     * @param {boolean} [fromButton=true] - Was this triggered from a button?
     */
    mute(fromButton = true) {
        if (!fromButton) this.wasMuted = this.muted;
        this.muted = true;
        this.setMasterVolume(0);
        document.querySelector('#menu #sound_on')?.classList.remove('active');
        document.querySelector('#menu #sound_off')?.classList.add('active');
    }

    /**
     * Unmutes all audio and updates UI.
     * @param {boolean} [fromButton=true] - Was this triggered from a button?
     */
    unmute(fromButton = true) {
        if (!fromButton) this.wasMuted = this.muted;
        this.muted = false;
        this.setMasterVolume(1);
        document.querySelector('#menu #sound_on')?.classList.add('active');
        document.querySelector('#menu #sound_off')?.classList.remove('active');
    }

    /**
     * Logs currently playing sound instances.
     * @param {string=} name - Optional filter by label.
     */
    printCurrSounds(name) {
        Object.keys(this.sounds).forEach(label => {
            if (!name || label === name) {
                const count = (this.currSounds[label] || []).length;
                log(label+': '+count+' '+'instance(s)');
            }
        });
    }
}