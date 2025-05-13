/**
 * LEVEL 01
 */
const level01 = {
	name: 'level 01',
	players: [
		'Pirate()',
	],
	bounds: [0,0,720,480],
	ground: 410,
	enemies: [
		'Crab([0,2])',
		'Crab([0,2])',
		'Crab(3)',
		'Ship(0)',
		'SeaTurtle()',
	],
	clouds: [],
	backgrounds: [
		'Background("./img/sky/skyA.jpg", 0, 0 ,0 , 740, 300)',
		//'Movie("./img/waves/ROLL_001.jpg", 1, 157, 0, 300, 740, 150, 30)',
		'Movie(["./img/waves/ROLL_001.webm","./img/waves/ROLL_001.mp4"], 1, 0, 0, 300, 740, 150, 30)',
		'Background("./img/trees/palms.png", 2, 0 , 0)',
		'Background("./img/beach/beachA.png", 2, 0 , 0)',
	],
	items: [
		'Catnip()',
		'Doubloon()',
	],
	projectiles: [
		'Cannonball()',
		'ShovelHole()',
		'XMark()',
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