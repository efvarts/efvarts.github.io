import { Projectile } from "./projectile.js";
import { Enemy }      from "./enemy.js";

export const enemies = [];
export const projectiles = [];

var c = document.querySelector('canvas');
var ctx = c.getContext('2d');

var width = c.width = document.body.clientWidth;
var height = c.height = document.body.clientHeight;

var size = 20;

var keys = {
    w: {pressed: false},
    a: {pressed: false},
    s: {pressed: false},
    d: {pressed: false},
    ArrowUp: {pressed: false},
    ArrowLeft: {pressed: false},
    ArrowDown: {pressed: false},
    ArrowRight: {pressed: false}
};

ctx.shadowBlur = 50;
ctx.shadowColor = "white";

class Player {
    constructor (x, y) {
        this.x = x;
        this.y = y;

        this.vx = 0;
        this.vy = 0;
    }

    change() {
        // Up
        if (keys["w"].pressed || keys["ArrowUp"].pressed) {
            this.vy -= 1;
        }

        // Left
        if (keys["a"].pressed || keys["ArrowLeft"].pressed) {
            this.vx -= 1;
        }

        // Down
        if (keys["s"].pressed || keys["ArrowDown"].pressed) {
            this.vy += 1;
        }

        // Right
        if (keys["d"].pressed || keys["ArrowRight"].pressed) {
            this.vx += 1;
        }
    }

    update() {
        let prevX = this.x;
        let prevY = this.y;

        if (this.x < 0) {
            this.x = 0;
            this.vx = 0;
        }

        if (this.x > width - size) {
            this.x = width - size;
            this.vx = 0;
        }

        if (this.y < 0) {
            this.y = 0;
            this.vy = 0;
        }

        if (this.y > height - size) {
            this.y = height - size;
            this.vy = 0;
        }

        this.vx *= 0.8;
        this.vy *= 0.8;

        this.x += this.vx;
        this.y += this.vy;
        
        this.vx = this.x - prevX;
        this.vy = this.y - prevY;
    }
    
    draw() {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, size, size);
    }
}

export const player = new Player(250,240);

// Key handeling
document.addEventListener('keydown', (e) => {
    if (e.key != ' ') {
        keys[e.key].pressed = true;
    }

    if (e.key == " ") {
        player.vx *= 10;
        player.vy *= 10;
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key].pressed = false;
});


// Player shooting 
c.addEventListener('click', (e) => {
    new Projectile(player.x + size / 2, player.y + size / 2, e.x, e.y, 7, false, 'red').draw();
});

function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < enemies.length; i++) {
        enemies[i].move();
        enemies[i].draw();
        if (enemies[i].attack) {
            enemies[i].age++;
            if (enemies[i].age % 50 == 0) {
                enemies[i].attack();
            }
        }

        if (enemies[i].check()) {
            enemies.splice(i, 1);
        }
    }

    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].update();
        projectiles[i].draw();

        projectiles[i].attack(enemies, 15);
        
        if (projectiles[i].check()) {
            projectiles.splice(i, 1);
            i--;
        }
    }

    player.change();
    player.update();
    player.draw();

    requestAnimationFrame(draw);
};

draw();