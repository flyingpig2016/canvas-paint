var canvas = document.getElementById('canvas');
var cxt = canvas.getContext('2d');
//保存图像
var saveimg = document.getElementById('saveimg');
var clearimg = document.getElementById('clearimg');
//工具标签
var Brush = document.getElementById('means_brush');
var Eraser = document.getElementById('means_eraser');
var Paint = document.getElementById('means_paint');
var Straw = document.getElementById('means_straw');
var text = document.getElementById('means_text');
var Magnifier = document.getElementById('means_magnifier');
//形状标签
var line = document.getElementById('means_line');
var arc = document.getElementById('means_arc');
var rect = document.getElementById('means_rect');
var poly = document.getElementById('means_poly');
var arcfill = document.getElementById('means_arcfill');
var rectfill = document.getElementById('means_rectfill');
var actions = [Brush, Eraser, Paint, Straw, text, Magnifier, line, arc, rect, poly, arcfill, rectfill];
//线宽
var line_1 = document.getElementById('width_1');
var line_3 = document.getElementById('width_3');
var line_5 = document.getElementById('width_5');
var line_7 = document.getElementById('width_7');
var widthLine = [line_1, line_3, line_5, line_7];
//颜色
var redColor = document.getElementById('red');
var greenColor = document.getElementById('green');
var blueColor = document.getElementById('blue');
var yellowColor = document.getElementById('yellow');
var whiteColor = document.getElementById('white');
var blackColor = document.getElementById('black');
var pinkColor = document.getElementById('pink');
var purpleColor = document.getElementById('purple');
var cyanColor = document.getElementById('cyan');
var orangeColor = document.getElementById('orange');
var colors = [redColor, greenColor, blueColor, yellowColor, whiteColor, blackColor, pinkColor, purpleColor, cyanColor, orangeColor];
//设置默认状态
var curTool = 0,
	curColor = 'black',
	curLineWidth = '1'; //声明当前的工具,颜色和线宽
drawImg(curTool, curLineWidth, curColor);
var accord = []; //accord数组保存笔触到达的信息和使用的画笔信息
//保存函数
//data协议:
//data : 资源类型; 编码,内容
saveimg.addEventListener('click', function () {
	var imgdata = canvas.toDataURL();
	var b64 = imgdata.substring(22);
	var myform = document.getElementById('myform');
	var data = document.getElementById('imgsave');
	data.value = b64;
	myform.submit();
	}, false)
	//清空画板
clearimg.addEventListener('click', function () {
		cxt.clearRect(0, 0, 880, 400);
	}, false)
	//工具函数===================================
for (var i = 0; i < actions.length; i++) {
	actions[i].index = i;
	actions[i].onclick = function (e) {
		for (var i = 0; i < actions.length; i++) {
			if (i === this.index) {
				actions[i].style.background = "yellow";
			} else {
				actions[i].style.background = "#ccc";
			}
		}
		curTool = this.index;
		drawImg(curTool, curLineWidth, curColor); //调用画图工具
	}
}
//放大镜,默认100%
Magnifier.addEventListener('click',function(){
	var scale = window.prompt('请输入要放大的百分比：', 100);
	scale = scale === null ? 100 : scale;
	canvas.style.width = parseInt(880 * scale / 100) + 'px';
	canvas.style.height = parseInt(400 * scale / 100) + 'px';
},false);

