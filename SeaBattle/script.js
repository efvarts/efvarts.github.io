var c = document.querySelector('canvas');
var ctx = c.getContext("2d");

var width = c.width = window.innerWidth;
var height = c.height = window.innerHeight;

// Top left corner of game area
var cornerBoundsX = width * .2;
var cornerBoundsY = height * .2;
var gameWidth =  500;
var gameHeight = 500;

ctx.beginPath();
ctx.lineWidth = 4;
ctx.strokeRect(cornerBoundsX, cornerBoundsY, gameWidth, gameHeight);

var rows = 10;
var cols = 10;
var cellSize = 50;

ctx.lineWidth = 1;
ctx.translate(cornerBoundsX, cornerBoundsY);
for (let i = 0; i < rows; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, gameHeight);
    ctx.stroke();
}

for (let j = 0; j < cols; j++) {
    ctx.beginPath();
    ctx.moveTo(0, j * cellSize);
    ctx.lineTo(gameWidth, j * cellSize);
    ctx.stroke();
}

// How many boats and their lengths
var boats = [4,3,3,2,2,2,1,1,1,1];

var grid = [];
var playerGrid = [];
var permanentCells = [];
for (let i = 0; i < rows; i++) {
    let arr = [];
    let playerArr = [];
    for (let j = 0; j < cols; j++)
    {
        arr.push(0); // 0 is water
        playerArr.push(-1) // -1 is nothing
    }
    grid.push(arr);
    playerGrid.push(playerArr);
}

c.addEventListener('mousedown', (e) => {
    if (e.clientX > cornerBoundsX && e.clientY > cornerBoundsY && e.clientX < cornerBoundsX + gameWidth && e.clientY < cornerBoundsY + gameHeight) {
        var cellX = Math.floor((e.clientX - cornerBoundsX) / cellSize);
        var cellY = Math.floor((e.clientY - cornerBoundsY) / cellSize);
        
        if (playerGrid[cellX][cellY] == -1) {
            playerGrid[cellX][cellY] = 0; // from nothing to water
        } else if (playerGrid[cellX][cellY] == 0) {
            playerGrid[cellX][cellY] = 1; // from water to boat 
        } else {
            playerGrid[cellX][cellY] = -1; // from boat to nothing
        }

        drawBoard();
    }

    if (e.clientX > cornerBoundsX + gameWidth && e.clientX < cornerBoundsX + gameWidth + cellSize && e.clientY > cornerBoundsY && e.clientY < cornerBoundsY + gameHeight) {
        let target = Math.floor((e.clientY - cornerBoundsY) / cellSize);
        for (let i = 0; i < cols; i++) {
            if (playerGrid[i][target] < 0) {
                playerGrid[i][target] = 0;
            }
        }

        drawBoard();
    }

    if (e.clientY > cornerBoundsY + gameHeight && e.clientY < cornerBoundsY + gameHeight + cellSize && e.clientX < cornerBoundsX + gameWidth && e.clientX > cornerBoundsX) {
        let target = Math.floor((e.clientX - cornerBoundsX) / cellSize);
        for (let i = 0; i < rows; i++) {
            if (playerGrid[target][i] < 0) {
                playerGrid[target][i] = 0;
            }
        }
        
        drawBoard();
    }
});

// Find spot for a boat based on int length
function generateBoat(length) {
    let direction = Math.floor(Math.random() * 2); // 0 => vertical - 1 ==> horizontal
    let x, y;
    if (direction) { // horizontal
        x = Math.floor(Math.random() * (rows - length));
        y = Math.floor(Math.random() * cols);
    } else { // vertical
        x = Math.floor(Math.random() * rows);
        y = Math.floor(Math.random() * (cols - length));
    }

    if (length < 2) {
        if (!checkValidPosition(x,y)) {
            return generateBoat(length);
        } else {
            grid[x][y] = 1;
        }
        return;
    }

    for (let i = 0; i < length; i++) {
        if (direction) { // horizontal
            if (!checkValidPosition(x + i,y)) {
                return generateBoat(length);
            }
        } else { // veritcal
            if (!checkValidPosition(x,y + i)) {
                return generateBoat(length);
            }
        }
    }

    for (let i = 0; i < length; i++) {
        if (direction) { // horizontal
            grid[x + i][y] = 1;
        } else { // veritcal
            grid[x][y + i] = 1;
        }
    }
}

