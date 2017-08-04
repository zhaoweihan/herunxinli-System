/**
 * 添加课程
 */
var app = new Vue({
    el: '#add',
    data: {
        //课程图片
        productImg: '',
        productName: '', //课程名称
        integral: "", //兑换所需积分,
        productUrl: "", //课程链接
        selected: "管理",
        maskStatus: false,
        baseImageUrl: ''
    },
    methods: {
        onSubmit: function () {
            var rex = /^[0-9]{1,6}$/;
            if (!rex.test(this.integral)) {
                this.$toast('所需积分必须为1-6位数字')
            } else {
                var self = this;
                var url = "";
                var data = {
                    backUserId: localStorage.getItem("id"),
                    name: self.productName,
                    img: self.productImg,
                    integral: self.integral,
                    url: self.productUrl
                }
                if (server.getUrlParam("goodsId")) { //修改
                    url = "/goods/update";
                    data.goodsId = server.getUrlParam("goodsId");
                    data.status = 0;
                } else { //新增
                    url = "/goods/add";
                }
                server.ajax({
                    url: url,
                    data: data,
                    success: function (result) {
                        self.$toast({
                            message: '提交成功',
                            position: 'bottom',
                            duration: 1000
                        });
                        setTimeout(function () {
                            window.location.href = 'index.html';
                        }, 1000)

                    }
                })
            }
        },
        // input file change事件 打开截图遮罩层
        fileMaskOpen: function () {
            this.maskStatus = true;
        },
        //关闭遮罩层
        closeMask: function () {
            this.maskStatus = false;
        },
        // 上传图片
        uploadImg: function (dataURL) {
            var self = this;
            var tmp = dataURL.split(",");
            tmp[1] = tmp[1].replace(/\s/g, "");
            var binary = atob(tmp[1]);
            var array = [];
            for (var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i))
            }

            var out = new Blob([new Uint8Array(array)], {
                type: "image/jpeg"
            })
            var formData = new FormData();
            formData.append("file", out);
            server.ajax({
                url: "/common/uploadFile",
                data: formData,
                processData: false,
                cache: false,
                contentType: false,
                success: function (result) {
                    self.baseImageUrl = result.data.baseImageUrl;
                    self.productImg = result.data.imagePath;
                }
            })
        },
        getInfo: function () {
            this.baseImageUrl = server.getUrlParam("baseUrl");
            this.productImg = server.getUrlParam("imgUrl");
            this.productName = server.getUrlParam("name");
            this.integral = server.getUrlParam("integral");
            this.productUrl = server.getUrlParam("productUrl");
        }

    },
    watch: {
        selected: function (n, o) {
            if (n == "兑换") {
                window.location.href = "exchange.html";
            } else if (n == "管理") {
                window.location.href = "index.html";
            }
        }
    },
    created: function () {
        if (server.getUrlParam("goodsId")) {
            this.getInfo();
        }
    },
    mounted: function () {
        server.isLogin(this);
        var self = this;
        var addImg = new bjj.PhotoClip("#clipArea", {
            size: [200, 200],
            outputSize: [100, 100],
            file: "#uploadImg",
            ok: "#clipBtn",
            loadError: function (errMsg, imgError) {
                console.log('errMsg:' + errMsg);
                console.log('imgError:' + imgError);
            },
            clipFinish: function (dataURL) {
                self.maskStatus = false;
                self.uploadImg(dataURL)
            }
        });
    }
})


/**
 * 兑换
 */
var app = new Vue({
    el: '#exchange',
    data: {
        exChangeNumber: '',
        selected: "兑换"
    },
    methods: {
        onSubmit: function () {
            var rex = /^[0-9]{5,5}$/;
            if (!rex.test(this.exChangeNumber)) {
                this.$toast('兑换码为5位数字')
            } else {
                var self = this;
                server.ajax({
                    url: "/goods/useExchangedGoods",
                    data: {
                        code: self.exChangeNumber,
                        backUserId: localStorage.getItem("id")
                    },
                    success: function (result) {
                        self.$toast("兑换成功");
                    }
                })

            }
        }
    },
    watch: {
        selected: function (n, o) {
            if (n == "管理") {
                window.location.href = "index.html";
            }
        }
    }
})