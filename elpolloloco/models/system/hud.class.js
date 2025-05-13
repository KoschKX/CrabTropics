/**
 * Class representing the HUD (Head-Up Display) of the game.
 * Handles the display of player stats, game over screens, wealth, health, and time remaining.
 */
class HUD {

    /** IMAGE */
    cvs;
    ctx;

    /** WORLD REFERENCE */
    world;
    player;

    /**
     * Creates a new HUD object.
     * @param {World} The World.
     */
    constructor(world) {
        this.world = world;
        this.cvs = world.cvs;
        this.ctx = world.ctx;
    }

    /**
     * Initiates the continue screen when the player is dead.
     * Displays the continue option and waits for input.
     */
    continue() {
        let self = this;
        let cTime = this.world.player.deadTime(true);
        if (cTime == 0) { 
            this.world.keyboard.setBlocked(true); 
        }
        this.tick('<=', 10, function(t) {
            self.displayContinue(10 - t);
        });
        this.tick('>', 10, function(t) {
            self.displayGameOver();
        });
    }

    /**
     * Executes a callback function based on a comparison of the player's dead time.
     * @param {string} op - The comparison operator (e.g., '==', '<=', '>', etc.).
     * @param {number} sec - The number to compare with the player's dead time.
     * @param {function} callback - The function to call when the condition is met.
     */
    tick(op, sec, callback) {
        const dTime = this.world.player.deadTime(true);
        if (!callback) return;
        const ops = {
            '==': (a, b) => a === b,
            '<=': (a, b) => a <= b,
            '<':  (a, b) => a <  b,
            '>=': (a, b) => a >= b,
            '>':  (a, b) => a >  b,
            '!=': (a, b) => a !== b
        };
        const compare = ops[op];
        if (compare && compare(dTime, sec)) {
            callback(dTime);
        }
    }

    /**
     * Displays the "Game Over" screen when the player is dead.
     */
    displayGameOver() {
        let text = 'GAME OVER';
        let font = "bold " + (this.cvs.width * 0.1) + "px Arial";
        this.world.gameover = true; 
        drawText(this.ctx, this.cvs.width * 0.5, this.cvs.height * 0.5, 0, 0, text, 'white', font, 'center', 'middle', 'black', 2);
    }

    /**
     * Displays the continue screen and counts down the time left for the player to press SPACE.
     * Revives the enemies and player if the player presses SPACE.
     * @param {number} timeLeft - The remaining time before the game over screen appears.
     */
    displayContinue(timeLeft) {
        this.world.keyboard.setBlocked(false);
        let text = 'CONTINUE? ' + timeLeft;
        let font = "bold " + (this.cvs.width * 0.1) + "px Arial";
        if (this.world.keyboard.SPACE) {
            this.world.level.enemies.forEach((enemy) => {
                if (!enemy.isBoss) { 
                    enemy.health = 1; 
                }
                enemy.isHit(); 
                enemy.revive(3000);
            });
            this.world.player.setInvincible(1000);
            this.world.player.revive();
        }
        drawText(this.ctx, this.cvs.width * 0.5, this.cvs.height * 0.5, 0, 0, text, 'white', font, 'center', 'middle', 'black', 2);
    }

    /**
     * Displays the player's current health on the HUD.
     */
    displayHealth() {
        let text = '♥'.repeat(this.world.player.health);
        let font = 'bold 30px Arial';
        drawText(this.ctx, 20, 40, 0, 0, text, 'red', font, 'left', 'middle', 'white', 1);
    }

    /**
     * Displays the player's current wealth (doubloons) on the HUD.
     */
    displayWealth() {
        let text = '$' + (this.world.player.doubloons);
        let font = 'bold 30px Arial';
        drawText(this.ctx, 20, 70, 0, 0, text, 'white', font, 'left', 'middle', '', 1);
    }

    /**
     * Displays the remaining time on the clock or "FIGHT!" if time has run out.
     */
    displayClock() {
        let text = this.world.remainderClock(this.world.bossTime);
        if (text == '0:00' || text == '00:00') { text = "FIGHT!"; }
        if (this.world.boss && this.world.boss.dead) { text = "VICTORY!"; }
        let font = 'bold 40px Arial';
        drawText(this.ctx, (this.cvs.width) * 0.5, 80, 0, 0, text, 'red', font, 'center', 'middle', 'white', 1);
    }

    /**
     * Displays the player's health, wealth, and clock status on the HUD.
     */
    status() {
        this.displayHealth();
        this.displayWealth();
        this.displayClock();
    }

    /**
     * Prints the appropriate HUD screen based on the player's state (dead or alive).
     * If the player is dead, shows the continue screen. Otherwise, shows the status screen.
     */
    print(world) {
        if (this.world.player.dead) {
            this.continue();
        } else {
            this.status();
        }
    }
}