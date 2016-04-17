var ox;
var oy;

var collideDis = 9.5;
var lightScale = 100;

var stageRatio = window.innerWidth/window.innerHeight;
var windowx = stageRatio * 600;
var windowy = 600;
var moveTox = windowx/2-1, moveToy = windowy/2-1, vx = 0, vy = 0;
var ax = 0; ay = 0;
var bonus_scalex = Math.random() * windowx * 0.6 + windowx * 0.2, bonus_scaley = Math.random() * windowy * 0.6 + windowy * 0.2;

var exitx;
var exity;
var densityVar = 16;

var running = true;
var dead = false;
var sumScore = 0;
var currentScore = 999;

// ************ generate obstacles **************

var boardx;
var boardy;
var obstacleLeftDist;
var obstacleUpperDist;
var goN, goE;
generate();

function generate(){
    boardx = Math.floor(windowx / collideDis / densityVar) + 2;  //each unit in board is 2 * collide Distance
    boardy = Math.floor(windowy / collideDis / densityVar) + 2; 
    obstacleLeftDist = Math.floor((windowx % (densityVar * collideDis)) / 2); 
    obstacleUpperDist = Math.floor((windowy % (densityVar * collideDis)) / 2); 
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
   ox = new Array(0);
   oy = new Array(0);
   goN = Math.floor((Math.random() * 3) - 1);
   goE = 0;
   if (goN == 0)
       while (goE == 0)
           goE = Math.floor((Math.random() * 3) - 1);

   r[Math.floor(boardx/2)][Math.floor(boardy/2)] = 1;  
   go(Math.floor(boardx/2), Math.floor(boardy/2), goE, goN);

   for(var i=1; i<boardx-1; i++){
       for(var j=1; j<boardy-1; j++){
           if(r[i][j] == 0){
               ox.push((i-1) * densityVar * collideDis + obstacleLeftDist);
               oy.push((j-1) * densityVar * collideDis + obstacleUpperDist);
           }
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
        exitx = (x - 2) * densityVar * collideDis;
        exity = (y - 2) * densityVar * collideDis;
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
var bg = new PIXI.Graphics();
var verge = new PIXI.Graphics();
var exit = new PIXI.Graphics();
var obstacles = new Array();
var light = new PIXI.Graphics();
var mask = new PIXI.Graphics();
var bonus_scales = new Array();
var bonus_scale = new PIXI.Graphics();
var bonus_light = new PIXI.Graphics();

// Size the renderer to fill the screen
resize();
document.body.appendChild(renderer.view);
window.addEventListener("resize", resize);

function resize() {
  ratio = Math.min(window.innerWidth/windowx, window.innerHeight/windowy);
  stage.scale.x = stage.scale.y = ratio;
  renderer.resize(Math.ceil(windowx * ratio), Math.ceil(windowy * ratio));
}

function add_bonus_light(){
    bonus_light.beginFill(0x0000FF, 1);
    bonus_light.x = bonus_scalex = Math.random() * windowx * 0.4 + windowx * 0.3;
    bonus_light.y = bonus_scaley = Math.random() * windowy * 0.4 + windowy * 0.3;
    bonus_light.drawCircle(0, 0, 5);
    bonus_light.endFill();
    bonus_light.visible = true;
    container.addChild(bonus_light);
}

function add_bonus_scale(){
    bonus_scale = new PIXI.Graphics();
    bonus_scale.beginFill(0x00FF00, 1);
    bonus_scale.x = bonus_scalex = Math.random() * windowx * 0.6 + windowx * 0.2;
    bonus_scale.y = bonus_scaley = Math.random() * windowy * 0.6 + windowy * 0.2;
    bonus_scale.drawCircle(0, 0, 5);
    bonus_scale.endFill();
    bonus_scale.visible = true;
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
    light.drawCircle(0, 0, lightScale);
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
    verge.drawRect(0, 0, windowx, windowy);
    container.addChild(verge);
}

function add_bg(){
    bg.lineStyle(40, 0x5e3a08, 1);
    bg.beginFill(0xf8ffc9, 1);
    bg.drawRect(0, 0, windowx, windowy);
    bg.endFill();
    container.addChild(bg);
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
add_bg();

add_bonus_scale();
bonus_scales.push(bonus_scale);
add_bonus_scale();
bonus_scales.push(bonus_scale);
add_bonus_scale();
bonus_scales.push(bonus_scale);
container.addChild(bonus_scales[0]);
container.addChild(bonus_scales[1]);
container.addChild(bonus_scales[2]);

add_obstacles();
add_verge();
add_bonus_light();
add_hero();
add_exit();
stage.addChild(container);

add_light();
container.mask = light;

stage.interactive = true;
stage.on('mousedown', onDown);
stage.on('touchstart', onDown);

function onDown (e) {
    if (running && !dead){
        moveTox = e.data.getLocalPosition(stage).x;
        moveToy = e.data.getLocalPosition(stage).y;
        var ratio = (moveToy - hero.y) / (moveTox - hero.x);
        var buffvx = Math.sqrt(1 / (1 + ratio * ratio));
        var buffvy = Math.sqrt(1 - buffvx * buffvx);
        // if (moveToy - hero.y > 0) vy = buffvy;
        // else vy = -buffvy;
        // if (moveTox - hero.x > 0) vx = buffvx;
        // else vx = -buffvx;
        if (moveToy - hero.y > 0) ay = buffvy;
        else ay = -buffvy;
        if (moveTox - hero.x > 0) ax = buffvx;
        else ax = -buffvx;
        ax = ax/4;
        ay = ay/4;
        vx = 0;
        vy = 0;
    } else if (!dead){
        var xpos = e.data.getLocalPosition(stage).x;
        var ypos = e.data.getLocalPosition(stage).y;
        if (windowx / xpos < 3 && windowx / xpos > 1.5 && windowy / ypos < 2 && windowy / ypos > 1.5){
            
            bonus_scales[0].clear();
            bonus_scales[1].clear();
            bonus_scales[2].clear();
            add_bonus_scale();
            bonus_scales[0] = bonus_scale;
            add_bonus_scale();
            bonus_scales[1] = bonus_scale;
            add_bonus_scale();
            bonus_scales[2] = bonus_scale;
            container.addChild(bonus_scales[0]);
            container.addChild(bonus_scales[1]);
            container.addChild(bonus_scales[2]);

            bonus_light.clear();
            bonus_light.beginFill(0x0000FF, 1);
            bonus_light.x = bonus_scalex = Math.random() * windowx * 0.4 + windowx * 0.3;
            bonus_light.y = bonus_scaley = Math.random() * windowy * 0.4 + windowy * 0.3;
            bonus_light.drawCircle(0, 0, 5);
            bonus_light.endFill();
            bonus_light.visible = true;


            running = true;
            currentScore = 999;
            if (lightScale > 100){
                lightScale = 100 * (2 - Math.pow (0.5, (lightScale - 100)/20)) * 0.8;
            } else {
                lightScale = 100;
            }
            changeLight(lightScale);
            generate();

            for (var i = 0; i < obstacles.length; i++){
                obstacles[i].x = ox[i];
                obstacles[i].y = oy[i];
            }
            exit.clear();
            exit.lineStyle(40, 0x00ff00, 1);
            if (!exitx|| exitx == windowx){  //left or right
                exit.moveTo(exitx,exity-20);
                exit.lineTo(exitx,exity+20);
            } else {  // up or bottom
                exit.moveTo(exitx-20, exity);
                exit.lineTo(exitx+20,exity);
            }

            output.visible = false;
            hero.x = windowx/2;
            hero.y = windowy/2;
            vy = vx = 0;
            ay = ax = 0;
            animate();

        }


    } else if (dead){
        var xpos = e.data.getLocalPosition(stage).x;
        var ypos = e.data.getLocalPosition(stage).y;
        if (windowx / xpos < 3 && windowx / xpos > 1.5 && windowy / ypos < 2 && windowy / ypos > 1.5){


            bonus_scales[0].clear();
            bonus_scales[1].clear();
            bonus_scales[2].clear();
            add_bonus_scale();
            bonus_scales[0] = bonus_scale;
            add_bonus_scale();
            bonus_scales[1] = bonus_scale;
            add_bonus_scale();
            bonus_scales[2] = bonus_scale;
            container.addChild(bonus_scales[0]);
            container.addChild(bonus_scales[1]);
            container.addChild(bonus_scales[2]);


            bonus_light.clear();
            bonus_light.beginFill(0x0000FF, 1);
            bonus_light.x = bonus_scalex = Math.random() * windowx * 0.4 + windowx * 0.3;
            bonus_light.y = bonus_scaley = Math.random() * windowy * 0.4 + windowy * 0.3;
            bonus_light.drawCircle(0, 0, 5);
            bonus_light.endFill();
            bonus_light.visible = true;


            running = true;
            dead = false;
            currentScore = 999;
            lightScale = 100;
            changeLight(lightScale);
            generate();

            for (var i = 0; i < obstacles.length; i++){
                obstacles[i].x = ox[i];
                obstacles[i].y = oy[i];
            }
            exit.clear();
            exit.lineStyle(40, 0x00ff00, 1);
            if (!exitx|| exitx == windowx){  //left or right
                exit.moveTo(exitx,exity-20);
                exit.lineTo(exitx,exity+20);
            } else {  // up or bottom
                exit.moveTo(exitx-20, exity);
                exit.lineTo(exitx+20,exity);
            }

            output.visible = false;
            hero.x = windowx/2;
            hero.y = windowy/2;
            vy = vx = 0;
            ay = ax = 0;
            animate();
        }
    }
    
}

var score = new PIXI.Text('',{
        font : 'bold italic 36px Arial',
        fill : '#FFFFFF',
        stroke : '#4a1850',
        strokeThickness : 5,
        dropShadow : true,
        dropShadowColor : '#000000',
        dropShadowAngle : Math.PI / 6,
        dropShadowDistance : 6,
        wordWrap : true,
        wordWrapWidth : 440
    });
score.x = 10;
score.y = 10;
stage.addChild(score);


var output = new PIXI.Text('Game Over\n    Retry!',{
        font : 'bold italic 36px Arial',
        fill : '#FFFFFF',
        stroke : '#4a1850',
        strokeThickness : 5,
        dropShadow : true,
        dropShadowColor : '#000000',
        dropShadowAngle : Math.PI / 6,
        dropShadowDistance : 6,
        wordWrap : true,
        wordWrapWidth : 440
    });
output.x = windowx/2 - 90;
output.y = windowy/2 - 50;
output.visible = false;
stage.addChild(output);

// ************** start animation **************


animate();


function animate() {
    currentScore--;
    score.text = '' + (currentScore);

    if (!currentScore){
        gameover();
        return;
    }

    for (var i = 0; i < obstacles.length; i++){
        obstacles[i].x += - Math.random() + Math.random();
        obstacles[i].y += - Math.random() + Math.random();
    }

    vx += ax;
    vy += ay;

    light.y = hero.y += vy;
    light.x = hero.x += vx;

    checkCollide();
    
}

function distance(bx, by){
    return Math.sqrt( (by - hero.y) * (by - hero.y) + (bx - hero.x) * (bx - hero.x) );
}

function changeLight(l){
    light.clear()
    light.lineStyle(0);
    light.beginFill(0xFFFFFF, 0.5);
    light.blendMode = PIXI.BLEND_MODES.ADD;
    light.x = hero.x;
    light.y = hero.y;
    light.drawCircle(0, 0, l);
    light.endFill();
}


function timeoutChange(){
    changeLight(lightScale);
}

function checkCollide(){
    if (((!exitx || exitx == windowx) && Math.abs(hero.x-exitx) < 20 && Math.abs(hero.y-exity) < 20) || ((!exity || exity == windowy) && Math.abs(hero.y-exity) < 20 && Math.abs(hero.x-exitx) < 20)){
        sumScore += currentScore;
        output.text = 'You win !!!\nNext: Level '+(16- densityVar)*2 +'\nScore: ' + sumScore;
        if (densityVar > 2) {
            densityVar = densityVar/2;
        }
        output.visible = true;
        changeLight(1500);
        renderer.render(stage);
        running = false;
        document.getElementById("scoreModalButton").click();
        return;
    }

    if (distance(bonus_light.x, bonus_light.y) < collideDis && bonus_light.visible){
        changeLight(1500);
        var timeoutID = window.setTimeout(timeoutChange, 500);
        bonus_light.visible = false;
    }


    for (var i = 0; i < 3; ++i){
        if (distance(bonus_scales[i].x, bonus_scales[i].y) < collideDis && bonus_scales[i].visible){
            lightScale += 20;
            changeLight(lightScale);
            bonus_scales[i].visible = false;
        }
    }
    

    for (var i = 0; i < obstacles.length; i++){
        if (distance(obstacles[i].x, obstacles[i].y) < collideDis){
            lightScale -= 20;
            changeLight(lightScale);
            obstacles[i].x += - Math.random()*20 + Math.random()*20;
            obstacles[i].y += - Math.random()*20 + Math.random()*20;
            if (lightScale < 20){
                gameover();
                return;
            }
            break;
        }
        if (hero.x < 15 || hero.x > windowx - 15 || hero.y < 15 || hero.y > windowy - 15){
            gameover();
            return;
        }
    }
    renderer.render(stage);
    requestAnimationFrame(animate);
}


function gameover(){
    sumScore = Math.floor(sumScore * 0.7);
    output.text = 'Game Over\n    Retry!\nScore: ' + sumScore;
    output.visible = true;
    renderer.render(stage);
    running = false;
    dead = true;
    document.getElementById("scoreModalButton").click();
}
