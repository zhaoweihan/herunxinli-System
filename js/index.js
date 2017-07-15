var app = new Vue({
    el: '#index',
    data: {
        selected: "管理",
        pageNum: 1,//初识值为1
        pageSize: 6,
        curriculumList: [],
        baseImageUrl: "http://ot18ayapm.bkt.clouddn.com/",
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
                success: function (result) {
                    if (result.data.goodsList.length == 0) {
                        self.listKey = false;
                    }
                    self.baseImageUrl = result.data.baseImageUrl;
                    result.data.goodsList.forEach(function (element) {
                        self.curriculumList.push(element);
                    }, this);

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