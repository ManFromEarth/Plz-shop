<template>
    <div>
        <section class="main">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-document"></i> 数据统计</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </section>
        <div class="holdGif">
            <img class="holdGif-img" src="../../../static/img/placehold.gif">
            <p>正在完善中。</p>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        methods: {}
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
