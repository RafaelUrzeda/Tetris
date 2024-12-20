# Documentación del Proyecto Tetris - ACTIVIDAD UT4

Este proyecto implementa un juego de Tetris en JavaScript utilizando la API de gráficos `canvas` para la creación y manipulación del tablero y las piezas. Cumple con los requisitos mínimos y se han añadido algunas características extra. Además que por decisión propia y por una cuestión puramente estética, los colores no cambian cuando las piezas llegan a su sitio. También utilizo requestAnimationFrame para evitar la sensación de lag.

## Estructura del Código

### Configuración Inicial
- **Variables Globales**:
  - Configuración del tablero: `filas`, `columnas`, `tamanoCelda`.
  - Estado del juego: `nivel` y `puntuación`.
- **Tablero**:
  - Representado como un array bidimensional `tablero[filas][columnas]`, donde inicialmente todas las celdas son `null`.

### Definición de Piezas
Se definen al menos 5 piezas con sus formas, colores y probabilidades de aparición:
```javascript
const formas = [
    { nombre: 'I', forma: [[1, 1, 1, 1]], color: 'cyan' },
    { nombre: 'J', forma: [[1, 0, 0], [1, 1, 1]], color: 'blue' },
    { nombre: 'L', forma: [[0, 0, 1], [1, 1, 1]], color: 'orange' },
    { nombre: 'O', forma: [[1, 1], [1, 1]], color: 'yellow' },
    { nombre: 'T', forma: [[0, 1, 0], [1, 1, 1]], color: 'purple' }
];
```
# Funcionalidades Mínimas

El proyecto implementa las funcionalidades requeridas en el enunciado:

## dibujarTablero()
- Pinta las celdas del tablero en función de su estado (gris para piezas, negro para vacío).
- **Cumple con el punto: "dibujarTablero()" del enunciado.**

## dibujarPieza(pieza, x, y)
- Dibuja una pieza en la posición `(x, y)` especificada.
- **Cumple con el punto: "dibujarPieza()" del enunciado.**

## generarPieza()
- Retorna una pieza aleatoria basada en las probabilidades definidas.
- **Cumple con el punto: "generarPieza()" del enunciado.**

## chequearColisiones(pieza, x, y)
- Comprueba si una pieza colisiona con los límites del tablero o con otras piezas.
- Retorna `true` si hay colisión, `false` en caso contrario.
- **Cumple con el punto: "chequearColisiones()" del enunciado.**

## posicionaPieza(pieza, x, y)
- Coloca una pieza en el tablero actualizando las celdas correspondientes.
- **Cumple con el punto: "posicionaPieza()" del enunciado.**

## eliminarLinea()
- Verifica si alguna fila está completamente llena, la elimina y añade una nueva fila de celdas vacías en la parte superior.
- Actualiza la puntuación según las líneas eliminadas y el nivel actual.
- **Cumple con el punto: "eliminarLinea()" del enunciado.**

## actualizar()
- Controla la lógica del juego:
  - Mueve la pieza hacia abajo.
  - Verifica colisiones.
  - Genera nuevas piezas si es necesario.
  - Si una nueva pieza colisiona al generarse, finaliza el juego.
- **Cumple con el punto: "actualizar()" del enunciado.**

## jugar()
- Actualiza el estado del juego cada 500 ms.
- Borra y redibuja el tablero y las piezas.
- **Cumple con el punto: "jugar()" del enunciado.**

# Control del Juego
El control del juego se realiza mediante las siguientes teclas:
- `A`: Mover pieza a la izquierda.
- `D`: Mover pieza a la derecha.
- `S`: Bajar la pieza rápidamente.
- `W`: Rotar la pieza.

Estas funcionalidades permiten un manejo completo del juego.

# Implementaciones Extra
Se han añadido las siguientes características adicionales:

## Rotar la pieza
- Implementado con la tecla `W`.

## Sistema de puntuaciones
- Basado en un sistema de niveles con puntos progresivos.

## Incremento de dificultad
- La velocidad del juego aumenta a medida que se sube de nivel.

## Visualización de puntuación y nivel
- Se muestran en la interfaz HTML.

# Integración con HTML y CSS
El juego utiliza un archivo HTML sencillo para mostrar el tablero y la puntuación:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <title>Tetris</title>
    <style>
        canvas {
            display: block;
            margin: 0 auto;
            background: #000;
        }
        #info {
            text-align: center;
            font-family: Arial, sans-serif;
            color: white;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div id="info">
        <p>Puntuación: <span id="puntuacion">0</span></p>
        <p>Nivel: <span id="nivel">0</span></p>
    </div>
    <canvas id="tetris" width="300" height="600"></canvas>
    <script src="tetris.js"></script>
</body>
</html>
```
# Actualización de Puntuación y Nivel
En el archivo `tetris.js`, la puntuación y el nivel se actualizan dinámicamente:

```javascript
const actualizarPuntuacionYNivel = () => {
    document.getElementById("puntuacion").innerText = puntuacion;
    document.getElementById("nivel").innerText = nivel;
};
```
# Finalización del Juego
Si una nueva pieza colisiona al generarse, el juego muestra una alerta:

FIN DE LA PARTIDA, este juego ha sido desarrollado por [Tu nombre y apellidos]

y reinicia el tablero.

# Requisitos Cumplidos
Este proyecto cumple con todos los puntos del enunciado, incluyendo las funcionalidades mínimas y las implementaciones extra opcionales.
