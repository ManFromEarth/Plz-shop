<template>
    <div>
        <section class="main">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-star-on"></i> 用户管理</el-breadcrumb-item>
                    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </section>
        <template>
            <el-table
                :data="tableData"
                stripe
                style="width: 100%">
                <el-table-column
                    prop="CreateTime"
                    label="日期"
                    width="180">
                </el-table-column>
                <el-table-column
                    label="ID"
                    width="180">
                    <template slot-scope="scope">
                        <el-tag
                            type="success"
                            close-transition>{{scope.row.Uid}}
                        </el-tag>
                        <el-tag
                            type="primary"
                            close-transition v-if="scope.row.NickName">{{scope.row.NickName}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="HasCouponNums"
                    label="优惠券">
                </el-table-column>
                <el-table-column
                    label="会员等级">
                    <template slot-scope="scope">
                        <div>{{scope.row.UserLevel === '' ? '普通会员' : scope.row.UserLevel}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="Amount"
                    label="余额">
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
        </template>


    </div>
</template>
<script>
    export default {
        data() {
            return {
                tableData: [],
                cur_page: 1,
                pagecount: 1
            }
        },
        created() {
          this.getData()
        },
        methods:{
            handleCurrentChange(val) {
                this.cur_page = val;
                this.getData();
            },
            getData(){
                var pageindex = this.cur_page
                this.$axios.get(`https://plz.lianjin8.com/WxInterface/UserCenter/HTgetUserList.ashx?IsVip=0&pageindex=${pageindex}`).then(res => {
                    var data = res.data;
                    this.tableData = data.Info
                    this.pagecount = data.pagecount
                })
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

</style>
