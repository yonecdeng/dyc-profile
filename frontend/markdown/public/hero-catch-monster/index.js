// Create the canvas
// canvas元素作为我们绘制的画布，我们可以在上面作画了。
var canvas = document.createElement("canvas");
// 获取画布的上线下文对象，可以使用上面挂载的api
var ctx = canvas.getContext("2d");
// 设置画布宽度
canvas.width = 512;
//设置画布高度
canvas.height = 480;
// 将画布添加到body元素后面，这样画布就会出现在页面中
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
  bgReady = true;
};
bgImage.src = "./assets/background.png";
// hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
  heroReady = true;
};
heroImage.src = "./assets/hero.png";
// monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
  monsterReady = true;
};
monsterImage.src = "./assets/monster.png";

// Game objects
var hero = {
  speed: 256, // movement in pixels per second
  x: 0,
  y: 0,
};
var monster = {
  x: 0,
  y: 0,
};
var monstersCaught = 0;

// 存储用户按了什么键，这样的好处是，如果用户同时按了多个键，我们就可以同时移动英雄，而不是一个接一个地移动。且保证了每次绘制只消费某个键一次，这样能保证每次绘制看起来英雄的移动速度是一致的，因为如果某次绘制消费这个键两次就会导致英雄移动的距离是两倍，那看起来速度就是原来的两倍。
var keysDown = {};

addEventListener(
  "keydown",
  function (e) {
    keysDown[e.keyCode] = true;
  },
  false
);

addEventListener(
  "keyup",
  function (e) {
    delete keysDown[e.keyCode];
  },
  false
);

// Reset the game when the player catches a monster
var reset = function (heroX, heroY) {
  hero.x = heroX;
  hero.y = heroY;

  // Throw the monster somewhere on the screen randomly
  monster.x = 32 + Math.random() * (canvas.width - 64);
  monster.y = 32 + Math.random() * (canvas.height - 64);
};

// Update game objects
var update = function (modifier) {
  // 如果恰好经过了一秒，则modifier将为1，并且英雄的速度将乘以1，这意味着他将在该秒内移动256个像素。使用此模式将确保英雄无论脚本运行多快（或多慢！）英雄都将以相同的速度移动。
  if (38 in keysDown) {
    // Player holding up
    hero.y -= hero.speed * modifier;
  }
  if (40 in keysDown) {
    // Player holding down
    hero.y += hero.speed * modifier;
  }
  if (37 in keysDown) {
    // Player holding left
    hero.x -= hero.speed * modifier;
  }
  if (39 in keysDown) {
    // Player holding right
    hero.x += hero.speed * modifier;
  }

  // Are they touching? 判断超人是否碰到了怪兽
  if (
    hero.x <= monster.x + 32 &&
    monster.x <= hero.x + 32 &&
    hero.y <= monster.y + 32 &&
    monster.y <= hero.y + 32
  ) {
    ++monstersCaught;
    reset(hero.x, hero.y);
  }
};

// Draw everything
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }

  if (heroReady) {
    ctx.drawImage(heroImage, hero.x, hero.y);
  }

  if (monsterReady) {
    ctx.drawImage(monsterImage, monster.x, monster.y);
  }

  // Score
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Monsterrs caught: " + monstersCaught, 32, 32);
};

// The main game loop
var main = function () {
  var now = Date.now(); // ms
  var delta = now - then;

  update(delta / 1000); // delta / 1000 换算成秒级
  render();

  then = now;

  // Request to do this again ASAP
  requestAnimationFrame(main);
};
// Let's play this game!
var then = Date.now();
reset(canvas.width / 2, canvas.height / 2);
main();
