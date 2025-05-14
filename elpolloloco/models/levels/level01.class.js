/**
 * LEVEL 01
 */
const level01 = {
	name: 'level 01',
	players: [
		'Pirate()',
	],
	bounds: [0,0,1152,768],
	ground: 670,
	enemies: [
		'Crab([0,2])',
		'Crab([0,2])',
		'Crab(3)',
		//'Ship(0)',
		'SeaTurtle()',
	],
	clouds: [],
	backgrounds: [
		'Background("./img/sky/skyA.jpg", 0, 0 ,0 , 1152, 500)',
		'Movie("./img/waves/ROLL_001.jpg", 1, 157, 0, 500, 1152, 200, 30)',
		//'Movie(["./img/waves/ROLL_001.webm","./img/waves/ROLL_001.mp4"], 1, 0, 0, 500, 1152, 200, 30)',
		'Background("./img/trees/palms.png", 2, 0 , 0, 1152, 768)',
		'Background("./img/beach/beachA.png", 2, 0 , 0, 1152, 768)',
	],
	items: [
		'Catnip()',
		'Doubloon()',
	],
	projectiles: [
		'Cannonball()',
		'ShovelHole()',
		'XMark()',
		'XArrow()',
	],
	effects: [
		'Explosion()',
		'Stomp()',
		'Sparkle()',
	],
	ambient: [
		'ocean',
	],
	music: [
		'island_lover',
	]
}