function drawBoard() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++)
        {
            /*if (grid[i][j]) {
                ctx.beginPath();
                ctx.arc(i * cellSize + cellSize / 2, j * cellSize + cellSize / 2, 10, 0, 2 * Math.PI);
                ctx.fill();
            }*/

            // Make sure permanent cells are still drawn
            for (let i = 0; i < permanentCells.length; i++) {
                let x = permanentCells[i][0];
                let y = permanentCells[i][1];
                let type = permanentCells[i][2]; // water or boat, 0 or 1
                playerGrid[x][y] = type;

                let up = (y > 0) ? grid[x][y-1] : 0;
                let left = (x > 0) ? grid[x-1][y] : 0;
                let right = (x < rows - 1) ? grid[x+1][y] : 0;
                let down = (y < cols - 1) ? grid[x][y+1] : 0;

                if (type) drawBoatType(up, left, right, down, x, y);
            }

            ctx.clearRect(i * cellSize + 10, j * cellSize + 10, cellSize - 20, cellSize - 20);
            
            ctx.fillStyle = "black";
            ctx.strokeStyle = "black";
            if (playerGrid[i][j] == 1) { // boat
                let permanentSkip = false;
                for (let p = 0; p < permanentCells.length; p++) {
                    if (permanentCells[p][0] == i && permanentCells[p][1] == j) {
                        permanentSkip = true;
                        break;
                    }
                }

                if (permanentSkip) continue;

                let up = (j > 0) ? playerGrid[i][j-1] : 0;
                let left = (i > 0) ? playerGrid[i-1][j] : 0;
                let right = (i < rows - 1) ? playerGrid[i+1][j] : 0;
                let down = (j < cols - 1) ? playerGrid[i][j+1] : 0;
                drawBoatType(up, left, right, down, i, j);

            } else if (playerGrid[i][j] == 0) { // water
                ctx.beginPath();
                for (let x = 0; x < 3; x++) {
                    ctx.moveTo(i * cellSize + 10, j * cellSize + 10 * x + 15);
                    ctx.lineTo(i * cellSize + cellSize - 10, j * cellSize + + 10 * x + 15);
                }
                ctx.stroke();
            }
        }
    }
}

function generateBoard() { 
    let i = 0;
    var x = setInterval(() => {
        if (i < boats.length) {
            generateBoat(boats[i]);
        } else {
            clearInterval(x);
            drawGridNumbers();
            findRandomStarters(3,3);
            drawBoard();
        }
        // drawBoard();
        i++;
    }, 5);
}
generateBoard();

// Check if position is valid
function checkValidPosition(x, y) {
    if (grid[x][y]) {
        return false; // boat already there;
    }

    // Check all spaces around grid[x][y]
    for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
            if (i < 0 || i >= rows || j < 0 || j >= cols) {
                continue;
            } // else (in spirit)

            if (grid[i][j]) {
                if (grid[i][j] == grid[x][y]) {
                    continue;
                }

                return false;
            }
        }
    }

    // Valid to place boat here
    return true;
}

// Draw numbers on sides
function drawGridNumbers() {
    let arr = [];
    for (let i = 0; i < cols; i++) {arr.push(0)};

    for (let i = 0; i < rows; i++) {
        let count = 0; // number of boats in row

        for (let j = 0; j < cols; j++) {
            if (grid[i][j]) {
                count++;
                arr[j]++;
            }
        }
        ctx.beginPath();
        ctx.font = "24px arial";
        ctx.fillText(count, cellSize * i + cellSize / 2 - 5, 530);

    }
    
    for (let i = 0; i < arr.length; i++) {
        ctx.beginPath();
        ctx.fillText(arr[i], 510, cellSize * i + cellSize / 2 + 5);
    }
}

