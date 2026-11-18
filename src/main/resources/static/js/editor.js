const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorInput = document.getElementById('color');
const sizeInput = document.getElementById('size');
const ampladaInput = document.getElementById('amplada');
const alcadaInput = document.getElementById('alcada');
const propietats = document.getElementById('propietats');
const propNom = document.getElementById('propNom');
const propX = document.getElementById('propX');
const propY = document.getElementById('propY');
const propMida = document.getElementById('propMida');
const propColor = document.getElementById('propColor');
const eines = ['select', 'circle', 'square', 'triangle', 'star', 'freehand', 'line'];
const clau = 'dibuix_' + drawId;

const estat = { width: 800, height: 600, objectes: [] };
const historial = createHistory(estat);

let tool = 'circle';
let comptador = 0;
let seleccionat = null;
let registre = [];
let traçActual = null;
let liniaActual = null;
let arrossegant = false;
let inici = null;
let darrerPunt = null;


function pickTool(obj) {
    if (obj.eina === 'circle') {
        ctx.arc(obj.x, obj.y, obj.size / 2, 0, 2 * Math.PI);
    }
    else if (obj.eina === 'square') {
        ctx.rect(obj.x - obj.size / 2, obj.y - obj.size / 2, obj.size, obj.size);
    }
    else if (obj.eina === 'triangle') {
        ctx.moveTo(obj.x, obj.y - obj.size / 2);
        ctx.lineTo(obj.x - obj.size / 2, obj.y + obj.size / 2);
        ctx.lineTo(obj.x + obj.size / 2, obj.y + obj.size / 2);
        ctx.closePath();
    }
    else if (obj.eina === 'star') {
        let puntas = 7;
        let radioGrande = obj.size / 2;
        let radioPequeno = obj.size / 4;
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
    else if (obj.eina === 'freehand' || obj.eina === 'line') {
        ctx.moveTo(obj.points[0].x, obj.points[0].y);
        for (let i = 1; i < obj.points.length; i++) {
            ctx.lineTo(obj.points[i].x, obj.points[i].y);
        }
    }
}

function drawObject(obj) {
    ctx.beginPath();
    pickTool(obj);
    if (obj.eina === 'freehand' || obj.eina === 'line') {
        ctx.strokeStyle = obj.color;
        ctx.lineWidth = obj.size / 5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    }
    else {
        ctx.fillStyle = obj.color;
        ctx.fill();
    }
}

function redraw() {
    canvas.width = estat.width;
    canvas.height = estat.height;
    for (const obj of estat.objectes) {
        drawObject(obj);
    }
    if (traçActual !== null) {
        drawObject(traçActual);
    }
}


function distanciaSegment(x, y, a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const llarg = dx * dx + dy * dy;
    let t = 0;
    if (llarg > 0) {
        t = ((x - a.x) * dx + (y - a.y) * dy) / llarg;
        t = Math.max(0, Math.min(1, t));
    }
    return Math.hypot(x - (a.x + t * dx), y - (a.y + t * dy));
}

function toca(obj, x, y) {
    if (obj.points) {
        const marge = Math.max(obj.size / 10, 5);
        for (let i = 1; i < obj.points.length; i++) {
            if (distanciaSegment(x, y, obj.points[i - 1], obj.points[i]) <= marge) {
                return true;
            }
        }
        return false;
    }
    if (obj.eina === 'circle') {
        return Math.hypot(x - obj.x, y - obj.y) <= obj.size / 2;
    }
    return Math.abs(x - obj.x) <= obj.size / 2 && Math.abs(y - obj.y) <= obj.size / 2;
}

function objecteA(x, y) {
    for (let i = estat.objectes.length - 1; i >= 0; i--) {
        if (toca(estat.objectes[i], x, y)) {
            return estat.objectes[i];
        }
    }
    return null;
}

function posicio(obj) {
    if (obj.points) {
        return obj.points[0];
    }
    return { x: obj.x, y: obj.y };
}

function nouObjecte(eina) {
    comptador++;
    return {
        eina: eina,
        color: colorInput.value,
        size: Number(sizeInput.value),
        name: eina + '_' + comptador
    };
}


function fer(accio) {
    historial.execute(accio);
    apuntar(accio.label);
}

function desfer() {
    if (!historial.canUndo()) return;
    historial.undo();
    apuntar('Desfer');
}

function refer() {
    if (!historial.canRedo()) return;
    historial.redo();
    apuntar('Refer');
}

function apuntar(text) {
    registre.push(text);
    guardarLocal();
    refrescar();
}


function renderList() {
    const llista = document.getElementById('llista');
    llista.innerHTML = '';
    for (const obj of estat.objectes) {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        const nom = document.createElement('span');
        nom.textContent = obj.name;
        li.appendChild(nom);
        if (!nomesLectura) {
            li.addEventListener('click', function () {
                canviarEina('select');
                seleccionat = obj;
                refrescar();
            });
            const boto = document.createElement('button');
            boto.className = 'btn btn-sm btn-outline-danger';
            boto.textContent = 'X';
            boto.addEventListener('click', function (e) {
                e.stopPropagation();
                fer(esborrarObjecte(obj, estat.objectes.indexOf(obj)));
            });
            li.appendChild(boto);
        }
        llista.appendChild(li);
    }
}

function renderPropietats() {
    if (propietats === null) return;
    propietats.hidden = seleccionat === null;
    if (seleccionat === null) return;
    const p = posicio(seleccionat);
    propNom.value = seleccionat.name;
    propX.value = p.x;
    propY.value = p.y;
    propMida.value = seleccionat.size;
    propColor.value = seleccionat.color;
}

function renderRegistre() {
    const llista = document.getElementById('registre');
    if (llista === null) return;
    llista.innerHTML = '';
    for (const text of registre) {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = text;
        llista.appendChild(li);
    }
}

function refrescar() {
    if (!estat.objectes.includes(seleccionat)) {
        seleccionat = null;
    }
    if (!estat.objectes.includes(liniaActual)) {
        liniaActual = null;
    }
    redraw();
    renderList();
    renderPropietats();
    renderRegistre();
    if (ampladaInput !== null) {
        ampladaInput.value = estat.width;
        alcadaInput.value = estat.height;
    }
}


function carregarDibuix(dibuix) {
    estat.width = dibuix.width;
    estat.height = dibuix.height;
    estat.objectes = dibuix.objectes;
    comptador = estat.objectes.length;
}

function guardarLocal() {
    localStorage.setItem(clau, JSON.stringify({ dibuix: estat, registre: registre }));
}

function carregarLocal() {
    const dades = JSON.parse(localStorage.getItem(clau));
    if (dades === null) return false;
    carregarDibuix(dades.dibuix);
    registre = dades.registre;
    return true;
}

function guardarConfig() {
    localStorage.setItem('configEditor', JSON.stringify({ tool: tool, color: colorInput.value, size: sizeInput.value }));
}

function carregarConfig() {
    const config = JSON.parse(localStorage.getItem('configEditor'));
    if (config === null) return;
    tool = config.tool;
    colorInput.value = config.color;
    sizeInput.value = config.size;
}


function canviarEina(nova) {
    tool = nova;
    liniaActual = null;
    if (nova !== 'select') {
        seleccionat = null;
    }
    guardarConfig();
    refrescar();
}

function clicCanvas(e) {
    if (tool === 'select' || tool === 'freehand') return;
    const punt = { x: e.offsetX, y: e.offsetY };
    if (tool === 'line') {
        if (liniaActual === null) {
            liniaActual = nouObjecte('line');
            liniaActual.points = [punt];
            fer(afegirObjecte(liniaActual));
        }
        else {
            fer(afegirPunt(liniaActual, punt));
        }
        return;
    }
    const obj = nouObjecte(tool);
    obj.x = punt.x;
    obj.y = punt.y;
    fer(afegirObjecte(obj));
}

function baixarRatoli(e) {
    document.activeElement.blur();
    const punt = { x: e.offsetX, y: e.offsetY };
    if (tool === 'select') {
        seleccionat = objecteA(punt.x, punt.y);
        arrossegant = seleccionat !== null;
        inici = punt;
        darrerPunt = punt;
        refrescar();
    }
    else if (tool === 'freehand') {
        traçActual = nouObjecte('freehand');
        traçActual.points = [punt];
    }
}

function moureRatoli(e) {
    const punt = { x: e.offsetX, y: e.offsetY };
    if (arrossegant) {
        desplacar(seleccionat, punt.x - darrerPunt.x, punt.y - darrerPunt.y);
        darrerPunt = punt;
        redraw();
    }
    else if (traçActual !== null) {
        traçActual.points.push(punt);
        redraw();
    }
}

function amollarRatoli() {
    if (arrossegant) {
        arrossegant = false;
        const dx = darrerPunt.x - inici.x;
        const dy = darrerPunt.y - inici.y;
        if (dx !== 0 || dy !== 0) {
            desplacar(seleccionat, -dx, -dy);
            fer(moureObjecte(seleccionat, dx, dy));
        }
    }
    if (traçActual !== null) {
        const traç = traçActual;
        traçActual = null;
        fer(afegirObjecte(traç));
    }
}

function canviarMida() {
    const abans = { width: estat.width, height: estat.height };
    const despres = { width: Number(ampladaInput.value), height: Number(alcadaInput.value) };
    fer(canviarMidaCanvas(abans, despres));
}


if (nomesLectura || !carregarLocal()) {
    if (dibuixInicial !== null) {
        carregarDibuix(JSON.parse(dibuixInicial));
    }
}

if (!nomesLectura) {
    carregarConfig();

    for (const eina of eines) {
        document.getElementById(eina).addEventListener('click', () => canviarEina(eina));
    }
    colorInput.addEventListener('change', guardarConfig);
    sizeInput.addEventListener('change', guardarConfig);
    ampladaInput.addEventListener('change', canviarMida);
    alcadaInput.addEventListener('change', canviarMida);
    document.getElementById('desfer').addEventListener('click', desfer);
    document.getElementById('refer').addEventListener('click', refer);
    document.getElementById('esborrarTot').addEventListener('click', () => fer(esborrarTot([...estat.objectes])));

    canvas.addEventListener('click', clicCanvas);
    canvas.addEventListener('dblclick', () => liniaActual = null);
    canvas.addEventListener('mousedown', baixarRatoli);
    canvas.addEventListener('mousemove', moureRatoli);
    canvas.addEventListener('mouseup', amollarRatoli);
    canvas.addEventListener('mouseleave', amollarRatoli);

    propNom.addEventListener('change', () => fer(canviarPropietat(seleccionat, 'name', propNom.value)));
    propColor.addEventListener('change', () => fer(canviarPropietat(seleccionat, 'color', propColor.value)));
    propMida.addEventListener('change', () => fer(canviarPropietat(seleccionat, 'size', Number(propMida.value))));
    propX.addEventListener('change', () => fer(moureObjecte(seleccionat, Number(propX.value) - posicio(seleccionat).x, 0)));
    propY.addEventListener('change', () => fer(moureObjecte(seleccionat, 0, Number(propY.value) - posicio(seleccionat).y)));

    document.getElementById('saveForm').addEventListener('submit', function (e) {
        if (estat.objectes.length === 0) {
            e.preventDefault();
            alert("El dibuix esta buit");
            return;
        }
        document.getElementById('objects').value = JSON.stringify(estat);
        document.getElementById('objectCount').value = estat.objectes.length;
        localStorage.removeItem(clau);
    });
}

refrescar();
