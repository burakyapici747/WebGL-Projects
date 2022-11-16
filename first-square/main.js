function main(){
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl");

    if(gl === null){
        alert("Unable to initialize WebGL.Your browser or machine may not support it.");
        return;
    }
    let vertices = [
        -0.5, -0.5, //indices 0
        0.5, 0.5,   //indices 1
        -0.5, 0.5,  //indices 2
        0.5, -0.5,  //indices 3
    ];

    let indices = [
        0,1,2, // Triangle 1
        0,3,1  // Triangle 2
    ];

    let vertexShaderCode = document.getElementById("vertex-shader").textContent;
    let fragmentShaderCode = document.getElementById("fragment-shader").textContent;
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);

    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderCode);
    gl.compileShader(fragmentShader);

    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    let position = gl.getAttribLocation(shaderProgram, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);


    gl.useProgram(shaderProgram);

    gl.clearColor(0.73, 0.85, 0.8, 1.0);
    gl.clearDepth(1.0)
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

}
window.onload = main;
