<template>
    <div class="zoom">
            <div class="main-panel">
                <el-col class="table-panel">
                    <el-col :span="24">
                        <el-form :inline="true" :model="filters">
                            <el-form-item label="包名">
                                <el-input v-model="filters.packageName" placeholder="输入包名"></el-input>
                            </el-form-item>
                            <el-form-item label="版本号">
                                <el-input v-model="filters.versionCode" placeholder="输入版本号"></el-input>
                            </el-form-item>
                            <el-form-item label="模版类型：">
                                <el-select class="sm" v-model="filters.templateId" placeholder="筛选名称" filterable clearable style="width:200px">
                                    <el-option v-for="(item,index) in templateList" :key="index" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="addTemplate()" class="add-new">添加</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="getRedisTemplate()" class="add-new">查询</el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="searchLog()" class="add-new">查询日志</el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>

                    <el-table :data="allConfig" style="width:60%">
                        <el-table-column prop="key" label="Key">
                        </el-table-column>
                        <el-table-column prop="value" label="Value">
                        </el-table-column>
                        <el-table-column label="操作" style="width:40">
                            <template scope="scope">
                                <el-button type="text" @click="deleteTemplate(scope.row.key)">删除</el-button>
                            </template>
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
                templateList:[],
                filters:{
                    packageName: '',
                    versionCode: '',
                    templateId: ''
                },
                allConfig:[],
                result:[]
            }
        },
        watch: {
        },
        methods: {
            // 去除左右空格
            trim(s){
                return s.replace(/(^\s*)|(\s*$)/g, "");
            },

            deleteTemplate(key) {
                let url = resources.delTemplate(key);
                let params = new URLSearchParams();
                this.$ajax.get(url,params)
                .then(res => {
                    if (res.status == 200) {
                        this.result = key + " " + "删除成功";
                        this.succeed();
                        for (var i in this.allConfig) {
                            if (this.allConfig[i].key == key) {
                                this.allConfig.splice(i,1);
                                break;
                            }
                        }
                    } 
                })
                .catch(error => {
                   this.mistake("删除失败");
                });
            },
            addTemplate() {
                if (this.filters.packageName == '' || this.trim(this.filters.packageName).length == 0) {
                    this.lackMessage("包名不能为空");
                    return;
                }
                if (this.filters.versionCode == '' || this.trim(this.filters.versionCode).length == 0) {
                    this.lackMessage("版本号不能为空");
                    return;
                }
                if (this.filters.templateId == '') {
                    this.lackMessage("挡板不能为空");
                    console.log(this.trim(this.filters.packageName).length)
                    console.log(this.trim(this.filters.versionCode))
                    return;
                }
                let url = resources.addTemplate();
                let params = new URLSearchParams();
                params.append('packageName', this.trim(this.filters.packageName));
                params.append('versionCode', this.trim(this.filters.versionCode));
                params.append('templateId', this.filters.templateId);
                this.$ajax.post(url,params)
                .then(res => {
                    //console.log(res)
                    this.allConfig = res.data.obj1;     
                })            
            },
            getRedisTemplate() {
                let params = new URLSearchParams();
                if (this.filters.packageName != '' && this.trim(this.filters.packageName).length != 0) {
                    params.append('packageName',this.trim(this.filters.packageName));
                }
                let url = resources.getTemplate();
                this.$ajax.post(url,params)
                .then(res => {
                    console.log(res)
                    this.allConfig = res.data.obj1;     
                })
            },
            searchLog() {
                if (this.filters.templateId == '') {
                    this.lackMessage("挡板不能为空");
                    return;
                }
                let url = resources.getDeviceLog(this.filters.templateId);
                let params = new URLSearchParams();
                this.$ajax.get(url,params)
                    .then(res => {
                        this.open(res.data.statusMsg + '  ' + res.data.obj1 + ' \n ' + res.data.obj2,"查询结果")
                    })  
            },
            open(message,title) {
                this.$alert(message, title, {
                    confirmButtonText: '确定',
                    callback: action => {
                        
                    }
                });
            },
            getTemplate() {
                // 获取所有模版数据
                let url = resources.template();
                let params = new URLSearchParams();
                params.append('packageName',"template%");
                this.$ajax.post(url,params)
                .then(res => {
                    this.templateList = res.data.obj1;      
                })
            },
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
            mistake(mistakeMes){
                this.$notify.error({
                    title: '错误',
                    message: mistakeMes
                    });
            },
        },
        mounted: function () {
            this.getTemplate();
            this.getRedisTemplate();
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

