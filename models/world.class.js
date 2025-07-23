/**
 * The Really Real World.
 */

/** NOTES
 * Using intervals on multiple objects was prone to bugs. In /js/utils.js (global utilities), I've written 
 * custom setTimeout and setInterval functions so they can sync up with the game's elapsed time. 
 */

class World {
    
    constructor(cvs, scr, kbd, aud) {
        this.cvs = cvs;
        this.ctx = cvs.getContext('2d');
        this.screen = scr;
        this.keyboard = kbd;
        this.audio = aud;
        this.loadicon = new LoadIcon(canvas);
        this.loadbar = new ProgressBar(canvas);
        this.cam = new Camera(this);
        this.hud = new HUD(this);
        this.gameover = false;
        this.paused = false;
        this.initialized = false;
        this.cache = true;
        this.bosstest = false;
        this.bossDripLoading = false;
        this.level = null;
        this.levelmap = null;
        this.boss = null;
        this.clsnInterval = null;
        this.drawFramesId = null;
        this.frameRate = 70;
        this.elapsedTime = 0;
        this.elapsedClockTime = 0;
        this.clockStarted = false;
        this.lastTime = null;
        this.timestamp = null;
        this.lastUpdateTime = null;
        this.scheduledTimers = [];
        this.scheduledRepeaters = [];
        this.bossTime = null;
        this.bossEventTime = 60;
        this.debug = false;
    }

    /**
     * Destroys the world instance and cancels any ongoing animation frame.
     */
	destroy() {
		cancelAnimationFrame(this.drawFramesId); this.drawFramesId = null;
	}

    /**
     * Initializes the world, playing ambient sounds and music and setting up initial game state.
     */
	init() {
        if(this.loadicon){ this.loadicon.stop(); };
        // if(this.loadBar){ this.loadBar.stop(); };
	    this.audio.playSound(this.level.ambient[0], 1.0, false, true);
		this.audio.playMusic(this.level.music[0], 0.4, true);
		if(this.initialized){ return; }
    	this.frameDuration = 1000 / this.frameRate;
		this.timestamp = 0; this.lastUpdateTime = performance.now(); 
		this.bossTime = this.bossEventTime;
		let self = this; setTimeout(function(){
			self.clockStarted = true;
		}, 1000);
		this.draw();
		this.dripLoadBoss();
		this.initialized = true;
	}

    /**
     * Restarts the game, resetting all timers, states, and variables.
     */
	restart() {
		this.unpause();
		this.clearAllTimers();
		this.clearAllRepeats();
		this.elapsedTime = 0;
		this.elapsedClockTime = 0;
		this.clockStarted = false;
        //this.lastUpdateTime = performance.now();
		this.bossTime = this.bossEventTime;
		this.gameover = false; 
		this.debug = false; 
		this.bosstest = false; this.boss = null;
		this.audio.reset();
		this.level.reset();
		this.destroy();
		this.initialized = false;
		this.init();
		this.player = this.level.player;
		this.player.revive(0);
	}

    /**
     * Loads a new level into the world.
     * @param {LevelMap} levelmap - The level map data to load.
     */
    load(levelmap) {
        let newlevel = new Level(this, levelmap);
        this.level = newlevel;
        this.levelmap = levelmap;
        this.player = this.level.player;
        this.ground = this.level.ground;
        this.level.preload(function() {
            this.world.init();
            this.world.screen.showControls();
        });
    }

    /**
     * Draws the game world, including all objects and background layers.
     * @param {number} timestamp - The current time in milliseconds.
     */
	draw(timestamp) {
		this.timestamp = timestamp; this.frameDuration = 1000 / this.frameRate;
        // this.ctx.clearRect(0,0,this.cvs.width,this.cvs.height);
		this.ctx.save(); 
		this.updateCamera();
		this.tick(timestamp);
		this.ctx.restore();
		this.hud.print();
		this.drawFramesId = requestAnimationFrame((timestamp) => this.draw(timestamp));
	}

