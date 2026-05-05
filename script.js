const canvas = document.querySelector("#myCanvas");
const ctx = canvas.getContext("2d");

console.log(ctx);

// ctx.fillStyle = 'blue';
// ctx.fillRect (50, 50, 100, 100);
// квадрат

// ctx.beginPath();
// ctx.moveTo(150, 50);
// ctx.lineTo(100, 150);
// ctx.lineTo(200, 150);
// ctx.closePath();
// ctx.fillStyle = 'red';
// ctx.fill();
// трикутник

// ctx.beginPath();
// ctx.arc(250, 100, 50, 0, Math.PI * 2);
// ctx.fillStyle = 'green';
// ctx.fill();
// коло

// ctx.strokeSrtyle = 'black';
// ctx.lineWidth = 5;
// ctx.strokeRect(50, 50, 100, 100);

// localStorage.setItem('canvasImage', canvas.toDataURL());

// const img = new Image();
// img.src = localStorage.getItem('canvasImage');
// img.onload = () => {
//     ctx.drawImage(img, 0, 0);
// }

let drawing = false;
let isErasing = false;
let currentColor = 'black';
let currentLineWidth = 10;
let drawingData = [];

canvas.addEventListener('mousedown', (event) => {
    drawing = true;

    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
    console.log(ctx);
    drawingData.push({
        type: 'begin',
        x: event.offsetX,
        y: event.offsetY,
        color: currentColor,
        width: currentLineWidth,
        eraser: isErasing
    });
    
});
    
canvas.addEventListener('mousemove', (event) => {
    if (drawing){
        ctx.strokeStyle = isErasing ? 'white' : currentColor;
        ctx.globalCompositeOperation = isErasing ? 'destination-out' : 'source-over';
        ctx.lineWidth = currentLineWidth;
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        console.log('move');
        
        drawingData.push({
            type: 'line',
            x: event.offsetX,
            y: event.offsetY,
        });

    }
});

canvas.addEventListener('mouseup', () => drawing = false);
canvas.addEventListener('mouseleave', () => drawing = false);

document.querySelector('#colorPicker').addEventListener('input', (event) => {
    currentColor = event.target.value;
});

document.querySelector('#inputLineWidth').addEventListener('input', (event) => {
    currentLineWidth = event.target.value;
});

document.querySelector('.clearCanvas').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.querySelector('.eraseMode').addEventListener('click', () => {
    isErasing = !isErasing;
    document.querySelector('.eraseMode').classList.toggle('border');
});

document.querySelector('.loadCanvas').addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = canvas.toDateaURL("image/png");
    link.download = 'my-drawing.png';
    link.click();
});

document.querySelector('.saveCanvas').addEventListener('click', () => {
    localStorage.setItem('canvasData', JSON.stringify(drawingData));
    alert('Drawing saved!');
});

document.querySelector('.restoreCanvas').addEventListener('click', () => {
    const savedData = localStorage.getItem('canvasData');
    if (savedData) {
        drawingData = JSON.parse(savedData);
        renderCanvas();
    }
});

document.querySelector('.replayDrawing').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    replayCanvas();
});

function renderCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log(drawingData);
    

    drawingData.forEach(step => {
        console.log(step);
        
        if (step.type === 'begin') {
            ctx.beginPath();
            ctx.moveTo(step.x, step.y);
            ctx.strokeStyle = step.eraser ? 'white' : step.color;
            ctx.lineWidth = step.width;
            ctx.globalCompositeOperation = step.eraser ? 'destination-out' : 'source-over';

        } else if (step.type === 'line') {
            ctx.lineTo(step.x, step.y);
            ctx.stroke();
        }
    });
}

function replayCanvas() {
   let i = 0;
   function drawNext() {
      if (i < drawingData.length) {
         const step = drawingData[i];
         if (step.type === "begin") {
            ctx.beginPath();
            ctx.moveTo(step.x, step.y);
            ctx.strokeStyle = step.erase ? "white" : step.color;
            ctx.lineWidth = step.width;
            ctx.globalCompositeOperation = step.erase ? "destination-out" : "source-over";
         } else if (step.type === "line") {
            ctx.lineTo(step.x, step.y);
            ctx.stroke();
         }
         i++;
         setTimeout(drawNext, 10);
      }
   }
   drawNext();
}


// function replayCanvas() {
//     let i = 0;
//     function drawNext() {
//         if (i < drawingData.lenght){
//                 if(step)
//         }
//     }
// }
    

window.onload = () => {
    const savedData = localStorage.getItem('canvasData');
    if (savedData) {
        drawingData = JSON.parse(savedData);
        renderCanvas();
    }
}