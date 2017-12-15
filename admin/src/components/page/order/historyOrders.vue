<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 订单管理</el-breadcrumb-item>
                <el-breadcrumb-item>历史订单</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-table :data="orderData" border style="width: 100%" ref="multipleTable">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="CreateTime" label="下单时间" sortable width="150">
            </el-table-column>
            <el-table-column prop="OrderCode" label="订单号" width="140">
            </el-table-column>
            <el-table-column  label="商品" width="400">
                <template slot-scope="scope">
                    <div v-for="pro in scope.row.list">
                        <span>{{pro.ProductName}}</span>
                        <span>{{pro.StandardName}}</span>
                        <span>{{'×' + pro.ProductNum}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column  label="付款" width="180">
                <template slot-scope="scope">
                    <div>
                        <span >{{ '运费：' + scope.row.Postage }}</span>
                        <span >{{ '优惠券：' + scope.row.DistountAmout }}</span>
                    </div>
                    <div>
                        <span >{{ '余额：' + scope.row.UsedCash }}</span>
                        <span >{{'支付：' + scope.row.AmoutPaid }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column  label="收货地址" :formatter="formatter">
                <template slot-scope="scope">
                    <div>{{scope.row.Address}}</div>
                    <div>
                        <span>{{scope.row.UserName}}</span>
                        <span>{{scope.row.Tell}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="状态" width="170" prop="StatusText">
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
                url: '',
                tableData: [],
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
            this.getData()
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
                this.getData();
            },
            getData1() {
                let self = this;
                if (process.env.NODE_ENV === 'development') {
                    self.url = '/ms/table/list';
                }

                self.$axios.post(self.url, {page: self.cur_page}).then((res) => {
                    self.tableData = res.data.list;
                })
            },
            search() {
                this.is_search = true;
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.$message('编辑第' + (index + 1) + '行');
            },
            handleDelete(index, row) {
                this.$message.error('删除第' + (index + 1) + '行');
            },
            delAll() {
                const self = this,
                    length = self.multipleSelection.length;
                let str = '';
                self.del_list = self.del_list.concat(self.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += self.multipleSelection[i].name + ' ';
                }
                self.$message.error('删除了' + str);
                self.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getData() {
                var pageindex = this.cur_page
                this.$axios.get(`https://plz.lianjin8.com/WxInterface/UserCenter/HTgetOrderList.ashx?Status=4&pageindex=${pageindex}`).then(res => {
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
</style>
