const colors = [
  '#e50000',
   '#ff8dd0',
   '#ffee00',
   '#028121',
   '#004cff',
   '#770088',
];
window.onload = function() {
  var canvas = document.getElementById('imageCanvas');
  var ctx = canvas.getContext('2d');
  var img = new Image();
  var mousePressed = false;
  var lastX, lastY;

  document.getElementById('imageLoader').addEventListener('change', function(e) {
    var reader = new FileReader();
    reader.onload = function(event) {
      img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        setTimeout(() => { 
          console.log('LOADED');
          drawFlag(colors);
        }, 100);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
  });
  canvas.addEventListener('mousedown', function(e) {
    mousePressed = true;
    draw(e.offsetX, e.offsetY, false);
  });

  canvas.addEventListener('mousemove', function(e) {
    if (mousePressed) {
      draw(e.offsetX, e.offsetY, true);
    }
  });

  canvas.addEventListener('mouseup', function() {
    mousePressed = false;
  });

  canvas.addEventListener('mouseleave', function() {
    mousePressed = false;
  });

  document.getElementById('saveBtn').addEventListener('click', function() {
    var dataURL = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
    var link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = dataURL;
    link.click();
  });

  function draw(x, y, isDown) {
    if (isDown) {
      console.log(x, y);
      ctx.beginPath();
      ctx.strokeStyle = 'red'; // Change drawing color here
      ctx.lineWidth = 3; // Change drawing line width here
      ctx.lineJoin = 'round';
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.stroke();
    }
    lastX = x; lastY = y;
  }

  function drawArc(x, y, color, startAngle) {
    ctx.beginPath();
    let endAngle = startAngle + Math.PI / 6;
    let realStartAngle = startAngle;
    if (color == colors[0]) {
      const grad=ctx.createLinearGradient(x * 1.3, y + 130, x * 1.7, y + 90);

      grad.addColorStop(0, color);
      grad.addColorStop(1, "transparent");
      ctx.strokeStyle = grad;
      realStartAngle = startAngle - Math.PI / 6;
      endAngle = realStartAngle + 2 * (Math.PI / 6);
    } else if (color == colors[colors.length - 1]){
      const grad=ctx.createLinearGradient(x * 1.3, y + 130, x * 1.7, y + 90);

      grad.addColorStop(0, color);
      grad.addColorStop(1, "transparent");
      ctx.strokeStyle = grad;
      realStartAngle = startAngle - Math.PI / 6;
      endAngle = realStartAngle + 2 * (Math.PI / 6);
    } else {
      ctx.strokeStyle = color;
    }
    const lineWidth = Math.floor(img.height * 0.15);
    ctx.lineWidth = lineWidth; 
    ctx.arc(x, y, x - (lineWidth / 2), realStartAngle, endAngle);
    ctx.stroke(); 
  }

  function drawFlag(colors) {
    const startAngle = Math.PI / 4;
    for (let i=0; i < colors.length; i++) {
      drawArc(
        img.width / 2, 
        img.height / 2, 
        colors[i], 
        startAngle + i * Math.PI / 6 
      );
    }
    ctx.fillRect((img.width / 2 ) * 1.3, img.height / 2 + 130, 3, 3);
    ctx.fillRect((img.width / 2 ) * 1.7, img.height / 2 + 90, 3, 3);
  }
}
