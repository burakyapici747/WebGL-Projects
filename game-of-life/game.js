let canvas = document.getElementById("canvas");
let gl = canvas.getContext("webgl");

let canvasWidth = canvas.clientWidth;
let canvasHeight = canvas.clientHeight;

let vertexShaderSource = document.getElementById("vertex-shader").textContent;
let fragmentShaderSource = document.getElementById("fragment-shader").textContent;
let gridSizeX = Math.floor(canvasWidth / gameSettings.canvasSettings.resolution);
let gridSizeY = Math.floor(canvasHeight / gameSettings.canvasSettings.resolution);
let squareSize = gameSettings.canvasSettings.canvasWidth / gridSizeX
let grid = createGrid(gridSizeX, gridSizeY);
fillRandomCellToGrid(grid);

function main(gameSettings){
    let vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    let program = createProgram(gl, vertexShader, fragmentShader);

    let positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    let resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    resizeCanvasToDisplaySize(gl.canvas);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    let indices = [
        0,1,2,
        2,1,3,
    ];

    let indexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(positionAttributeLocation);

    let size = 2;
    let type = gl.FLOAT;
    let normalize = false;
    let stride = 0;
    let offset = 0;
    gl.vertexAttribPointer(
        positionAttributeLocation,
        size,
        type,
        normalize,
        stride,
        offset,
    );

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);


    setInterval(function(){
        draw(indices);
    }, gameSettings.canvasSettings.refreshTime);
}

function draw(indices){
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function compileShader(gl, shaderType, shaderSource){
    let shader = gl.createShader(shaderType);

    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(!success){
        throw "Could not compile shader" + gl.getShaderInfoLog(shader);
    }

    return shader;
}

function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function resizeCanvasToDisplaySize(canvas) {
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    const needResize = canvas.width  !== displayWidth ||
        canvas.height !== displayHeight;

    if (needResize) {
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
    }

    return needResize;
}

function createProgram(gl, vertexShader, fragmentShader){
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(!success){
        throw "Program failed to link" + gl.getProgramInfoLog(program);
    }

    return program;
}

function createSquare(gl, x, y, width, height){
    let x1 = x;
    let x2 = x + width;
    let y1 = y;
    let y2 = y + height;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1, //Vertex 0
        x2, y1, //Vertex 1
        x1, y2, //Vertex 2
        x2, y2, //Vertex 3
    ]), gl.STATIC_DRAW);
}
main(gameSettings);



function createGrid(gridSizeX, gridSizeY) {
    return new Array(gridSizeX).fill(null).map(() => new Array(gridSizeY).fill(0));
}

function fillRandomCellToGrid(grid) {
    for (let column = 0; column < grid.length; column++) {
        for (let row = 0; row < grid[column].length; row++) {
            grid[column][row] = Math.floor(Math.random() * 2);
        }
    }
}

function drawCells(grid) {
    for (let column = 0; column < grid.length; column++) {
        for (let row = 0; row < grid[column].length; row++) {
            if (grid[column][row] == 1) {
                createSquare(gl,column * squareSize, row * squareSize, squareSize, squareSize)
                gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
            }
        }
    }
}

function sumNeighbors(grid, column, row) {
    let sum = 0;
    let tempColumn = column, tempRow = row;
    let cellDirections = {
        topLeft: [-1, -1],
        top: [0, -1],
        topRight: [1, -1],
        right: [1, 0],
        bottomRight: [1, 1],
        bottom: [0, 1],
        bottomLeft: [-1, 1],
        left: [-1, 0],
    };
    for (let [key] of Object.entries(cellDirections)) {
        column = tempColumn;
        row = tempRow;
        if (column + cellDirections[key][0] < 0) {
            column = grid.length - 1;
        } else if (column + cellDirections[key][0] > grid.length - 1) {
            column = 0;
        } else if (row + cellDirections[key][1] < 0) {
            row = grid.length - 1;
        } else if (row + cellDirections[key][1] > grid.length - 1) {
            row = 0;
        }
        if (grid[column + cellDirections[key][0]][row + cellDirections[key][1]] == 1) {
            sum++;
        }
    }
    return sum;
}


function killCell(newGenerationArr, column, row) {
    newGenerationArr[column][row] = 0;
}

function reviveCell(grid, column, row) {
    grid[column][row] = 1;
}

function createNewGenerationArr(grid) {
    let newGenerationArr = new Array(grid.length).fill(null)
        .map(() => new Array(grid.length).fill(0));
    for (let column = 0; column < grid.length; column++) {
        for (let row = 0; row < grid[column].length; row++) {
            newGenerationArr[column][row] = grid[column][row];
        }
    }
    return newGenerationArr;
}

function fillGridWithNewGenerationArr(grid, newGenerationArr) {
    for (let column = 0; column < newGenerationArr.length; column++) {
        for (let row = 0; row < newGenerationArr[column].length; row++) {
            grid[column][row] = newGenerationArr[column][row];
        }
    }
    return grid;
}

function nextGeneration(grid) {
    let newGenerationArr = createNewGenerationArr(grid);
    for (let column = 0; column < grid.length; column++) {
        for (let row = 0; row < grid[column].length; row++) {
            if (grid[column][row] == 1 && sumNeighbors(grid, column, row) < 2) {
                killCell(newGenerationArr, column, row);
            } else if (grid[column][row] == 1 && sumNeighbors(grid, column, row) > 3) {
                killCell(newGenerationArr, column, row);
            } else if (grid[column][row] == 1 && (sumNeighbors(grid, column, row) == 2 || sumNeighbors(grid, column, row) == 3)) {
                reviveCell(newGenerationArr, column, row);
            } else if (grid[column][row] == 0 && sumNeighbors(grid, column, row) == 3) {
                reviveCell(newGenerationArr, column, row);
            }
        }
    }
    grid = fillGridWithNewGenerationArr(grid, newGenerationArr);
    drawCells(newGenerationArr);
}

setInterval(function() {
    nextGeneration(grid);
}, gameSettings.canvasSettings.refreshTime);