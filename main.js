var AM = new AssetManager();
var dataList = {yLeftBumper: 100, leftBumperSpeed: 3, yRightBumper: 100, rightBumperSpeed: 3, ball1X: 0, ball1Y: 0, ball1deltaX: 1, ball1deltaY: 1, ball2X: 0, ball2Y: 0, ball2deltaX: 1, ball2deltaY: 1, score1: 0, score2: 0 };

window.onload = function (gameEngine) {
    var socket = io.connect("http://24.16.255.56:8888");
    this.gameEngine = gameEngine;
  
    socket.on("load", function (data) {
        dataList.yLeftBumper = data.yLeftBumper;
        dataList.yRightBumper = data.yRightBumper;
        dataList.leftBumperSpeed = data.leftBumperSpeed;
        dataList.rightBumperSpeed = data.rightBumperSpeed;
        dataList.ball1X = data.ball1X;
        dataList.ball1Y = data.ball1Y;
        dataList.ball2X = data.ball2X;
        dataList.ball2Y = data.ball2Y;
        dataList.score1 = data.score1;
        dataList.score2 = data.score2;

        console.log(data.statename);
    });
  
    var text = document.getElementById("text");
    var saveButton = document.getElementById("save");
    var loadButton = document.getElementById("load");
  
    saveButton.onclick = function () {
      console.log("save");
      text.innerHTML = "Saved."
      socket.emit("save", { studentname: "Nicholas Caron", statename: "anything else", yLeftBumper: dataList.yLeftBumper
                   , leftBumperSpeed: dataList.leftBumperSpeed, yRightBumper: dataList.yRightBumper
                   , rightBumperSpeed: dataList.rightBumperSpeed, ball1X: dataList.ball1X, ball1Y: dataList.ball1Y
                   , ball2X: dataList.ball2X, ball2Y: dataList.ball2Y, score1: dataList.score1, score2: dataList.score2
                   , ball1deltaX: dataList.ball1deltaX, ball1deltaY: dataList.ball1deltaY, ball2deltaX : dataList.ball2deltaX, ball2deltaY: dataList.ball2deltaY});
    };
  
    loadButton.onclick = function () {
      console.log("load");
      text.innerHTML = "Loaded."
      this.score = "Left Score: " + dataList.score1 + " Right Score: " + dataList.score2;
      socket.emit("load", { studentname: "Nicholas Caron", statename: "anything else"});
    };
  
  };


function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spriteSheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
                return 1;
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}


//Background static image
function Background(game, spritesheet){
    this.animation = new Animation(spritesheet,2000,2000,2000, 4, 1, true, .75);
    this.speed = 0;
    this.ctx = game.ctx;
    Entity.call(this,game, -295 ,-50);
};

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.draw = function(){
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, 0.85);
    Entity.prototype.draw.call(this);
};

// UPDATE HERE TO CHANGE THE BACKGROUND
Background.prototype.update = function(){

};

function leftBumper(gameEngine, ctx){
    this.gameEngine = gameEngine;
    this.ball = this.gameEngine.entities[0];
    this.ctx = ctx;
    this.x = 30;
    this.y = dataList.yLeftBumper;
    this.speed = dataList.leftBumperSpeed;
    this.width = 20;
    this.height = 100;
    this.leftRect = {x:this.x, y: this.y, width: this.width, height: this.height}; 
    this.ball1 = this.gameEngine.entities[0];
    this.ball2 = this.gameEngine.entities[9];
};

leftBumper.prototype = new Entity();
leftBumper.prototype.constructor = leftBumper;

leftBumper.prototype.draw = function(){
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(this.x,this.y,this.width,this.height);
    //this.ctx.fillStyle = "red";
    //this.ctx.fillRect(this.leftRect.x,this.leftRect.y,this.leftRect.width,this.leftRect.height);
};