//遍历线宽函数===================================
for (var i = 0; i < widthLine.length; i++) {
	widthLine[i].index = i;
	widthLine[i].onclick = function () {
		//		selectLine(widthLine,this);
		for (var i = 0; i < widthLine.length; i++) {
			if (i === this.index) {
				widthLine[i].style.background = "yellow";
			} else {
				widthLine[i].style.background = "#ccc";
			}
		}
		curLineWidth = 2 * this.index + 1;
		drawImg(curTool, curLineWidth, curColor); //调用画图工具

	}
}
//遍历颜色函数=========================================
for (var i = 0; i < colors.length; i++) {
	colors[i].index = i;
	colors[i].onclick = function (e) {
		for (var i = 0; i < colors.length; i++) {
			if (i === this.index) {
				colors[i].style.border = '3px solid crimson ';
			} else {
				colors[i].style.border = '3px solid #fff ';
			}
		}
		curColor = this.id;
		drawImg(curTool, curLineWidth, curColor); //调用画图工具
	}
}
//每种画图方法封装=============================================
var draw = {
		'drawLine': function (startX, startY, moveX, moveY, lineWidths, col) {
			cxt.save();
			cxt.beginPath();
			cxt.moveTo(startX, startY);
			cxt.lineTo(moveX, moveY);
			cxt.closePath();
			cxt.lineWidth = lineWidths;
			cxt.strokeStyle = col;
			cxt.stroke();
			cxt.restore();
		},
		'drawCircle': function (startX, startY, moveX, moveY, lineWidths, col) {
			cxt.save();
			cxt.beginPath();
			var a = moveX - startX;
			var b = moveY - startY;
			var c = Math.sqrt(a * a + b * b);
			cxt.arc(startX, startY, c, 0, 2 * Math.PI, false);
			cxt.closePath();
			cxt.lineWidth = lineWidths;
			cxt.strokeStyle = col;
			cxt.stroke();
			cxt.restore();
		},
		'fillCircle': function (startX, startY, moveX, moveY, lineWidths, col) {
			cxt.save();
			cxt.beginPath();
			var a = moveX - startX;
			var b = moveY - startY;
			var c = Math.sqrt(a * a + b * b);
			cxt.arc(startX, startY, c, 0, 2 * Math.PI, false);
			cxt.closePath();
			cxt.lineWidth = lineWidths;
			cxt.fillStyle = col;
			cxt.fill();
			cxt.restore();
		},
		'drawRect': function (startX, startY, moveX, moveY, lineWidths, col) {
			cxt.save();
			cxt.lineWidth = lineWidths;
			cxt.strokeStyle = col;
			var a = Math.abs(moveX - startX);
			var b = Math.abs(moveY - startY);
			if (moveX > startX && moveY > startY) {
				cxt.strokeRect(startX, startY, a, b);
			} else if (moveX > startX && moveY < startY) {
				cxt.strokeRect(startX, startY - b, a, b);
			} else if (moveX < startX && moveY < startY) {
				cxt.strokeRect(moveX, moveY, a, b);
			} else {
				cxt.strokeRect(moveX, moveY - b, a, b);
			}
			cxt.restore();
		},
		'fillRect': function (startX, startY, moveX, moveY, lineWidths, col) {
			cxt.save();
			cxt.lineWidth = lineWidths;
			cxt.fillStyle = col;
			var a = Math.abs(moveX - startX);
			var b = Math.abs(moveY - startY);
			if (moveX > startX && moveY > startY) {
				cxt.fillRect(startX, startY, a, b);
			} else if (moveX > startX && moveY < startY) {
				cxt.fillRect(startX, startY - b, a, b);
			} else if (moveX < startX && moveY < startY) {
				cxt.fillRect(moveX, moveY, a, b);
			} else {
				cxt.fillRect(moveX, moveY - b, a, b);
			}
			cxt.restore();
		},
		'drawTriangle': function (startX, startY, moveX, moveY, lineWidths, col) {
			cxt.save();
			cxt.beginPath();
			if (moveX > startX && moveY > startY) {
				cxt.moveTo(startX, startY);
				cxt.lineTo(moveX, moveY);
				cxt.lineTo(2 * startX - moveX, moveY);
			} else if (moveX < startX && moveY > startY) {
				cxt.moveTo(startX, startY);
				cxt.lineTo(moveX, moveY);
				cxt.lineTo(2 * startX - moveX, moveY);
			} else if (moveX > startX && moveY < startY) {
				cxt.moveTo(startX, startY);
				cxt.lineTo(moveX, moveY);
				cxt.lineTo(2 * moveX - startX, startY);
			} else {
				cxt.moveTo(startX, startY);
				cxt.lineTo(moveX, moveY);
				cxt.lineTo(2 * moveX - startX, startY);
			}
			cxt.closePath();
			cxt.lineWidth = lineWidths;
			cxt.strokeStyle = col;
			cxt.stroke();
			cxt.restore();
		},
		'drawText': function (startX, startY, col, text) {
			cxt.save();
			cxt.font = "bold 14px Arial";
			cxt.textAlign = 'center';
			cxt.textBaseline = 'middle';
			cxt.fillStyle = col;
			cxt.fillText(text, startX, startY);
			cxt.restore();
		}
	}
	//画图函数设置================================
