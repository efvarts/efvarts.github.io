import { Enemy } from './enemy.js';
import { Ranger } from './enemy.js';
import { player } from './script.js';

const rand = (n) => Math.floor(Math.random() * n);
var width = document.body.clientWidth;
var height = document.body.clientHeight - 80;

const spawner = setInterval(() => {
    let pos1 = getPos(player.x, player.y, 150);
    new Enemy(pos1.x, pos1.y, 2, 20, 2, 20, 10);
    let pos2 = getPos(player.x, player.y, 150);
    new Enemy(pos2.x, pos2.y, 2, 20, 2, 20, 10);
}, 1000);

const rangerSpawner = setInterval(() => {
    let pos = getPos(player.x, player.y, 250);
    new Ranger(pos.x, pos.y, 2, 20, 1, 0, 10);
}, 2000);

// Limit radius
function getPos(pX, pY, limit) {
    let posX = rand(width);
    let posY = rand(height);

    let dx = pX - posX;
    let dy = pY - posY;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < limit) {
        return getPos(player.x, player.y, limit);
    } else {
        return {x: posX, y: posY};
    }
}