leftBumper.prototype.update = function(){
    this.ball2 = this.gameEngine.entities[9];
    if(this.y != dataList.yLeftBumper){
         this.ball1.x = dataList.ball1X;
         this.ball1.y = dataList.ball1Y;
         this.ball1.deltaX = dataList.ball1deltaX;
         this.ball1.deltaY = dataList.ball1deltaY;
         if(this.ball2 != null){
         this.ball2.x = dataList.ball2X;
         this.ball2.y = dataList.ball2Y;
         this.ball2.deltaX = dataList.ball2deltaX;
         this.ball2.deltaY = dataList.ball2deltaY;
         }
    }
    this.y = dataList.yLeftBumper;
    this.distance1 = Math.sqrt(Math.pow(this.gameEngine.entities[0].x - this.x, 2) + Math.pow(this.gameEngine.entities[0].y - this.y, 2));
    this.distance2 = Math.sqrt(Math.pow(this.gameEngine.entities[9].x - this.x,2) + Math.pow(this.gameEngine.entities[9].y - this.y,2));
    if(this.distance1 <= this.distance2){
        this.ball = this.gameEngine.entities[0];
    }
    else{
        this.ball = this.gameEngine.entities[9];
    }
    this.leftRect = {x:this.x, y: this.y, width: this.width, height: this.height}; 
    if(this.y > 595){
        this.y -= this.speed;
    }
    if(this.y < 5){
        this.y +=this.speed;
    }
    
    if(this.ball.y +10 > this.y + (this.height /2)){
        this.y +=this.speed;
    }
    else if(this.ball.y +10< this.y + (this.height/2)){
        this.y -= this.speed;
    }
    dataList.yLeftBumper = this.y;
    dataList.ball1X = this.ball1.x;
    dataList.ball1Y = this.ball1.y;
    dataList.ball1deltaX = this.ball1.deltaX;
    dataList.ball1deltaY = this.ball1.deltaY;
    if(this.ball2 != null){
        dataList.ball2X = this.ball2.x;
        dataList.ball2Y = this.ball2.y;
        dataList.ball2deltaX = this.ball2.deltaX;
        dataList.ball2deltaY = this.ball2.deltaY;
    }
};

function rightBumper(gameEngine, ctx){
    this.gameEngine = gameEngine;
    this.ball = this.gameEngine.entities[0]; 
    this.ctx = ctx;
    this.x = 950;
    this.y = 500;
    this.speed = 4;
    this.width = 20;
    this.height = 100; 
    this.rightRect = {x:this.x, y: this.y, width: this.width, height: this.height};
};

rightBumper.prototype = new Entity();
rightBumper.prototype.constructor = rightBumper;

rightBumper.prototype.draw = function(){
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(this.x,this.y,this.width,this.height);
    //this.ctx.fillStyle = "red";
    //this.ctx.fillRect(this.rightRect.x,this.rightRect.y,this.rightRect.width,this.rightRect.height);
};

rightBumper.prototype.update = function(){
    this.y = dataList.yRightBumper;
    this.distance1 = Math.sqrt(Math.pow(this.gameEngine.entities[0].x - this.x, 2) + Math.pow(this.gameEngine.entities[0].y - this.y, 2));
    this.distance2 = Math.sqrt(Math.pow(this.gameEngine.entities[9].x - this.x,2) + Math.pow(this.gameEngine.entities[9].y - this.y,2));
    if(this.distance1 <= this.distance2){
        this.ball = this.gameEngine.entities[0];
    }
    else{
        this.ball = this.gameEngine.entities[9];
    }
    this.rightRect = {x:this.x, y: this.y, width: this.width, height: this.height};
    if(this.y > 595){
        this.y -= this.speed;
    }
    if(this.y < 5){
        this.y +=this.speed;
    }
    
    if(this.ball.y +10 > this.y + (this.height /2)){
        this.y +=this.speed;
    }
    else if(this.ball.y +10< this.y + (this.height/2)){
        this.y -= this.speed;
    }
    dataList.yRightBumper = this.y;
};


function ball(gameEngine, ctx){
    this.gameEngine = gameEngine;
    this.leftBumper = null;
    this.rightBumper = null;
    this.ctx = ctx;
    this.x = 500;
    this.y = 400;
    this.deltaX = (Math.random() *4) -3; 
    this.deltaY = (Math.random() * 4) -3;
    this.width = 20;
    this.height = 20; 
    this.ballRect = {x:this.x - 20, y: this.y -20, width: this.width *2, height: this.height*2};
};

ball.prototype = new Entity();
ball.prototype.constructor = ball;

ball.prototype.draw = function(){
    this.ctx.fillStyle = "white";
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y,20,0,2* Math.PI);
    this.ctx.fill();

};