// boat  : (int) number of boats to start with
// water : (int) number of waters to start with
function findRandomStarters(boat, water) {
    for (let i = 0; i < boat; i++) {
        let coords = findElement(1); // find boat
        coords.push(1); // denotes this is a boat
        permanentCells.push(coords);

        playerGrid[coords[0]][coords[1]] = 1;
    }

    for (let i = 0; i < water; i++) {
        let coords = findElement(0); // find water
        ctx.beginPath();
        for (let x = 0; x < 3; x++) {
            ctx.moveTo(coords[0] * cellSize + 10, coords[1] * cellSize + 10 * x + 15);
            ctx.lineTo(coords[0] * cellSize + cellSize - 10, coords[1] * cellSize + + 10 * x + 15);
        }
        ctx.stroke();
        coords.push(0); // denotes this is a water
        permanentCells.push(coords);

        playerGrid[coords[0]][coords[1]] = 0;
    }
}

// element : (int) 0 or 1 "water" or "boat" 
function findElement(element) {
    let randX = Math.floor(Math.random() * rows);
    let randY = Math.floor(Math.random() * cols);

    if (grid[randX][randY] == element) {
        return [randX, randY];
    } else {
        return findElement(element);
    }
}

// Marching squares
// Directions are surrounding squares
// X and Y are positions on grid
function drawBoatType(top, left, right, down, x, y) {
    var id = Math.abs(top) * 8 + Math.abs(left) * 4 + Math.abs(right) * 2 + Math.abs(down);

    switch (id) {
        case 9: // Boats on top and bottom
            ctx.beginPath();
            ctx.fillRect(x * cellSize + 10, y * cellSize + 10, cellSize - 20, cellSize - 20);
            break;
        case 8: // Down arrow, only one boat on top
            ctx.beginPath();
            ctx.moveTo(x * cellSize + 10, y * cellSize + 10);
            ctx.lineTo(x * cellSize + cellSize - 10, y * cellSize + 10);
            ctx.lineTo(x * cellSize + cellSize / 2, y * cellSize + cellSize - 10);
            ctx.fill();
            break;
        case 6: // Boats on left and right
            ctx.beginPath();
            ctx.fillRect(x * cellSize + 10, y * cellSize + 10, cellSize - 20, cellSize - 20);
            break;
        case 2: // Left arrow, boat on right
            ctx.beginPath();
            ctx.moveTo(x * cellSize + cellSize - 10, y * cellSize + 10);
            ctx.lineTo(x * cellSize + cellSize - 10, y * cellSize + cellSize - 10);
            ctx.lineTo(x * cellSize + 10, y * cellSize + cellSize / 2);
            ctx.fill();
            break;
        case 4: // Right arrow, boat on left
            ctx.beginPath();
            ctx.moveTo(x * cellSize + 10, y * cellSize + 10);
            ctx.lineTo(x * cellSize + 10, y * cellSize + cellSize - 10);
            ctx.lineTo(x * cellSize + cellSize - 10, y * cellSize + cellSize / 2);
            ctx.fill();
            break;
        case 1: // Up arrow, boat below
            ctx.beginPath();
            ctx.moveTo(x * cellSize + 10, y * cellSize + cellSize - 10);
            ctx.lineTo(x * cellSize + cellSize - 10, y * cellSize + cellSize - 10);
            ctx.lineTo(x * cellSize + cellSize / 2, y * cellSize + 10);
            ctx.fill();
            break;
        case 0: // Circle, No surrounding boats
            ctx.beginPath();
            ctx.arc(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2, 10, 0, 2 * Math.PI);
            ctx.fill();
            break;
        default:
            ctx.beginPath();
            ctx.fillRect(x * cellSize + 10, y * cellSize + 10, cellSize - 20, cellSize - 20);
            break;
    }
}

function revealAll() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++)
        {
            if (grid[i][j]) {
                ctx.beginPath();
                ctx.arc(i * cellSize + cellSize / 2, j * cellSize + cellSize / 2, 10, 0, 2 * Math.PI);
                ctx.fillStyle="red";
                ctx.fill();
            }
        }
    }
}

function checkBoard() {
    var valid = true;
    for (let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            if (playerGrid[i][j] != grid[i][j]) {
                valid = false;
                alert("Not Correct");
                return;
            }
        }
    }
    alert("Correct");
}