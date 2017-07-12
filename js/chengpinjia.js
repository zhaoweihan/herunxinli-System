(function (win, doc, $) {
    function ChengPinJia() {
        /*
         * ajax 基础路径
         */
        this.ajaxUrl = '/shi_er_juan_lian';
        /*
         * 微信登录回调域名
         */
        this.wxCallbackUrl = 'http://zwh.s1.natapp.cc/ls';
        /*
         * 首页图片预览url 中间部分地址
         */
        this.middleHref = '/ls';
        /*
         * 是否为debug模式，debug模式会输出或打印出系统级错误，以便开发调试
         */
        this.debug = false;
        /*
         * 初始化函数
         */
        this._init();

    }
    ChengPinJia.prototype = {
        /*
         * 初始化方法
         */
        _init: function () {
            //this.isLogin();
        },
        /*
         * 判断是否登录状态
         */
        isLogin: function () {
            if (localStorage.getItem("cusUserId") == null || localStorage.getItem("phone") == null) {
                plus.webview.close("tab-webview");
                mui.openWindow({
                    url: "login.html",
                    id: "login"
                });
            }
        },
        /*
         * 输出浏览器类型和设备类型
         */
        agent: function () {
            if (navigator.platform == "Win32") {
                agent = "ZHUMENGYUNSHOPMALLWAP";
            } else if (navigator.platform == "iPhone") {
                agent = "ZHUMENGYUNSHOPMALLIOS";
            } else {
                agent = "ZHUMENGYUNSHOPMALLANDROID";
            }
            return agent;
        },

        /*
         * jquery Ajax封装
         */
        ajax: function (option) {
            var self = this;
            var defaults = {
                async: true,
                type: "post",
                url: "",
                success: function () {},
                error: function () {},
                timeout: function () {}
            }
            if (typeof (option) != "object") {
                throw "参数必须为对象";
                return false;
            }
            $.extend(true, defaults, option || {});

            $.ajax({
                type: defaults.type,
                url: self.ajaxUrl + defaults.url,
                async: defaults.async,
                beforeSend: function (xhr) {
                    //xhr.setRequestHeader("Authorization", localStorage.getItem("Authorization"));
                    xhr.setRequestHeader("user-agents", self.agent());
                },
                data: defaults.data,
                success: function (data) {
                    var code = Number(data.responseHead.code);
                    if (code == 200) {
                        defaults.success(data.responseBody);
                    } else if (code < 60000 && code >= 50000) { //业务级别错误
                        defaults.error(data.responseHead.code, data.responseHead.msg);
                    } else if (code < 50000) { //系统级别错误
                        self.debug ? console.log(data.responseHead.msg) : null;
                    }
                },
                timeout: 6000,
                error: function (xhr, error) {
                    defaults.timeout();
                    if (self.debug) {
                        console.log(xhr);
                        console.log("error：" + error);
                    }

                }
            });
        },

        /*
         * 获取地址栏参数，支持直接传中文参数
         */
        getUrlParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg); // 匹配目标参数
            if (r != null)
                return decodeURIComponent(r[2]);
            return null; // 返回参数值
        },

        /*
         * localStorage封装
         */
        loStg: {
            setItem: function (key, value) {
                if (typeof (value) == "object") {
                    localStorage.setItem(key, JSON.stringify(value));
                } else {
                    localStorage.setItem(key, value);
                }
            },
            getItem: function (key) {
                var value = localStorage.getItem(key);
                if (value == null) {
                    return null;
                } else {
                    try {
                        return JSON.parse(value);
                    } catch (e) {
                        return value;
                    }
                }
            }
        },
        /*
         * sessionStorage封装
         */
        seStg: {
            setItem: function (key, value) {
                if (typeof (value) == "object") {
                    sessionStorage.setItem(key, JSON.stringify(value));
                } else {
                    sessionStorage.setItem(key, value);
                }
            },
            getItem: function (key) {
                var value = sessionStorage.getItem(key);
                if (value == null) {
                    return null;
                } else {
                    try {
                        return JSON.parse(value);
                    } catch (e) {
                        return value;
                    }
                }
            }
        },
        /*
         * 自定义滚动条
         */
        scrollbar: function (option) {
            var defauls = {
                scrollDir: "y", //滚动方向
                contSelector: '', //滚动内容区选择器
                barSelector: '', //滚动条选择器
                sliderSelector: '', //滚动滑块选择器
                wheelStep: 10, //滚轮步长
            }
            $.extend(true, defauls, option || {});

            //滚动内容对象
            var $cont = $(defauls.contSelector);
            //滚动条滑块对象
            var $slider = $(defauls.sliderSelector);
            //滚动条对象
            var $bar = $(defauls.barSelector);
            var $doc = $(document);
            var initSliderDragEvent = function () {
                var slider = $slider;
                if (slider[0]) {
                    var doc = $doc;
                    slider.on("mousedown", function (e) {
                        e.preventDefault();
                        dragStartPagePosition = e.pageY; //鼠标位置
                        dragStartScrollPosition = $cont[0].scrollTop; //滚动内容超出容器的高度
                        dragConBarRate = getMaxScrollPosition() / getMaxSliderPosition();

                        doc.on("mousemove.scroll", function (e) {
                            mousemoveHandler(e, dragStartScrollPosition, dragStartPagePosition, dragConBarRate);
                        }).on("mouseup.scroll", function () {
                            doc.off(".scroll");
                        });
                    });
                    //内容可滚动高度
                    function getMaxScrollPosition() {
                        return Math.max($cont.height(), $cont[0].scrollHeight) - $cont.height();
                    }
                    //滑块可移动距离
                    function getMaxSliderPosition() {
                        return $bar.height() - $slider.height();
                    }

                    function scrollTo(positionVal) {
                        $cont.scrollTop(positionVal);
                    }

                    function mousemoveHandler(e, ds, dp, dr) {
                        e.preventDefault();
                        if (dp == null) {
                            return;
                        }
                        scrollTo(ds + (e.pageY - dp) * dr);
                    }
                    //监听内容滚动，同步滑块位置
                    function bindContScroll($s) {
                        $cont.on("scroll", function () {
                            var sliderEl = $s && $s[0];
                            if (sliderEl) {
                                sliderEl.style.top = getSliderPosition() + "px";
                            }
                        });
                    }
                    //计算滑块当前的位置
                    function getSliderPosition() {
                        return Math.min(getMaxSliderPosition(), getMaxSliderPosition() * $cont[0].scrollTop / getMaxScrollPosition());
                    }
                    bindContScroll($slider);
                    //监听鼠标滚轮事件
                    function bindMousewheel() {
                        $cont.on("mousewheel DOMMouseScroll", function (e) {
                            e.preventDefault();
                            var oEv = e.originalEvent,
                                wheelRange = oEv.wheelDelta ? -oEv.wheelDelta / 120 : (oEv.detail || 0) / 3;
                            scrollTo($cont[0].scrollTop + wheelRange * defauls.wheelStep);
                        });
                    }
                    bindMousewheel();
                }
            }

            initSliderDragEvent();

        },
        /*
         * 发送手机验证码按钮倒计时
         */
        vCodeCountdown: function (btnId) {
            var key = 60;
            $("#" + btnId).attr("disabled", "disabled").css("opacity", ".7");
            var Countdown = setInterval(function () {
                if (key > 0) {
                    key--;
                    $("#" + btnId).html(key + "秒再发送");
                } else {
                    $("#" + btnId).html("点击再次发送");
                    clearInterval(Countdown);
                    $("#" + btnId).removeAttr("disabled").css("opacity", "1");
                }
            }, 1000);
        }
    }
    win.ChengPinJia = ChengPinJia; //把对象挂载到window下
})(window, document, jQuery);
var cpj = new ChengPinJia(); //实例化对象

