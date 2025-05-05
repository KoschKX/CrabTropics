const level01 = new Level(
	new Pirate(),
	[
		new Crab(0),
		new Crab(1),
		new Crab(0),
		new Ship(0),
	],
	[
		// new Cloud(0, [0,200], [25,50]),
		// new Cloud(1, [500,740], [100,150]),
		// new Cloud(2, [200,500], [50,75]),
	],
	[
		new Background('./img/sky/skyA.jpg', 0, 0 ,0 , 740, 300 ),
		new Movie('./img/waves/ROLL_001.jpg', 1, 157, 0, 300, 740, 150),
		new Background('./img/trees/palms.png', 2, 0 , 0),
		new Background('./img/beach/beachA.png', 2, 0 , 0),
	],
	[
		new Cannonball(),
	],
	[
		new Explosion(),
	],
	[0,0,720,480], 
	350,
);

	