ball.prototype.update = function(){

    this.leftBumper = this.gameEngine.entities[1];
    this.rightBumper = this.gameEngine.entities[2];
    this.box1 = this.gameEngine.entities[5];
    this.box2 = this.gameEngine.entities[6];
    this.box3 = this.gameEngine.entities[7];
    this.box4 = this.gameEngine.entities[8];

    var rect2 =this.ballRect;
    var rect1 =this.leftBumper.leftRect;

    if(rect1.x < rect2.x + rect2.width 
        && rect1.x + rect1.width > rect2.x 
        && rect1.y < rect2.y + rect2.height 
        && rect1.height + rect1.y > rect2.y){

            // this is for the ball hitting from the top or bottom so it reverses its y direction
            if(this.x >= rect1.x && this.x <= rect1.x + rect1.width){
                this.deltaY = this.deltaY * -1;
                if(this.y <= rect1.y){
                    this.y -= 5;
                }
                else{
                    this.y += 5;
                }
            }

            //this is if the ball hits on the side so it reverses its x direction
            else if(this.y >= rect1.y && this.y <= rect1.y + rect1.height){
                this.deltaX = this.deltaX * -1;
                if(this.x <= rect1.x){
                    this.x -=5;
                }
                else{
                    this.x += 5;
                }
            }
        };
        
        

        var rect1 =this.rightBumper.rightRect;
        if(rect1.x < rect2.x + rect2.width 
            && rect1.x + rect1.width > rect2.x 
            && rect1.y < rect2.y + rect2.height 
            && rect1.height + rect1.y > rect2.y){
                if(this.x >= rect1.x && this.x <= rect1.x + rect1.width){
                    this.deltaY = this.deltaY * -1;
                    if(this.y <= rect1.y){
                        this.y -= 5;
                    }
                    else{
                        this.y += 5;
                    }
                }
                else if(this.y >= rect1.y && this.y <= rect1.y + rect1.height){
                    this.deltaX = this.deltaX * -1;
                    if(this.x <= rect1.x){
                        this.x -=5;
                    }
                    else{
                        this.x += 5;
                    }
                }
            }; 
    
        var rect1 =this.box1.boxRect;
        if(rect1.x < rect2.x + rect2.width 
            && rect1.x + rect1.width > rect2.x 
            && rect1.y < rect2.y + rect2.height 
            && rect1.height + rect1.y > rect2.y){
                if(this.x >= rect1.x && this.x <= rect1.x + rect1.width){
                    this.deltaY = this.deltaY * -1;
                    if(this.y <= rect1.y){
                        this.y -= 5;
                    }
                    else{
                        this.y += 5;
                    }
                }
                else if(this.y >= rect1.y && this.y <= rect1.y + rect1.height){
                    this.deltaX = this.deltaX * -1;
                    if(this.x <= rect1.x){
                        this.x -=5;
                    }
                    else{
                        this.x += 5;
                    }
                }
            }; 
    
            var rect1 =this.box2.boxRect;
            if(rect1.x < rect2.x + rect2.width 
                && rect1.x + rect1.width > rect2.x 
                && rect1.y < rect2.y + rect2.height 
                && rect1.height + rect1.y > rect2.y){
                    if(this.x >= rect1.x && this.x <= rect1.x + rect1.width){
                        this.deltaY = this.deltaY * -1;
                        if(this.y <= rect1.y){
                            this.y -= 5;
                        }
                        else{
                            this.y += 5;
                        }
                    }
                    else if(this.y >= rect1.y && this.y <= rect1.y + rect1.height){
                        this.deltaX = this.deltaX * -1;
                        if(this.x <= rect1.x){
                            this.x -=5;
                        }
                        else{
                            this.x += 5;
                        }
                    }
                }; 
    
                var rect1 =this.box3.boxRect;
                if(rect1.x < rect2.x + rect2.width 
                    && rect1.x + rect1.width > rect2.x 
                    && rect1.y < rect2.y + rect2.height 
                    && rect1.height + rect1.y > rect2.y){
                        if(this.x >= rect1.x && this.x <= rect1.x + rect1.width){
                            this.deltaY = this.deltaY * -1;
                            if(this.y <= rect1.y){
                                this.y -= 5;
                            }
                            else{
                                this.y += 5;
                            }
                        }
                        else if(this.y >= rect1.y && this.y <= rect1.y + rect1.height){
                            this.deltaX = this.deltaX * -1;
                            if(this.x <= rect1.x){
                                this.x -=5;
                            }
                            else{
                                this.x += 5;
                            }
                        }
                    }; 
                    var rect1 =this.box4.boxRect;
                    if(rect1.x < rect2.x + rect2.width 
                        && rect1.x + rect1.width > rect2.x 
                        && rect1.y < rect2.y + rect2.height 
                        && rect1.height + rect1.y > rect2.y){
                            if(this.x >= rect1.x && this.x <= rect1.x + rect1.width){
                                this.deltaY = this.deltaY * -1;
                                if(this.y <= rect1.y){
                                    this.y -= 5;
                                }
                                else{
                                    this.y += 5;
                                }
                            }
                            else if(this.y >= rect1.y && this.y <= rect1.y + rect1.height){
                                this.deltaX = this.deltaX * -1;
                                if(this.x <= rect1.x){
                                    this.x -=5;
                                }
                                else{
                                    this.x += 5;
                                }
                            }
                        }; 
    
    
    if(this.y >= 680 || this.y <= 20){
        this.deltaY = this.deltaY *-1;
    }
    if(this.x >= 980 || this.x <= 20){
        this.x = 500;
        this.y = 400;
        this.deltaX = (Math.random() *4) -3; 
        this.deltaY = (Math.random() *4) -3; 
    }
    if(this.deltaX > 0){
        this.deltaX += 0.005;
    }
    else{
        this.deltaX -= 0.005;
    }
    if(this.deltaY > 0){
        this.deltaY += 0.005;
    }
    else{
        this.deltaY -= 0.005;
    }
    this.x += this.deltaX;
    this.y += this.deltaY;
    this.ballRect = {x:this.x - 20, y: this.y -20, width: this.width *2, height: this.height*2};
};

