var size = prompt("Size of window (px): ");

var newWindow = open('https://efvarts.github.io/Snake/snake.html', 'snake', `width=${size},height=${size}`)
// var newWindow = open('/snake.html', 'snake', `width=${size},height=${size}`)
newWindow.focus();