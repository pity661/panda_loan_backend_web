<template>
    <div style="width:50%">
        <el-form ref="form" :model="product" label-width="100px">
            <el-form-item label="产品名称：">
                <div style="display:inline" v-if="!product.isNew"><span>{{product.title}}</span>
                <span style="color:gray">{{product.isPublished === 2 ? '(已下线)' : (product.isPublished === 1 ? '(已发布)' : '(未发布)')}}</span>
                </div>
                <div style="display:inline" v-if="product.isNew">
                    <el-badge value="New" class="item">
                        <span>{{product.title}}</span>
                    </el-badge>
                    <span style="color:gray">{{product.isPublished === 2 ? '(已下线)' : (product.isPublished === 1 ? '(已发布)' : '(未发布)')}}</span>
                </div>
                <div style="display:inline;padding-left:10px;color:gray" v-if="product.isPublished === 2">
                    下线时间：{{product.unpublishTime}}
                </div>
                <div style="display:inline;padding-left:10px;color:gray" v-if="product.isPublished === 1">
                    发布时间：{{product.publishTime}}
                </div>
            </el-form-item>
            <el-form-item label="机构名称：">
                <span>{{product.lenderName}}</span>
            </el-form-item>
            <el-form-item label="产品标签：">
                <span>{{product.showFirstTags}}</span>
            </el-form-item>
            <el-form-item label="借款资格：">
                <span>{{product.showGuarantees}}</span>
            </el-form-item>
            <el-form-item label="产品链接：">
                <span>{{product.url}}</span>
            </el-form-item>
            <el-form-item label="产品logo：">
                <img :src="product.imgUrl" style="width:100px;height:100px;display:block;">
            </el-form-item>
            <el-form-item label="额度区间：">
                <span>{{product.minAmount}}元 — {{product.maxAmount}}元</span>
            </el-form-item>
            <el-form-item label="还款期数：">
                <span>{{product.minTerm}}期 — {{product.maxTerm}}期</span>
            </el-form-item>
            <el-form-item label="申请次数：">
                <span>{{product.applyTimes}}次</span>
            </el-form-item>
            <el-form-item label="产品说明：">
                <span>{{product.description}}</span>
            </el-form-item>
            
        </el-form>
    </div>
</template>

<script>
    import resources from '../../resources'
    
    export default {
        data() {
            return {
                productId: this.$route.params.id,
                product: {

                },
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                }
            }
        },
        methods: {
            getDetail() {
                let url =  resources.products();
                url = url + "/" + this.productId;
                let params = new URLSearchParams();
                this.$ajax.get(url,params)
                    .then(res => {
                        console.log(res)
                        this.product = res.data.obj1;
                        console.log(this.product)
                        var showFirstTags = '';
                        for (var i = 0; i < this.product.firstTags.length; i ++) {
                            if ( i === 0) {
                                showFirstTags = this.product.firstTags[i];
                            } else {
                                showFirstTags = showFirstTags + '|' + this.product.firstTags[i];
                            }
                        }
                        this.product.showFirstTags = showFirstTags;
                        var showGuarantees = '';
                        for (var i = 0; i < this.product.guarantees.length; i ++) {
                            if ( i === 0) {
                                showGuarantees = this.product.guarantees[i];
                            } else {
                                showGuarantees = showGuarantees + '|' + this.product.guarantees[i];
                            }
                        }
                        this.product.showGuarantees = showGuarantees;
                        this.product.publishTime = new Date(this.product.publishTime).toLocaleDateString();
                        this.product.unpublishTime = new Date(this.product.unpublishTime).toLocaleDateString();
                        // this.timestampToTime(this.product.publishTime);
                        // new Date().toLocaleString().replace(/:\d{1,2}$/, ' ');                      
                    })
            }
        },
        mounted: function () {
            this.getDetail();
        }
    }
</script>
<style lang="scss" scoped>
    .my-input{
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #bfcbd9;
        box-sizing: border-box;
        color: #1f2d3d;
        font-size: inherit;
        height: 36px;
        line-height: 1;
        outline: 0;
        padding: 3px 10px;
    }
    .page-container {
        color: #666;
        min-width: 1200px;
        .sm {
            width: 105px;
        }
        .table-panel {
            margin-top: 20px;
            .add-new{
                width: 80px;
                text-align: center;
                //margin-left: 500px;
            }     
        }
        .title {
            line-height: 2.5;
            font-weight: bold;
            font-size: 14px;
        }
        .page {
            text-align: center;
            margin: 10px;
        }
        .el-input {
            width: 145px;
        }
        .el-date-editor {
            width: 280px;
        }
        .pointer {
            cursor: pointer;
            color: #29b6f6;
        }
        .success {
            color: #13CE66;
        }
        .error {
            color: #FF4949;
        }
        #container {
            width: 650px;
            height: 500px;
            margin: 0px;
        }
        .avatar-uploader .el-upload {
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #20a0ff;
        }
        .avatar-uploader-icon {
            border: 1px dashed #d9d9d9;
            font-size: 28px;
            color: #8c939d;
            width: 200px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }
        .avatar {
            width: 200px;
            height: 200px;
            display: block;
        }
        .pic {
            width: 60px;
            height: 60px;
            display: block;
        }
    }
</style>
