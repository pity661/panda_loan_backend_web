<template>
    <div class="zoom">
            <div class="main-panel">
                <el-col class="table-panel">
                    <el-col :span="24">
                        <el-form :inline="true" :model="filters">
                            <el-form-item label="产品名称">
                                <el-input v-model="filters.title" placeholder="输入产品名称"></el-input>
                            </el-form-item>
                            <el-form-item label="机构名称">
                                <el-input v-model="filters.lenderName" placeholder="输入机构名称"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="search()" class="add-new">查找</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>

                    <el-table :data="allproducts" v-loading="loading" :move="getdata" @update="datadragEnd">
                        <el-table-column prop="id" label="Id" width="80">
                        </el-table-column>
                    </el-table>
                </el-col>
            </div>
        </div>
</template>

<script>
    import resources from '../../resources'
    export default {
        data() {
            return {
            }
        },
        watch: {
        },
        methods: {
            succeed(){
                this.$notify({
                    title: '成功',
                    message: this.result,
                    type: 'success'
                    });
            },
            lackMessage(mistakeMes){
                this.$notify({
                    title: '警告',
                    message: mistakeMes,
                    type: 'warning'
                    });
            },
            mistake(){
                this.$notify.error({
                    title: '错误',
                    message: '添加失败'
                    });
            },
        },
        mounted: function () {
            
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
                height: 50px;
                width: 80px;
                text-align: center;
                //margin-left: 500px;
            }
            .sort{
                height: 50px;
                width: 100px;
                text-align: center;
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

<style>
    body {
        zoom:0.8;
    }
</style>
