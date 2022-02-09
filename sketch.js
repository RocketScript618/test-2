var back, backImg;

var bike1,bike1_img, bike;

var glider1, glider2, gliderImg;

var play1,play_img,play_press;

var question,quest_img,quest_press;

var exit,exit_img,exit_press;

var menu,menu_img,menu_text;

var arrow_img,arrow1,arrow2,arrow3;

var score,highscore, time, velocities, goText;

var speedUp, gOver, lightMove, music;

var gameState = "stand-by";

var trails, obstacle;

function preload() {

  menu_img = loadImage("menu.png");

  exit_img = loadImage("close.png");
  exit_press = loadImage("press8.png");

  play_img = loadImage("play.png");
  play_press = loadImage("press7.png");

  quest_img = loadImage("tips.png");
  quest_press = loadImage("press6.png");

  bike1_img = loadImage("bike1.png");

  gliderImg = loadImage("glider.png");

  backImg = loadImage("grid1.png");

  arrow_img = loadImage("arrow.png");

}

function setup() {
  createCanvas(windowWidth,windowHeight);

  music = createAudio('music.mp3');
  speedUp = createAudio('speedUp.mp3');
  lightMove = createAudio('lightMove.mp3');
  gOver = createAudio('gOver.mp3');

  trails = createGroup();
  obstacle = createGroup();
  bike = createGroup();

  score = 0;
  highscore = 0;

  menu_text = false;

  goText = false;

  velocities = 5;

  time = height/velocities;

  back = createSprite(width/2,height/3);
  back.addImage(backImg);
  back.scale=2.5;

  bike1 = createSprite(width/2,height/2+200);
  bike1.addImage(bike1_img);
  bike1.setCollider("rectangle",0,0,30,65);
  bike.add(bike1);
  bike1.scale = 1.5;

  glider1 = createSprite(bike1.x-175,height-150);
  glider1.addImage(gliderImg);
  glider1.scale= 2.5;
  glider1.setCollider("rectangle",0,0,140,45);

  glider2 = createSprite(bike1.x+175,height-150);
  glider2.addImage(gliderImg);
  glider2.setCollider("rectangle",0,0,140,45);
  glider2.scale= 2.5;

  question = createSprite(width-50,height-50);
  question.addImage("res1",quest_img);
  question.addImage("pre1",quest_press);
  question.scale = 3;
  question.setCollider("rectangle", 0,0, 20,20)

  menu = createSprite(width/2,height/2);
  menu.addImage(menu_img);
  menu.scale = 20
  menu.visible = false;

  exit = createSprite(menu.x-450,menu.y-285);
  exit.addImage("res2",exit_img);
  exit.addImage("pre2",exit_press);
  exit.scale = 5;
  exit.setCollider("rectangle", 0,0, 20,20)
  exit.visible = false;

  play1 = createSprite(width/2,height/2);
  play1.addImage("res3",play_img);
  play1.addImage("pre3",play_press);
  play1.setCollider("rectangle", 0,.5, 28,18)
  play1.scale = 7;

  arrow1 = createSprite(question.x-45,question.y-45);
  arrow1.addImage("arrow",arrow_img);
  arrow1.scale = 3;
  arrow1.rotation=135;
}


