<template>
    <div>
        <section class="main">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-star-off"></i> 会员管理</el-breadcrumb-item>
                    <el-breadcrumb-item>现金券</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </section>
        <div class="setting">
            <div class="setcell">
                <span>现金券金额：</span>
                <el-input class="cashAmount-input" v-model="Amount"></el-input>
            </div>
            <div class="setcell">
                <span>数量：</span>
                <el-input class=" cashAmount-input" v-model="Count"></el-input>
            </div>
            <el-button type="primary" @click="giveOut" class="born">生成</el-button>
        </div>

        <div>
            <p class="couponTit">现金券列表</p>
            <el-tag v-for="cash in cashCoupon" class="el-tag" size="medium" :disable-transitions="false"
                    @close="handleClose(cash)" closable type="info">
                <span class="cashAmount">{{'￥' + cash.Amount}}</span>
                <span>{{cash.Code}}</span>

            </el-tag>
        </div>

    </div>
</template>
<script>
    import ElButton from "../../../../node_modules/element-ui/packages/button/src/button.vue";
    import ElForm from "../../../../node_modules/element-ui/packages/form/src/form.vue";
    import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item.vue";
    import ElInput from "../../../../node_modules/element-ui/packages/input/src/input.vue";
    import ElTag from "../../../../node_modules/element-ui/packages/tag/src/tag.vue";

    export default {
        components: {
            ElTag,
            ElInput,
            ElFormItem,
            ElForm,
            ElButton
        },
        created() {
           this.updataCash()
        },

        data() {
            return {
                cashCoupon: [],
                Amount: 0,
                Count: 1
            }
        },
        methods: {
            giveOut() {
                var jsonStr = JSON.stringify({
                    CashName: '',
                    Amount: this.Amount,
                    Count: this.Count

                })
                this.$axios.get(`https://plz.lianjin8.com/WxInterface/Coupon/AddCashCoupon.ashx?JsonStr=${jsonStr}`).then(
                    res => {
                         if(res.data.State==='ok'){
                             this.updataCash()
                         }
                    }
                )
            },
            handleClose(cash) {
                if (cash.ID) {
                    this.$axios.get(`https://plz.lianjin8.com/WxInterface/Coupon/DelCashCoupon.ashx?ID=${cash.ID}`).then(res => {
                        if (res.data.State === 'ok') {
                            this.updataCash()
                        }
                    })
                }
            },
            updataCash(){
                this.$axios.get('https://plz.lianjin8.com/WxInterface/Coupon/GetCashCouponList.ashx').then(
                    res => {
                        if (res.data) {
                            this.cashCoupon = res.data
                        }
                    }
                )
            }
        }
    }
</script>

<style scoped>
    .holdGif {
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        color: #D1D1D0;
        margin-top: 200px;
        margin-right: 100px;
    }

    .holdGif-img {
        width: 150px;
        height: 150px;
        margin-right: 20px;
    }

    .cashAmount-input {
        width: 60px;
    }

    .el-tag {
        margin-right: 6px;
        margin-bottom: 6px;
    }

    .setting {
        display: flex;
        margin-bottom: 20px;
    }

    .born {
        margin-left: 20px;
    }

    .setcell {
        margin-right: 14px;
    }

    .cashAmount {
        margin-right: 6px;
    }

    .couponTit {
        margin-bottom: 20px;
    }

</style>
