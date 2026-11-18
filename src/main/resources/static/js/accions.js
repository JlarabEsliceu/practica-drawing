function desplacar(obj, dx, dy) {
    if (obj.points) {
        for (const p of obj.points) {
            p.x += dx;
            p.y += dy;
        }
    }
    else {
        obj.x += dx;
        obj.y += dy;
    }
}

const afegirObjecte = (obj) => ({
    label: 'Afegeix ' + obj.name,
    do: (s) => { s.objectes.push(obj); },
    undo: (s) => { s.objectes.splice(s.objectes.indexOf(obj), 1); },
});

const esborrarObjecte = (obj, index) => ({
    label: 'Esborra ' + obj.name,
    do: (s) => { s.objectes.splice(index, 1); },
    undo: (s) => { s.objectes.splice(index, 0, obj); },
});

const esborrarTot = (anteriors) => ({
    label: 'Esborra tot',
    do: (s) => { s.objectes = []; },
    undo: (s) => { s.objectes = [...anteriors]; },
});

const afegirPunt = (linia, punt) => ({
    label: 'Afegeix un punt a ' + linia.name,
    do: () => { linia.points.push(punt); },
    undo: () => { linia.points.pop(); },
});

const moureObjecte = (obj, dx, dy) => ({
    label: 'Mou ' + obj.name,
    do: () => { desplacar(obj, dx, dy); },
    undo: () => { desplacar(obj, -dx, -dy); },
});

const canviarPropietat = (obj, propietat, valor) => {
    const anterior = obj[propietat];
    return {
        label: 'Canvia ' + propietat + ' de ' + obj.name,
        do: () => { obj[propietat] = valor; },
        undo: () => { obj[propietat] = anterior; },
    };
};

const canviarMidaCanvas = (abans, despres) => ({
    label: 'Canvia la mida del canvas',
    do: (s) => { s.width = despres.width; s.height = despres.height; },
    undo: (s) => { s.width = abans.width; s.height = abans.height; },
});
