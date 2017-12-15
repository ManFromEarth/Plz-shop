<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo"  unique-opened router   background-color="#545c64"
                 text-color="#fff"
                 active-text-color="#ffd04b">
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}
                        </template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title
                            }}
                            <el-badge class="mark" value='new' v-if="subItem.bubbles" />
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                        <el-badge class="mark" value='new' v-if="item.bubbles"/>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                items: [
                    {
                        icon: 'el-icon-menu',
                        index: '1',
                        title: '订单管理',
                        subs: [
                            {
                                index: 'dealing',
                                title: '未处理',
                                bubbles: 3
                            },
                            {
                                index: 'confirmReceipt',
                                title: '代发货',

                            },
                            {
                                index: 'returnGoods',
                                title: '退货单',

                            },
                            {
                                index: 'historyOrders',
                                title: '历史订单',

                            }
                        ]
                    },
                    {
                        icon: 'el-icon-edit',
                        index: '2',
                        title: '商品管理',
                        subs: [
                            {
                                index: 'commodity',
                                title: '商品总览'
                            },
                            {
                                index: 'editPro',
                                title: '编辑商品'
                            }

                        ]
                    },
                    {
                        icon: 'el-icon-star-on',
                        index: '3',
                        title: '用户管理',
                        subs: [
                            {
                                index: 'userform',
                                title: '用户列表'
                            }

                        ]
                    },
                    {
                        icon: 'el-icon-star-off',
                        index: '4',
                        title: '会员管理',
                        subs: [
                            {
                                index: 'vipRegister',
                                title: '注册管理'
                            },

                            {
                                index: 'vipCode',
                                title: '会员兑换码'
                            },
                            {
                                index: 'cashCoupon',
                                title: '现金劵'
                            }

                        ]
                    },
                    {
                        icon: 'el-icon-view',
                        index: 'basecharts',
                        title: '小野币商城',
                        subs: [
                            {
                                index: 'exchange',
                                title: '兑换品编辑'
                            },
                            {
                                index: 'exchangeRule',
                                title: '积分规则'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-caret-top',
                        index: 'drag',
                        title: '优惠券',
                        subs: [
                            {
                                index: 'couponRule',
                                title: '设置规则'
                            },
                            {
                                index: 'vuetable',
                                title: '查看'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-upload2',
                        index: 'cookEdit',
                        title: '菜谱管理',

                    },
                    {
                        icon: 'el-icon-message',
                        index: 'CustomerService',
                        title: '客服消息',
                        bubbles: 3
                    },
                    {
                        icon: 'el-icon-document',
                        index: 'BusinessAnalyst',
                        title: '数据统计'
                    },
                    {
                        icon: 'el-icon-setting',
                        index: 'setting',
                        title: '设置'
                    }
                ]
            }
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            }
        }
    }
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        width: 200px;
        left: 0;
        top: 70px;
        bottom: 0;
        background: #409EFF;
    }

    .sidebar > ul {
        height: 100%;
    }
</style>
