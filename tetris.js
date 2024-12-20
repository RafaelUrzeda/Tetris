const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

// Variables del tablero
const filas = 20;
const columnas = 10;
const tamanoCelda = 30;
const tablero = Array.from({ length: filas }, () => Array(columnas).fill(null));
let level = 0;
let puntuacion = 0;
let velocidad = 500;
let ultimoTiempo = 0;
let acumuladorTiempo = 0;

// Piezas del juego
const formas = [
    { nombre: 'I', forma: [[1, 1, 1, 1]], color: 'cyan'},
    { nombre: 'J', forma: [[1, 0, 0], [1, 1, 1]], color: 'blue'},
    { nombre: 'L', forma: [[0, 0, 1], [1, 1, 1]], color: 'orange'},
    { nombre: 'O', forma: [[1, 1], [1, 1]], color: 'yellow'},
    { nombre: 'T', forma: [[0, 1, 0], [1, 1, 1]], color: 'purple'},
    { nombre: 'S', forma: [[0, 1, 1], [1, 1, 0]], color: 'green'},
    { nombre: 'Z', forma: [[1, 1, 0], [0, 1, 1]], color: 'pink'},
    { nombre: 'C', forma: [[1, 1, 1], [1, 0, 1]], color: 'red'}
];

const puntosNiveles = [
    [40, 100, 300, 1200], // Nivel 0
    [80, 200, 600, 2400], // Nivel 1
    [120, 300, 900, 3600], // Nivel 2
    [160, 400, 1200, 4800] // Nivel 3
];

const calcularPuntuacion = (lineas) => {
    return puntosNiveles[level][lineas - 1];
};

const dibujarTablero = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    tablero.forEach((fila, y) => {
        fila.forEach((celda, x) => {
            context.fillStyle = celda || 'black';
            context.fillRect(x * tamanoCelda, y * tamanoCelda, tamanoCelda, tamanoCelda);
            context.strokeStyle = 'white';
            context.strokeRect(x * tamanoCelda, y * tamanoCelda, tamanoCelda, tamanoCelda);
        });
    });
    document.getElementById("score").textContent = `Puntuación: ${puntuacion} | Nivel: ${level}`;
};

const dibujarPieza = (pieza, x, y) => {
    context.fillStyle = pieza.color;
    pieza.forma.forEach((fila, i) => {
        fila.forEach((celda, j) => {
            if (celda) {
                context.fillRect((x + j) * tamanoCelda, (y + i) * tamanoCelda, tamanoCelda, tamanoCelda);
                context.strokeStyle = 'white';
                context.strokeRect((x + j) * tamanoCelda, (y + i) * tamanoCelda, tamanoCelda, tamanoCelda);
            }
        });
    });
};

const generarPieza = () => {
    const forma = formas[Math.floor(Math.random() * formas.length)];
    return { ...forma };
};

const chequearColisiones = (pieza, x, y) => {
    return pieza.forma.some((fila, i) => {
        return fila.some((celda, j) => {
            if (celda) {
                const nuevoX = x + j;
                const nuevoY = y + i;
                return (
                    nuevoX < 0 ||
                    nuevoX >= columnas ||
                    nuevoY >= filas ||
                    (nuevoY >= 0 && tablero[nuevoY][nuevoX])
                );
            }
            return false;
        });
    });
};

const posicionaPieza = (pieza, x, y) => {
    pieza.forma.forEach((fila, i) => {
        fila.forEach((celda, j) => {
            if (celda) {
                tablero[y + i][x + j] = pieza.color;
            }
        });
    });
};

const eliminarLineas = () => {
    let lineasEliminadas = 0;
    for (let fila = filas - 1; fila >= 0; fila--) {
        if (tablero[fila].every(celda => celda)) {
            tablero.splice(fila, 1);
            tablero.unshift(Array(columnas).fill(null));
            lineasEliminadas++;
            fila++; // Revisar la misma fila después de eliminar
        }
    }
    if (lineasEliminadas > 0) {
        puntuacion += calcularPuntuacion(lineasEliminadas);
        if (puntuacion >= (level + 1) * 1000) {
            level++;
            velocidad = Math.max(100, velocidad - 50); // Aumenta la velocidad con un límite mínimo
        }
    }
};

let piezaActual = generarPieza();
let x = 3;
let y = 0;

const actualizar = () => {
    y++;
    if (chequearColisiones(piezaActual, x, y)) {
        y--;
        posicionaPieza(piezaActual, x, y);
        eliminarLineas();
        piezaActual = generarPieza();
        x = 3;
        y = 0;

        if (chequearColisiones(piezaActual, x, y)) {
            alert("FIN DE LA PARTIDA, este juego ha sido desarrollado por [Rafael Augusto Urzeda Almeida]");
            tablero.forEach(fila => fila.fill(null));
            puntuacion = 0;
            level = 0;
            velocidad = 500;
        }
    }
};

const jugar = (tiempoActual) => {
    if (!ultimoTiempo) {
        ultimoTiempo = tiempoActual;
    }
    const deltaTiempo = tiempoActual - ultimoTiempo;
    acumuladorTiempo += deltaTiempo;

    if (acumuladorTiempo >= velocidad) {
        actualizar();
        acumuladorTiempo = 0;
    }

    dibujarTablero();
    dibujarPieza(piezaActual, x, y);

    ultimoTiempo = tiempoActual;
    requestAnimationFrame(jugar);
};

document.addEventListener('keydown', (event) => {
    if (event.key === 'a' || event.key === 'A') {
        if (!chequearColisiones(piezaActual, x - 1, y)) x--;
    } else if (event.key === 'd' || event.key === 'D') {
        if (!chequearColisiones(piezaActual, x + 1, y)) x++;
    } else if (event.key === 's' || event.key === 'S') {
        if (!chequearColisiones(piezaActual, x, y + 1)) y++;
    } else if (event.key === 'w' || event.key === 'W') {
        const piezaRotada = rotarPieza(piezaActual);
        if (!chequearColisiones(piezaRotada, x, y)) piezaActual = piezaRotada;
    }
});

const rotarPieza = (pieza) => {
    const nuevaForma = pieza.forma[0].map((_, i) => pieza.forma.map(fila => fila[i]).reverse());
    return { ...pieza, forma: nuevaForma };
};

jugar(0);
