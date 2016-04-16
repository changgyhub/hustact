var ox = new Array(1000);
var oy = new Array(1000);
var collideDis = 9.5;

var stageRatio = window.innerWidth/window.innerHeight;
var windowx = stageRatio * 600;
var windowy = 600;
var moveTox = windowx/2-1, moveToy = windowy/2-1, vx = 0, vy = 0;

var exitx;
var exity;


// ************ generate obstacles **************

var boardx = Math.floor(windowx / collideDis / 4) + 2;  //each unit in board is 2 * collide Distance
var boardy = Math.floor(windowy / collideDis / 4) + 2; 
r = new Array(boardx);// = createArray(boardx, boardy);
  
for(var i=0; i<boardx; i++)
    r[i] = new Array(boardy);
  
for(var i=0; i<boardx; i++)
    for(var j=0; j<boardy; j++)
        r[i][j] = 0;
for(var i=0; i<boardx; i++){
    r[i][0] = -1;
    r[i][boardy-1] = -1;
}
for(var i=0; i<boardy; i++){
    r[0][i] = -1;
    r[boardx-1][i] = -1;
}

var goN = Math.floor((Math.random() * 3) - 1);
var goE = 0;
if (goN == 0)
    while (goE == 0)
        goE = Math.floor((Math.random() * 3) - 1);

r[Math.floor(boardx/2)][Math.floor(boardy/2)] = 1;  
go(Math.floor(boardx/2), Math.floor(boardy/2), goE, goN);

for(var i=1; i<boardx-1; i++){
    for(var j=1; j<boardy-1; j++){
        if(r[i][j] == 0){
            ox.push((i-1) * 4 * collideDis + 20);
            oy.push((j-1) * 4 * collideDis + 20);
        }
    }
}

function check(x, y, xD, yD){
    //check forward
    if (r[x+xD][y+yD] == 1)
        return false;
    //if all route are blocked
    if (r[x+xD][y-yD] == 1000 && r[x-xD][y+yD] == 1000 && r[x+xD][y+yD] == 1000)
        return false;
    //left and right
    if (r[x-yD][y-xD] == 1 || r[x+yD][y+xD] == 1)
        return false;
    return true;
}

function go(x, y, xD, yD){      //direction change on x & y, exactly one to be 0
  if(r[x][y] == -1){
      exitx = (x - 2) * 4 * collideDis;
      exity = (y - 2) * 4 * collideDis;
      if (exitx < 3) exitx = 0;
      else if (exitx > windowx - 3) exitx = windowx;
      else if (exity < 3) exity = 0;
      else exity = windowy;
      return true;
  }
  //1000 means this route has been checked to be false
  if(r[x][y] == 1000)
      return false;
  while(true){
    if(!check(x, y, xD, yD)){
        r[x][y] = 1000;
        return false;
    }
    var goN = Math.floor((Math.random() * 4) - 1);
    if (goN == 2)
        goN = 0;
    var goE = 0;
    if (goN == 0){
        while (goE == 0)
          goE = Math.floor((Math.random() * 3) - 1);
    }
    
    if (goN + yD == 0 && goE + xD == 0)   // you cannot go back
        continue;
    
    if(go(x+goE, y+goN, goE, goN)){
        r[x][y] = 1;
        return true;
    }
  }
}


// ************ UI **************

var rendererOptions = {
  antialiasing: false,
  transparent: false,
  resolution: window.devicePixelRatio,
  autoResize: true,
  backgroundColor : 0xFFFFFF,
}
 

renderer = PIXI.autoDetectRenderer(windowx, windowy, rendererOptions);
renderer.view.style.position = "absolute";
renderer.view.style.top = "0px";
renderer.view.style.left = "0px";
 

var stage = new PIXI.Container();
var container = new PIXI.Container();
var hero = new PIXI.Graphics();
var verge = new PIXI.Graphics();
var exit = new PIXI.Graphics();
var obstacles = new Array();
var light = new PIXI.Graphics();
var mask = new PIXI.Graphics();