//上传图片
function newBlob(data, datatype) {
    var out;
    try {
        out = new Blob([data], {
            type: datatype
        })
    } catch (e) {
        window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
        if (e.name == "TypeError" && window.BlobBuilder) {
            var bb = new BlobBuilder();
            bb.append(data.buffer);
            out = bb.getBlob(datatype)
        } else {
            if (e.name == "InvalidStateError") {
                out = new Blob([data], {
                    type: datatype
                })
            } else {}
        }
    }
    return out
}
var needsFormDataShim = (function () {
        var bCheck = ~navigator.userAgent.indexOf("Android") && ~navigator.vendor.indexOf("Google") && !~navigator.userAgent.indexOf("Chrome");
        return bCheck && navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534
    })(),
    blobConstruct = !!(function () {
        try {
            return new Blob()
        } catch (e) {}
    })(),
    XBlob = blobConstruct ? window.Blob : function (parts, opts) {
        var bb = new(window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder);
        parts.forEach(function (p) {
            bb.append(p)
        });
        return bb.getBlob(opts ? opts.type : undefined)
    };

function FormDataShim() {
    var o = this,
        parts = [],
        boundary = Array(5).join("-") + (+new Date() * (10000000000000000 * Math.random())).toString(32),
        oldSend = XMLHttpRequest.prototype.send;
    this.append = function (name, value, filename) {
        parts.push("--" + boundary + '\r\nContent-Disposition: form-data; name="' + name + '"');
        if (value instanceof Blob) {
            parts.push('; filename="' + (filename || "blob") + '"\r\nContent-Type: ' + value.type + "\r\n\r\n");
            parts.push(value)
        } else {
            parts.push("\r\n\r\n" + value)
        }
        parts.push("\r\n")
    };
    XMLHttpRequest.prototype.send = function (val) {
        var fr, data, oXHR = this;
        if (val === o) {
            parts.push("--" + boundary + "--\r\n");
            data = new XBlob(parts);
            fr = new FileReader();
            fr.onload = function () {
                oldSend.call(oXHR, fr.result)
            };
            fr.onerror = function (err) {
                throw err
            };
            fr.readAsArrayBuffer(data);
            this.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
            XMLHttpRequest.prototype.send = oldSend
        } else {
            oldSend.call(this, val)
        }
    }
}

