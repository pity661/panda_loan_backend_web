/**
 * http配置
 */
// 引入axios以及element ui中的loading和message组件
import axios from 'axios'
import { Loading, Message } from 'element-ui'
import resources from './resources'
import router from './router'
// 超时时间
axios.defaults.timeout = 20000
// 启用cookie
axios.defaults.withCredentials = true
// http请求拦截器
axios.interceptors.request.use(config => {
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    if (sessionStorage.getItem('token')) {  
        config.headers.Authorization =  sessionStorage.getItem('token');
    }
    // element ui Loading方法
    return config
}, error => {
    Message.error({
        message: '加载超时'
    })
    return Promise.reject(error)
})

// const router = new VueRouter({
//     routes
// })

// http响应拦截器
axios.interceptors.response.use(data => {
    return data
}, error => {
    if (error.response) {
        console.log(error.response);
        switch (error.response.status) {
            case 401: 
                // 返回 401 清除token信息并跳转到登录页面
                sessionStorage.removeItem('token');
                Message.error({
                    message: error.response.data.statusMsg
                })
                // 1.5秒时间间隔
                setTimeout(function (){
                    window.location.reload(true);
                },1500)
                // router.replace({
                //     path: 'product',
                //     query: {redirect: router.currentRoute.fullPath}
                // });
                
                break;
            case 403:
                Message.error({
                    message: error.response.data.statusMsg
                })
                break;
            default:
            console.log("default");
        }
    }
    // Message.error({
    //     message: '哎呦,网络好像有点问题,无响应数据返回～'
    // })
    return Promise.reject(error);
})

export default axios