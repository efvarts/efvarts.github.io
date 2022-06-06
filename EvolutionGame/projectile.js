import { projectiles } from "./script.js";
import { player } from "./script.js";
import { health } from "./script.js";
var c = document.querySelector('canvas');
var ctx = c.getContext('2d');

var width = document.body.clientWidth;
var height = document.body.clientHeight - 80;

// X, y coordinates, direction is rise and run, enemyBool is if shot by enemy
export class Projectile {
    constructor (x, y, pX, pY, speed, enemyBool, color) {
        this.x = x;
        this.y = y;

        this.shotByEnemy = enemyBool;
        this.shotPlayer = false;
        this.color = color;

        let dx = pX - x;
        let dy = pY - y;

        let dist = Math.sqrt(dx * dx + dy * dy);
        dx /= dist;
        dy /= dist;

        dx *= speed;
        dy *= speed;

        this.dx = dx;
        this.dy = dy;
        
        // Die at 50 or until reach edge
        this.age = 0;

        projectiles.push(this);
    }
    
    // Check if hit enemy in enemies if in attackDist
    attack(enemies, attackDist) {
        for (let i = 0; i < enemies.length; i++) {
            if (this.shotByEnemy) {
                continue;
            }

            let dx = enemies[i].x - this.x;
            let dy = enemies[i].y - this.y;

            let dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= attackDist && !enemies[i].projectiles.includes(this)) {
                enemies[i].health--;
                enemies[i].projectiles.push(this);
            }
        }
    }

    // Check if should die, return true if should be dead
    // If diebool is true, die immediately
    check() {
        if (this.age > 100) {
            return true;
        }

        if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
            return true;
        }

        return false;
    }

    update () {
        this.x += this.dx;
        this.y += this.dy;

        this.age++;

        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 8 && this.shotByEnemy && !this.shotPlayer && !health.invincible) {
            this.shotPlayer = true;
            health.h -= 5;
        }
    }
    
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.dx * 2, this.y + this.dy * 2);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 5;
        ctx.stroke();
    }
}