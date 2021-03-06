var bullet1 = null;
var bullet_state = { "REPOSE": 0, "GO": 1 };

var intro1 = null, intro2 = null;

var level1 = null;
var button_pause;
var paused = false;

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
	engine.image.load("./img/pause.png", "button_pause");
	engine.image.load("./img/play.png", "button_play");
	
	bullet1 = new engine.entity( "bullet1_hover", parseInt(engine.canvas.width / 2), parseInt(engine.canvas.height / 2) );
	bullet1.w = 32;
	bullet1.h = 32;
	bullet1.angle = 45;
	bullet1.magnitude = 2;
	bullet1.acceleration = 1.00001;
	bullet1.state = bullet_state.REPOSE;
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
		
		if( ( touch_left() || touch_right()
			|| click_left() || click_right() )
			&& this.state == bullet_state.REPOSE ){
			this.state = bullet_state.GO;
		}
		
		if( this.state == bullet_state.GO ){
			if( touch_left() || click_left() ){
				this.angle -= 6.8;
				this.key = "bullet1_left";
			}
			if( touch_right() || click_right() ){
				this.angle += 6.8;
				this.key = "bullet1_right";
			}
			if( ( ! touch_left() && ! touch_right() )
				&& ( ! click_left() && ! click_right() ) ){
				this.key = "bullet1_hover";
			}	
		}
	}
	engine.viewport.enabled = true;
	engine.viewport.width = 300;
	engine.viewport.height = 300;
	
	intro1 = new engine.entity( "intro1", 0, 0);
	intro1.w = 64;
	intro1.h = 64;
	intro1.x = parseInt(engine.canvas.width / 2) - parseInt( intro1.w / 2 );
	intro1.y = parseInt(engine.canvas.height / 2) - parseInt( intro1.h / 2 );
	intro1.top_layered = true;
	
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
	intro2.top_layered = true;
	
	level1 = new engine.map( "level1", 0, 0);
	var level1_array = {};
	level1_array.an_array = 
	[
		["b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"],
		["b", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "b"],
		["b", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "b"],
		["b", "x", "x", "x", "x", "b", "b", "b", "b", "x", "x", "b"],
		["b", "x", "x", "x", "x", "x", "b", "x", "x", "x", "x", "b"],
		["b", "x", "x", "x", "x", "x", "b", "x", "x", "x", "x", "b"],
		["b", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "b"],
		["b", "x", "x", "x", "x", "x", "x", "x", "x", "b", "b", "b"],
		["b", "x", "b", "x", "x", "x", "x", "x", "x", "b", "x", "b"],
		["b", "x", "b", "b", "x", "x", "x", "x", "x", "x", "x", "b"],
		["b", "x", "x", "x", "x", "x", "x", "x", "x", "x", "x", "b"],
		["b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"]
	];
	level1_array.w = 12;
	level1_array.h = 12;
	
	level1.array_push( level1_array, 48, 48, { "b": "block1" } );
	
	button_pause = new engine.entity( "button_pause", 0,0 );
	button_pause.w = 48;
	button_pause.h = 48;
	button_pause.x = engine.canvas.width - button_pause.w;
	button_pause.y = engine.canvas.height - button_pause.h;
	button_pause.top_layered = true;
};
engine.draw = function(){
	bullet1.draw();
	level1.draw();
	intro1.draw();
	intro2.draw();
	button_pause.draw();
};
engine.update = function(){
	if( touch_playpause() == true || click_playpause() == true ) paused = ! paused;
	
	if( paused == true ){
		if( button_pause.key == "button_pause" ){
			button_pause.key = "button_play";
		}
		return;
	}else{
		if( button_pause.key == "button_play" ){
			button_pause.key = "button_pause";
		}
	}
	
	bullet1.update();
	intro1.update();
	intro2.update();
	
	process_obstacles();
	
	engine.viewport.followTo( bullet1 );
	engine.viewport.update();
};

/*
	obstacles & target
*/
function process_obstacles(){
	level1.entity_list.forEach( function( item ){
		if( item.key == "block1" ){
			if( item.collide( bullet1 ) ){
				console.log("collide!");
				
				return;
			}
		}
	} );
}
function process_target(){
	
}

/*
	touch/click logic
*/
function touch_playpause(){
	return ( engine.events.touch_x < engine.canvas.width && engine.events.touch_x > engine.canvas.width - button_pause.w
			&& engine.events.touch_y < engine.canvas.height && engine.events.touch_y > engine.canvas.height - button_pause.h );
}
function touch_exclution(){
	return touch_playpause();
}

function click_playpause(){
	return ( engine.events.click_x < engine.canvas.width && engine.events.click_x > engine.canvas.width - button_pause.w
			&& engine.events.click_y < engine.canvas.height && engine.events.click_y > engine.canvas.height - button_pause.h );
}
function click_exclution(){
	return click_playpause();
}

function touch_left(){
	return ( engine.events.touch_x < engine.canvas.width / 2 && engine.events.touch_y < engine.canvas.height ) && ( engine.events.touch_x > 0 && engine.events.touch_y > 0 ) && ! touch_exclution();
}
function touch_right(){
	return ( engine.events.touch_x > engine.canvas.width / 2 && engine.events.touch_y < engine.canvas.height ) && ( engine.events.touch_x > 0 && engine.events.touch_y > 0 ) && ! touch_exclution();
}

function click_right(){
	return ( engine.events.click_x > engine.canvas.width / 2 && engine.events.click_y < engine.canvas.height ) && ( engine.events.click_x > 0 && engine.events.click_y > 0 ) && ! click_exclution();
}
function click_left(){
	return ( engine.events.click_x < engine.canvas.width / 2 && engine.events.click_y < engine.canvas.height ) && ( engine.events.click_x > 0 && engine.events.click_y > 0 ) && ! click_exclution();
}
