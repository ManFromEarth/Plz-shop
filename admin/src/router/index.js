import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/dealing',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [
                {
                    path: '/',
                    component: resolve => require(['../components/page/order/dealing.vue'], resolve)
                },
                {
                    path: '/confirmReceipt',
                    component: resolve => require(['../components/page/order/confirmReceipt.vue'], resolve)
                },
                {
                    path: '/returnGoods',
                    component: resolve => require(['../components/page/order/returnGoods.vue'], resolve)
                },

                {
                    path: '/historyOrders',
                    component: resolve => require(['../components/page/order/historyOrders'], resolve)
                },
                {
                    path: '/commodity',
                    component: resolve => require(['../components/page/goodsEdit/Commodity.vue'], resolve)
                },
                {
                    path: '/editPro',
                    component: resolve => require(['../components/page/goodsEdit/Editpro.vue'], resolve)
                },
                {
                    path: '/CustomerService',
                    component: resolve => require(['../components/page/CustomerService.vue'], resolve)
                },

                {
                    path: '/setting',
                    component: resolve => require(['../components/page/setting.vue'], resolve)
                },
                {
                    path: '/BusinessAnalyst',
                    component: resolve => require(['../components/page/BusinessAnalyst.vue'], resolve)
                },
                {
                    path: '/couponRule',
                    component: resolve => require(['../components/page/couponRule.vue'], resolve)
                },
                {
                    path: '/VueTable',
                    component: resolve => require(['../components/page/VueTable.vue'], resolve)
                },
                {
                    path: '/exchange',
                    component: resolve => require(['../components/page/exShop/exchange.vue'], resolve)
                },
                {
                    path: '/exchangeRule',
                    component: resolve => require(['../components/page/exShop/exchangeRule.vue'], resolve)
                },
                {
                    path: '/userform',
                    component: resolve => require(['../components/page/userform.vue'], resolve)
                },
                {
                    path: '/cashCoupon',
                    component: resolve => require(['../components/page/vipManage/cashCoupon.vue'], resolve)
                },
                {
                    path: '/vipCode',
                    component: resolve => require(['../components/page/vipManage/vipCode.vue'], resolve)
                },
                {
                    path: '/vipRegister',
                    component: resolve => require(['../components/page/vipManage/vipRegister.vue'], resolve)
                },
                {
                    path: '/cookEdit',
                    component: resolve => require(['../components/page/cook/cookEdit.vue'], resolve)
                },

            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})
