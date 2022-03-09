// 平移矩阵             旋转矩阵                      缩放矩阵
// x'   1 0 0 Tx   x    x'   cosB -sinB  0  0   x    x'   Sx 0 0 0   x
// y' = 0 1 0 Ty * y    y' = sinB  cosB  0  0 * y    y' = 0 Sy 0 0 * y
// z'   0 0 1 Tz   z    z'      0     0  1  0   z    z'   0 0 Sz 0   z
// 1    0 0 0  1   1    1       0     0  0  1   1    1    0 0 0  1   1
var VSHADER_SOURCE =
'attribute vec4 a_Position;\n' +
'uniform mat4 u_xformMatrix;\n' +
'uniform mat4 u_xformMatrix2;\n' +
'uniform mat4 u_xformMatrix3;\n' +
'void main() {\n' +
'   gl_Position = u_xformMatrix3 * (u_xformMatrix2 * (u_xformMatrix * a_Position));\n' +
'}\n'; // 注意运算顺序

var FSHADER_SOURCE =
'void main() {\n' +
'   gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);\n' +
'}\n';

var Tx = 0.0, Ty = 0.25, Tz = 0.0; // 平移距离
var ANGLE = 180.0; // 旋转角度
var Sx = 1.75, Sy = 1.0, Sz = 1.0; // 缩放比例

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

    var n = initVertexBuffers(gl);

    var radian = ANGLE * Math.PI / 180.0;
    var cosB = Math.cos(radian);
    var sinB = Math.sin(radian);
    // WebGL内矩阵是列主序的！！！
    // 平移矩阵
    var xformMatrix = new Float32Array([
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        Tx, Ty, Tz, 1.0
    ]);
    var u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
    gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
    // 旋转矩阵
    var xformMatrix2 = new Float32Array([
        cosB, sinB, 0.0, 0.0,
        -sinB, cosB, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
    ]);
    var u_xformMatrix2 = gl.getUniformLocation(gl.program, 'u_xformMatrix2');
    gl.uniformMatrix4fv(u_xformMatrix2, false, xformMatrix2);
    // 缩放矩阵
    var xformMatrix3 = new Float32Array([
        Sx, 0.0, 0.0, 0.0,
        0.0, Sy, 0.0, 0.0,
        0.0, 0.0, Sz, 0.0,
        0.0, 0.0, 0.0, 1.0
    ])
    var u_xformMartrix3 = gl.getUniformLocation(gl.program, 'u_xformMatrix3');
    gl.uniformMatrix4fv(u_xformMartrix3, false, xformMatrix3);

    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

function initVertexBuffers(gl) { // 创建顶点缓冲区
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var vertices = new Float32Array([
        -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    return vertices.length / 2;
}
