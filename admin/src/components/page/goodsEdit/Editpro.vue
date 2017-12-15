<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-edit"></i> 商品管理</el-breadcrumb-item>
                <el-breadcruhh-item>编辑商品</el-breadcruhh-item>
            </el-breadcrumb>
        </div>
        <div class="page-cell-top"><p style="margin-bottom: 8px">编辑分类</p>
            <el-tag
                :key="tag"
                v-for="tag in Tags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag.Cid)"
                class="el-tag">
                {{tag.Cname}}
            </el-tag>
            <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm">
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">添加分类</el-button>
        </div>
        <div class="page-cell-bottom"><p style="margin-bottom: 10px;">添加商品</p>
            <el-button class="addproSymbol" type="primary" size="mini" v-if="showEditcell" @click="Editcell">添加<i
                class="el-icon-edit el-icon--right"></i></el-button>
            <div v-else style="width: 500px">
                <el-form ref="form" :model="form" label-width="80px" size="mini" label-position="left"
                         style="width: 800px;">
                    <el-form-item label="选择类目">
                        <el-select v-model="form.Cid" placeholder="">
                            <el-option :label="tag.Cname" :key="tag.Cid" :value="tag.Cid"
                                       v-for="tag in Tags"></el-option>
                        </el-select>
                    </el-form-item>
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
                            :on-preview="onPreviewCover"
                            :on-remove="onRemoveCover"
                            :on-success="onSuccessCover"
                            :auto-upload="true"
                            :on-change="onChangeCover"
                            :before-upload="beforeuploadCover"
                            :data="data"
                            name="img"
                            ref="upload"
                            :limit="3"
                            multiple
                            :disabled="Coverable"
                        >
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="coverdialogVisible" size="tiny">
                            <img width="100%" :src="coverdialogImageUrl" alt="">
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
                            :on-preview="onPreviewGroup"
                            :on-remove="onRemoveGroup"
                            :on-success="onSuccessGroup"
                            :auto-upload="true"
                            :on-change="onChangeGroup"
                            name="img"
                            ref="upload"
                            :limit="3"
                            multiple
                            :disabled="Groupable"
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
                        <el-button icon="el-icon-puls" size="mini" @click="addspec" class="addspec-but" v-show="addbuttonAble">添加规格</el-button>
                    </el-form-item>
                </el-form>
                <el-button type="primary" round style="margin-left:76px;margin-bottom: 100px" @click="submitForm">提交
                </el-button>
            </div>
        </div>
    </div>
