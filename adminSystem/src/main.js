import axios from './http'
import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';    // 浅绿色主题
import "babel-polyfill";
import moment from 'moment';
Vue.use(ElementUI);
Vue.prototype.$axios = axios;
Vue.prototype.$moment = moment;
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
