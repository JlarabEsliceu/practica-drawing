console.log("Editor script loaded successfully.");

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let objectes = [];
let tool = 'circle';
let colorInput = document.getElementById('color');
let sizeInput = document.getElementById('size');

console.log(canvas)

let eines = ['circle', 'square', 'triangle', 'star', 'freehand'];
for (let i = 0; i < eines.length; i++) {
    let eina = document.getElementById(eines[i]);
    eina.addEventListener('click', function() {
        tool = eines[i];
        console.log(tool);
    });
}


canvas.addEventListener('click',function(e){
    let x = e.offsetX;
    let y = e.offsetY;
    let obj = {
        eina: tool,
        x: x,
        y: y,
        color: colorInput.value,
        size: Number(sizeInput.value),
        name: tool + '_' + (objectes.length + 1)
    };
    objectes.push(obj);
    drawObject(obj);
    renderList();

})

function pickTool(obj) {
    if(obj.eina === 'circle') {
        ctx.arc(obj.x, obj.y, obj.size/2, 0,2*Math.PI);
    }
    else if(obj.eina === 'square') {
        ctx.rect(obj.x - obj.size/2, obj.y - obj.size/2, obj.size, obj.size);
    }
    else if(obj.eina === 'triangle') {
        ctx.moveTo(obj.x, obj.y - obj.size/2);
        ctx.lineTo(obj.x - obj.size/2, obj.y + obj.size/2);
        ctx.lineTo(obj.x + obj.size/2, obj.y + obj.size/2);
        ctx.closePath();
    }
    else if(obj.eina === 'star') {
        let puntas = 7;
        let radioGrande = obj.size/2;
        let radioPequeno = obj.size/4;
        for (let i = 0; i < puntas * 2; i++) {
            let radio = (i % 2 === 0) ? radioGrande : radioPequeno;
            let angulo = (i * Math.PI) / puntas;
            let x = obj.x + radio * Math.sin(angulo);
            let y = obj.y - radio * Math.cos(angulo);
            if (i === 0) {
                ctx.moveTo(x, y);
            }
            else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
    }
}

function drawObject(obj) {
    ctx.beginPath();
    ctx.fillStyle = obj.color;
    pickTool(obj);
    ctx.fill();

}

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < objectes.length; i++) {
        drawObject(objectes[i]);
    }
}

function renderList() {
    let llista = document.getElementById('llista');
    llista.innerHTML = '';
    for (let i = 0; i < objectes.length; i++) {
        let li = document.createElement('li');
        li.textContent = objectes[i].name;
        llista.appendChild(li);
    }
}