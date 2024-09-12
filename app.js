const c = document.getElementById("myCanvas");
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext("2d");

let circle_x = 160;
let circle_y = 60;
let radius = 20;
let xSpeed = 20;
let ySpeed = 20;
let ground_x = 100;
let ground_y = 500;
let ground_z = 5;
let brickArray = [];
let count = 0;

let unit = 50;
// let row = canvasHeight / unit; // 計算列數
// let column = canvasWidth / unit; // 計算欄數

// min, max
function getRArbitary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visible = true;
  }

  drawBrick() {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  touchBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY >= this.y - radius &&
      ballY <= this.y + this.height + radius
    );
  }

  //選擇brick位置
  pickALocation() {
    let overLapping = false;
    let newX;
    let newY;

    function check(newX, newY) {
      for (let i = 0; i < brickArray.length; i++) {
        if (newX == brickArray[i].x && newY == brickArray[i].y) {
          // 完全重疊
          overLapping = true;
          return;
        }
        if (
          // 部分(unit內)重疊
          newX >= brickArray[i].x - unit &&
          newX <= brickArray[i].x + unit &&
          newY >= brickArray[i].y - unit &&
          newY <= brickArray[i].y + unit
        ) {
          overLapping = true;
          return;
        } else {
          overLapping = false;
        }
      }
    }

    do {
      //newX = Math.floor(Math.random() * column) * unit;
      //newY = Math.floor(Math.random() * row) * unit;
      newX = getRArbitary(0, 950);
      newY = getRArbitary(0, 450);
      check(newX, newY);
    } while (overLapping); //If true, the loop will start over again, otherwise it ends.
    this.x = newX;
    this.y = newY;
  }
}

//製作所有的方塊
for (let i = 0; i < 10; i++) {
  //new Brick(getRArbitary(0, 950), getRArbitary(0, 550));
  new Brick();
  brickArray.forEach((brick) => {
    brick.pickALocation();
  });
}

// 移動地板
c.addEventListener("mousemove", (e) => {
  ground_x = e.clientX;
  while (ground_x + 200 > canvasWidth) {
    ground_x = 800;
    return;
  }
});

function drawCircle() {
  //確認球是否打到磚塊
  brickArray.forEach((brick) => {
    if (brick.visible && brick.touchBall(circle_x, circle_y)) {
      count++;
      brick.visible = false;
      // 改變x, y方向速度，並將brick從brickArray中移除
      // 從下方撞擊 || 從上方撞擊
      if (circle_y >= brick.y + brick.height || circle_y <= brick.y) {
        ySpeed *= -1;
      }
      // 從右撞擊 || 從左撞擊
      if (circle_x >= brick.x + brick.width || circle_x <= brick.x) {
        xSpeed *= -1;
      }

      //brickArray.splice(index, 1); // O(n)
      // if (brickArray.length == 0) {
      //   alert("遊戲結束");
      //   clearInterval(game);
      // }
      if (count == 10) {
        alert("遊戲結束");
        clearInterval(game);
        location.reload();
      }
    }
  });
  // 確認是否打到地板
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + 200 + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    // 施加彈力
    if (ySpeed > 0) {
      circle_y -= 50;
    } else {
      circle_y += 50;
    }
    ySpeed *= -1;
  }

  // 確認球是否撞到牆壁
  // 確認右邊
  if (circle_x >= canvasWidth - radius) {
    xSpeed *= -1;
  }
  // 確認左邊
  if (circle_x <= radius) {
    xSpeed *= -1;
  }
  // 確認上面
  if (circle_y <= radius) {
    ySpeed *= -1;
  }
  // 確認下面
  if (circle_y >= canvasHeight - radius) {
    ySpeed *= -1;
  }
  // 更動圓的座標
  circle_x += xSpeed;
  circle_y += ySpeed;

  // 劃出背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  //劃出所有的方塊
  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  //劃出可控地板
  ctx.fillStyle = "orange";
  ctx.fillRect(ground_x, ground_y, 200, ground_z);

  // 劃出圓球
  // (圓心座標(x, y), radius, startAngle, endAngle)
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "yellow";
  ctx.fill();
}

let game = setInterval(drawCircle, 25);
