<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 订单管理</el-breadcrumb-item>
                <el-breadcrumb-item>待送货</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量确认完成送货</el-button>
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
                               @click="handlePostmesage(scope.$index, scope.row)">发送送出消息
                    </el-button>
                    <el-button size="small" type="primary"
                               @click="handleConfirm(scope.$index, scope.row)">确认送达
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
                this.$axios.get(`https://plz.lianjin8.com/WxInterface/UserCenter/HTupdOrderStatus.ashx?OrderId=${row.OrderId}&Type=2&Remark=""`).then(res => {
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
            delAll() {
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            updata() {
                var pageindex = this.cur_page
                this.$axios.get(`https://plz.lianjin8.com/WxInterface/UserCenter/HTgetOrderList.ashx?Status=2&pageindex=${pageindex}`).then(res => {
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
