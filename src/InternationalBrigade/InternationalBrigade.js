var VSHADER_SOURCE =
'attribute vec4 a_Position;\n' +
'uniform mat4 u_ModelMatrix;\n' +
'attribute vec4 a_Color;\n' +
'varying vec4 v_Color;\n' +
'void main() {\n' +
'   gl_Position = u_ModelMatrix * a_Position;\n' +
'   v_Color = a_Color;\n' +
'}\n';

var FSHADER_SOURCE =
'precision mediump float;\n' +
'varying vec4 v_Color;\n' +
'void main() {\n' +
'   gl_FragColor = v_Color;\n' +
'}\n';

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position'),
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix'),
    a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    var modelMatrix = new Matrix4();
    draw(gl, a_Position, u_ModelMatrix, a_Color, modelMatrix);
}

function draw(gl, a_Position, u_ModelMatrix, a_Color, modelMatrix) {
    modelMatrix.setIdentity(); // 模型矩阵初始化
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var verticesColors = new Float32Array([
        -1.0, 1.0, 0.8, 0.0, 0.0,
        -1.0, 0.33, 0.8, 0.0, 0.0,
        1.0, 1.0, 0.8, 0.0, 0.0,
        1.0, 0.33, 0.8, 0.0, 0.0
    ]);
    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(a_Color);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, verticesColors.length / 5);
    var verticesColors2 = new Float32Array([
        -1.0, 0.33, 1.0, 0.9, 0.0,
        -1.0, -0.33, 1.0, 0.9, 0.0,
        1.0, 0.33, 1.0, 0.9, 0.0,
        1.0, -0.33, 1.0, 0.9, 0.0
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors2, gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, verticesColors2.length / 5);
    var verticesColors3 = new Float32Array([
        -1.0, -0.33, 0.45, 0.0, 0.35,
        -1.0, -1.0, 0.45, 0.0, 0.35,
        1.0, -0.33, 0.45, 0.0, 0.35,
        1.0, -1.0, 0.45, 0.0, 0.35
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors3, gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, verticesColors3.length / 5);
    var verticesColors4 = new Float32Array([ // 别忘了3:2的长宽比
        -0.07698, 0.1, 0.8, 0.0, 0.0,
        0.0, -0.1, 0.8, 0.0, 0.0,
        0.07698, 0.1, 0.8, 0.0, 0.0
    ]);
    modelMatrix.setScale(0.8, 0.8, 1.0);
    modelMatrix.translate(0.0, -0.15, 0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors4, gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, verticesColors4.length / 5);
    var verticesColors5 = new Float32Array([
        -0.07698, 0.1, 0.8, 0.0, 0.0,
        0.0, 0.5, 0.8, 0.0, 0.0,
        0.07698, 0.1, 0.8, 0.0, 0.0
    ]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors5, gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, verticesColors5.length / 5);
    // 无法使剩下两个三角形通过前一个三角形旋转得到，暂时挖个坑
    var verticesColors6 = new Float32Array([
        -0.295, -0.208, 0.8, 0.0, 0.0,
        -0.07698, 0.1, 0.8, 0.0, 0.0,
        0.0, -0.1, 0.8, 0.0, 0.0
    ]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors6, gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, verticesColors6.length / 5);
    var verticesColors7 = new Float32Array([
        0.295, -0.208, 0.8, 0.0, 0.0,
        0.07698, 0.1, 0.8, 0.0, 0.0,
        0.0, -0.1, 0.8, 0.0, 0.0
    ]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors7, gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, verticesColors7.length / 5);
}
