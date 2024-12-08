document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const startInput = document.getElementById("start");
    const endInput = document.getElementById("end");
    const findPathButton = document.getElementById("findPath");
    const output = document.getElementById("pathOutput");
    const size = 10;

    function createBoard() {
        for (let row = 0; row <= size + 1; row++) {
            for (let col = 0; col <= size + 1; col++) {
                const cell = document.createElement("div");

                if (
                    (row === 0 && col === 0) || 
                    (row === 0 && col === size + 1) || 
                    (row === size + 1 && col === 0) || 
                    (row === size + 1 && col === size + 1)
                ) {
                    cell.className = "cell empty";
                } else if (row === 0 && col <= size) {
                    cell.className = "cell header";
                    cell.textContent = col;
                } else if (col === 0 && row <= size) {
                    cell.className = "cell header";
                    cell.textContent = row;
                } else if (row <= size && col === size + 1) {
                    cell.className = "cell arrow";
                    cell.textContent = row % 2 === 1 ? "→" : "←";
                } else if (col <= size && row === size + 1) {
                    cell.className = "cell arrow";
                    cell.textContent = col % 2 === 1 ? "↓" : "↑";
                } else {
                    cell.className = "cell coordinate";
                    cell.dataset.coordinate = `${row},${col}`;
                }

                board.appendChild(cell);
            }
        }
    }

    function toIndex(coordinate) {
        const regex = /^(\d+),(\d+)$/;
        const match = coordinate.match(regex);

        if (!match) {
            showError("Ingrese una coordenada válida");
            return null;
        }

        const row = parseInt(match[1], 10);
        const col = parseInt(match[2], 10);

        if (row < 1 || row > size || col < 1 || col > size) {
            showError("Las coordenadas están fuera de límite");
            return null;
        }

        return { row, col };
    }

    function showError(message) {
        output.textContent = message;
        output.style.color = "red";
    }

    function bfs(start, end) {
        const queue = [[start]];
        const visited = new Set();
        visited.add(`${start.row},${start.col}`);

        while (queue.length > 0) {
            const path = queue.shift();
            const { row, col } = path[path.length - 1];

            if (row === end.row && col === end.col) {
                return path;
            }

            const moves = [];
            if (row % 2 === 1) moves.push([0, 1]); 
            else moves.push([0, -1]);

            if (col % 2 === 1) moves.push([1, 0]); 
            else moves.push([-1, 0]); 

            for (const [dRow, dCol] of moves) {
                const newRow = row + dRow;
                const newCol = col + dCol;

                if (
                    newRow >= 1 && newRow <= size &&
                    newCol >= 1 && newCol <= size &&
                    !visited.has(`${newRow},${newCol}`) 
                ) {
                    visited.add(`${newRow},${newCol}`); 
                    queue.push([...path, { row: newRow, col: newCol }]);
                }
            }
        }

        return [];
    }

    function highlightPath(path) {
        document.querySelectorAll(".cell.coordinate").forEach(cell => 
            cell.classList.remove("path")
        );

        path.forEach(({ row, col }) => {
            const cell = document.querySelector(`[data-coordinate="${row},${col}"]`); // Corregido
            if (cell) cell.classList.add("path");
        });
    }

    function showPath(path) {
        if (path.length === 0) {
            showError("No hay camino para la ruta.");
        } else {
            const instructions = path.map(({ row, col }) => `(${row},${col})`).join(" → ");
            output.textContent = `Ruta: ${instructions}`;
            output.style.color = "#2c3e50";
        }
    }

    findPathButton.addEventListener("click", () => {
        const start = toIndex(startInput.value);
        const end = toIndex(endInput.value);

        if (!start || !end) return;

        const path = bfs(start, end);
        highlightPath(path);
        showPath(path);
    });

    createBoard();
});
