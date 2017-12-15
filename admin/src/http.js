import axios from 'axios'
import router from './router/index'

// axios 配置
axios.defaults.timeout = 5000;
// http request 拦截器

axios.interceptors.response.use(function (response) {
    // token 已过期，重定向到登录页面
    if (response.data.State) {
        if (response.data.State === 'expire') {
            router.replace({
                path: '/login',
                query: {redirect: router.currentRoute.fullPath}
            })
        }
    }
    return response
}, function (error) {
    // Do something with response error
    return Promise.reject(error)
});

export default axios;
