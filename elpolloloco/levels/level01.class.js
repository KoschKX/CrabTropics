const level01 = new Level(
	[
		new Crab(0),
		new Crab(1),
		new Crab(0),
	],
	[
		new Cloud(0, [0,200], [25,50]),
		new Cloud(1, [500,740], [100,150]),
		new Cloud(2, [200,500], [50,75]),
	],
	new Background('./img/beach/skyA.png', 0 , 0),
	new Background('./img/beach/beachA.png', 0 , 0),
	350,
);

	