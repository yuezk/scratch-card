刮刮卡
=====

移动端的刮刮卡效果，兼容Android, iOS, 以及WP8。支持多点触控（WP8除外）。

截图
===

<img src="http://s1.imgs.cc/img/PEwj92b.jpg" alt="刮刮卡效果截图" width="320">

如何使用
=======

`ScratchCard(canvasId, [options])`
------------------------------

`canvasId`: `canvas`元素的`id`

`options`: 可选，一些配置参数

代码示例
-------

```html
<!-- 可选，用来优化高分屏的显示效果 -->
<script src="path/to/hidpi-canvas.min.js"></script>

<script src="scratch-card.js"></script>
<script>
  var card = new ScratchCard('canvas');
</script>
```

配置选项
=======

options#width
-------------

options#height
-------------

options#background
----------
刮刮卡涂层的填充色，默认是`null`，格式同CSS中颜色的格式。

options#text
----------
刮刮卡上的文字，默认是`刮开此涂层`

options#font
------------
刮刮卡文字的字体

options#color
-----------
刮刮卡字体颜色

options#lineWidth
----------
刮刮卡刮痕的宽度，默认值是25

options#activePercent
-------------
刮刮卡刮开的面积所占的比例，当刮开的面积占总面积的比例等于该值时，会调用`finish`回调函数

options#autoClear
---------------
当刮开的面积所占的比例大于`activePercent`的时候，是否自动清除涂层，默认是`false`

options#initialized
---------------
刮刮卡初始化之后的回调函数

options#period(ratio)
--------------
每刮一次（所有手指离开屏幕），将会调用该回调函数，参数为已刮开的面积所占的比例

options#finish(ratio)
------------
当刮开的面积所占的比例大于`activePercent`时，调用该回调函数，参数为已刮开的面积所占的比例

`ScratchCard.CARD_BG`
--------------------
如果用图片来填充涂层，可以修改该值，Base64编码

方法
===

`clear()`
--------
清空涂层

`reset()`
--------
重置涂层，即恢复到初始时的状态

