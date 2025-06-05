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
          drawFlag(colors);
        }, 100);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(e.target.files[0]);
  });


  document.getElementById('saveBtn').addEventListener('click', function() {
    var dataURL = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
    var link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = dataURL;
    link.click();
  });

  function drawArc(x, y, color, startAngle) {
    ctx.beginPath();
    let endAngle = startAngle + Math.PI / 6;
    let realStartAngle = startAngle;
    if (color === colors[0]) {
      const grad=ctx.createLinearGradient(x * 1.5, y + 125, x * 1.6, y + 90);

      grad.addColorStop(0, color);
      grad.addColorStop(1, "transparent");
      ctx.strokeStyle = grad;
      realStartAngle = startAngle - Math.PI / 6;
      endAngle = realStartAngle + 2 * (Math.PI / 6);
    } else if (color === colors[colors.length - 1]){
      const grad=ctx.createLinearGradient(x * 0.5, y - 110, x * 0.25, y - 80);

      grad.addColorStop(1, color);
      grad.addColorStop(0, "transparent");
      ctx.strokeStyle = grad;
      realStartAngle = startAngle; // - Math.PI / 6;
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
    const centerX = img.width / 2;
    const centerY = img.height / 2;
    for (let i=0; i < colors.length; i++) {
      drawArc(
        centerX, 
        centerY,
        colors[i], 
        startAngle + i * Math.PI / 6 
      );
    }
    //    ctx.font = "bold 30px Serif";
    //    ctx.fillStyle = 'white';
    //    ctx.fillTextCircle("#pridemonth ", centerX, centerY, 75, Math.PI / 2);

    // ctx.fillRect((img.width / 2 ) * 0.5, img.height / 2 - 110, 3, 3);
    // ctx.fillRect((img.width / 2 ) * 0.25, img.height / 2 - 80, 3, 3);
    drawTextAlongArc(ctx, "#PRIDEMONTH", centerX, centerY, centerX * 0.9, 2.1 * Math.PI, 26);
  }
}


function drawTextAlongArc(context, str, centerX, centerY, radius, angle, fontSizeInPoints) {
  var len = str.length, s, letterAngle;
  if (!fontSizeInPoints) {
    fontSizeInPoints = 30; 
  }
  context.save();
  context.fillStyle = 'white';
  context.font = fontSizeInPoints + "pt Arial";
  context.textAlign = 'center';
  context.translate(centerX, centerY);
  context.rotate(angle + Math.PI / 2);

  for (var n = 0; n < len; n++) {
    s = str[n];
    letterAngle = -0.7*(context.measureText(s).width / radius);

    context.rotate(letterAngle);
    context.save();

    context.translate(0, radius);
    context.strokeStyle = '#333';
    context.lineWidth = 1;
    context.strokeText(s, 1, 1);
    context.strokeStyle = '#ddd';
    context.lineWidth = 1;
    context.strokeText(s, -1, -1);
    context.fillText(s, 0, 0);
    context.restore();

    context.rotate(letterAngle);
  }
  context.restore();
}
