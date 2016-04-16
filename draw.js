var ox = [50, 150, 250];
var oy = [50, 150, 250];

//exitx or exity = 34 or windowx/y - 34
var exitx = 123;
var exity = 466;

var windowx = 300;
var windowy = 500;

var moveTox = windowx/2-1, moveToy = windowy/2-1, vx = 0, vy = 0;

var renderer = PIXI.autoDetectRenderer(windowx, windowy,{backgroundColor : 0xFFFFFF});
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();
var container = new PIXI.Container();
var hero = new PIXI.Graphics();
var verge = new PIXI.Graphics();
var exit = new PIXI.Graphics();
var obstacles = new Array();
var light = new PIXI.Graphics();
var mask = new PIXI.Graphics();

function add_mask(){
    mask.lineStyle(0);
    mask.beginFill(0x000000, 1);
    mask.drawRect(38, 38, windowx - 76, windowy - 76);
    mask.endFill();
    stage.addChild(mask);
}

function add_light(){
    light.lineStyle(0);
    light.beginFill(0xFFFFFF, 0.5);
    light.blendMode = PIXI.BLEND_MODES.ADD;
    light.x = hero.x;
    light.y = hero.y;
    light.drawCircle(0, 0, 50);
    light.endFill();
    stage.addChild(light);
}

function add_hero(){
    hero.lineStyle(0);
    hero.beginFill(0x000000, 1);
    hero.x = windowx/2;
    hero.y = windowy/2;
    hero.drawCircle(0, 0, 5);
    hero.endFill();
    container.addChild(hero);
}

function add_verge(){
    verge.lineStyle(8, 0x5e3a08, 1);
    verge.beginFill(0xf8ffc9, 1);
    verge.drawRect(34, 34, windowx - 68, windowy - 68);
    verge.endFill();
    container.addChild(verge);
}

function add_exit(){
    exit.lineStyle(8, 0x00ff00, 1);
    if (exitx == 34 || exitx == windowx - 34){  //left or right
        exit.moveTo(exitx,exity-10);
        exit.lineTo(exitx,exity+10);
    } else {  // up or bottom
        exit.moveTo(exitx-10, exity);
        exit.lineTo(exitx+10,exity);
    }
    container.addChild(exit);
}


function add_obstacles(){
    for (var i = 0; i < ox.length; i++){
        var obstacle = new PIXI.Graphics();
        obstacle.lineStyle(0);
        obstacle.beginFill(0xff0000, 1);
        obstacle.x = ox[i];
        obstacle.y = oy[i];
        obstacle.drawCircle(0, 0, 5);
        obstacle.endFill();
        obstacles.push(obstacle);
        container.addChild(obstacles[i]);
    }
}

add_mask();
add_verge();
add_exit();
add_hero();

add_obstacles();
stage.addChild(container);

add_light();
container.mask = light;

stage.interactive = true;
stage.on('mousedown', onDown);
stage.on('touchstart', onDown);

function onDown (mouse) {
    moveTox = renderer.plugins.interaction.mouse.global.x;
    moveToy = renderer.plugins.interaction.mouse.global.y;
    var ratio = (moveToy - hero.y) / (moveTox - hero.x);
    var buffvx = Math.sqrt(5 / (1 + ratio * ratio));
    var buffvy = Math.sqrt(5 - buffvx * buffvx);
    if (moveToy - hero.y > 0) vy = buffvy;
    else vy = -buffvy;
    if (moveTox - hero.x > 0) vx = buffvx;
    else vx = -buffvx;
}

// run the render loop
animate();
//setTimeout(animate, 200);
function animate() {

    for (var i = 0; i < ox.length; i++){
        obstacles[i].x += - Math.random() + Math.random();
        obstacles[i].y += - Math.random() + Math.random();
    }

    light.y = hero.y += vy;
    light.x = hero.x += vx;

    renderer.render(stage);
    requestAnimationFrame(animate);
}
