/**
 * 添加课程
 */
var app = new Vue({
    el: '#add',
    data: {
        //课程图片
        productImg: '',
        productName: '', //课程名称
        integral: "", //兑换所需积分
        selected: "管理",
        maskStatus:false
    },
    methods: {
        onSubmit: function () {
            var rex = /^[0-9]{1,6}$/;
            if (!rex.test(this.integral)) {
                this.$toast('所需积分必须为1-6位数字')
            } else {
                this.$messagebox.alert('提示', '提交成功');
            }
        },
        // input file change事件 打开截图遮罩层
        fileMaskOpen:function(){
            this.maskStatus=true;
        },
        //关闭遮罩层
        closeMask:function(){
            this.maskStatus=false;
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
    mounted: function () {
        var self=this;
        var addImg = new bjj.PhotoClip("#clipArea", {
            size: [200, 200],
            outputSize: [100, 100],
            file: "#uploadImg",
            ok: "#clipBtn",
            loadError:function(errMsg,imgError){
                console.log('errMsg:'+errMsg);
                console.log('imgError:'+imgError);
            },
            clipFinish: function (dataURL) {
                self.maskStatus=false;
                self.productImg=dataURL;
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
                this.$messagebox.alert('提示', '提交成功');
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