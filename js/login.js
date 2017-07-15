var app = new Vue({
    el: '#login',
    data: {
        username: '',
        password: '',
    },
    methods: {
        onSubmit: function () {
            var self=this;
            // server.ajax({
            //     url: "/backUser/updatePassword.json",
            //     data: {
            //         backUserId: 1,
            //         oldPassword: "222222",
            //         newPassword: "123456"
            //     },
            //     success: function (result) {
            //         console.log(result)
            //     }
            // })
            server.ajax({
                url: "/backUser/login",
                data: {
                    username: self.username,
                    password: self.password,
                },
                success: function (result) {
                    localStorage.setItem("token",result.data.token);
                    localStorage.setItem("id",result.data.id);
                    localStorage.setItem("username",result.data.username);
                    window.location.href='index.html';
                }
            })
        }
    }

})