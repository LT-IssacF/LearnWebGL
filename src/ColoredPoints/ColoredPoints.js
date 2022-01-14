// 顶点着色器
var VSHADER_SOURCE =
'attribute vec4 a_Position;\n' +
'attribute float a_PointSize;\n' +
'void main() {\n' +
'   gl_Position = a_Position;\n' +
'   gl_PointSize = a_PointSize;\n' +
'   }\n';
// 片元着色器
var FSHADER_SOURCE =
'precision mediump float;\n' +
'uniform vec4 u_FragColor;\n' +
'void main() {\n' +
 '   gl_FragColor = u_FragColor;\n' +
'   }\n';

function main() {
    // 获取<canvas>元素
    var canvas = document.getElementById('webgl');
    // 获取WebGL绘图背景
    var gl = getWebGLContext(canvas);
    // 初始化着色器
    initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    // 获取两个attribute变量的储存位置
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    // 将点的位置传送到对应的attribute变量中
    gl.vertexAttrib1f(a_PointSize, 10.0);
    // 获取uniform变量的储存位置
    var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    // 注册鼠标点击响应事件函数
    canvas.onmousedown = function(ev) {
        click(ev, gl, canvas, a_Position, u_FragColor);
    };
    // 指定缓冲区背景色
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // 清空缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT);
}
// 全局变量
var g_points = []; // 点的位置数组
var g_colors = []; // 点的颜色数组
function click(ev, gl, canvas, a_Position, u_FragColor) {
    // 点的x、y坐标，初始为浏览器客户区中的坐标
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();
    // 需经转换后才能用在WebGL坐标系统中
    x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
    y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
    g_points.push([x, y]);
    // 根据点在绘图区域不同的位置决定点的颜色
    if( x >= 0.0 && y >= 0.0 ) { // 第一象限
        g_colors.push([1.0, 0.0, 0.0, 1.0]);
    } else if(x > 0.0 && y < 0.0) { // 第二象限
        g_colors.push([0.0, 1.0, 0.0, 1.0]);
    } else if(x < 0.0 && y < 0.0) { // 第三象限
        g_colors.push([0.0, 0.0, 1.0, 1.0]);
    } else { // 第四象限
        g_colors.push([1.0, 1.0, 1.0, 1.0]);
    }
    // 清空缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT);
    // 每处理一次响应鼠标点击事件，都会进行重新绘图，绘制之前所有的响应事件和本次响应事件
    var len = g_points.length;
    for(var i = 0; i < len; i++) {
        // 将点的位置传送到对应的attribute变量中
        gl.vertexAttrib4f(a_Position, g_points[i][0], g_points[i][1], 0.0, 1.0);
        // 将点的颜色传送到对应的uniform变量中
        gl.uniform4f(u_FragColor, g_colors[i][0], g_colors[i][1], g_colors[i][2], g_colors[i][3]);
        // 绘制点
        gl.drawArrays(gl.POINTS, 0, 1);
    }
}
