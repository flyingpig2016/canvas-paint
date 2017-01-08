<?php
	//声明文件的类型， 
	header('Content-type : image/png');
	//文件的相关描述
	header('Content-Disposition : attachment; filename="canvas.png"');
	//文件的内容
	echo base64_decode($_POST['dataImg']);
	
?>