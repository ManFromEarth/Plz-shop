<template>
    <div class="login-wrap">
        <img class="company-logo" src="../../../static/img/plz_logo.gif">
        <div class="ms-title">品丽州生鲜小程序后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password"
                              @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
    export default {
        data: function () {
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                const self = this;
                var PassWord = this.ruleForm.password
                var Name = this.ruleForm.username
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        localStorage.setItem('ms_username', self.ruleForm.username);
                        this.$axios.get(`https://plz.lianjin8.com/WxInterface/Manage/Login.ashx?PassWord=${PassWord}&Name=${Name}`).then(res => {
                            if (res.data.State === 'ok') {
                                self.$router.push('/dealing');
                            }
                            else {
                                this.$message.error('用户名或密码不正确')
                            }
                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;

    }

    .ms-title {
        position: absolute;
        top: 50%;
        width: 100%;
        margin-top: -230px;
        text-align: center;
        font-size: 30px;
        color: #fff;

    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 300px;
        height: 160px;
        margin: -150px 0 0 -190px;
        padding: 40px;
        border-radius: 5px;
        background: #fff;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
    }

    .company-logo {
        width: 100px;
        height: 100px;
        margin-top: 120px;
        border-radius: 14px;
    }
</style>
