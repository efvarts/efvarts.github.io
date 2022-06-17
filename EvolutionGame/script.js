import { ParticleSquare }   from "./particles.js";
import { Projectile }       from "./projectile.js";
import { Sword }            from "./weapons.js";
import { Bomb }             from "./weapons.js";
import { Heal }             from "./drops.js";

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
var worldTime = 0;

const keys = {
    w: {pressed: false},
    a: {pressed: false},
    s: {pressed: false},
    d: {pressed: false},
    ArrowUp: {pressed: false},
    ArrowLeft: {pressed: false},
    ArrowDown: {pressed: false},
    ArrowRight: {pressed: false}
};

export const settings = {
    paused: false,
    gameOver: false
};

export const health = {h: 100, invincible: false};

ctx.shadowBlur = 50;
ctx.shadowColor = "white";

class Player {
    constructor (x, y) {
        this.x = x;
        this.y = y;

        this.vx = 0;
        this.vy = 0;

        this.status = [];
        this.afflictedTime = [];
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

        for (let i = 0; i < this.status.length; i++) {
            if (this.afflictedTime[i] == undefined) {
                this.afflictedTime.push(0);
            }
        }
    }
    
    draw() {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, size, size);

        let pos = {x: player.x + size / 2, y: player.y + 2};
        manageEffects(pos, health.h, [this.status, this.afflictedTime]);
    }
}

export const player = new Player(250,240);

var maxDash = 150;
var dashTimer = maxDash;

var selectedWeapon = 'machineGun';

new Heal(500,500,10);

// Key handeling
document.addEventListener('keydown', (e) => {
    if (e.key != ' ') {
        if (e.key.length == 1) {
            keys[e.key.toLowerCase()].pressed = true;
        } else {
            keys[e.key].pressed = true;
        }
    }

    if (e.key == ' ') {
        if (dashTimer >= 50 && !settings.paused) {
            player.vx *= 10;
            player.vy *= 10;
            
            health.invincible = true;
            let x = setInterval(() => {
                if (!player.status.length) {
                    new ParticleSquare({x: player.x + size / 2, y: player.y + size / 2}, 0, 20 + Math.random() * 5, false, ['white']);
                }
                
                for (let i = 0; i < enemies.length; i++) {
                    let dx = (player.x + 10) - (enemies[i].x + 10);
                    let dy = (player.y + 10) - (enemies[i].y + 10);
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist <= 25) {
                        enemies[i].health -= 2;
                    }
                }
            }, 5);

            setTimeout(() => {
                health.invincible = false;
                clearInterval(x);
            }, 100);
            dashTimer -= 50;
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key != ' ') {
        if (e.key.length == 1) {
            keys[e.key.toLowerCase()].pressed = false;
        } else {
            keys[e.key].pressed = false;
        }
    }
});

var lastAttack = 0;

// Pause Starting X and Y, width and height are 50
var pauseX, pauseY;

// If mouse down or not
var mouseBool = false;
var mouse = {x: 0, y: 0};

// Player shooting 
c.addEventListener('mousedown', (e) => {
    mouseBool = true;

    mouse.x = e.x;
    mouse.y = e.y;

    // First weapon slot
    if (inRect(e.x, e.y, 530, height + 15, 50, 50)) {
        selectedWeapon = 'gun';
        mouseBool = false;
    }

    // Second weapon slot
    if (inRect(e.x, e.y, 590, height + 15, 50, 50)) {
        selectedWeapon = 'sword';
        mouseBool = false;
    }

    // Pause button
    if (inRect(e.x, e.y, pauseX - 5, pauseY - 5, 50, 50)) {
        if (settings.paused) {
            settings.paused = false;
        } else {
            settings.paused = true;
        }

        mouseBool = false;
    }
});

c.addEventListener('mouseup', (e) => {
    mouseBool = false;

    if (selectedWeapon == 'gun') {
        lastAttack = 0;
    }
});

c.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

var timer = 8;

