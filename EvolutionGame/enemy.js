import { Projectile } from './projectile.js';
import { enemies } from './script.js';
import { player } from './script.js';

var c = document.querySelector('canvas');
var ctx = c.getContext('2d');

var width = document.body.clientWidth;
var height = document.body.clientHeight;

export class Enemy {
    constructor (x, y, speed, size, health) {
        this.x = x;
        this.y = y;

        this.speed = speed;
        this.size = size;

        this.health = health;

        // Projectiles that already hit
        this.projectiles = [];

        enemies.push(this);
    }

    check() {
        if (this.health <= 0) {
            return true;
        }

        return false;
    }

    move() {
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        dx /= dist;
        dy /= dist;

        dx *= this.speed;
        dy *= this.speed;

        this.x += dx;
        this.y += dy;

        if (this.x < 0) {
            this.x = 0;
        }

        if (this.x > width - this.size) {
            this.x = width - this.size;
        }

        if (this.y < 0) {
            this.y = 0;
        }

        if (this.y > height - this.size) {
            this.y = height - this.size;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = "#dc143c";
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

export class Ranger extends Enemy {
    constructor (x, y, speed, size, health) {
        super(x, y, speed, size, health);

        this.age = 0;

        if (this.speed > 2) {
            this.speed = 2;
        }
    }

    attack() {
        new Projectile(this.x + 10, this.y + 10, player.x, player.y, 7, true, 'lightblue');
    }
}