function draw() {
  background("grey");
  edges = createEdgeSprites();

  obstacle.setDepthEach(glider1.depth-2);

  if(back.y>=height-60){
    back.y = height/2;
  }

  if(score>=highscore){
    highscore = score;
  }

  if(gameState == "play"){

    music.volume(0.1);
    music.loop = true;

    lightMove.volume(0.2);
    lightMove.loop = true;

    play1.visible = false;
    arrow1.visible = false;

    back.velocityY = velocities*2;

    if(back.y>=height-60){
      back.y = height/2;
    }

    if(bike.isTouching(obstacle)){
      score = score -10;
    }

    if(score < 0 || bike1.isTouching(glider1) || bike1.isTouching(glider2)){
      music.pause();

      lightMove.pause();

      score = 0;
      goText = true;
      gOver.volume(0.3);
      gOver.play();
      gameState = "stand-by";
    }

    if(keyDown("w")){
      bike.setVelocityYEach(-velocities-3);
      bike.setVelocityXEach(0);
      bike.setRotationEach(0);
    }

    if(keyDown("s")){
      bike.setVelocityYEach(velocities+3);
      bike.setVelocityXEach(0)
      bike.setRotationEach(180);
    }

    if(keyDown("a")||touches.x<width/2){
      bike.setVelocityXEach(-velocities-3);
      bike.setVelocityYEach(0);
      bike.setRotationEach(270);
    }

    if(keyDown("d")){
      bike.setVelocityXEach(velocities+3);
      bike.setVelocityYEach(0);
      bike.setRotationEach(90);
    }

    if(frameCount % 45 == 0){
      obstacles();
    }

    if(frameCount % 450 == 0){
      velocities = velocities+2;
      speedUp.volume(0.3);
      speedUp.play();
    }

    obstacle.setVelocityYEach(velocities);
    obstacle.setColorEach("orange");
  }

  if(gameState == "stand-by"){
    play1.visible = true;
    arrow1.visible = true;

    back.velocityY = 0;

    bike.setVelocityXEach(0);
    bike.setVelocityYEach(0);

    obstacle.setVelocityYEach(0);
    obstacle.setLifetimeEach(-1);
    
    trails.setLifetimeEach(-1);

    if(mousePressedOver(play1)&&menu_text==false){
      goText = false;
  
      reset();
      gameState = "play";
    }
  
    if(touches.length>0&&menu_text==false){
      touches = [];
      goText = false;
  
      reset();
      gameState = "play";
    }
  
    if(mousePressedOver(question)){
      question.changeImage("pre1");
      play1.visible = false;
      menu.depth = play1.depth +1;
      exit.depth = menu.depth+1;
      menu.visible = true;
      exit.visible = true;
      menu_text = true;
    } else{
      question.changeImage("res1");
    }
  
    if(mousePressedOver(exit)){
      play1.visible = true;
      menu.visible = false;
      exit.visible = false;
      menu_text = false;
    }  
  }

  follow();

  glider1.x = bike1.x-175;
  glider2.x = bike1.x+175;

  bike.collide(edges);
  bike.collide(obstacle);

  drawSprites();

  fill("white");
  textSize(27);
  text("Puntuación: " + score, width-200, 40);
  text("Mejor Puntuación: " + highscore, width-275, 80);

  if(gameState!="play"){
    text("Para controles y tips, haz click aquí", arrow1.x-350,arrow1.y-35);
  }

  if(menu_text==true){
    fill("black");
    textSize(27);
    text("El objetivo es sobrevivir el mayor tiempo posible,",menu.x-300,menu.y-200);
    text("evita chocar con los obstáculos y con los planeadores que te siguen.",menu.x-425,menu.y-146);

    fill("red");
    text("Cada vez que choques con un obstáculo, perderás 10 puntos, si tu puntuación",menu.x-475,menu.y-92);
    text(" llega a cero o chocas con los planeadores que te siguen, seras capturado y",menu.x-450,menu.y-38);
    text(" habrás perdido.",menu.x-100, menu.y+16)

    fill("cyan");
    text("Usa W, A, S y D para moverte en computadora o toca la parte superior, izquierda,",menu.x-485,menu.y+70);
    text("derecha e inferior en dispositivos móbiles.",menu.x-255,menu.y+124);

    fill("orange");
    text("Cada vez que oigas tocar una trompeta, sabrás que la velocidad de los obstáculos",menu.x-495,menu.y+168);
    text(" y tu moto de luz habrá aumentado",menu.x-200,menu.y+222);


  }

  if(goText == true){
    stroke("red");
    strokeWeight(3);
    fill("red");
    textSize(54);
    text("¡Has sido capturado! Intenta de nuevo", width/4,height/3)
  }
}

function follow(){
  trail1 = createSprite(bike1.x,bike1.y,20,20)
  trail1.shapeColor = "cyan";
  trail1.lifetime = 200;

  trail2 = createSprite(glider1.x,glider1.y+45,20,20)
  trail2.shapeColor = "red";
  trail2.velocityY =5;
  trail2.lifetime = 100;

  trail3 = createSprite(glider2.x,glider2.y+45,20,20)
  trail3.shapeColor = "red";
  trail3.velocityY =5;
  trail3.lifetime = 100;
  
  trail1.depth = bike1.depth-1;
  trail2.depth = bike1.depth-1;
  trail3.depth = bike1.depth-1;

  trails.add(trail1);
  trails.add(trail2);
  trails.add(trail3);

}