function dataURLtoBlob(data) {
    var tmp = data.split(",");
    tmp[1] = tmp[1].replace(/\s/g, "");
    var binary = atob(tmp[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i))
    }
    return new newBlob(new Uint8Array(array), "image/jpeg")
};

//fastclick
! function () {
    "use strict";

    function t(e, o) {
        function i(t, e) {
            return function () {
                return t.apply(e, arguments)
            }
        }
        var r;
        if (o = o || {}, this.trackingClick = !1, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = o.touchBoundary || 10, this.layer = e, this.tapDelay = o.tapDelay || 200, this.tapTimeout = o.tapTimeout || 700, !t.notNeeded(e)) {
            for (var a = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], c = this, s = 0, u = a.length; u > s; s++) c[a[s]] = i(c[a[s]], c);
            n && (e.addEventListener("mouseover", this.onMouse, !0), e.addEventListener("mousedown", this.onMouse, !0), e.addEventListener("mouseup", this.onMouse, !0)), e.addEventListener("click", this.onClick, !0), e.addEventListener("touchstart", this.onTouchStart, !1), e.addEventListener("touchmove", this.onTouchMove, !1), e.addEventListener("touchend", this.onTouchEnd, !1), e.addEventListener("touchcancel", this.onTouchCancel, !1), Event.prototype.stopImmediatePropagation || (e.removeEventListener = function (t, n, o) {
                var i = Node.prototype.removeEventListener;
                "click" === t ? i.call(e, t, n.hijacked || n, o) : i.call(e, t, n, o)
            }, e.addEventListener = function (t, n, o) {
                var i = Node.prototype.addEventListener;
                "click" === t ? i.call(e, t, n.hijacked || (n.hijacked = function (t) {
                    t.propagationStopped || n(t)
                }), o) : i.call(e, t, n, o)
            }), "function" == typeof e.onclick && (r = e.onclick, e.addEventListener("click", function (t) {
                r(t)
            }, !1), e.onclick = null)
        }
    }
    var e = navigator.userAgent.indexOf("Windows Phone") >= 0,
        n = navigator.userAgent.indexOf("Android") > 0 && !e,
        o = /iP(ad|hone|od)/.test(navigator.userAgent) && !e,
        i = o && /OS 4_\d(_\d)?/.test(navigator.userAgent),
        r = o && /OS [6-7]_\d/.test(navigator.userAgent),
        a = navigator.userAgent.indexOf("BB10") > 0;
    t.prototype.needsClick = function (t) {
        switch (t.nodeName.toLowerCase()) {
            case "button":
            case "select":
            case "textarea":
                if (t.disabled) return !0;
                break;
            case "input":
                if (o && "file" === t.type || t.disabled) return !0;
                break;
            case "label":
            case "iframe":
            case "video":
                return !0
        }
        return /\bneedsclick\b/.test(t.className)
    }, t.prototype.needsFocus = function (t) {
        switch (t.nodeName.toLowerCase()) {
            case "textarea":
                return !0;
            case "select":
                return !n;
            case "input":
                switch (t.type) {
                    case "button":
                    case "checkbox":
                    case "file":
                    case "image":
                    case "radio":
                    case "submit":
                        return !1
                }
                return !t.disabled && !t.readOnly;
            default:
                return /\bneedsfocus\b/.test(t.className)
        }
    }, t.prototype.sendClick = function (t, e) {
        var n, o;
        document.activeElement && document.activeElement !== t && document.activeElement.blur(), o = e.changedTouches[0], n = document.createEvent("MouseEvents"), n.initMouseEvent(this.determineEventType(t), !0, !0, window, 1, o.screenX, o.screenY, o.clientX, o.clientY, !1, !1, !1, !1, 0, null), n.forwardedTouchEvent = !0, t.dispatchEvent(n)
    }, t.prototype.determineEventType = function (t) {
        return n && "select" === t.tagName.toLowerCase() ? "mousedown" : "click"
    }, t.prototype.focus = function (t) {
        var e;
        o && t.setSelectionRange && 0 !== t.type.indexOf("date") && "time" !== t.type && "month" !== t.type ? (e = t.value.length, t.setSelectionRange(e, e)) : t.focus()
    }, t.prototype.updateScrollParent = function (t) {
        var e, n;
        if (e = t.fastClickScrollParent, !e || !e.contains(t)) {
            n = t;
            do {
                if (n.scrollHeight > n.offsetHeight) {
                    e = n, t.fastClickScrollParent = n;
                    break
                }
                n = n.parentElement
            } while (n)
        }
        e && (e.fastClickLastScrollTop = e.scrollTop)
    }, t.prototype.getTargetElementFromEventTarget = function (t) {
        return t.nodeType === Node.TEXT_NODE ? t.parentNode : t
    }, t.prototype.onTouchStart = function (t) {
        var e, n, r;
        if (t.targetTouches.length > 1) return !0;
        if (e = this.getTargetElementFromEventTarget(t.target), n = t.targetTouches[0], o) {
            if (r = window.getSelection(), r.rangeCount && !r.isCollapsed) return !0;
            if (!i) {
                if (n.identifier && n.identifier === this.lastTouchIdentifier) return t.preventDefault(), !1;
                this.lastTouchIdentifier = n.identifier, this.updateScrollParent(e)
            }
        }
        return this.trackingClick = !0, this.trackingClickStart = t.timeStamp, this.targetElement = e, this.touchStartX = n.pageX, this.touchStartY = n.pageY, t.timeStamp - this.lastClickTime < this.tapDelay && t.preventDefault(), !0
    }, t.prototype.touchHasMoved = function (t) {
        var e = t.changedTouches[0],
            n = this.touchBoundary;
        return Math.abs(e.pageX - this.touchStartX) > n || Math.abs(e.pageY - this.touchStartY) > n ? !0 : !1
    }, t.prototype.onTouchMove = function (t) {
        return this.trackingClick ? ((this.targetElement !== this.getTargetElementFromEventTarget(t.target) || this.touchHasMoved(t)) && (this.trackingClick = !1, this.targetElement = null), !0) : !0
    }, t.prototype.findControl = function (t) {
        return void 0 !== t.control ? t.control : t.htmlFor ? document.getElementById(t.htmlFor) : t.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
    }, t.prototype.onTouchEnd = function (t) {
        var e, a, c, s, u, l = this.targetElement;
        if (!this.trackingClick) return !0;
        if (t.timeStamp - this.lastClickTime < this.tapDelay) return this.cancelNextClick = !0, !0;
        if (t.timeStamp - this.trackingClickStart > this.tapTimeout) return !0;
        if (this.cancelNextClick = !1, this.lastClickTime = t.timeStamp, a = this.trackingClickStart, this.trackingClick = !1, this.trackingClickStart = 0, r && (u = t.changedTouches[0], l = document.elementFromPoint(u.pageX - window.pageXOffset, u.pageY - window.pageYOffset) || l, l.fastClickScrollParent = this.targetElement.fastClickScrollParent), c = l.tagName.toLowerCase(), "label" === c) {
            if (e = this.findControl(l)) {
                if (this.focus(l), n) return !1;
                l = e
            }
        } else if (this.needsFocus(l)) return t.timeStamp - a > 100 || o && window.top !== window && "input" === c ? (this.targetElement = null, !1) : (this.focus(l), this.sendClick(l, t), o && "select" === c || (this.targetElement = null, t.preventDefault()), !1);
        return o && !i && (s = l.fastClickScrollParent, s && s.fastClickLastScrollTop !== s.scrollTop) ? !0 : (this.needsClick(l) || (t.preventDefault(), this.sendClick(l, t)), !1)
    }, t.prototype.onTouchCancel = function () {
        this.trackingClick = !1, this.targetElement = null
    }, t.prototype.onMouse = function (t) {
        return this.targetElement ? t.forwardedTouchEvent ? !0 : t.cancelable && (!this.needsClick(this.targetElement) || this.cancelNextClick) ? (t.stopImmediatePropagation ? t.stopImmediatePropagation() : t.propagationStopped = !0, t.stopPropagation(), t.preventDefault(), !1) : !0 : !0
    }, t.prototype.onClick = function (t) {
        var e;
        return this.trackingClick ? (this.targetElement = null, this.trackingClick = !1, !0) : "submit" === t.target.type && 0 === t.detail ? !0 : (e = this.onMouse(t), e || (this.targetElement = null), e)
    }, t.prototype.destroy = function () {
        var t = this.layer;
        n && (t.removeEventListener("mouseover", this.onMouse, !0), t.removeEventListener("mousedown", this.onMouse, !0), t.removeEventListener("mouseup", this.onMouse, !0)), t.removeEventListener("click", this.onClick, !0), t.removeEventListener("touchstart", this.onTouchStart, !1), t.removeEventListener("touchmove", this.onTouchMove, !1), t.removeEventListener("touchend", this.onTouchEnd, !1), t.removeEventListener("touchcancel", this.onTouchCancel, !1)
    }, t.notNeeded = function (t) {
        var e, o, i, r;
        if ("undefined" == typeof window.ontouchstart) return !0;
        if (o = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
            if (!n) return !0;
            if (e = document.querySelector("meta[name=viewport]")) {
                if (-1 !== e.content.indexOf("user-scalable=no")) return !0;
                if (o > 31 && document.documentElement.scrollWidth <= window.outerWidth) return !0
            }
        }
        if (a && (i = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/), i[1] >= 10 && i[2] >= 3 && (e = document.querySelector("meta[name=viewport]")))) {
            if (-1 !== e.content.indexOf("user-scalable=no")) return !0;
            if (document.documentElement.scrollWidth <= window.outerWidth) return !0
        }
        return "none" === t.style.msTouchAction || "manipulation" === t.style.touchAction ? !0 : (r = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1], r >= 27 && (e = document.querySelector("meta[name=viewport]"), e && (-1 !== e.content.indexOf("user-scalable=no") || document.documentElement.scrollWidth <= window.outerWidth)) ? !0 : "none" === t.style.touchAction || "manipulation" === t.style.touchAction ? !0 : !1)
    }, t.attach = function (e, n) {
        return new t(e, n)
    }, "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function () {
        return t
    }) : "undefined" != typeof module && module.exports ? (module.exports = t.attach, module.exports.FastClick = t) : window.FastClick = t
}();

