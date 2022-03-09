var VSHADER_SOURCE =
'attribute vec4 a_Position;\n' +
'uniform mat4 u_ModelMatrix;\n' + // 模型矩阵
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
// 旋转速度
var ANGLE_STEP = 60.0;

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

    var n = initVertexBuffers(gl);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    var currentAngle = 0.0;
    var modelMatrix = new Matrix4();
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    var tick = function() {
        currentAngle = animate(currentAngle);
        draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
        requestAnimationFrame(tick); // 反复调用函数
    };
    tick();
}

function initVertexBuffers(gl) {
    var vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    var verticesColors = new Float32Array([
        0.5, 0.88, 1.0, 0.0, 0.0,
        1.0, 0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 0.0, 1.0
    ])
    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
    gl.enableVertexAttribArray(a_Position);
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(a_Color);
    return verticesColors.length / 5;
}

var g_last = Date.now();
function animate(angle) { // 更新角度
    var now = Date.now();
    var elapsed = now - g_last;
    g_last = now;
    var newAngle = (angle + (ANGLE_STEP * elapsed) / 1000.0) % 360;
    return newAngle;
}

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
    modelMatrix.setRotate(currentAngle, 0, 0, 1);
    modelMatrix.scale(0.75, 0.75, 0.75);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}
