var c = document.querySelector('canvas');
var ctx = c.getContext('2d');

var width = c.width = window.innerWidth;
var height = c.height = window.innerHeight;

var cellSize = 20;
var rows = width / cellSize,
    columns = height / cellSize;
var grid = [];

for (let i = 0; i < rows; i++) {
  let arr = [];
    for (let j = 0; j < columns; j++) {
      arr.push(0);
    }
  grid.push(arr);
}

class Trail {
  constructor (x, y, maxLife) {
    this.x = x;
    this.y = y;

    this.lifeTime = 0;
    this.maxLife = maxLife;

    this.update = () => {
      this.lifeTime++;

      if (this.lifeTime >= this.maxLife) {
        grid[this.x][this.y] = 0;
      }
    }
  }
}

class Food {
  constructor (x, y) {
    this.x = x;
    this.y = y;

    this.food = true;

    grid[x][y] = this;

    this.remove = () => {
      grid[this.x][this.y] = 0;

      let pos = replace();

      new Food(pos[0], pos[1]);
    }
  }
}

// Please make a keystroke queue so they can be done rapidly and it won't go backward when it isn't supposed to.

class Player {
  constructor (x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;

    this.direction = -1;

    this.length = 5;
  
    this.draw = () => { 
      ctx.fillStyle = '#51E415';
      ctx.beginPath();
      ctx.fillRect(1 + this.x * cellSize, 1 + this.y * cellSize, cellSize, cellSize);
    }

    this.move = (horizontal, vertical) => {
      this.x += horizontal * this.speed;
      this.y += vertical   * this.speed;

      if (this.x >= rows) {
        this.x = rows - 1;
      }

      if (this.x < 0) {
        this.x = 0;
      }

      if (this.y >= columns) {
        this.y = columns - 1;
      }

      if (this.y < 0) {
        this.y = 0;
      }
    }
  }
}

var p = new Player(7,7,1);

function replace() {
  let tempX = Math.floor(Math.random() * rows);
  let tempY = Math.floor(Math.random() * columns);

  if ((tempX == p.x && tempY == p.y) || (grid[tempX][tempY])) {
    return replace();
  } else {
    return [tempX, tempY];
  }
}

// var keystrokes = [];

document.addEventListener('keydown', (e) => {
  // Up
  if ((e.keyCode == '38' || e.keyCode == '87') && p.direction != 1) {
    p.direction = 0;
  }
  // Down
  if ((e.keyCode == '40' || e.keyCode == '83') && p.direction != 0) {
    p.direction = 1;
  }
  // Right
  if ((e.keyCode == '39' || e.keyCode == '68') && p.direction != 3) {
    p.direction = 2;
  }
  // Left
  if ((e.keyCode == '37' || e.keyCode == '65') && p.direction != 2) {
    p.direction = 3;
  }

  // keystrokes.push(e.keyCode);
});

function draw() {
  // If there is key events, do those. If moving, move continuosly. Walls?
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,width,height);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (grid[i][j]) {
        if (grid[i][j].food) {
          ctx.fillStyle = 'red';
          ctx.fillRect(grid[i][j].x * cellSize, grid[i][j].y * cellSize, cellSize,  cellSize);
        } else {
          grid[i][j].update();

          ctx.fillStyle = '#51E415';
          ctx.fillRect(2 + grid[i][j].x * cellSize, 2 + grid[i][j].y * cellSize, cellSize - 1, cellSize - 1);
        }
      } else {
        ctx.fillStyle = "#1E1E1E";
        ctx.fillRect(2 + i * cellSize, 2 + j * cellSize, cellSize - 1, cellSize - 1);
      }
    }
  }

  // Up
  if (p.direction === 0) {
    p.move(0,-1);
  }

  // Down
  if (p.direction === 1) {
    p.move(0,1);
  }

  // Right
  if (p.direction === 2) {
    p.move(1,0);
  }

  // Left
  if (p.direction === 3) {
    p.move(-1,0);
  }

  if (grid[p.x][p.y]) {
    if (grid[p.x][p.y].food) {
      grid[p.x][p.y].remove();

      p.length++;
    } else {
      if (p.direction != -1) {
        console.log('die');
      }
    }
  }

  grid[p.x][p.y] = new Trail(p.x, p.y, p.length);

  p.draw();
}

let x = setInterval(draw, 150);

new Food(Math.floor(Math.random() * rows), Math.floor(Math.random() * columns));
new Food(Math.floor(Math.random() * rows), Math.floor(Math.random() * columns));
new Food(Math.floor(Math.random() * rows), Math.floor(Math.random() * columns));
new Food(Math.floor(Math.random() * rows), Math.floor(Math.random() * columns));
new Food(Math.floor(Math.random() * rows), Math.floor(Math.random() * columns));