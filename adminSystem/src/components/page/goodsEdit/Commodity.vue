<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-edit"></i> 商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>商品总览</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div v-if="visable">
            <div v-for="cgoods in goodsList" class="Citem">
                <h6 class="classifa">{{cgoods.Cname}}</h6>
                <div class="goodsWrap">
                    <div v-for="singel in cgoods.productlist" class="singel-pro" @click="loadGoods(singel.Pid)">
                        <img :src="singel.ImgCover" class="ImgGroup">
                        <div>{{singel.Title}}</div>
                    </div>
                </div>
            </div>
        </div>
        <el-form label-position="left" label-width="80px" :model="editForm" v-else class="editForm">
            <el-form-item label="商品名称">
                <el-input v-model.trim="form.Title"></el-input>
            </el-form-item>
            <el-form-item label="是否热门">
                <el-checkbox v-model="form.IsHotProduct"></el-checkbox>
            </el-form-item>
            <el-form-item label="封面图">
                <el-upload
                    action="https://plz.lianjin8.com/WxInterface/Product/UploadHandler.ashx"
                    list-type="picture-card"
                    :on-remove="onRemoveCover"
                    :on-success="onSuccessCover"
                    :disabled="Coverable"
                    :file-list="coverfileList">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible" size="tiny">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item label="描述" class="form-inline">
                <el-input v-model.trim="form.Tips"></el-input>
            </el-form-item>
            <el-form-item label="促销文字">
                <el-input v-model.trim="form.Descript"></el-input>
            </el-form-item>
            <el-form-item label="轮播图">
                <el-upload
                    action="https://plz.lianjin8.com/WxInterface/Product/UploadHandler.ashx"
                    list-type="picture-card"
                    :on-remove="onRemoveGroup"
                    :on-success="onSuccessGroup"
                    :auto-upload="true"
                    :limit="3"
                    multiple
                    :disabled="Groupable"
                    :file-list="fileList"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="groupdialogVisible" size="tiny">
                    <img width="100%" :src="groupdialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item label="规格" class="spec-form-item">
                <div v-for="(spec,specIndex) in form.standardlist">
                    <p class="spec-cpmpute-tips">规格{{specIndex + 1}}:</p>
                    <div class="inline-cell inline-cell-wrap">
                        <el-input placeholder="规格名称"
                                  v-model.trim="form.standardlist[specIndex].StandardName"></el-input>
                        <el-input placeholder="规格说明（非必填）"
                                  v-model.trim="form.standardlist[specIndex].DesName"></el-input>
                    </div>
                    <div class="inline-cell inline-cell-wrap">
                        <el-input placeholder="售价"
                                  v-model.trim.number="form.standardlist[specIndex].Price"></el-input>
                        <el-input placeholder="原价（非必填）"
                                  v-model.trim.number="form.standardlist[specIndex].OriginalPrice"></el-input>
                    </div>
                    <el-input placeholder="赠品（非必填）" class="inline-cell-wrap"
                              v-model.trim="form.standardlist[specIndex].Free"></el-input>
                    <el-input placeholder="包装" class="inline-cell-wrap"
                              v-model.trim="form.standardlist[specIndex].PackagingMethod"></el-input>
                    <el-input placeholder="贮藏" class="inline-cell-wrap"
                              v-model.trim="form.standardlist[specIndex].StorageMethod"></el-input>
                    <el-input placeholder="保质期" class="inline-cell-wrap"
                              v-model.trim="form.standardlist[specIndex].GuaranteePeriod"></el-input>
                </div>
            </el-form-item>
            <div>
                <el-button type="primary" round style="margin-left:76px;margin-bottom: 100px" @click="submitForm">修改商品
                </el-button>
                <el-button type="warning" round style="margin-left:30px;margin-bottom: 100px" @click="deletePro">删除商品
                </el-button>
            </div>
        </el-form>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                Coverable:true,
                Groupable:false,
                goodsList: [],
                visable: true,
                form: {},
                coverfileList: [],
                fileList: []
            }
        },
        created() {
            this.fetchList()
        },
        computed: {},
        methods: {
            fetchList() {
                this.$axios.get('https://plz.lianjin8.com/WxInterface/Product/HTgetProductList.ashx').then(res =>{
                    if (res.status === 200) {
                        this.goodsList = res.data
                    }
                }).catch()
            },
            loadGoods(pid) {
                if (pid) {
                    this.$axios.get(`https://plz.lianjin8.com/WxInterface/Product/getProductInfo.ashx?Pid=${pid}`).then(res =>{
                        if (res.status === 200) {
                            this.visable = !this.visable;
                            this.form = res.data
                            var cover=res.data.ImgCover
                            var group=res.data.ImgGroup
                            var coverfileList=[]
                            var fileList=[]
                            coverfileList[0]={url:cover}
                            this.coverfileList=coverfileList
                            for(var i=0,len=group.length;i<len;i++){
                                fileList.push({
                                    url:group[i]
                                })
                            }
                            if(fileList.length>=3){
                               this.Groupable=true
                            }
                            this.fileList=fileList
                        }
                    })
                }
            },
            submitForm() {
                var coverfileList = this.coverfileList
                var fileList=this.fileList
                var JsonStr = this.form
                console.log(coverfileList,fileList,JsonStr)
                if(coverfileList.length===0){
                    this.$message({
                        type: 'error',
                        message: '请至少选择一张封面图'
                    })
                    return
                }
                if(fileList.length===0){
                    this.$message({
                        type: 'error',
                        message: '请至少选择一张轮播图'
                    })
                    return
                }
                if (!JsonStr.Title || JsonStr.Title === ''){
                    this.$message({
                        type: 'error',
                        message: '请填写商品名!'
                    })
                    return
                }
                if (!JsonStr.Tips || JsonStr.Tips === ''){
                    this.$message({
                        type: 'error',
                        message: '请填写描述!'
                    })
                    return
                }
                if (!JsonStr.Descript || JsonStr.Descript === ''){
                    this.$message({
                        type: 'error',
                        message: '请填写促销文字!'
                    })
                    return
                }
                for (var i = 0; i < JsonStr.standardlist.length; i++) {
                    if (!JsonStr.standardlist[i].StandardName || JsonStr.standardlist[i].StandardName == '') {
                        this.$message({
                            type: 'error',
                            message: `请填写规格${i + 1}的名称!`
                        })
                        return
                    }
                    if (!JsonStr.standardlist[i].Price || JsonStr.standardlist[i].Price ===0) {
                        this.$message({
                            type: 'error',
                            message: `请填写规格${i + 1}的售价!`
                        })
                        return
                    }
                    if (!Number.isInteger(JsonStr.standardlist[i].Price)) {
                        this.$message({
                            type: 'error',
                            message: `规格${i + 1}的售价应填写为数字!`
                        })
                        return
                    }
                }
                JsonStr.ImgCover=coverfileList[0].url
                var ImgGroup=[]
                for(var i=0,length=fileList.length;i<length;i++){
                    ImgGroup.push(fileList[i].url)
                }
                JsonStr.ImgGroup=ImgGroup
                var getParam = {JsonStr: JsonStr}
                this.$axios.get('https://plz.lianjin8.com/WxInterface/Product/HTeditProduct.ashx', {params: getParam}).then((res) => {
                    if (res.data.State === 'ok') {
                        this.$message({
                            message: '修改商品成功',
                            type: 'success'
                        });
                    }
                    else {
                        this.$message({
                            message: res.data.message,
                            type: 'error'
                        });
                    }
                }).catch((error) => {
                    this.$message.error({
                        message: '修改商品失败'
                    });
                })
            },
            deletePro() {
                var pid = this.form.Pid
                this.$axios.get(`https://plz.lianjin8.com/WxInterface/Product/HTdelProduct.ashx?Pid=${pid}`).then(res => {
                    if (res.data.State === 'Ok') {
                        this.$message.success('删除商品成功');
                    } else {
                        this.$message.error('删除商品失败');
                    }
                }).catch(res => {
                    this.$message.error('错误');
                })
            },
            onRemoveCover(file, fileList) {
                var len=fileList.length
                var form=this.form
                if (len === 0) {
                    this.Coverable = false
                }
                this.coverfileList=fileList
            },
            onSuccessCover(response, file, fileList){
                var len = fileList.length
                file.url=file.response
                if (len >= 1) {
                    this.Coverable =true
                }
                this.coverfileList=fileList
            },
            onRemoveGroup(file, fileList) {
                var len = fileList.length
                if (len <= 2) {
                    this.Groupable = false
                }
                this.fileList=fileList
            },
            onSuccessGroup(response, file, fileList){
                var len = fileList.length
                if (len >= 3) {
                    this.Groupable = true
                }
                file.url=file.response
                this.fileList=fileList
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

    .goodsWrap {
        display: flex;
    }

    .goodsWrap :hover {
        color: #20a0ff;
        cursor: pointer;
    }

    .ImgGroup {
        height: 80px;
        width: 80px;
        border-radius: 10%;
        border: 1px transparent solid;
    }

    .ImgGroup:hover {
        border: 1px #20a0ff solid;
        display: inline-block;

    }

    .Citem {
        margin-bottom: 20px;
        font-size: 13px;
    }

    .singel-pro {
        margin-right: 18px;
    }

    .classifa {
        margin-bottom: 10px;
    }

    .editForm {
        width: 400px;
    }

    .form-inline-item {
        display: flex;
    }

    .spec-cpmpute-tips {
        font-size: 12px;
        color: #97A8BE;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;

    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 140px;
        height: 140px;
        display: block;
    }

    .inline-cell-wrap {
        margin-bottom: 10px;
        display: flex;
    }
</style>