//微信接口注入配置
var wxtimestamp = new Date().getTime();

function getqm() {
    var signature = '';
    cpj.ajax({
        url: "/weiXin/getSignature.json",
        async: false,
        data: {
            timestamp: wxtimestamp,
            url: location.href.split('#')[0],
            noncestr: "lsbw"
        },
        success: function (data) {
            signature = data.signature;
        }
    });
    return signature;
}
wx.config({
    debug: cpj.debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: 'wx586b95803668b35e', // 必填，公众号的唯一标识
    timestamp: wxtimestamp, // 必填，生成签名的时间戳
    nonceStr: 'lsbw', // 必填，生成签名的随机串
    signature: getqm(), // 必填，签名，见附录1
    jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'hideMenuItems', 'hideAllNonBaseMenuItem'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
});
wx.error(function (res) {
    layer.open({
        content: '微信接口配置注入失败，请重新刷新页面再试一试',
        skin: 'msg',
        time: 2 //2秒后自动关闭
    });
});

function getUserInfo() {
    cpj.ajax({
        url: "/weiXin/getUserInfo.json",
        data: {
            code: cpj.getUrlParam("code")
        },
        async: false,
        success: function (data) {
            cpj.loStg.setItem("userinfo", data.userInfo);
        },
        error: function (code, msg) {
            layer.open({
                content: msg,
                skin: 'msg',
            });
        }
    });
}

