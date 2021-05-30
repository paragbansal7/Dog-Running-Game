var ground;
var dog, dogRunning, dogStanding;
var food, foodImage;
var obstacle, obstacleImage;
var foodGroup, obstacleGroup;
var score, highScore, lifeline;
var jumpSound, dieSound, foodSound;
var Play = 1;
var End = 0;
var gameState = Play;

function preload() {


  dogRunning = loadAnimation("2.jpg","3.jpg","4.jpg");
  dogStanding = loadAnimation("1.jpg");

  foodImage = loadImage("food.jpg");
  obstaceImage = loadImage("obstacle.png");

  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  foodSound = loadSound("food.mp3")

}

function setup() {
  createCanvas(windowWidth,windowHeight);

  dog = createSprite(110, height-40, 100, 100);
  dog.scale=0.4;

  dog.addAnimation("running", dogRunning);
  dog.addAnimation("collided", dogStanding);

  ground = createSprite(width/2, height-20, width, 10);

  foodGroup = createGroup();
  obstacleGroup = createGroup();

  score = 0;
  highScore = 0;
  lifeline = 3;
}


function draw() {
  background("white");

  dog.collide(ground);
  fill("black");
  textSize(15);
  text("Score:" + score, width-70, 20);
  text("High Score:" + highScore, width-105, 40);
  text("Lives Left:" + lifeline, 10, 20);

  if (score > highScore) {
    highScore = score;
  }

  if (gameState === Play) {

    dog.changeAnimation("running", dogRunning);

    if (keyDown("space") && dog.y >= width/2) {
      dog.velocityY = -18;
      jumpSound.play();
    }

    dog.velocityY = dog.velocityY + 0.65;

    spawnfood();
    spawnObstacles();

    if (dog.isTouching(foodGroup)) {
      foodSound.play();
      foodGroup.destroyEach();
      score = score + 1;
    }

    if (dog.isTouching(obstacleGroup)) {
      dieSound.play();
      lifeline = lifeline - 1;
      gameState = End;
      score = 0;
    }

    if (lifeline === 0) {
      highScore = 0;
    }

  } else if (gameState === End) {

    dog.changeAnimation("collided", dogStanding);

    foodGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);

    foodGroup.setLifetimeEach(-1);
    obstacleGroup.setLifetimeEach(-1);

    stroke("black");
    fill("red");
    textSize(25);
    text("GAME OVER!", width/2-80, height/2-30);

    textSize(18);
    text("Press 'R' to restart", width/2-80,height/2);

    if (keyDown("r")) {
      gameState = Play;
      obstacleGroup.destroyEach();
      foodGroup.destroyEach();
    }

    if (lifeline === 0 && keyDown("r")) {
      lifeline = 3;
    }
  }

  drawSprites();

}

function spawnfood() {

  var rand = Math.round(random(height/2+100,height/2-100));

  if (frameCount % 100 === 0) {
 
    food = createSprite(width+10, rand, 10, 10);
    food.addImage("abc", foodImage);
    food.scale = 0.3;
    food.velocityX = -(20 + score / 2);
    food.lifetime = width/-(10 + score/2);
    foodGroup.add(food);
    dog.depth = food.depth + 1;

  }
}

function spawnObstacles() {
  if (frameCount % 140 === 0) {
    obstacle = createSprite(width+10, height-57, 10, 10);
    obstacle.addImage("abc", obstaceImage);
    obstacle.scale = 0.2;
    
obstacle.setCollider("rectangle",-10,0,450 ,420);
    
    obstacle.velocityX = -(15 + score / 4);
    obstacle.lifetime = width/-(8+ score/4);
    obstacleGroup.add(obstacle);
    
  }
}