// Size the renderer to fill the screen
resize();
document.body.appendChild(renderer.view);
window.addEventListener("resize", resize);

function resize() {
  ratio = Math.min(window.innerWidth/windowx, window.innerHeight/windowy);
  stage.scale.x = stage.scale.y = ratio;
  renderer.resize(Math.ceil(windowx * ratio), Math.ceil(windowy * ratio));
}


function add_mask(){
    mask.lineStyle(0);
    mask.beginFill(0x000000, 1);
    mask.drawRect(4, 4, windowx - 8, windowy - 8);
    mask.endFill();
    stage.addChild(mask);
}

function add_light(){
    light.lineStyle(0);
    light.beginFill(0xFFFFFF, 0.5);
    light.blendMode = PIXI.BLEND_MODES.ADD;
    light.x = hero.x;
    light.y = hero.y;
    light.drawCircle(0, 0, 100);
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
    verge.lineStyle(40, 0x5e3a08, 1);
    verge.beginFill(0xf8ffc9, 1);
    verge.drawRect(0, 0, windowx, windowy);
    verge.endFill();
    container.addChild(verge);
}

function add_exit(){
    exit.lineStyle(40, 0x00ff00, 1);
    if (!exitx|| exitx == windowx){  //left or right
        exit.moveTo(exitx,exity-20);
        exit.lineTo(exitx,exity+20);
    } else {  // up or bottom
        exit.moveTo(exitx-20, exity);
        exit.lineTo(exitx+20,exity);
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

function onDown (e) {
    moveTox = e.data.getLocalPosition(stage).x;
    moveToy = e.data.getLocalPosition(stage).y;
    var ratio = (moveToy - hero.y) / (moveTox - hero.x);
    var buffvx = Math.sqrt(5 / (1 + ratio * ratio));
    var buffvy = Math.sqrt(5 - buffvx * buffvx);
    if (moveToy - hero.y > 0) vy = buffvy;
    else vy = -buffvy;
    if (moveTox - hero.x > 0) vx = buffvx;
    else vx = -buffvx;
}



// ************** start animation **************


animate();


function animate() {

    for (var i = 0; i < ox.length; i++){
        obstacles[i].x += - Math.random() + Math.random();
        obstacles[i].y += - Math.random() + Math.random();
    }

    light.y = hero.y += vy;
    light.x = hero.x += vx;

    checkCollide();
    
}

function distance(bx, by){
    return Math.sqrt( (by - hero.y) * (by - hero.y) + (bx - hero.x) * (bx - hero.x) );
}



var output = new PIXI.Text('Game Over',{
        font : 'bold italic 36px Arial',
        fill : '#F7EDCA',
        stroke : '#4a1850',
        strokeThickness : 5,
        dropShadow : true,
        dropShadowColor : '#000000',
        dropShadowAngle : Math.PI / 6,
        dropShadowDistance : 6,
        wordWrap : true,
        wordWrapWidth : 440
    });
output.x = windowx/6;
output.y = windowy/2;

function checkCollide(){
    if (((!exitx || exitx == windowx) && Math.abs(hero.x-exitx) < 20 && Math.abs(hero.y-exity) < 20) || ((!exity || exity == windowy) && Math.abs(hero.y-exity) < 20 && Math.abs(hero.x-exitx) < 20)){
        output.text = 'You win';
        stage.addChild(output);
        renderer.render(stage);
        return;
    }
    for (var i = 0; i < ox.length; i++){
        if (distance(obstacles[i].x, obstacles[i].y) < collideDis || hero.x < 15 || hero.x > windowx - 15 || hero.y < 15 || hero.y > windowy - 15){
            stage.addChild(output);
            renderer.render(stage);
            return;
        }
    }
    renderer.render(stage);
    requestAnimationFrame(animate);
}
