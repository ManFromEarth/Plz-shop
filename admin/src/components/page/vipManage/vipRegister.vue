<template>
    <div>
        <section class="main">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-star-off"></i> 会员管理</el-breadcrumb-item>
                    <el-breadcrumb-item>注册管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </section>
        <div class="vipWrap">
            <p>设置会员</p>
            <el-form :model="levels" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
                <el-form-item
                    v-for="(lv, index) in levels"
                    :label="'会员' + index"
                    :rules="[
      { required: true, message: '年龄不能为空'},
      { type: 'number', message: '年龄必须为数字值'}
    ]"
                    class="inputWrap"
                >
                    <el-input class="input-cell" placeholder="会员名" v-model="levels[index].LevelName"></el-input>
                    <el-input class="input-cell input-nums" placeholder="价格"
                              v-model="levels[index].NeedAmount"></el-input>
                    <el-input class="input-cell input-nums" placeholder="折扣系数"
                              v-model="levels[index].Discount"></el-input>
                    <el-input class="input-cell" placeholder="会员增值服务" v-model="levels[index].SendGift"></el-input>
                    <el-button @click.prevent="removeLevel(lv)">删除</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="addDomain" type="primary" plain>新增会员</el-button>
                    <el-button @click="submitForm" type="primary">提交</el-button>
                </el-form-item>
            </el-form>

        </div>

    </div>
</template>

<script>

    export default {
        data() {
            return {
                levels: []
            };
        },
        created() {
            this.initVIPData()
        },
        methods: {
            submitForm() {
                var levels = JSON.stringify(this.levels)
                this.$axios.get(`https://plz.lianjin8.com/WxInterface/UserCenter/HTeditLevel.ashx?JsonStr=${levels}`).then(
                    res => {
                        if (res.data.State === 'ok') {
                            this.$message.success('提交成功')
                            this.initVIPData()
                        }
                        else {
                            this.$message.error('错误')
                        }
                    }
                ).catch(
                    err => {
                        this.$message.error('错误')
                    }
                )
            },
            removeLevel(item) {
                var index = this.levels.indexOf(item)
                if (index !== -1) {
                    if (item && item.LevelId !== 0) {
                        this.$axios.get(`https://plz.lianjin8.com/WxInterface/UserCenter/HTDelLevel.ashx?LevelId=${item.LevelId}`).then(
                            (res) => {
                                if (
                                    res.data.State === 'ok'
                                ) {
                                    this.levels.splice(index, 1)
                                } else {
                                    this.$message.error('删除出错')
                                }
                            }
                        ).catch(err => {
                            this.$message.error('删除出错')
                        })
                    } else {
                        this.levels.splice(index, 1)
                    }
                }
            },
            addDomain() {
                this.levels.push({
                    LevelName: '',
                    NeedAmount: 0,
                    Discount: 0,
                    SendGift: '',
                    LevelId: 0
                });
            },
            initVIPData() {
                this.$axios.get('https://plz.lianjin8.com/WxInterface/UserCenter/getLevelList.ashx').then(res => {
                    if (res.status === 200 && res.data) {
                        this.levels = res.data
                    }
                })
            }
        }
    }
</script>

<style scoped>

    .input-cell {
        display: inline-block;
        width: 20%;
    }

    .input-nums {
        width: 12%;
    }

</style>
