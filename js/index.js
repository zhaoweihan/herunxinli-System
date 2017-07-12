var app = new Vue({
  el: '#index',
  data: {
    message: 'Hello Vue!',
    selected:"管理"
  },
  watch: {
        selected:function(n,o){
            if(n=="兑换"){
                window.location.href="exchange.html";
            }
        }
    }
})