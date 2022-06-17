import { particles } from "./script.js";

const rand = (n) => Math.random() * n;
const randf = (n) => Math.floor(Math.random() * n);

var c = document.querySelector('canvas');
var ctx = c.getContext('2d');

// Pos is {x , y}
// Direction is 0 for random or 1 for up
// Ordered color is appear in order of color
export class Particle {
    constructor (pos, direction, lifeTime, orderedColor, ...colors) {
        this.x = pos.x;
        this.y = pos.y;

        this.age = 0;
        this.maxAge = lifeTime;

        if (direction) {
            this.dirY = -Math.random() * 3;
            this.dirX = rand(1);

            if (randf(2)) {
                this.dirX *= -1;
            }
        } else {
            this.dirX = rand(1);
            this.dirY = rand(1);

            if (randf(2)) {
                this.dirX *= -1;
            }

            if (randf(2)) {
                this.dirY *= -1;
            }
        }

        colors = colors[0];

        if (orderedColor) {
            this.color = colors;
            this.colorOrder = true;
        } else {
            this.color = colors[randf(colors.length)];
            this.colorOrder = false;
        }

        particles.push(this);
    }

    update() {
        this.x += this.dirX;
        this.y += this.dirY;

        this.age++;
    }
}

export class ParticleSquare extends Particle {
    constructor (pos, direction, lifeTime, orderedColor, ...colors) {
        super(pos, direction, lifeTime, orderedColor, ...colors);
    }

    draw() {
        if (this.colorOrder) {
            let interval = this.maxAge / this.color.length;
            let color = Math.floor(this.age / interval);
            ctx.fillStyle = this.color[color] ?? this.color[this.color.length - 1];
        } else {
            ctx.fillStyle = this.color;
        }

        ctx.beginPath();
        ctx.fillRect(this.x, this.y, 10, 10);
    }
}