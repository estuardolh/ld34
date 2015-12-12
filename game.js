var bullet1 = null;

engine.load = function(){
	/*
	bullet !
	*/
	engine.image.load("./img/bullet1.png", "bullet1");
	
	bullet1 = new engine.entity( "bullet1", 0, 0 );
	bullet1.w = 48;
	bullet1.h = 48;
	bullet1.angle = 30;
	bullet1.magnitude = Math.sqrt( 8 /* square root( 2^2 + 2^2 ) || 45 degrees */ );
	bullet1.acceleration = 1.00001;
	
	// inherance ? xd
	/*
	var bullet1_updatefather = bullet1.update();
	bullet1.update = function(){
		bullet1_updatefather();
		bullet1.angle = engine.math.xy_to_angle( bullet1.x, bullet1.y );
	};
	*/
	
	bullet1.update = function(){
		this.x += this.dx;
		this.y += this.dy;
		
		this.dx *= this.acceleration;
		this.dy *= this.acceleration;
		
		this.dx = engine.math.angle_to_xy( this.angle, this.magnitude )[0];
		this.dy = engine.math.angle_to_xy( this.angle, this.magnitude )[1];
		//this.angle = engine.math.xy_to_angle( this.dx, this.dy );
		
		if( is_left() ) this.angle += 6.8;
		if( is_right() ) this.angle -= 6.8;
		
	}

};
engine.draw = function(){
	bullet1.draw();
};
engine.update = function(){
	
	bullet1.update();
};

/*
	touch logic
*/
function is_left(){
	return ( engine.events.touch_x < engine.canvas.width / 2 && engine.events.touch_y < engine.canvas.height ) && ( engine.events.touch_x > 0 && engine.events.touch_y > 0 );
}
function is_right(){
	return ( engine.events.touch_x > engine.canvas.width / 2 && engine.events.touch_y < engine.canvas.height ) && ( engine.events.touch_x > 0 && engine.events.touch_y > 0 );
}