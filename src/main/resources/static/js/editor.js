console.log("Editor script loaded successfully.");

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let objectes = [];
let tool = 'circle';
let colorInput = document.getElementById('color');
let sizeInput = document.getElementById('size');
let dibuixant = false;
let traçActual = null;
let comptador = 0;
let liniaActual = null;


console.log(canvas)

if(!nomesLectura){
    const eines = ['circle', 'square', 'triangle', 'star', 'freehand','line'];
    for (let i = 0; i < eines.length; i++) {
        let eina = document.getElementById(eines[i]);
        eina.addEventListener('click', function() {
            tool = eines[i];
            liniaActual = null;
            console.log(tool);
        });
    }
}


canvas.addEventListener('click',function(e){
    if(nomesLectura) return;
    if (tool === 'freehand') return;
    if(tool === 'line'){
        let punt = {x: e.offsetX, y: e.offsetY};
        if(liniaActual === null){
            liniaActual = {
                eina: 'line',
                points: [punt],
                color: colorInput.value,
                size: Number(sizeInput.value),
                name: tool + '_' + (++comptador)
            };
            objectes.push(liniaActual)
        }
        else{
            liniaActual.points.push(punt);
        }
        redraw();
        renderList();
        return;
    }
    let x = e.offsetX;
    let y = e.offsetY;
    let obj = {
        eina: tool,
        x: x,
        y: y,
        color: colorInput.value,
        size: Number(sizeInput.value),
        name: tool + '_' + (++comptador)
    };
    objectes.push(obj);
    drawObject(obj);
    renderList();

})

canvas.addEventListener('dblclick', function(){
    liniaActual = null;
});

canvas.addEventListener('mousedown', function(e){
    if(nomesLectura) return;
    if (tool !== 'freehand') return;
    let x = e.offsetX;
    let y = e.offsetY;

    traçActual = {
        eina: 'freehand',
        points: [{x: x , y: y}],
        color: colorInput.value,
        size: Number(sizeInput.value),
        name: 'freehand_' + (++comptador)
    }

    objectes.push(traçActual)
    dibuixant = true;
});

canvas.addEventListener('mousemove',function(e){
    if(!dibuixant) return;
    traçActual.points.push({x: e.offsetX, y: e.offsetY});
    redraw();
})

function acabarTraç(){
    if(!dibuixant)return;
    dibuixant = false;
    traçActual = null;
    renderList();
}

canvas.addEventListener('mouseup', acabarTraç);
canvas.addEventListener('mouseleave', acabarTraç)

if(!nomesLectura){
    let botoEsborrarTot = document.getElementById('esborrarTot')
    botoEsborrarTot.addEventListener('click', function(){
        objectes = [];
        redraw();
        renderList();
        liniaActual = null;
    })
}


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
    else if(obj.eina === 'freehand' || obj.eina === 'line'){
        ctx.moveTo(obj.points[0].x, obj.points[0].y);
        for(let i = 1; i < obj.points.length; i++){
            ctx.lineTo(obj.points[i].x, obj.points[i].y);
        }
    }
}

function drawObject(obj) {
    ctx.beginPath();
    pickTool(obj);
    if (obj.eina === 'freehand' || obj.eina === 'line'){
        ctx.strokeStyle = obj.color;
        ctx.lineWidth = obj.size / 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    }
    else{
        ctx.fillStyle = obj.color;
        ctx.fill();
    }

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
        li.className = 'list-group-item'
        let nom = document.createElement('span');
        nom.textContent = objectes[i].name;
        li.appendChild(nom);
        if(!nomesLectura){
            let boton = document.createElement('button');
            boton.className = 'btn btn-sm btn-outline-danger'
            boton.textContent = 'X'
            boton.addEventListener('click',function(e){
                objectes.splice(i,1)
                redraw()
                renderList();
                liniaActual = null;
            })
            li.appendChild(boton);
        }
        llista.appendChild(li);
    }
}

// Save Form
let saveForm = document.getElementById('saveForm')
if(saveForm != null){
    saveForm.addEventListener('submit',function(e){
        if(objectes.length === 0) {
            e.preventDefault();
            alert("El dibuix esta buit");
            return;
        }
        document.getElementById('objects').value = JSON.stringify(objectes);
        document.getElementById('objectCount').value = objectes.length;
    })
}

if(dibuixInicial != null){
    objectes = JSON.parse(dibuixInicial)
    comptador = objectes.length;
    redraw();
    renderList();
}

