var add = new Vue({
    el: '#add',
    data: {
        //课程图片
        productImg:'',
        productName: '',//课程名称
        integral: "",//兑换所需积分
        selected: "管理"
    },
    methods: {
        onSubmit: function () {
            var rex = /^[0-9]{1,6}$/;
            if (!rex.test(this.integral)) {
                this.$toast('所需积分必须为1-6位数字')
            } else {
                this.$messagebox.alert('提示', '提交成功');
            }
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
    }
})
var exchange = new Vue({
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