const draw = setInterval(() => {
    if (!settings.paused) {
        if (health.h > 0) {
            ctx.clearRect(0, 0, width, height + 80);
            ctx.shadowBlur = 50;

            if (mouseBool) {
                if (lastAttack <= 0) {
                    let pos = {x: player.x + size / 2, y: player.y + size / 2};
                    let status = null;
                    if (player.status.includes('fire')) {
                        status = 'fire';
                    }

                    switch (selectedWeapon) {
                        case 'gun': {
                            new Projectile(pos.x, pos.y, mouse.x, mouse.y, 7, false, 'red', status).draw();
                            lastAttack = 20;
                            break;
                        }

                        case 'sword':
                            new Sword(pos, mouse.x, mouse.y).draw();
                            lastAttack = 50;
                            break;

                        case 'bomb':
                            new Bomb(pos, mouse.x, mouse.y, 100, false);
                            lastAttack = 50;
                            break;

                        case 'machineGun':
                            let addX = Math.random() * 100;
                            let addY = Math.random() * 100;

                            if (Math.floor(Math.random() * 2)) {
                                addX *= -1;
                            }

                            if (Math.floor(Math.random() * 2)) {
                                addY *= -1;
                            }

                            new Projectile(pos.x, pos.y, mouse.x + addX, mouse.y + addY, 7, false, 'red', status).draw();
                            lastAttack = 10;
                            break;
                    }
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

            // Enemies
            for (let i = 0; i < enemies.length; i++) {
                enemies[i].eAge++;

                let pos = {x: enemies[i].x + enemies[i].size / 2, y: enemies[i].y + 2};
                enemies[i].move();
                manageEffects(pos, i, [enemies[i].status, enemies[i].afflictedTime]);
                enemies[i].draw();
                if (enemies[i].attack) {
                    enemies[i].age++;
                    if (enemies[i].age % enemies[i].attackTime == 0) {
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

                    preShake(10);
                    setTimeout(() => {
                        postShake();
                    },50);

                    if (Math.random() * 100 <= 10) {
                        new Heal(enemies[i].x, enemies[i].y, 10);
                    }

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

            player.change();
            player.update();
            player.draw();

            drawBar();
            drawPause();
            drawGui();
            worldTime++;
            if (dashTimer < maxDash) {
                dashTimer++;
            }
            lastAttack--;
        } else {
            console.log(score);
            clearInterval(draw);
        }
    } else {
        postShake();
        ctx.shadowBlur = 0;
        ctx.font = '50px "PressStart2P"';
        ctx.fillStyle = 'white';
        ctx.fillText("Paused", width / 2 - 150, height / 2);
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

// Pause Button
function drawPause() {
    pauseX = width - 60;
    pauseY = height + 20;

    ctx.beginPath();
    ctx.fillStyle = 'rgb(20,20,20)';
    ctx.fillRect(pauseX, pauseY, 40, 40);
    ctx.strokeRect(pauseX, pauseY, 40, 40);

    ctx.fillStyle = 'white';
    ctx.fillRect(pauseX + 8, pauseY + 8, 10, 24);
    ctx.fillRect(pauseX + 22, pauseY + 8, 10, 24);
}

// Draw weapons buttons
function drawGui() {
    ctx.beginPath();
    ctx.strokeRect(530, height + 20, 40, 40);
    ctx.strokeRect(590, height + 20, 40, 40);

    ctx.font = '10px "PressStart2P"';
    ctx.fillText('Gun', 535, height + 45);
    ctx.fillText('Swd', 595, height + 45);
}

function preShake(factor) {
    ctx.save();
    let dx = Math.random() * factor + 1;
    let dy = Math.random() * factor + 1;

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

function inRect(eventX, eventY, x, y, width, height) {
    return eventX > x && eventX < x + width && eventY > y && eventY < y + height;
}

// Manage status effects of players and enemies
// If not player h is the index of enemy in enemies
function manageEffects(pos, h, ...statusInfo) {
    statusInfo = statusInfo[0];

    let status = statusInfo[0];
    let afflictedTime = statusInfo[1];

    let isPlayer = false;
    if (h == health.h) {
        isPlayer = true;
    }

    for (let i = 0; i < status.length; i++) {
        switch (status[i]) {
            case 'fire':
                if (afflictedTime[i] % 80 == 0 && afflictedTime[i] < 400) {
                    if (isPlayer) {
                        health.h -= 5;
                    } else {
                        enemies[h].health -= 5;
                    }
                }

                if (afflictedTime[i] > 400) {
                    status.splice(i, 1);
                    afflictedTime.splice(i, 1);
                    i--;
                }
                
                new ParticleSquare(pos, 1, Math.random() * 30 + 15, true, ["#FF2400", "#FF4500", "#FF4500", "#FEBE10"]);
                break;

            case 'poison':
                if (afflictedTime[i] < 500 && afflictedTime[i] % 50 == 0) {
                    if (isPlayer) {
                        health.h -= 1;

                        if (health.h <= 0) {
                            health.h = 1;
                        }
                    } else {
                        enemies[h].health -= 1;

                        if (enemies[h].health <= 0) {
                            enemies[h].health = 1;
                        }
                    }
                }
                
                if (afflictedTime[i] > 500) {
                    status.splice(i, 1);
                    afflictedTime.splice(i, 1);
                    i--;
                }

                new ParticleSquare(pos, 0, 30, false, ["#03C03C", 'yellow',"#ADFF2F"]);
                break;
        }

        afflictedTime[i]++;
    }
}