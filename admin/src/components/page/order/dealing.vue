<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 订单管理</el-breadcrumb-item>
                <el-breadcrumb-item>新增待处理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量确认送货</el-button>
            <el-select v-model="select_cate" placeholder="筛选" class="handle-select mr10">
                <el-option key="1" label="半小时内" value="广东省"></el-option>
                <el-option key="2" label="两小时内" value="湖南省"></el-option>
            </el-select>
            <el-input v-model="select_word" placeholder="搜索订单号" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <el-table :data="orderData" border style="width: 100%" ref="multipleTable"
                  @selection-change="handleSelectionChange" highlight-current-row=true>
            <el-table-column type="selection" width="48"></el-table-column>
            <el-table-column label="下单时间" sortable width="116" prop="CreateTime">
            </el-table-column>
            <el-table-column prop="UserId" label="用户ID" width="80">
            </el-table-column>
            <el-table-column prop="OrderCode" label="订单号" width="140">
            </el-table-column>
            <el-table-column label="商品" width="450" class="prodetail">
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
                        <span>{{ '运费：' + scope.row.Postage }}</span>
                        <span>{{ '优惠券：' + scope.row.DistountAmout }}</span>
                    </div>
                    <div>
                        <span>{{ '余额：' + scope.row.UsedCash }}</span>
                        <span>{{'微信支付：' + scope.row.AmoutPaid }}</span>
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
                    <el-button size="small" type="warning"
                               @click="handleConfuse(scope.$index, scope.row)">退单
                    </el-button>
                    <el-button size="small" type="primary"
                               @click="handleConfirm(scope.$index, scope.row)">确认
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
                orderData: [],
                cur_page: 1,
                pagecount:1
            }
        },
        created() {
            this.updata()
        },
        computed: {},
        methods: {
            handleCurrentChange(val) {
                this.cur_page = val;
                this.updata();
            },
            getData() {
                let self = this;
                if (process.env.NODE_ENV === 'development') {
                    self.url = '/ms/table/list';
                }
                ;
                self.$axios.post(self.url, {page: self.cur_page}).then((res) => {
                    self.tableData = res.data.list;
                })
            },
            handleConfirm(index, row) {
                this.$axios.get(`https://plz.lianjin8.com/WxInterface/UserCenter/HTupdOrderStatus.ashx?OrderId=${row.OrderId}&Type=4&Remark=""`).then(res => {
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
            handleConfuse(index, row) {
                this.$confirm('确认已退款?是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.get(`https://plz.lianjin8.com/WxInterface/UserCenter/HTupdOrderStatus.ashx?OrderId=${row.OrderId}&Type=1&Remark=""`).then(res => {
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
            delAll() {
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            updata() {
                var pageindex = this.cur_page
                this.$axios.get(`https://plz.lianjin8.com/WxInterface/UserCenter/HTgetOrderList.ashx?Status=1&pageindex=${pageindex}`).then(res => {
                    var data = res.data;
                    this.orderData =data.Info
                    this.pagecount=data.pagecount
                }).catch(err => {
                })
            }
        }
    }
</script>

<style scoped>
    .prodetail {
        font-size: 13px;
        color: #00d1b2;
    }

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
</style>
