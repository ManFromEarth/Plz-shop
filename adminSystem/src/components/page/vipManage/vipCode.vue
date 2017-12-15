<template>
    <div>
        <section class="main">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-star-off"></i> 会员管理</el-breadcrumb-item>
                    <el-breadcrumb-item>会员兑换码</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </section>
        <template>
            <el-table
                :data="codeData"
                stripe
                style="width: 100%">
                <el-table-column
                    label="ID"
                    width="180">
                    <template slot-scope="scope">
                        <el-tag
                            type= "success"
                            close-transition>{{scope.row.UserId}}</el-tag>
                        <el-tag
                            type= "primary"
                            close-transition v-if="scope.row.UserName">{{scope.row.UserName}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="Code"
                    label="会员兑换码"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="Remeark"
                    label="兑换物品">
                </el-table-column>

                <el-table-column label="操作" width="180" fixed="right" resizable=false>
                    <template scope="scope">
                        <el-button size="small" type="warning"
                                   @click="handleEx(scope.$index, scope.row)">兑换
                        </el-button>

                    </template>
                </el-table-column>
            </el-table>
        </template>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                codeData: []
            }
        },
        created() {
            this.updata()
        },
        computed: {},
        methods: {
            handleCurrentChange(val) {
            },
            handleEx(index, row) {
                this.$axios.get(`https://plz.lianjin8.com/WxInterface/UserCenter/exchangeRechangeCode.ashx?Code=${row.Code}`).then(res => {
                    if (res.data.State === 'ok') {
                        this.$message({
                            showClose: true,
                            message: '成功',
                            type: 'success'
                        })
                        this.updata()
                    }
                    else {
                        this.$message.error('错误');
                    }
                }).catch()
            },
            updata() {
                this.$axios.get("https://plz.lianjin8.com/WxInterface/UserCenter/HTgetRechargeCodeList.ashx").then(res => {
                    var codeData = res.data;
                        this.codeData = codeData
                }).catch(err => {
                })
            }
        }
    }
</script>

<style scoped>
    .holdGif{
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        color: #D1D1D0;
        margin-top: 200px;
        margin-right: 100px;
    }
    .holdGif-img{
        width: 150px;
        height: 150px;
        margin-right: 20px;
    }

</style>
