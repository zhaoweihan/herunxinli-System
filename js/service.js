// http://doc.weiwei528.com/hrxl/swagger-ui.html
(function ($, win) {
    function Server() {
        this.baseUrl = "/hrxl";
        this.debug = true;
        this._init();
    }
    Server.prototype = {
        _init: function () {},
        isLogin: function (self) {
            if (!localStorage.getItem("id") || !localStorage.getItem("token") || !localStorage.getItem("username")) {
                self.$messagebox.alert("登录状态失效，请重新登录").then(action => {
                    localStorage.clear();
                    window.location.href = 'login.html';
                });
                
            }
        },
        ajax: function (options) {
            var self = this;
            var isBackId = false;
            var defaults = {
                async: true,
                type: "post",
                url: "",
                success: function () {},
                error: function () {},
                timeout: function () {}
            }
            if (typeof (options) != "object") {
                throw "参数必须为对象";
            }
            $.extend(true, defaults, options || {});
            for (var dataKey in defaults.data) {
                if (dataKey == "backUserId") {
                    isBackId = true
                    break;
                }
            }
            $.ajax({
                type: defaults.type,
                url: self.baseUrl + defaults.url,
                async: defaults.async,
                headers: this.headerToken(isBackId),
                data: defaults.data,
                success: function (data) {
                    var code = Number(data.responseHead.code);
                    if (code == 200) {
                        defaults.success(data.responseBody);
                    } else if (code < 60000 && code >= 50000) { //业务级别错误
                        // 请求加固失效 需要重新登录
                        if (code == 50000) {
                            app.$messagebox.alert(data.responseHead.msg).then(action => {
                                localStorage.clear();
                                window.location.href = 'login.html';
                            });
                        }else{
                            app.$toast(data.responseHead.msg)
                        }
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
        headerToken: function (bl) {
            var key = localStorage.getItem("token");
            var nonceStr = this.randomStr();
            var timestamp = Math.floor(new Date().getTime() / 1000);
            var signature = hex_md5(key + timestamp + nonceStr);
            if (bl) {
                return {
                    nonceStr: nonceStr,
                    timestamp: timestamp,
                    signature: signature
                }
            } else {
                return {};
            }

        },
        randomStr: function () {
            var str = '';
            var letterArr = []
            for (var i = 97; i <= 122; i++) {
                letterArr.push(String.fromCharCode(i));
            }
            for (var index = 0; index < 4; index++) {
                str += letterArr[Math.floor(Math.random() * 26)];
                str += Math.floor(Math.random() * 10);
            }
            return str;
        }

    }
    win.Server = Server; //把对象挂载到window下
})(jQuery, window);
var server = new Server(); //实例化对象