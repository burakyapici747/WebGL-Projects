let canvas = document.getElementById("canvas");
let gl = canvas.getContext("webgl");

let vertexShaderSource = document.getElementById("vertex-shader").textContent;
let fragmentShaderSource = document.getElementById("fragment-shader").textContent;

let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

let program = createProgram(gl, vertexShader, fragmentShader);

let positionsLocation = gl.getAttribLocation(program, 'position');;

let vertexPositions = new Float32Array([
    0.0, 0.5,
    -0.5, -0.5,
    0.5, -0.5,
]);

let positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexPositions, gl.STATIC_DRAW);

let vertexColors = new Uint8Array([
    255, 0, 0, 255,
    0, 255, 0, 255,
    0, 0, 255, 255,
]);

gl.enableVertexAttribArray(positionsLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(
    positionsLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0,
);

gl.clearColor(0.75, 0.85, 0.8, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

gl.useProgram(program);

gl.drawArrays(gl.TRIANGLES, 0, 3);

function checkShaderStatus(gl, shader, type){
    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        console.log(`Shader derlenemedi bir hata var ${type} \n${gl.getShaderInfoLog(shader)}`);
    }
}

function createShader(gl, type, source){
   let shader = gl.createShader(type);
   gl.shaderSource(shader, source);
   gl.compileShader(shader);
   checkShaderStatus(gl, shader, type);

   return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    return program;
}