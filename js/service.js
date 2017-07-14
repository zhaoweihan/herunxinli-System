(function ($) {
    function server() {
        this.baseUrl = "";
        this.debug = true;
    }
    server.prototype = {
        ajax: function (options) {
            var self = this;
            var defultOptions = {
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
            $.ajax({
                type: defaults.type,
                url: self.baseUrl + defaults.url,
                async: defaults.async,
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
        }
    }
})(jQuery)