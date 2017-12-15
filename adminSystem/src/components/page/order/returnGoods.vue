<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 订单管理</el-breadcrumb-item>
                <el-breadcrumb-item>待退货确认</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量确认可以退货</el-button>
        <el-table :data="orderData" border style="width: 100%" ref="multipleTable"
                  @selection-change="handleSelectionChange" highlight-current-row=true>
            <el-table-column type="selection" width="48"></el-table-column>
            <el-table-column label="下单时间" sortable width="116" prop="CreateTime">
            </el-table-column>
            <el-table-column prop="UserId" label="用户ID" width="80">
            </el-table-column>
            <el-table-column prop="OrderCode" label="订单号" width="140">
            </el-table-column>
            <el-table-column prop="name" label="商品" width="450">
                <template slot-scope="scope">
                    <div v-for="pro in scope.row.list">
                        <span>{{pro.ProductName}}</span>
                        <span>{{pro.StandardName}}</span>
                        <span>{{'×' + pro.ProductNum}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="付款" width="200">
                <template slot-scope="scope">
                    <div>
                        <span >{{ '运费：' + scope.row.Postage }}</span>
                        <span >{{ '优惠券：' + scope.row.DistountAmout }}</span>
                    </div>
                    <div>
                        <span >{{ '余额：' + scope.row.UsedCash }}</span>
                        <span >{{'微信支付：' + scope.row.AmoutPaid }}</span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="收货地址"
                             :filters="[{ text: '永康市', value: '永康市' }, { text: '其他', value: '其他' }]"
                             filter-placement="bottom-end">
                <template slot-scope="scope">
                    <div>{{scope.row.Address}}</div>
                    <div>
                        <span>{{scope.row.UserName}}</span>
                        <span>{{scope.row.Tell}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right" resizable=false>
                <template scope="scope">
                    <el-button size="small" type="primary"
                               @click="handleConfirm(scope.$index, scope.row)">退货
                    </el-button>
                    <el-button size="small"
                               @click="handleResuf(scope.$index, scope.row)">拒绝
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                @current-change="handleCurrentChange"
                layout="prev, pager, next"
                page-size="20"
                :page-count="pagecount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                url: 'https://plz.lianjin8.com/WxInterface/UserCenter/HTgetOrderList.ashx?Status=6',
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                orderData: [],
                cur_page: 1,
                pagecount:1
            }
        },
        created() {
            this.updata();
        },
        computed: {
            data() {
                const self = this;
                return self.tableData.filter(function (d) {
                    let is_del = false;
                    for (let i = 0; i < self.del_list.length; i++) {
                        if (d.name === self.del_list[i].name) {
                            is_del = true;
                            break;
                        }
                    }
                    if (!is_del) {
                        if (d.address.indexOf(self.select_cate) > -1 &&
                            (d.name.indexOf(self.select_word) > -1 ||
                                d.address.indexOf(self.select_word) > -1)
                        ) {
                            return d;
                        }
                    }
                })
            }
        },
        methods: {
            handleCurrentChange(val) {
                this.cur_page = val;
                this.updata();
            },
            updata() {
                var pageindex = this.cur_page
                this.$axios.get(`https://plz.lianjin8.com/WxInterface/UserCenter/HTgetOrderList.ashx?Status=3&pageindex=${pageindex}`).then(res => {
                    var data = res.data;
                    this.orderData =data.Info
                    this.pagecount=data.pagecount
                }).catch(err => {
                })
            },
            handleConfirm(index, row){
                this.$confirm('确认已退款?是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.get(`https://plz.lianjin8.com/WxInterface/UserCenter/HTupdOrderStatus.ashx?OrderId=${row.OrderId}&Type=3&Remark=""`).then(res => {
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
                }).catch(() => {

                });

            },
            handleResuf(index, row){
                this.$axios.get(`https://plz.lianjin8.com/WxInterface/UserCenter/HTupdOrderStatus.ashx?OrderId=${row.OrderId}&Type=5&Remark=""`).then(res => {
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

            }

        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .mr10 {
        margin-bottom: 20px;
    }
</style>
