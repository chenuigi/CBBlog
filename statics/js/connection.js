/**
 * Created by zt on 2018/4/15 0015.
 */
/**
*请求后台服务器的内容
 **/

/*转发页面*/
/*全局 登录*/
var loginKey = false;
(function (window) {
    /**创建axios实例*/
   //var token = getCookie("token");
    const service = axios.create({
        baseURL:'/v1/', // api的base_url
        timeout: 8000, // 请求超时时间
        //headers: {'Content-Type': 'application/json; charset=UTF-8'},
        responseType:'json'
    });

    /**添加请求拦截器*/
    service.interceptors.request.use(function (config) {

        /*在除了登录不传token时，都需要传一个token，，后台验证*/
        // token = getCookie("access_token");

        // /*controllerId传入 判断权限*/
        // var controlId = getCookie("controlId");

        // if((token==null||token==""||token==undefined)&& loginKey==true){
        //     window.location.href='/index.html';
        // }
        // if(loginKey==true){
        //    config.headers['controller_id'] = controlId;
        //    config.headers['access_token'] = token;
        // }
        /*-----------*/

        return config;
    }, function (error){
        console.error('请求异常',error);
        return Promise.reject(error);
    });

    // 添加响应拦截器
    service.interceptors.response.use(function (response) {
        if(typeof(response.data.code)=='undefined'){
            return false;
        }
        if(response.data.code == 200){  //ret 1成功  0失败
            //todo
            return response;
        }else {
            var code=response.data.code;
            if((code+='').slice(0,1)==4||code=='10127'){
                 clearAllCookie();
              //  window.location.href='/index.html';
            }
            code = codeDefaults[code];
            AMUI.dialog.tips({title:'提示', content: initString(code), type: 'error'});
           
        }
        return response;
    }, function (error) {
        /*AMUI.dialog.alert({
            title:'提示',
            content:error
        });*/
        return Promise.reject(error);
    });

    let fetch = service;
    window.fetch=fetch;
    if(Vue){
        Vue.prototype.fetch = fetch;
        console.info('fetch已注入到Vue');
    }
})(window);