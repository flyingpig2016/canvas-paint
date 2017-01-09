# 用canvas API制作的画图工具
这是一个用JavaScript和php写的画图工具,效果如下所示：
![](https://github.com/flyingpig2016/canvas-paint/blob/master/imgs/1.gif)

###canvas画图制作思路：
- 确定每个事件的用法；
- 在画一笔画的时候保存之前的所有坐标点；
- 在画每一笔画的时候先清除画布，然后遍历所有存储的坐标点；
- 简化代码