function obstacles(){
  score = score+1;
  var ran = Math.round(random(1,7));
  switch(ran){
    case 1:
      one = createSprite(Math.round(random(0,width)),0,200,20);
      two = createSprite(one.x-110,one.y+90,20,200);
      three = createSprite(one.x+110,one.y+90,20,200);

      one.lifetime = time;
      two.lifetime = time;
      three.lifetime = time;
        
      obstacle.add(one);
      obstacle.add(two);
      obstacle.add(three);
      break;

    case 2:
      one = createSprite(Math.round(random(0,width)),0,200,20);
      two = createSprite(one.x-110,one.y-90,20,200);
      three = createSprite(one.x+110,one.y+90,20,200);

      one.lifetime = time;
      two.lifetime = time;
      three.lifetime = time;

      obstacle.add(one);
      obstacle.add(two);
      obstacle.add(three);
      break;

    case 3:
      one = createSprite(Math.round(random(0,width)),0,200,20);
      two = createSprite(one.x-110,one.y+90,20,200);
      three = createSprite(one.x+110,one.y-90,20,200);

      one.lifetime = time;
      two.lifetime = time;
      three.lifetime = time;

      obstacle.add(one);
      obstacle.add(two);
      obstacle.add(three);
      break;

    case 4:
      one = createSprite(Math.round(random(0,width)),0,200,20);
      two = createSprite(one.x-110,one.y+90,20,200);
      three = createSprite(one.x+110,one.y-90,20,200);
      four = createSprite(one.x-110,one.y+200,200,20);
      five = createSprite(one.x+110,one.y-200,200,20);

      one.lifetime = time;
      two.lifetime = time;
      three.lifetime = time;
      four.lifetime = time;
      five.lifetime = time;

      obstacle.add(one);
      obstacle.add(two);
      obstacle.add(three);
      obstacle.add(four);
      obstacle.add(five);
      break;

    case 5:
      one = createSprite(Math.round(random(0,width)),0,200,20);
      two = createSprite(one.x+110,one.y+90,20,200);
      three = createSprite(one.x-110,one.y-90,20,200);
      four = createSprite(one.x-110,one.y-200,200,20);
      five = createSprite(one.x+110,one.y+200,200,20);

      one.lifetime = time;
      two.lifetime = time;
      three.lifetime = time;
      four.lifetime = time;
      five.lifetime = time;

      obstacle.add(one);
      obstacle.add(two);
      obstacle.add(three);
      obstacle.add(four);
      obstacle.add(five);
      break;

    case 6:
      one = createSprite(Math.round(random(0,width)),0,200,20);
      two = createSprite(one.x+110,one.y+90,200,20);
      three = createSprite(one.x-110,one.y-90,200,20);
      four = createSprite(one.x-110,one.y-200,20,200);
      five = createSprite(one.x+110,one.y+200,20,200);

      one.lifetime = time;
      two.lifetime = time;
      three.lifetime = time;
      four.lifetime = time;
      five.lifetime = time;

      obstacle.add(one);
      obstacle.add(two);
      obstacle.add(three);
      obstacle.add(four);
      obstacle.add(five);
      break;

    case 7:
      one = createSprite(Math.round(random(0,width)),0,200,20);
      two = createSprite(one.x+110,one.y-90,200,20);
      three = createSprite(one.x-110,one.y+90,200,20);
      four = createSprite(one.x-110,one.y+200,20,200);
      five = createSprite(one.x+110,one.y-200,20,200);

      one.lifetime = time;
      two.lifetime = time;
      three.lifetime = time;
      four.lifetime = time;
      five.lifetime = time;

      obstacle.add(one);
      obstacle.add(two);
      obstacle.add(three);
      obstacle.add(four);
      obstacle.add(five);
      break;
      
      default:
        break;
  }
}

function reset(){

  velocities = 5;

  bike.setRotationEach(0);

  obstacle.destroyEach();
  trails.destroyEach();

  bike1.x = width/2;
  bike1.y = height/2+200;

  music.currentTime = 0;
  music.play();

  lightMove.currentTime = 0;
  lightMove.play();
}