/**
 * 刮刮卡
 * @param  {window} win
 * @param  {document} doc
 * @param  {undefined} undefined
 * @version 0.1.0
 * @author yuezk001@gmail.com
 */ (function(win, doc, undefined) {
    /**
     * 刮刮卡效果
     * @param {string} el
     * @param {object} options
     */
    var ScratchCard = function(el, options) {
        /*no operation*/
        var noop = function() {};

        this.options = {
            width: 300,
            height: 150,
            background: null,
            text: '刮开此涂层',
            font: '36px arial',
            color: '#666',
            lineWidth: 25,
            activePercent: .4,
            //达到activePercent时，自动清除
            autoClear: false,

            //events
            initialized: noop,
            //刮除面积大于activePercent的时候触发
            finish: noop,
            //刮一次的间歇触发
            period: noop
        };

        this.canvas = doc.getElementById(el);
        this.options.width = this.canvas.width;
        this.options.height = this.canvas.height;

        if (this.canvas === null) throw new Error('cannot find canvas on the page!');

        this.initialized = false;
        this.options = extend(this.options, options);
        this.ongoingTouches = []; //缓存屏幕上的touch

        this.init();
    };

    //默认的背景图片
    ScratchCard.CARD_BG = 'data:image/png;base64,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';

    ScratchCard.prototype.init = function() {
        if (this.initialized) return this;

        this._prepare();
        this._paint();
        this._bindEvents();

        return this;
    };

    /*====================public method ===============*/
    ScratchCard.prototype.clear = function() {
        this.ctx.clearRect(0, 0, this.options.width, this.options.height);
    };

    /**
     * 恢复到初始状态
     */
    ScratchCard.prototype.reset = function() {
        this._paint();
    };

    /**
     * 根据id，查找缓存的touch，找到返回index，否则返回-1
     * @param  {touch} id
     * @return {number}
     */
    ScratchCard.prototype.getOngoingTouchIndex = function(id) {
        for (var i = 0; i < this.ongoingTouches.length; i++) {
            var identifier = this.ongoingTouches[i].identifier;
            if (identifier == id) {
                return i;
            }
        }

        return -1; //not found
    };

    /**
     * 得到touch的位置相对于canvas的offset
     * @param  {touch} touch
     * @return {object}
     */
    ScratchCard.prototype.getRelativePostion = function(touch) {
        var offset = getOffset(this.canvas);
        var computed = win.getComputedStyle(this.canvas);

        return {
            top: touch.pageY - offset.top - this.canvas.clientTop - parseInt(computed.paddingTop),
            left: touch.pageX - offset.left - this.canvas.clientLeft - parseInt(computed.paddingLeft)
        };
    };

    /**
     * 返回擦去的面积所占的比例
     * @return {number}
     */
    ScratchCard.prototype.checkSquare = function() {
        var imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var data = imageData.data;
        var dots = 0;
        var pix = 0;

        for (var i = 0, len = data.length; i < len; i += 4) {
            pix++;
            if (data[i + 3] < 1) {
                dots++;
            }
        }

        return dots / pix;
    }

    /*====================私有方法=====================*/
    /**
     * 一些准备工作
     */
    ScratchCard.prototype._prepare = function() {
        this.pointerEnabled = win.navigator.msPointerEnabled;

        this.canvas.style.msTouchAction = 'none';
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;

        this.ctx = this.canvas.getContext('2d');
    };

    ScratchCard.prototype._bindEvents = function() {
        var self = this;
        var canvas = this.canvas;

        if (this.pointerEnabled) { //ie mobile
            this.canvas.addEventListener('MSPointerDown', self._handleStart.bind(self), false);
            this.canvas.addEventListener('MSPointerMove', self._handleMove.bind(self), false);
            this.canvas.addEventListener('MSPointerUp', self._handleEnd.bind(self), false);
            //处理手指滑出canvas之后，并离开屏幕的事件
            this.canvas.ownerDocument.addEventListener('MSPointerUp', self._handleCancel.bind(self), false);
            this.canvas.ownerDocument.addEventListener('MSPointerCancel', self._handleCancel.bind(self), false);
        } else {
            canvas.addEventListener('touchstart', self._handleStart.bind(self));
            canvas.addEventListener('touchmove', self._handleMove.bind(self));
            canvas.addEventListener('touchend', self._handleEnd.bind(self));
            canvas.addEventListener('touchcancel', self._handleCancel.bind(self));
        }
    };

    /**
     * 画初始背景
     */
    ScratchCard.prototype._paint = function() {
        var self = this;
        var ctx = this.ctx;

        ctx.globalCompositeOperation = 'source-over';
        if (this.options.background) { //纯色
            this.clear();
            ctx.fillStyle = this.options.background;
            ctx.fillRect(0, 0, this.options.width, this.options.height);
            this._drawText();
        } else { //图片
            var img = new Image();
            img.src = ScratchCard.CARD_BG;

            img.onload = function() {
                self.clear();

                var pattern = ctx.createPattern(this, 'repeat');
                ctx.fillStyle = pattern;
                ctx.fillRect(0, 0, self.options.width, self.options.height);

                self._drawText();
            };
        }
    };

    /**
     * 画初始文字
     */
    ScratchCard.prototype._drawText = function() {
        var ctx = this.ctx;

        //画文字 
        ctx.font = this.options.font;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = this.options.color;

        ctx.fillText(this.options.text, this.options.width / 2, this.options.height / 2);

        //如果之前没有初始化过
        if (!this.initialized) {
            this.initialized = true;
            this.options.initialized.apply(this);
        }
    };

    ScratchCard.prototype._handleStart = function(e) {
        e.preventDefault();

        var touches = this._getStartTouch(e);
        for (var i = 0; i < touches.length; i++) {
            this.ongoingTouches.push(this._copyToch(touches[i])); //缓存下来
        }
    };

    ScratchCard.prototype._handleMove = function(e) {
        e.preventDefault();

        var ctx = this.ctx;
        var touches = e.changedTouches || [{
            identifier: e.pointerId,
            pageY: e.pageY,
            pageX: e.pageX
        }];
        for (var i = 0; i < touches.length; i++) {
            var index = this.getOngoingTouchIndex(touches[i].identifier);
            if (index >= 0) {
                var touch = this.ongoingTouches[index];
                var pos = this.getRelativePostion(touch);
                var newPos = this.getRelativePostion(touches[i]);

                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineWidth = this.options.lineWidth;
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';

                ctx.beginPath();
                ctx.moveTo(pos.left, pos.top);
                ctx.lineTo(newPos.left, newPos.top);
                ctx.stroke();

                //fix android 4.2 bug by forcing repaint
                var n = Math.floor(Math.random() * 10000);
                this.canvas.style.color = '#' + n.toString(16);

                //替换旧的touch，缓存新的touch
                this.ongoingTouches[index] = this._copyToch(touches[i]);
            } else {
                //没有在缓存的touch中找到
            }
        }
    };

    ScratchCard.prototype._handleEnd = function(e) {
        e.preventDefault();

        var touches = e.changedTouches || [{
            identifier: e.pointerId,
            pageY: e.pageY,
            pageX: e.pageX
        }];
        for (var i = 0; i < touches.length; i++) {
            var index = this.getOngoingTouchIndex(touches[i].identifier);
            if (index >= 0) {
                this.ongoingTouches.splice(index, 1);
            } else {
                //没有在缓存的touch中找到
            }
        }

        if (this.ongoingTouches.length === 0) { //如果没有手指停留在屏幕上
            var ratio = this.checkSquare();
            this.options.period.apply(this, [ratio]);

            if (ratio >= this.options.activePercent) {
                if (this.options.autoClear) this.clear();
                this.options.finish.apply(this, [ratio]);
            }
        }
    };

    ScratchCard.prototype._handleCancel = function(e) {
        e.preventDefault();

        var touches = e.changedTouches || [{
            identifier: e.pointerId,
            pageY: e.pageY,
            pageX: e.pageX
        }];
        for (var i = 0; i < touches.length; i++) {
            this.ongoingTouches.splice(i, 1);
        }
    };

    /**
     * touchstart事件触发时，得到chagnedTouch，用来兼容WP设备
     * @param  {Event} event
     * @return {array}
     */
    ScratchCard.prototype._getStartTouch = function(event) {
        var touches = [];

        if (event.changedTouches) {
            return event.changedTouches;
        }

        //ie mobile first touch
        if (this.ongoingTouches.length === 0) {
            touches.push({
                identifier: event.pointerId,
                pageX: event.pageX,
                pageY: event.pageY
            });
        }

        return touches;
    };

    /**
     * 拷贝touch事件中必要的信息，因为浏览器会共享同一个事件对象
     * @param  {object} touch  Touch对象或类Touch对象
     */
    ScratchCard.prototype._copyToch = function(touch) {
        return {
            identifier: touch.identifier,
            pageX: touch.pageX,
            pageY: touch.pageY
        };
    };


    /*====================工具函数=====================*/

    /**
     * 简单的extend
     * @param  {object} target
     * @param  {object} source
     * @return {object}
     */
    function extend(target, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }

        return target;
    }

    /**
     * 得到元素相对于document的offset
     * @param  {Element} ele
     * @return {object}
     */
    function getOffset(ele) {
        var box = {
            top: 0,
            left: 0
        };
        var doc = ele.ownerDocument;
        var docElem = doc.documentElement;
        var win = doc.defaultView;

        if (ele.getBoundingClientRect) {
            box = ele.getBoundingClientRect();
        }

        return {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft
        };
    }

    /**
     * bind polyfill
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#Polyfill
     */
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
            if (typeof this !== 'function') {
                // closest thing possible to the ECMAScript 5
                // internal IsCallable function
                throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function() {},
                fBound = function() {
                    return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }

    win.ScratchCard = ScratchCard;
})(window, document);