function leftScore(gameEngine, ctx){
    this.gameEngine = gameEngine;
    this.ctx = ctx;
    this.score = 0;
};

leftScore.prototype = new Entity();
leftScore.prototype.constructor = leftScore;

leftScore.prototype.draw = function(){
    this.ctx.font = "20px Arial";
    this.ctx.fillText("Score: " + this.score, 100, 30);
};

leftScore.prototype.update = function(){
    this.score = dataList.score1;
    if(this.gameEngine.entities[0].x >= 980){
        this.score ++;
    }
    if(this.gameEngine.entities[9].x >= 980){
        this.score ++;
    }
    dataList.score1 = this.score;
};


function rightScore(gameEngine, ctx){
    this.gameEngine = gameEngine;
    this.ctx = ctx;
    this.score = 0;
};

rightScore.prototype = new Entity();
rightScore.prototype.constructor = rightScore;

rightScore.prototype.draw = function(){
    this.ctx.font = "20px Arial";
    this.ctx.fillText("Score: " + this.score, 800, 30);
};

rightScore.prototype.update = function(){
    this.score = dataList.score2;
    if(this.gameEngine.entities[0].x <= 20){
        this.score ++;
    }
    if(this.gameEngine.entities[9].x <= 20){
        this.score ++;
    }
    dataList.score2 = this.score;
};

function box(gameEngine, ctx, x, y){
    this.gameEngine = gameEngine;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 80; 
    this.boxRect = {x:this.x, y: this.y, width:this.width, height:this.height};
};

box.prototype = new Entity();
box.prototype.constructor = box;

box.prototype.draw = function(){
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(this.x,this.y,this.width,this.height);

};

box.prototype.update = function(){
    

};


AM.queueDownload("./img/BellmontMove.png");





AM.downloadAll(function(){
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");
    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    gameEngine.addEntity(new ball(gameEngine, ctx));
    gameEngine.addEntity(new leftBumper(gameEngine, ctx));
    gameEngine.addEntity(new rightBumper(gameEngine, ctx));
    gameEngine.addEntity(new leftScore(gameEngine, ctx));
    gameEngine.addEntity(new rightScore(gameEngine, ctx));
    gameEngine.addEntity(new box(gameEngine, ctx, 300,175));
    gameEngine.addEntity(new box(gameEngine, ctx, 300,445));
    gameEngine.addEntity(new box(gameEngine, ctx, 620,175));
    gameEngine.addEntity(new box(gameEngine, ctx, 620,445));
    gameEngine.addEntity(new ball(gameEngine, ctx));




    console.log("Thats it folks!");
});