    drawObjects(){
        this.addObjectsToMap(this.level.backgrounds.filter(background => background.layer === 0));
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.backgrounds.filter(background => background.layer === 1));
        this.addObjectsToMap(this.level.enemies.filter(enemy => enemy.name === 'Ship'));
        this.addObjectsToMap(this.level.projectiles.filter(projectile => !projectile.falling && projectile.name === 'Cannonball'));
        this.addObjectsToMap(this.level.effects.filter(effect => effect.name === 'Explosion'));
        this.addObjectsToMap(this.level.backgrounds.filter(background => background.layer === 2));
        this.addObjectsToMap(this.level.projectiles.filter(projectile => projectile.name === 'XMark'));
        this.addObjectsToMap(this.level.enemies.filter(enemy => enemy.name === 'SeaTurtle'));
        this.addObjectsToMap(this.level.items.filter(item => item.name === 'Doubloon'));
        this.addObjectsToMap(this.level.items.filter(item => item.name === 'Catnip'));
        this.addObjectsToMap(this.level.enemies.filter(enemy => enemy.dead && enemy.name === 'Crab'));
        this.addObjectsToMap(this.level.effects.filter(effect => effect.name === 'Sparkle'));
        this.addToMap(this.player);
        this.addObjectsToMap(this.level.enemies.filter(enemy => !enemy.dead && enemy.name === 'Crab'));
        this.addObjectsToMap(this.level.effects.filter(effect => effect.name === 'Stomp'));
        this.addObjectsToMap(this.level.projectiles.filter(projectile => projectile.falling && projectile.name === 'Cannonball'));
        this.addObjectsToMap(this.level.backgrounds.filter(background => background.layer === 3));
        this.addObjectsToMap(this.level.projectiles.filter(projectile => projectile.name === 'XArrow'));
        this.addObjectsToMap(this.level.backgrounds.filter(background => background.layer === 4));
    }

    /**
     * Adds objects to the game world map.
     * @param {Array} objects - The array of objects to add to the map.
     */
    addObjectsToMap(objects) {
        objects.forEach(obj => { this.addToMap(obj); });
    }

    /**
     * Adds a single object to the map and draws it.
     * @param {Object} mo - The object to add and draw.
     */
    addToMap(mo) {
        if (mo.flickering && mo.flicker(1)) { return; }
        this.ctx.save();
        mo.draw(this.ctx);
        if (this.debug && mo instanceof Character) {
            mo.drawColliders(this.ctx);
        }
        this.ctx.restore();
    }

    /**
     * Updates the camera's position based on the player's location.
     */
    updateCamera() {
        this.cam.update(
            [this.player.x, this.player.y],
            [this.player.width * 0.5, 0],
            this.level.bounds,
        );
    }

    /**
     * Main game loop logic, executed every frame.
     * @param {number} timestamp - The current time in milliseconds.
     */
	tick(timestamp) {
		if ( this.paused) { this.lastUpdateTime = timestamp;  this.drawObjects(); return;}

		let delta = this.timestamp - this.lastUpdateTime;

		if (!this.paused && (delta >= this.frameDuration)) {

            this.drawObjects();

			// EXECUTER TIMERS
			this.scheduledTimers = this.scheduledTimers.filter(timer => {
		        if (this.elapsedTime >= timer.execTime) { timer.callback(); return false; }
		        return true;
		    });

		    // EXECUTE REPEATERS
		    for (const repeater of this.scheduledRepeaters) {
		        if (this.elapsedTime >= repeater.execTime) { repeater.callback(); repeater.execTime = this.elapsedTime + repeater.delay; }
		    }

		    this.elapsedTime += delta; 
		    if( this.clockStarted ){ this.elapsedClockTime += delta; }
			this.checkBossTime();
			this.checkCollisions();
            this.checkAdvMenuKey();
			this.lastUpdateTime = this.timestamp;
			this.level.backgrounds.forEach(obj => obj.main?.(delta));
			this.level.clouds.forEach(obj => obj.main?.(delta));
			this.level.enemies.forEach(obj => obj.main?.(delta));
			this.level.projectiles.forEach(obj => obj.main?.(delta));
			this.level.effects.forEach(obj => obj.main?.(delta));
			this.level.items.forEach(obj => obj.main?.(delta));
			this.player.main(delta);
		}
	}

    /**
     * Returns the formatted clock time in "MM:SS" format.
     * @returns {string} The current game time in "MM:SS" format.
     */
	clock(){
		let seconds= Math.floor(this.elapsedClockTime / 1000);
		let minutes = Math.floor(seconds / 60);
			seconds = seconds % 60;
		return minutes.toString().padStart(2, '0')+':'+seconds.toString().padStart(2, '0');
	}

    /**
     * Returns the remaining time in "MM:SS" format until the boss fight is triggered.
     * @param {number} total - The total time remaining until the event.
     * @returns {string} The remaining time in "MM:SS" format.
     */
    remainderClock(total) {
        let remaining = Math.floor(total - (this.elapsedClockTime / 1000));
        if (remaining < 0) {
            remaining = 0;
        }
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
    }

    /**
     * Pauses the game.
     * @returns {boolean} The paused state of the game.
     */
    pause() {
        this.paused = true;
        document.querySelector('#menu #pause_on').classList.remove('active');
        document.querySelector('#menu #pause_off').classList.add('active');
        return this.paused;
    }

    /**
     * Unpauses the game.
     * @returns {boolean} The paused state of the game.
     */
    unpause() {
        this.paused = false;
        document.querySelector('#menu #pause_off').classList.remove('active');
        document.querySelector('#menu #pause_on').classList.add('active');
        return this.paused;
    }

    /**
     * Sets a one-time timer to execute a callback after a specified delay.
     * @param {Function} callback - The function to call after the delay.
     * @param {number} delay - The delay time in milliseconds.
     * @returns {string} The ID of the timer.
     */
    setTimer(callback, delay) {
        const execTime = this.elapsedTime + delay;
        const id = Math.random().toString(36).substr(2, 9);
        this.scheduledTimers.push({ id, callback, execTime });
        return id;
    }

    /**
     * Clears a scheduled timer by its ID.
     * @param {string} id - The ID of the timer to clear.
     */
    clearTimer(id) {
        this.scheduledTimers = this.scheduledTimers.filter(timeout => timeout.id !== id);
    }

    /**
     * Sets a repeater that calls a callback function periodically after a specified delay.
     * @param {Function} callback - The function to call periodically.
     * @param {number} delay - The delay time in milliseconds between each execution.
     * @returns {string} The ID of the repeater.
     */
    setRepeater(callback, delay) {
        const id = Math.random().toString(36).substr(2, 9);
        const execTime = this.elapsedTime + delay;
        this.scheduledRepeaters.push({ id, callback, delay, execTime });
        return id;
    }

    /**
     * Clears a scheduled repeater by its ID.
     * @param {string} id - The ID of the repeater to clear.
     */
    clearRepeater(id) {
        this.scheduledRepeaters = this.scheduledRepeaters.filter(i => i.id !== id);
    }

    /**
     * Clears all scheduled timers.
     */
    clearAllTimers() {
        this.scheduledTimers = [];
    }

    /**
     * Clears all scheduled repeaters.
     */
    clearAllRepeats() {
        this.scheduledRepeaters = [];
    }

    /**
     * Checks for collisions between various game objects.
     */
    checkCollisions() {
        this.checkCollisionsItem();
        this.checkCollisionsProjectile();
        this.checkCollisionsEnemy();
    }

    /**
     * Checks for collisions between the player and items.
     */
    checkCollisionsItem() {
        this.level.items.forEach((item) => {
            let colIA = this.player.isColliding(item, 0, 0, true);
            if (colIA) {
                this.player.getItem(item);
            }
        });
    }

    /**
     * Checks for collisions between projectiles and various game entities (player, enemies).
     */
    checkCollisionsProjectile() {
        this.level.projectiles.forEach((projectile) => {
            let colPA = this.player.isColliding(projectile, 0, 0);
            let colPB = this.player.isColliding(projectile, 1, 0);
            if (colPA) {
                this.player.isHit(true);
            }
            if (colPB) {
                if (projectile instanceof XMark) {
                    if (this.keyboard.DOWN) this.player.dig(projectile);
                }
            }
            this.level.enemies.forEach((enemy) => {
                if (enemy.isBoss) { return; }
                let colPC = projectile.isColliding(enemy, 0, 0);
                if (colPC) {
                    if (projectile instanceof Cannonball && projectile.hostile && (!enemy.appearing)) {
                        enemy.isHit();
                    }
                }
            });
        });
    }

    /**
     * Checks for collisions between the player and enemies.
     */
    checkCollisionsEnemy() {
        this.level.enemies.forEach((enemy) => {
            let colA = this.player.isColliding(enemy, 0, 0);
            let colB = this.player.isColliding(enemy, 1, 1);
            if (colB) {
                if (this.player.falling) {
                    let bopPoint = enemy.y + enemy.boxes[1][1] - (this.player.boxes[1][1]);
                    if (enemy.isBoss == true && enemy.dead) {
                        this.player.bounce(17.5, bopPoint);
                        enemy.isHit();
                    } else {
                        if (!this.player.dead && (enemy.bounceoninjured || enemy.hostile) && (!enemy.appearing)) {
                            if (enemy.health > 0) { this.player.bounce(17.5, bopPoint); }
                            enemy.isHit();
                        }
                    }
                }
            } else if (colA) {
                if (!((this.player.falling || this.player.bouncing) && colA == 1) && enemy.hostile) {
                    this.player.isHit(true);
                }
            }
        });

        /** Checks enemies on other enemies */
        let antiEnemies = this.level.enemies.filter(antiEnemy => antiEnemy.attacksEnemies === true);
        antiEnemies.forEach((antiEnemy) => {
            if( !antiEnemy.boxes || !antiEnemy.boxes.length ){ return; }
            this.level.enemies.forEach((enemy) => {
                if(enemy==antiEnemy){ return; }
                let colA = antiEnemy.isColliding(enemy,0,0);
                if(colA){
                    enemy.isHit();
                }
            });
        });
    }

    /**
     * Checks if it's time for the boss fight to trigger.
     */
	checkBossTime(){
		if(this.boss){ return; }
		let remaining = Math.floor(this.bossTime - (this.elapsedClockTime / 1000));
		if( remaining<0 ){
			this.callBoss();
		}
	}

    /**
     * Calls and spawns the boss character when the boss fight begins.
     */
	callBoss(){
		if(this.bosstest || this.gameover){ return; } 
		let tmpBoss = new SeaTurtle(this, false);
		let self = this; this.level.preloadObjectLibs(tmpBoss, function(){
			log('Boss Called');
			self.bossTime = (self.elapsedClockTime / 1000);
			self.boss = new SeaTurtle(self, false);
		  	self.boss.init();
		  	self.boss.callBoss();
		  	self.boss.appearing = false; self.boss.static = true;
		  	self.level.enemies.push(self.boss);
		  	tmpBoss.destroy();
		});
		this.bosstest = true;
		this.audio.playSound('seaturtle_hornA', 0.5, true);
	}

    /**
     * Drip loads the boss assets (e.g., images, animations) as needed.
     */
	dripLoadBoss(){
		if(this.bossDripLoading){ return; } 
		this.bossDripLoading = true;
		let tmpBoss = new SeaTurtle(this, false);
		let self = this; this.level.dripImageLib(tmpBoss, tmpBoss.imagesLib, 100 ,function(){
			log('Boss Loaded');
			self.bossDripLoading = false;
			tmpBoss.destroy();
		});
	}

    /**
     * Check for the Video Format.
     */
    getVideoFormat(){
        this.videoFormat = document.querySelector('body').getAttribute('video-format');
        if(!this.videoFormat){this.videoFormat = 'mp4'; }
    }

/* ------------------ DEBUG ------------------ */

    /**
     * Checks if the TAB key is pressed to enable advanced menu.
     */
    checkAdvMenuKey(){
        if(this.keyboard.TAB){
            document.querySelector('body').setAttribute('advanced-menu', true);
        }
    }

    /**
     * Toggle to see Debug information on the screen and in the console.
     */
    toggleDebug(onoff, force = false){
        document.querySelector('body').setAttribute('data-debug', onoff);
        this.debug = onoff;
    }

}