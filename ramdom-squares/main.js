let canvas = document.getElementById("canvas");
let gl = canvas.getContext("webgl");

let vertexShaderSource = document.getElementById("vertex-shader").textContent;
let fragmentShaderSource = document.getElementById("fragment-shader").textContent;

function main(){
    let vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    let program = createProgram(gl, vertexShader, fragmentShader);

    let positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    let resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    let colorUniformLocation = gl.getUniformLocation(program, 'u_color');

    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    resizeCanvasToDisplaySize(gl.canvas);

    gl.clearColor(0.73, 0.85, 0.8, 1.0);
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
        draw(colorUniformLocation, indices);
    },1);
}

function draw(colorUniformLocation, indices){
    gl.clearColor(0.73, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    for(let i = 1; i <= 5000; i++){
        let randomSize = randomInt(10,50);
        createSquare(gl, randomInt(0, 500 - randomSize), randomInt(0, 500 - randomSize), randomSize, randomSize);

        gl.uniform4f(colorUniformLocation, 2., Math.random(), Math.random(), 1);

        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
    }
}


function compileShader(gl, shaderType, shaderSource){
    let shader = gl.createShader(shaderType);

    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(!success){
        throw  `Shader derlenirken bir hata oluştu ${gl.getShaderInfoLog(shader)}`;
    }

    return shader;
}

function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function resizeCanvasToDisplaySize(canvas) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Check if the canvas is not the same size.
    const needResize = canvas.width  !== displayWidth ||
        canvas.height !== displayHeight;

    if (needResize) {
        // Make the canvas the same size
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
main();
