var VSHADER_SOURCE = // 顶点着色器
'attribute vec4 a_Position;\n' +
'uniform mat4 u_ModelMatrix;\n' +
'attribute vec4 a_Color;\n' +
'varying vec4 v_Color;\n' +
'void main() {\n' +
'   gl_Position = u_ModelMatrix * a_Position;\n' + // 最终坐标 = 模型变换矩阵 * 坐标向量
'   v_Color = a_Color;\n' + // 将颜色数据从顶点着色器传送到片元着色器中
'}\n';

var FSHADER_SOURCE = // 片元着色器
'precision mediump float;\n' +
'varying vec4 v_Color;\n' +
'void main() {\n' +
'   gl_FragColor = v_Color;\n' +
'}\n';

function main() {
    var canvas = document.getElementById('webgl');
    var gl = getWebGLContext(canvas);
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

    var n = initVertexBuffers(gl);

    var currentAngle = 0.0;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    var tick = function() {
        currentAngle = animate(currentAngle);
        draw(gl, currentAngle, n);
        requestAnimationFrame(tick); // 在函数末尾再次调用自己
    }
    tick(); // 主函数内只调用一次
}

function initVertexBuffers(gl) {
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var verticesColors = new Float32Array([
        -0.577, -0.333, 1.0, 0.0, 0.0,
        0.0, 0.667, 0.0, 1.0, 0.0,
        0.577, -0.333, 0.0, 0.0, 1.0
    ]); // (坐标分量 * 2, 颜色分量 * 3)
    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position'); // 获取着色器中attribute变量地址
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0); // 传送数据
    gl.enableVertexAttribArray(a_Position); // 开启变量
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(a_Color);
    return verticesColors.length / 5; // 绘制三个点
}

var ANGLE_STEP = 60.0; // 60度/s
var g_last = Date.now();
function animate(angle) { // 获取旋转角度
    var now = Date.now();
    var elapsed = now - g_last; // 时间间隔,单位ms
    g_last = now;
    angle += ANGLE_STEP * elapsed / 1000.0; // 新角度 = 旧角度 + 旋转角度
    return angle % 360; // 对结果取余
}

function draw(gl, angle, n) {
    var modelMatrix = new Matrix4(); // 模型矩阵
    modelMatrix.setRotate(angle, 1, 1, 1);
    modelMatrix.scale(0.75, 0.75, 0.75);
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix'); // 获取着色器中uniform变量的地址
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements); // 传送数据
    gl.clear(gl.COLOR_BUFFER_BIT); // 重置背景
    gl.drawArrays(gl.TRIANGLES, 0, n); // 画图
}
