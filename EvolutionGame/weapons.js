import { ParticleSquare } from './particles.js';
import { health, projectiles }    from './script.js';
import { particles }      from './script.js';
import { enemies }        from './script.js';
import { player }         from './script.js';

var c = document.querySelector('canvas');
var ctx = c.getContext('2d');

// Target x and target y
// Pos is firer position
export class Bomb {
    constructor (pos, x, y, spread, shotByEnemy) {
        this.x = pos.x;
        this.y = pos.y;

        this.shotByEnemy = shotByEnemy;

        this.spread = spread;

        let dx = x - pos.x;
        let dy = y - pos.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        this.dx = (dx / dist) * 5;
        this.dy = (dy / dist) * 5;

        this.age = 0;
        this.maxAge = 50;

        particles.push(this);
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        this.age++;

        if (this.age > this.maxAge - 1) {
            for (let i = 0; i < 20; i++) {
                new ParticleSquare({x: this.x + 10, y: this.y + 10}, 0, this.spread + Math.random() * 10, false, ["#FF2400", "#FF4500", "#FF4500", "#FEBE10", "#343434"]);
            }

            if (!this.shotByEnemy) {
                for (let i = 0; i < enemies.length; i++) {
                    let dx = enemies[i].x - this.x;
                    let dy = enemies[i].y - this.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < this.spread) {
                        enemies[i].health -= 10;
                        enemies[i].status.push("fire");
                    }
                }
            } else {
                let dx = player.x - this.x;
                let dy = player.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.spread && !health.invincible) {
                    health.h -= 10;
                    if (!player.status.includes("fire")) {
                        player.status.push("fire");
                    }
                }
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = "#483c32";
        ctx.rect(this.x, this.y, 20, 20);
        ctx.fill();
        ctx.strokeStyle = "#232b2b";
        ctx.lineWidth = 1;
        ctx.stroke();

        new ParticleSquare({x: this.x + 5, y: this.y - 10}, 1, 50, true, ["#FF2400", "#FF4500", "#FF4500", "#FEBE10"]);
    }
}

export class Sword {
    constructor(pos, x, y) {
        this.x = pos.x;
        this.y = pos.y;

        this.px = x;
        this.py = y;

        this.age = 0;
        this.maxAge = 20;

        let dx = x - pos.x;
        let dy = y - pos.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        this.dx = dx / dist;
        this.dy = dy / dist;
        
        if (x < pos.x) {
            this.angle = Math.atan2(dy, dx) + 30 * Math.PI / 180;
        } else {
            this.angle = Math.atan2(dy, dx) - 30 * Math.PI / 180;
        }

        particles.push(this);
    }

    update() {
        if (this.px < this.x) {
            this.angle-=0.1;
        } else {
            this.angle+=0.1;
        }
        this.age++;

        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i];

            let dx = (enemy.x + 10) - this.x;
            let dy = (enemy.y + 10) - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            let hitboxX = false;
            let hitboxY = false;

            if (this.px < this.x) {
                if (enemy.x > this.px && this.x > enemy.x) hitboxX = true;
            } else {
                if (enemy.x < this.px && this.x < enemy.x) hitboxX = true;
            }

            if (this.py < this.y) {
                if (enemy.y > this.py && this.y > enemy.y) hitboxY = true;
            } else {
                if (enemy.y < this.py && this.y < enemy.y) hitboxY = true;
            }

            if ((dist < 110 && hitboxY && hitboxX) || dist <= 10) {
                enemy.health -= 3;

                if (player.status.includes("fire")) {
                    if (!enemy.status.includes("fire")) {
                        enemy.status.push("fire");
                    }
                }
            }
        }

        for (let i = 0; i < projectiles.length; i++) {
            let projectile = projectiles[i];

            let dx = projectile.x - this.x;
            let dy = projectile.y - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            let hitboxX = false;
            let hitboxY = false;

            if (this.px < this.x) {
                if (projectile.x > this.px && this.x > projectile.x) hitboxX = true;
            } else {
                if (projectile.x < this.px && this.x < projectile.x) hitboxX = true;
            }

            if (this.py < this.y) {
                if (projectile.y > this.py && this.y > projectile.y) hitboxY = true;
            } else {
                if (projectile.y < this.py && this.y < projectile.y) hitboxY = true;
            }
            
            if (dist < 100 && hitboxX && hitboxY && projectile.shotByEnemy) {
                projectile.dx *= -1;
                projectile.dy *= -1;

                projectile.shotByEnemy = false;
                projectile.age = 0;
                projectile.color = 'red';
            }
        } 
    }

    draw() {
        let pX = this.x + 120 * Math.cos(this.angle);
        let pY = this.y + 120 * Math.sin(this.angle);

        let x = this.x + 20 * Math.cos(this.angle);
        let y = this.y + 20 * Math.sin(this.angle);

        let pX2, pY2;
        let x2, y2;

        if (this.px < this.x) {
            pX2 = this.x + 110 * Math.cos(this.angle - 15 * Math.PI / 180);
            pY2 = this.y + 110 * Math.sin(this.angle - 15 * Math.PI / 180);

            x2 = this.x + 20 * Math.cos(this.angle - 15 * Math.PI / 180);
            y2 = this.y + 20 * Math.sin(this.angle - 15 * Math.PI / 180);
        } else {
            pX2 = this.x + 110 * Math.cos(this.angle + 15 * Math.PI / 180);
            pY2 = this.y + 110 * Math.sin(this.angle + 15 * Math.PI / 180);

            x2 = this.x + 20 * Math.cos(this.angle + 15 * Math.PI / 180);
            y2 = this.y + 20 * Math.sin(this.angle + 15 * Math.PI / 180);
        }

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(pX, pY);
        ctx.lineTo(pX2, pY2);
        ctx.lineTo(x2, y2);
        ctx.fillStyle = "#FFC72C";
        ctx.lineWidth = 3;
        ctx.closePath();
        ctx.fill();

        let pos = {
            x: (this.x + pX) / 2,
            y: (this.y + pY) / 2
        };

        new ParticleSquare(pos, 1, 30, true, ["#ff355e","#ff5a36","#FFC72C"]);
    }
}