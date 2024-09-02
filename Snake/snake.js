var c   = document.querySelector('canvas');
var ctx = c.getContext('2d');

var width  = c.width  = window.innerWidth;
var height = c.height = window.innerHeight;

var subdivision = 10;
var margin = 2;

var cellSize = height / subdivision;

clearBoard();

// Direction is clockwise starting at 0 (up), 1 (right), 2 (down), 3 (left)
var player = {
    x: 4,
    y: 4,
    dir: 1,
    len: 3
};

// End of trail
var tail = {
    x: 2,
    y: 4
};

var snakeCells = [];

drawCell(player.x, player.y, "#51E415");
drawCell(tail.x, tail.y, "#51E415");

var update = setInterval(() => {

}, 100);

function drawCell(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(margin + x * cellSize, margin + y * cellSize, 
                 cellSize - margin / 2, cellSize - margin / 2);
}

function clearBoard() {
    for (let i = 0; i < subdivision; i++) {
        for (let j = 0; j < subdivision; j++) {
            drawCell(i, j, "#1E1E1E")
        }
    }
}

function addSnakeCell(x, y, maxLife) {
    if (x == null) {
        snakeCells.push({
            x: tail.x,
            y: tail.y,
            age: 0,
            maxLife: player.len
        });
    } else {
        snakeCells.push({
            x: x,
            y: y,
            age: 0,
            maxLife: maxLife
        });
    }
}

/*ctx.arc(width / 2, height / 4, 5, 0, 2 * Math.PI);
ctx.fillStyle = "green";
ctx.fill(); */

// green #51E415
// darkcell #1E1E1E