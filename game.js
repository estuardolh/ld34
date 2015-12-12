var bullet1 = null;
var bullet_state = { "REPOSE": 0, "GO": 1 };

var intro1 = null, intro2 = null;

var level1 = null;

engine.load = function(){
	/*
	bullet !
	*/
	engine.image.load("./img/intro1.png", "intro1");
	engine.image.load("./img/intro2.png", "intro2");
	
	engine.image.load("./img/bullet1_hover.png", "bullet1_hover");
	engine.image.load("./img/bullet1_left.png", "bullet1_left");
	engine.image.load("./img/bullet1_right.png", "bullet1_right");
	
	engine.image.load("./img/block1.png", "block1");
	
	bullet1 = new engine.entity( "bullet1_hover", parseInt(engine.canvas.width / 2), parseInt(engine.canvas.height / 2) );
	bullet1.w = 48;
	bullet1.h = 48;
	bullet1.angle = 45;
	bullet1.magnitude = 2;
	bullet1.acceleration = 1.00001;
	bullet1.state = bullet_state.REPOSE;
	
	intro1 = new engine.entity( "intro1", 0, 0);
	intro1.w = 64;
	intro1.h = 64;
	intro1.x = parseInt(engine.canvas.width / 2) - parseInt( intro1.w / 2 );
	intro1.y = parseInt(engine.canvas.height / 2) - parseInt( intro1.h / 2 );
	
	intro2 = new engine.entity( "intro2", 0, 0);
	intro2.w = 64;
	intro2.h = 64;
	intro2.x = parseInt(engine.canvas.width / 2) + parseInt( intro2.w / 2 );
	intro2.y = parseInt(engine.canvas.height / 2) - parseInt( intro2.h / 2 );
	intro2.update = function(){
		if( bullet1.state != bullet_state.REPOSE && this.visible == true ){
			this.visible = false;
		}
	};
	intro1.update = intro2.update;
	
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
		
		if( this.state == bullet_state.REPOSE ){
			this.angle += 6.4;
		}
		if( this.state == bullet_state.GO ){
			this.magnitude = Math.sqrt( 8 /* square root( 2^2 + 2^2 ) || 45 degrees */ );	
		}
		
		this.dx = engine.math.angle_to_xy( this.angle, this.magnitude )[0];
		this.dy = engine.math.angle_to_xy( this.angle, this.magnitude )[1];
		//this.angle = engine.math.xy_to_angle( this.dx, this.dy );
		
		if( ( is_left() || is_right() )
			&& this.state == bullet_state.REPOSE ){
			this.state = bullet_state.GO;
		}
		
		if( this.state == bullet_state.GO ){
			if( is_left() ){
				this.angle -= 6.8;
				this.key = "bullet1_left";
			}
			if( is_right() ){
				this.angle += 6.8;
				this.key = "bullet1_right";
			}
			if( ! is_left() && ! is_right() ){
				this.key = "bullet1_hover";
			}	
		}
	}

	level1 = new engine.map( "level1", 0, 0);
	var level1_array = {};
	level1_array.an_array = 
	[
		["b", "b", "x", "b"],
		["b", "x", "b", "x"],
		["b", "x", "x", "x"],
		["b", "x", "x", "x"]
	];
	level1_array.w = 4;
	level1_array.h = 4;
	
	level1.array_push( level1_array, 48, 48, { "b": "block1" } );
};
engine.draw = function(){
	bullet1.draw();
	intro1.draw();
	intro2.draw();
	level1.draw();
};
engine.update = function(){
	bullet1.update();
	intro1.update();
	intro2.update();
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