function wxShare(url) {
    if (!url) {
        url = window.location.href;
    }
    var shareTitle = '';
    var shareImg = '';
    if (cpj.getUrlParam("inviterId")) { //已经发起活动
        shareTitle = '李鹏程家有喜事，刷脸请吃大餐啦！-李氏本味';
        var headimgUrl = cpj.loStg.getItem("userinfo").headimgurl;
        shareImg = headimgUrl.slice(0, headimgUrl.length - 1) + "64";
    } else { //未发起
        shareTitle = '天呐！你的颜值可以免费吃大餐！-李氏本味';
        shareImg = 'http://m.chengpinjia.com/goodsDetail/benwei.jpg';
    }
    //分享给朋友
    wx.onMenuShareAppMessage({
        title: shareTitle, // 分享标题
        desc: shareTitle, // 分享描述
        link: url, // 分享链接
        imgUrl: shareImg, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        }
    });
    //分享朋友圈
    wx.onMenuShareTimeline({
        title: shareTitle, // 分享标题
        link: url, // 分享链接
        imgUrl: shareImg, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        }
    });
    //批量隐藏功能按钮，把不需要分享的 平台隐藏掉
    wx.hideMenuItems({
        menuList: ["menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:facebook", "menuItem:share:QZone", "menuItem:openWithQQBrowser", "menuItem:openWithSafari", "menuItem:copyUrl", "menuItem:originPage"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
    });
    //分享到QQ: "menuItem:share:qq"
    //分享到Weibo: "menuItem:share:weiboApp"
    //分享到FB: "menuItem:share:facebook"
    //分享到 QQ 空间/menuItem:share:QZone
    //在QQ浏览器中打开: "menuItem:openWithQQBrowser"
    //在Safari中打开: "menuItem:openWithSafari"
    //复制链接: "menuItem:copyUrl"
    //原网页: "menuItem:originPage"
}

$("#share").on('click', function () {
    layer.open({
        content: '点击右上角分享',
        skin: 'msg',
        time: 2,
    });
})