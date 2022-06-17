import { ParticleSquare}    from './particles.js';
import { particles }        from './script.js';
import { RectRect }         from './collison.js';
import { health }           from './script.js';
import { player}            from './script.js';

var c = document.querySelector('canvas');
var ctx = c.getContext('2d');

export class Heal {
    constructor (x,y, amount) {
        this.x = x;
        this.y = y;
        // Amount to heal player for
        this.amount = amount;

        this.age = 0;
        this.maxAge = 100000;

        particles.push(this);
    }

    update() {
        if (RectRect(player.x, player.y, 20, 20, this.x, this.y, 20, 20)) {
            health.h += this.amount;
            this.age = this.maxAge + 1;

            if (health.h > 100) health.h = 100;
            
            for (let i = 0; i < 20; i++) {
                new ParticleSquare(this, 0, 20 + Math.random() * 15, false, ["#00fa9a","#66CDAA"]);
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = "#00fa9a";
        ctx.fillRect(this.x, this.y, 20, 20);
    }
}