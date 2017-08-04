var app = new Vue({
    el: '#index',
    data: {
        see: false,
        selected: "管理",
        pageNum: 1, //页码 初识值为1
        pageSize: 6, //每页条数
        curriculumList: [],
        baseImageUrl: "",
        listKey: true
    },
    methods: {
        getList: function () {
            var self = this;
            server.ajax({
                url: "/goods/list",
                data: {
                    pageNum: this.pageNum,
                    pageSize: this.pageSize,
                    status: -1
                },
                beforeSend: function () {
                    self.$indicator.open();
                },
                success: function (result) {
                    if (result.data.goodsList.length == 0) {
                        self.listKey = false;
                    }
                    self.baseImageUrl = result.data.baseImageUrl;
                    result.data.goodsList.forEach(function (element) {
                        self.curriculumList.push(element);
                    }, this);
                    self.$indicator.close();
                    self.see = true;

                }
            })
        },
        badgeColor: function (num) {
            return num ? "" : "#888";
        },
        loadMore: function () {
            if (this.listKey) {
                this.pageNum++;
                this.getList()
            }

        },
        //上下架接口
        downAndUp: function (type, id) {
            var self = this;
            this.$messagebox.confirm('确定切换上下架?').then(action => {
                var status = null;
                type ? status = 0 : status = 1; //判断是上架还是下架
                server.ajax({
                    url: "/goods/update",
                    data: {
                        status: status,
                        backUserId: localStorage.getItem('id'),
                        goodsId: id
                    },
                    success: function (result) {
                        self.curriculumList.forEach(function (ele) {
                            if (id == ele.id) {
                                ele.status = status;
                            }

                        })
                    }
                })
            });
        },
        // 编辑修改课程
        edit: function (id, img, name, integral,productUrl) {
            window.location.href = "add.html?goodsId=" + id + "&baseUrl=" + this.baseImageUrl + "&imgUrl=" + img + "&name=" + name + "&integral=" + integral+"&productUrl="+productUrl;
        }
    },
    watch: {
        selected: function (n, o) {
            if (n == "兑换") {
                window.location.href = "exchange.html";
            }
        },

    },
    created: function () {
        this.getList();
    },
    mounted: function () {
        server.isLogin(this);
    },
    filters: {
        status: function (text, isWord) {
            return text == isWord ? text = "下架" : text = "上架";
        }
    }
})