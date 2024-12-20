const canvas = document.getElementById("tetris");
const context = canvas.getContext("2d");

// Variables del tablero
const filas = 20;
const columnas = 10;
const tamanoCelda = 30;
const tablero = Array.from({ length: filas }, () => Array(columnas).fill(null));
var level = 0;
var puntuacion = 0;

// Piezas del juego
const formas = [
    { nombre: 'I', forma: [[1, 1, 1, 1]], color: 'cyan'},
    { nombre: 'J', forma: [[1, 0, 0], [1, 1, 1]], color: 'blue'},
    { nombre: 'L', forma: [[0, 0, 1], [1, 1, 1]], color: 'orange'},
    { nombre: 'O', forma: [[1, 1], [1, 1]], color: 'yellow'},
    { nombre: 'T', forma: [[0, 1, 0], [1, 1, 1]], color: 'purple'},
    { nombre: 'S', forma: [[0, 1, 1], [1, 1, 0]], color: 'green'},
    { nombre: 'C', forma: [[1, 1, 1], [1, 0, 1]], color: 'red'}
];

const puntosNiveles =[ [40, 100, 300, 1200], [80, 200, 600, 2400], [120, 300, 900, 3600], [400, 1000, 3000, 12000]];
const puntos = (filas) => {
    return puntosNiveles[level][filas - 1];
}
// dibujarTablero() : encargada de pintar cada una de las celdas del tablero, si el valor de la celda es 1 pintará de gris sino será negro.
const dibujarTablero = () => {
    for (let fila = 0; fila < filas; fila++) {
        for (let columna = 0; columna < columnas; columna++) {
            const celda = tablero[fila][columna];
            context.fillStyle = celda ? celda : 'black';
            context.fillRect(columna * tamanoCelda, fila * tamanoCelda, tamanoCelda, tamanoCelda);
            context.strokeRect(columna * tamanoCelda, fila * tamanoCelda, tamanoCelda, tamanoCelda);
        }
    }
    // Tambien dibujo el borde del tablero para verlo bien
    context.strokeStyle = 'white';
    context.lineWidth = 2;
    context.strokeRect(0, 0, columnas * tamanoCelda, filas * tamanoCelda);
}

// dibujarPieza(pieza, x, y): le pasamos el objeto pieza y la posición donde tiene que dibujarla en el eje x  y en el eje y de nuestro lienzo.
const dibujarPieza = (pieza, x, y) => {
    context.fillStyle = pieza.color;
    pieza.forma.forEach((fila, i) => {
        fila.forEach((celda, j) => {
            if (celda) {
                context.fillRect((x + j) * tamanoCelda, (y + i) * tamanoCelda, tamanoCelda, tamanoCelda);
                context.strokeRect((x + j) * tamanoCelda, (y + i) * tamanoCelda, tamanoCelda, tamanoCelda);
            }
        });
    });
}

// generarPieza() : retorna la pieza que se muestra en base a la probabilidad que tiene cada una.
const generarPieza = () => {
    const forma = formas[Math.floor(Math.random() * formas.length)];
    return { ...forma };
}

// chequearColisiones(pieza, x, y): detecta si se produce una colisión es decir salirse de nuestro tablero
// o hay un 1 en el tablero por lo que ese hueco está ocupado. Retorna verdadero o falso.
const chequearColisiones = (pieza, x, y) => {
    for (let i = 0; i < pieza.forma.length; i++) {
        for (let j = 0; j < pieza.forma[i].length; j++) {
            if (pieza.forma[i][j]) {
                const nuevoX = x + j;
                const nuevoY = y + i;
                if (nuevoX < 0 || nuevoX >= columnas || nuevoY >= filas || tablero[nuevoY][nuevoX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// posicionaPieza(pieza, x, y): coloca la pieza en el tablero
const posicionaPieza = (pieza, x, y) => {
    pieza.forma.forEach((fila, i) => {
        fila.forEach((celda, j) => {
            if (celda) {
                tablero[y + i][x + j] = pieza.color;
            }
        });
    });
}

// eliminarLinea(): elimina de nuestro tablero una fila si está es todo 1 y añade una nueva fila de ceros
const eliminarLinea = (iteracion) => {
    let contador = iteracion? (contador + 1) : 0;
    for (let fila = filas - 1; fila >= 0; fila--) {
        if (tablero[fila].every(celda => celda !== null)) {
            tablero.splice(fila, 1);
            tablero.unshift(Array(columnas).fill(null));
            console.log("Puntuación: " + puntuacion);
            eliminarLinea(true);
        }
    }
    puntuacion += puntos(contador);
}

// actualizar(): Es la función que controla la lógica del juego, mediante la 
// utilización de las funciones chequearcolisiones, posicionaPieza, eliminanarLinea 
// y generarPieza nueva, por último comprueba si la nueva pieza generada tiene colisiones, 
// si es así el juego debe finalizar mostrando una alerta por pantalla que dice
// “FIN DE LA PARTIDA, este juego ha sido desarrollado por [Tu nombre y apellidos]”
let piezaActual = generarPieza();
let x = 3; // Posición inicial en el eje x
let y = 0; // Posición inicial en el eje y

const actualizar = () => {
    // Mover la pieza hacia abajo
    y++;

    // Verificar colisiones
    if (chequearColisiones(piezaActual, x, y)) {
        y--;
        posicionaPieza(piezaActual, x, y);
        eliminarLinea();
        piezaActual = generarPieza();
        x = 3;
        y = 0;

        // Verificar si la nueva pieza colisiona al generarse
        if (chequearColisiones(piezaActual, x, y)) {
            alert("FIN DE LA PARTIDA, este juego ha sido desarrollado por [Rafael Augusto Urzeda Almeida]");
            // Reiniciar el juego
            tablero.forEach(fila => fila.fill(null));
        }
    }
}

// jugar() es una función que primero actualiza el estado del juego, y después borra el tablero para
// volver a dibujarlo todo (tablero y pieza). Este proceso debe repetirse cada medio segundo.
const jugar = () => {
    actualizar();
    context.clearRect(0, 0, canvas.width, canvas.height);
    dibujarTablero();
    dibujarPieza(piezaActual, x, y);
    setTimeout(jugar, 500);
}

// Iniciar el juego
jugar();

document.addEventListener('keydown', (event) => {
    if (event.key === 'a' || event.key === 'A') {
        // Mover a la izquierda
        if (!chequearColisiones(piezaActual, x - 1, y)) {
            x--;
        }
    } else if (event.key === 'd' || event.key === 'D') {
        // Mover a la derecha
        if (!chequearColisiones(piezaActual, x + 1, y)) {
            x++;
        }
    } else if (event.key === 's' || event.key === 'S') {
        // Bajar más rápido
        if (!chequearColisiones(piezaActual, x, y + 1)) {
            y++;
        }
    } else if (event.key === 'w' || event.key === 'W') {
        // Rotar la pieza
        const piezaRotada = rotarPieza(piezaActual);
        if (!chequearColisiones(piezaRotada, x, y)) {
            piezaActual = piezaRotada;
        }
    }
});

// Función para rotar la pieza
const rotarPieza = (pieza) => {
    const nuevaForma = pieza.forma[0].map((_, i) => pieza.forma.map(fila => fila[i]).reverse());
    return { ...pieza, forma: nuevaForma };
}