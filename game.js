var bullet1 = null;

engine.load = function(){
	engine.image.load("./img/bullet1.png", "bullet1");
	
	bullet1 = new engine.entity( "bullet1", 0, 0 );
	bullet1.w = 48;
	bullet1.h = 48;
	bullet1.angle = 30;
	bullet1.dx = 2;
	bullet1.dy = 2;
	bullet1.acceleration = 1.00001;
};
engine.draw = function(){
	bullet1.draw();
};
engine.update = function(){
	//if( ++bullet1.angle > 359 ) bullet1.angle = 0;
	bullet1.update();
	// if( --bullet2.angle < 1 ) bullet2.angle = 359;
};