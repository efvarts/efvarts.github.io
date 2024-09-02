var size = prompt("Size of window (px): ");

var newWindow = open('/snake.html', 'snake', `width=${size},height=${size}`)
newWindow.focus();

// alert(newWindow.location.href); // (*) about:blank, loading hasn't started yet

newWindow.onload = function() {
//   let html = `<div style="font-size:30px">Welcome!</div>`;
  newWindow.document.body.insertAdjacentHTML('afterbegin', html);
};