var accord = []; //存储全局的图像
//根据存储的点重新画线
function againDraw(storData) {
	for (var i = 0; i < storData.length; i++) {
		switch (storData[i].type) {
		case 0:
			cxt.save();
			cxt.beginPath();
			cxt.moveTo(storData[i].down[0], storData[i].down[1]);
			for (var j = 0; j < storData[i].move.length; j++) {
				cxt.lineTo(storData[i].move[j][0], storData[i].move[j][1]);
			}
			cxt.lineWidth = storData[i].line;
			cxt.strokeStyle = storData[i].colors;
			cxt.stroke();
			cxt.restore();
			break;
		case 1:
			cxt.save();
			cxt.beginPath();
			cxt.moveTo(storData[i].down[0], storData[i].down[1]);
			for (var j = 0; j < storData[i].move.length; j++) {
				cxt.lineTo(storData[i].move[j][0], storData[i].move[j][1]);
			}
			cxt.lineWidth = storData[i].line;
			cxt.strokeStyle = '#fff';
			cxt.stroke();
			cxt.restore();
			break;
		case 2:
			cxt.fillStyle = storData[i].colors;
			cxt.fillRect(0, 0, 880, 400);
		case 4:
			draw.drawText(storData[i].down[0], storData[i].down[1], storData[i].colors, storData[i].text[0]);
			break;
		case 6:
			draw.drawLine(storData[i].down[0], storData[i].down[1], storData[i].up[0], storData[i].up[1], storData[i].line, storData[i].colors);
			break;
		case 7:
			draw.drawCircle(storData[i].down[0], storData[i].down[1], storData[i].up[0], storData[i].up[1], storData[i].line, storData[i].colors);
			break;
		case 8:
			draw.drawRect(storData[i].down[0], storData[i].down[1], storData[i].up[0], storData[i].up[1], storData[i].line, storData[i].colors);
			break;
		case 9:
			draw.drawTriangle(storData[i].down[0], storData[i].down[1], storData[i].up[0], storData[i].up[1], storData[i].line, storData[i].colors);
			break;
		case 10:
			draw.fillCircle(storData[i].down[0], storData[i].down[1], storData[i].up[0], storData[i].up[1], storData[i].line, storData[i].colors);
			break;
		case 11:
			draw.fillRect(storData[i].down[0], storData[i].down[1], storData[i].up[0], storData[i].up[1], storData[i].line, storData[i].colors);
			break;
		}
	}
}
//确定画图的工具线宽和颜色
function drawImg(tools, lineWidths, col) {
	var startX, startY, //鼠标键按下的位置
		moveX, moveY, //鼠标移动到的位置
		upX, upY; //结束位置
	var temp = { //存存储某一次鼠标点击到释放的坐标
		'type': tools,
		'line': lineWidths,
		'colors': col,
		'down': [],
		'move': [],
		'up': [],
		'text': []
	};
	flag = 0; //标志位
	canvas.onmousedown = function (e) {
		e = window.event || e;
		flag = 1;
		startX = e.pageX - this.offsetLeft;
		startY = e.pageY - this.offsetTop;
		temp.down.push(startX, startY);
		switch (tools) {
		case 0:
			cxt.save();
			cxt.beginPath();
			cxt.moveTo(startX, startY);
			break;
		case 1:
			cxt.save();
			cxt.beginPath();
			cxt.moveTo(startX, startY);
			break;
		case 2: //喷漆
			cxt.fillStyle = col;
			cxt.fillRect(0, 0, 880, 400);
			break;
		case 3:
			var obj = cxt.getImageData(moveX, moveX, 1, 1); //吸管
			alert('色值为：rgba(' + obj.data + ')');
			break;
		}
	}
	canvas.onmousemove = function (e) {
		e = window.event || e;
		moveX = e.pageX - this.offsetLeft;
		moveY = e.pageY - this.offsetTop;
		if (flag) {
			temp.move.push([moveX, moveY]);
			switch (tools) {
			case 0: //画笔
				cxt.lineTo(moveX, moveY);
				cxt.lineWidth = lineWidths;
				cxt.strokeStyle = col;
				cxt.stroke();
				cxt.restore();
				break;
			case 1: //橡皮
				cxt.lineTo(moveX, moveY);
				cxt.lineWidth = lineWidths;
				cxt.strokeStyle = "#fff";
				cxt.stroke();
				cxt.restore();
				break;
			case 6: //直线
				cxt.clearRect(0, 0, 880, 400);
				againDraw(accord);
				draw.drawLine(startX, startY, moveX, moveY, lineWidths, col);
				break;
			case 7: //路径圆
				cxt.clearRect(0, 0, 880, 400);
				againDraw(accord);
				draw.drawCircle(startX, startY, moveX, moveY, lineWidths, col);
				break;
			case 8: //路径长方形
				cxt.clearRect(0, 0, 880, 400);
				againDraw(accord);
				draw.drawRect(startX, startY, moveX, moveY, lineWidths, col);
				break;
			case 9: //路径三角形
				cxt.clearRect(0, 0, 880, 400);
				againDraw(accord);
				draw.drawTriangle(startX, startY, moveX, moveY, lineWidths, col);
				break;
			case 10: //填充圆
				cxt.clearRect(0, 0, 880, 400);
				againDraw(accord);
				draw.fillCircle(startX, startY, moveX, moveY, lineWidths, col);
				break;
			case 11: //填充矩形
				cxt.clearRect(0, 0, 880, 400);
				againDraw(accord);
				draw.fillRect(startX, startY, moveX, moveY, lineWidths, col);
				break;
			}
		}
	}
	canvas.onmouseup = function () {
			e = window.event || e;
			flag = 0;
			upX = e.pageX - this.offsetLeft;
			upY = e.pageY - this.offsetTop;
			temp.up.push(upX, upY);
			if (tools === 4) {
				var textValue = window.prompt('请在这里输入文字');
				textValue = textValue === null ? '' : textValue;
				temp.text.push(textValue);
				draw.drawText(startX, startY, col, textValue);
			}
			accord.push(temp);
			temp = { //存存储某一次鼠标点击到释放的坐标
				'type': tools,
				'line': lineWidths,
				'colors': col,
				'down': [],
				'move': [],
				'up': [],
				'text': []
			};
		}
		//再次进入画布，鼠标左键没有松开的时候，不会和上次连接
	canvas.onmouseout = function (e) {
		flag = 0;
	}
}