</template>
<script>
    import ElInput from "../../../../node_modules/element-ui/packages/input/src/input.vue";
    import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item.vue";
    import ElForm from "../../../../node_modules/element-ui/packages/form/src/form.vue";

    export default {
        components: {
            ElForm,
            ElFormItem,
            ElInput
        },
        created() {
            this.ininData()
        },
        data() {
            return {
                addbuttonAble:true,
                groupdialogImageUrl: '',
                groupdialogVisible: false,
                uploadUrl: 'https://plz.lianjin8.com/WxInterface/Product/HTeditProduct.ashx',
                Tags: [],
                inputVisible: false,
                showEditcell: true,
                Coverable: false,
                Groupable: false,
                coverdialogImageUrl: '',
                coverdialogVisible: false,
                ImgGroupList: [],
                detailPicList: [],
                form: {
                    Title: '',
                    Cid: '',
                    ImgGroup: [],//imgfile
                    Tips: '',
                    IsHotProduct: false,
                    ImgCover: '',//imgfile
                    Descript: '',
                    standardlist: [
                        {
                            StandardName: '',
                            Price: 0,
                            OriginalPrice: 0,
                            Free: '',
                            Effect: '',
                            DesName: '',
                            MenuIds: '',
                            PackagingMethod: '',
                            GuaranteePeriod: '',
                            StorageMethod: '',
                            DesImg: []//imgfile
                        }
                    ]
                }
            };
        },
        methods: {
            ininData() {
                var that = this
                this.$axios.get('https://plz.lianjin8.com/WxInterface/Product/HTgetProCategeroyList.ashx').then((response) => {
                    var data = response.data
                    that.Tags = data
                }, (response) => {
                })
            },
            handleClose(cid) {
                var that = this
                this.$confirm('此操作将删除该分类下的所有商品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.get(`https://plz.lianjin8.com/WxInterface/Product/HTEditProCategroy.ashx?Type=3&Cid=${cid}&Cname=`).then((response) => {
                        if (response.data.State === 'ok') {
                            that.ininData()
                        }
                    }, (response) => {
                    })
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleInputConfirm() {
                var that = this
                var inputValue = this.inputValue;
                if (inputValue) {
                    this.$axios.post(`https://plz.lianjin8.com/WxInterface/Product/HTEditProCategroy.ashx?Type=1&Cname=${inputValue}`).then((response) => {
                            console.log(response.data.State)
                            if (response.data.State === 'ok') {
                                that.ininData()
                            }
                        }, (response) => {
                        }
                    )
                }
                this.inputVisible = false;
                this.inputValue = '';
            },
            Editcell() {
                this.showEditcell = false
            },
            addspec() {

                var specs = this.form.standardlist
                if(specs.length>=2) {
                    this.addbuttonAble=false
                }
                specs.push({
                    StandardName: '',
                    Price: 0,
                    OriginalPrice: 0,
                    Free: '',
                    Effect: '',
                    DesName: '',
                    MenuIds: '',
                    PackagingMethod: '',
                    GuaranteePeriod: '',
                    StorageMethod: '',
                    DesImg: []//imgfile
                })
            },
            submitForm() {
                var JsonStr = this.form
                if (!JsonStr.Cid || JsonStr.Cid === '') {
                    this.$message({
                        type: 'error',
                        message: '请选择类别!'
                    })
                    return
                }
                if (!JsonStr.Title || JsonStr.Title === '') {
                    this.$message({
                        type: 'error',
                        message: '请填写商品名!'
                    })
                    return
                }
                if (!JsonStr.ImgCover || JsonStr.ImgCover === '') {
                    this.$message({
                        type: 'error',
                        message: '请至少选择一张封面图!'
                    })
                    return
                }
                if (!JsonStr.Tips || JsonStr.Tips === '') {
                    this.$message({
                        type: 'error',
                        message: '请填写描述!'
                    })
                    return
                }
                if (!JsonStr.Descript || JsonStr.Descript === '') {
                    this.$message({
                        type: 'error',
                        message: '请填写促销文字!'
                    })
                    return
                }
                if ( JsonStr.ImgGroup.length === 0) {
                    this.$message({
                        type: 'error',
                        message: '请至少选择一张轮播图!'
                    })
                    return
                }
                for (var i = 0; i < JsonStr.standardlist.length; i++) {
                    if (!JsonStr.standardlist[i].StandardName || JsonStr.standardlist[i].StandardName ==='') {
                        this.$message({
                            type: 'error',
                            message: `请填写规格${i + 1}的名称!`
                        })
                        return
                    }
                    if (JsonStr.standardlist[i].Price===0 || JsonStr.standardlist[i].Price === '') {
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
                var getParam = {JsonStr: JsonStr}
                this.$axios.get('https://plz.lianjin8.com/WxInterface/Product/HTeditProduct.ashx', {params: getParam}).then((res) => {
                    if (res.data.State === 'ok') {
                        this.$notify({
                            title: '成功',
                            message: '添加商品成功。。。',
                            type: 'success'
                        });
                    }
                    else {
                        this.$notify({
                            title: '失败',
                            message: res.data.message,
                            type: 'error'
                        });
                    }
                }).catch((error) => {
                    this.$notify.error({
                        title: '失败',
                        message: '添加商品失败！'
                    });
                })
            },
            onPreviewCover(file) {
                this.coverdialogImageUrl = file.url;
                this.coverdialogVisible = true;
            },
            onRemoveCover(file, fileList) {
                var len = fileList.length
                if (len === 0) {
                    this.Coverable = false
                }
                this.form.ImgCover =''
            },
            onSuccessCover(response, file, fileList) {
                var len = fileList.length
                this.form.ImgCover=fileList[0].response
                if (len >= 1) {
                    this.Coverable =true
                }
                console.log(this.form.ImgCover)
            },
            onPreviewGroup(file) {
                this.groupdialogImageUrl = file.url;
                this.groupdialogVisible = true;
            },
            onRemoveGroup(file, fileList) {
                var len = fileList.length
                var ImgGroupList=[]
                for(var i=0;i<len;i++){
                    ImgGroupList.push(fileList[i].response)
                }
                this.form.ImgGroup = ImgGroupList
                if (len <= 2) {
                    this.Groupable = false
                }
            },
            onSuccessGroup(response, file, fileList){
                var len = fileList.length
                var ImgGroupList=[]
                for(var i=0;i<len;i++){
                    ImgGroupList.push(fileList[i].response)
                }
                this.form.ImgGroup = ImgGroupList
                console.log(this.ImgGroup)
                if (len >= 3) {
                    this.Groupable = true
                }
            }

        }
    }
</script>
<style scoped>
    .el-tag + .el-tag {
        margin-left: 10px;
    }

    .el-tag {
        height: 32px;
        line-height: 32px;
    }

    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }

    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        height: 32px;
        line-height: 32px;

    }

    .page-cell-top {
        padding-bottom: 10px;
        border-bottom: 1px #DEDEDD solid;
        height: 60px;
    }

    .page-cell-bottom {
        margin-top: 14px;
    }

    .rename {
        display: inline-flex;
        margin-left: 100px;
        align-items: center;
    }

    .rename .rename_tips {
        font-size: 13px;
        color: #8c939d;
        margin-right: 20px;
    }

    .newname {
        width: 90px;
    }

    .addproSymbol {
        margin-top: 8px;
        line-height: 22px;
    }

    .form-inline-item {
        display: flex;
    }

    .spec-cpmpute-tips {
        font-size: 12px;
        color:#97A8BE;
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
