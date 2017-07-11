var add = new Vue({
    el: '#add',
    data: {
        productName: '',
        integral: "",
        selected: "管理"
    },
    methods: {
        onSubmit: function () {
            this.$toast('提交成功')
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
            var rex=/^[0-9]{1,5}$/;
            if (!rex.test(this.exChangeNumber)) {
                this.$toast('兑换码为5位数字')
            } else {
                this.$toast('提交成功')
            }
        }
    },
    watch: {
        selected:function(n,o){
            if(n=="管理"){
                window.location.href="index.html";
            }
        }
    }
})