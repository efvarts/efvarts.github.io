import { Projectile }     from "./projectile.js";
import { ParticleSquare } from "./particles.js";
import { Sword }          from "./weapons.js";
import { Bomb }           from "./weapons.js";

export const enemies = [];
export const projectiles = [];
export const particles = [];

var c = document.querySelector('canvas');
var ctx = c.getContext('2d');

var width = c.width = document.body.clientWidth;
var height = c.height = document.body.clientHeight;
height -= 80;

var size = 20;

var score = 0;

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
export const health = {h: 100, invincible: false};

// Key handeling
document.addEventListener('keydown', (e) => {
    if (e.key != ' ') {
        keys[e.key.toLowerCase()].pressed = true;
    }

    if (e.key == ' ') {
        player.vx *= 10;
        player.vy *= 10;
        
        health.invincible = true;
        let x = setInterval(() => {
            new ParticleSquare({x: player.x + size / 2, y: player.y + size / 2}, 0, 20 + Math.random() * 5, false, ['white']);
        
            for (let i = 0; i < enemies.length; i++) {
                let dx = (player.x + 10) - (enemies[i].x + 10);
                let dy = (player.y + 10) - (enemies[i].y + 10);
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist <= 25) {
                    enemies[i].health -= 3;
                }
            }
        }, 5);

        setTimeout(() => {
            health.invincible = false;
            clearInterval(x);
        }, 100);
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key != ' ') {
        keys[e.key.toLowerCase()].pressed = false;
    }
});

var worldTime = 0;
var lastAttack = 0;

// Player shooting 
c.addEventListener('click', (e) => {
    // new Projectile(player.x + size / 2, player.y + size / 2, e.x, e.y, 7, false, 'red').draw();
    if (lastAttack <= 0) {
        let pos = {x: player.x + size / 2, y: player.y + size / 2};
        // new Bomb(pos, e.x, e.y, 100);
        new Sword(pos, e.x, e.y).draw();
        lastAttack = 50;
    }
});

var timer = 8;

const draw = setInterval(() => {

    if (health.h > 0) {
        ctx.clearRect(0, 0, width, height + 80);
        ctx.shadowBlur = 50;

        // Enemies
        for (let i = 0; i < enemies.length; i++) {
            enemies[i].eAge++;

            enemies[i].move();
            enemies[i].draw();
            if (enemies[i].attack) {
                enemies[i].age++;
                if (enemies[i].age % 50 == 0) {
                    enemies[i].attack();
                }
            }

            // Kill enemies
            if (enemies[i].check()) {
                for (let j = 0; j < 10; j++) {
                    let pos = {
                        x: enemies[i].x + size / 2,
                        y: enemies[i].y + size / 2
                    };
                    new ParticleSquare(pos, 0, Math.random() * 20 + 50, false,[ctx.fillStyle]);
                }

                preShake();
                setTimeout(() => {
                    postShake();
                },50);

                score += enemies[i].scoreDeath;
                enemies.splice(i, 1);
            }
        }

        // Projectiles
        for (let i = 0; i < projectiles.length; i++) {
            projectiles[i].update();
            projectiles[i].draw();

            projectiles[i].attack(enemies, 15);
            
            if (projectiles[i].check()) {
                projectiles.splice(i, 1);
                i--;
            }
        }

        // Particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            if (particles[i].age > particles[i].maxAge) {
                particles.splice(i, 1);
                i--;
            }
        }

        player.change();
        player.update();
        player.draw();

        drawBar();
        worldTime++;
        lastAttack--;
    } else {
        console.log(score);
        clearInterval(draw);
    }
}, timer);

// Health bar
function drawBar() {
    if (health.h < 0) {
        health.h = 0;
    }

    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.fillStyle="rgb(10, 10, 10)";
    ctx.fillRect(0,height,width,80);
    ctx.fillStyle = "#00fa9a";
    ctx.fillRect(10,height+20,health.h * 5,40);
    ctx.fillStyle = "#ff355e";
    ctx.fillRect(10 + health.h * 5,height+20,500 - health.h * 5,40);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.strokeRect(10,height+20,500,40);
}

function preShake() {
    ctx.save();
    let dx = Math.random() * 10 + 1;
    let dy = Math.random() * 10 + 1;

    if (Math.floor(Math.random() * 2)) {
        dx *= -1;
    }

    if (Math.floor(Math.random() * 2)) {
        dy *= -1;
    }

    ctx.translate(dx, dy);
}

function postShake() {
    ctx.restore();
}