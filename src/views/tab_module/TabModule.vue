<template>
    <div class="page-container">
        <div class="main-panel">
            <el-col class="table-panel">
                <el-form :inline="true" :model="filters">
                    <el-form-item label="发布平台">
                        <el-select class="sm" v-model="filters.platformId" placeholder="发布平台" clearable v-on:change="clientMessage()" style="width:150px">
                            <el-option label="Android" value="0"></el-option>
                            <el-option label=iOS value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="App名称">
                        <el-select class="sm" v-model="filters.appName" placeholder="应用名称" filterable v-on:change="clientMessage()" clearable style="width:150px">
                            <el-option v-for="(item,index) in filters.appNames" :key="index" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="渠道名">
                        <el-select class="sm" v-model="filters.channelId" placeholder="渠道名" filterable v-on:change="clientMessage()" clearable style="width:150px">
                            <el-option v-for="(item,index) in filters.channels" :key="index" :label="item.channelName" :value="item.channelId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="版本号">
                        <el-select class="sm" v-model="filters.versionCode" placeholder="版本号" clearable v-on:change="clientMessage()" style="width:150px">
                            <el-option v-for="(item,index) in filters.versionCodes" :key="index" :label="item.versionName + '  (' + item.versionCode + ')' " :value="item.versionCode"></el-option>
                        </el-select>
                    </el-form-item>
                    <br>
                    <el-form-item label="包名">
                        <el-select class="sm" v-model="filters.packageName" placeholder="包名" filterable clearable v-on:change="clientMessage()" style="width:250px">
                            <el-option v-for="(item,index) in filters.packageNames" :key="index" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <span style="padding-left:100px"/>
                    <el-form-item>
                        <el-button type="primary" @click="search()" class="add-new">筛选</el-button>
                    </el-form-item>
                    <el-form-item v-if="clientVersion != null">
                            <el-button type="primary" @click="editTabModule()" class="add-new">编辑</el-button>
                    </el-form-item>

                    <el-table :data="tabModuleList">
                        <el-table-column prop="" label="编号" width="70">
                            <template slot-scope="scope">
                                {{(pageNumber - 1) * pageSize + scope.$index + 1}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="" label="操作" width="70">
                            <template slot-scope="scope">
                                <el-button type="text" @click="alterUrl(scope.row.id,scope.row.schemeUrl,scope.row.iconUrl,scope.row.name,scope.row.moduleId)">修改</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="moduleId" label="菜单id">
                        </el-table-column>
                        <el-table-column prop="name" label="名称">
                        </el-table-column>
                        <el-table-column label="平台">
                            <template slot-scope="scope">
                                <span>{{scope.row.channelId == 13 ? 'iOS' : 'Android'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="iconUrl" label="应用" width="150">
                        </el-table-column>
                        <el-table-column prop="schemeUrl" label="链接" show-overflow-tooltip width="230"> 
                        </el-table-column>
                        <el-table-column prop="channelId" label="渠道id">
                        </el-table-column>
                        <el-table-column label="版本">
                            <template slot-scope="scope">
                                <el-button type="text" @click="alterVersion(scope.row.id,scope.row.version,scope.row.name,scope.row.versionCode)">
                                    <span>{{scope.row.version}}</span>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="clientVersionId" label="版本id">
                        </el-table-column>
                        <el-table-column prop="packageName" label="包名" width="220">
                        </el-table-column>
                        <el-table-column label="排序">
                            <template slot-scope="scope">
                                <el-button type="text" @click="sequence(scope.row.id,scope.row.sequence,scope.row.name)">
                                    <span>{{scope.row.sequence}}</span>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="层类">
                            <template slot-scope="scope">
                                <!-- <el-button type="text" @click="alterBed(scope.row.id,scope.row.tabType,scope.row.name)">
                                    <span>{{scope.row.tabType == 10 ? '业务层':'遮挡层'}}</span>
                                </el-button> -->
                                <span>{{scope.row.tabType == 10 ? '业务层':'遮挡层'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="自动刷新" width="70">
                            <template slot-scope="scope">
                                <el-button type="text" @click="reflush(scope.row.id,scope.row.forceRefresh,scope.row.name)">
                                    <span>{{scope.row.forceRefresh == 1 ? '是':'否'}}</span>
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="page">
                        <el-pagination  @current-change="search()" :current-page.sync="pageNumber" :page-size="pageSize" layout="prev, pager, next, jumper"
                            :total="dataCount">
                        </el-pagination>
                    </div>
                </el-form>
            </el-col>
        </div>

        <el-dialog title="链接编辑" :visible.sync="urlDialog" size="tiny">
            <el-form :model="urlForm" :inline="true" label-width="100px">
                <el-form-item label="应用名：">
                    <span>{{urlForm.appName}}</span>
                </el-form-item>
                <br/>
                <el-form-item label="菜单Id：">
                    <span>{{urlForm.moduleId}}</span>
                </el-form-item>
                <br/>
                <el-form-item label="菜单名：">
                    <span>{{urlForm.tabName}}</span>
                </el-form-item>
                <br/>
                <el-form-item label="菜单链接：">
                    <textarea rows="6" cols="20" type="text" v-model="urlForm.schemeUrl" class="my-input" style="width:450px;height:150px;line-height:20px;padding-left:10px;padding-top:20px;margin-left:20px;margin-top:10px"></textarea>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="urlDialog = false">取 消</el-button>
                <el-button type="primary" @click="updateSchemeUrl()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="菜单编辑" :visible.sync="dialog" size="">
            <el-form :model="dialogForm" :inline="true" label-width="100px">
                <el-form-item label="发布平台：">
                    <span>{{dialogForm.platformId == 0 ? 'Android' : 'iOS'}}</span>
                </el-form-item>
                <br/>
                <el-form-item label="App名称：">
                    <el-input v-model="dialogForm.appName" placeholder="名称"></el-input>
                    <span style="padding-left:50px"></span><span>{{tabModuleList.length == 0 ? '' : tabModuleList[0].iconUrl}}</span>
                </el-form-item>
                <br/>
                <el-form-item label="渠道id：">
                    <span>{{dialogForm.channelId}}</span>
                </el-form-item>
                <br/>
                <el-form-item label="包名：">
                    <span>{{dialogForm.packageName}}</span>
                </el-form-item>
                <br/>
                <el-form-item label="版本：">
                    <span>{{dialogForm.versionName + '  (' + dialogForm.versionCode + ')' }}</span>
                </el-form-item>
                <br/>
                <el-form-item label="模版类型：">
                    <el-select class="sm" v-model="dialogForm.templateId" placeholder="筛选名称" filterable clearable v-on:change="chooseTemplate()" style="width:200px">
                        <el-option v-for="(item,index) in templateList" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <br/>
                <el-form-item label="菜单信息：">
                    <el-checkbox-group v-model="chooseMudule">
                        <span style="padding-left:15px"></span>
                        <el-checkbox v-for="(item,index) in moduleList" :key="index" :label="item.id + '.' + item.name"/>
                    </el-checkbox-group>
                </el-form-item>
                <br/>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog = false">取 消</el-button>
                <el-button type="primary" @click="update()">确 定</el-button>
            </div>
        </el-dialog> 
    </div>
</template>

<script>
    import resources from '../../resources'
    const tabModuleMappingQuery = `
        query(
            $appName: String
            $channelId: Long
            $platformId: Int
            $pageNumber: Int
            $pageSize: Int
            $versionCode: Int
        ){
            tabModule(
                appName: $appName
                channelId: $channelId
                platformId: $platformId
                versionCode: $versionCode
                pageNumber: $pageNumber
                pageSize: $pageSize
            ){
                dataCount
                pagesCount
                pageSize
                pageNum
                data{
                    id
                    moduleId
                    name
                    iconUrl
                    schemeUrl
                    channelId
                    packageName
                    version
                    clientVersionId
                    tabType
                    sequence
                    forceRefresh
                    versionCode
		        }
            }
        }
    `;
    export default {
        data() {
            return {
                urlForm: {
                    id: '',
                    schemeUrl: '',
                    tabName:'',
                    appName: '',
                    moduleId: ''
                },
                urlDialog:false,
                clientVersion:null,
                pageSize: 10,
                pageNumber: 1,
                dataCount: 0,
                filters: {
                    platformId: '',
                    appName: '',
                    channelId: '',
                    versionCode: '',
                    packageName: '',
                    appNames: [],
                    channels: [],
                    versionCodes: [],
                    packageNames: []
                },
                tabModuleList: [],
                showSort:false,
                templateList: [],
                moduleList: [],
                chooseMudule: [],
                moduleIdList: [],
                dialog:false,
                dialogForm: {
                    platformId: '',
                    appName: '',
                    channelId: '',
                    packageName: '',
                    versionCode: '',
                    versionName: '',
                    templateId: ''
                },
                moduleObject:{
                    id:'',
                    name:''
                },
                lastTemplate:[],
                choosedTemplate:[]
            }
        },
        watch: {
            // 监听数组
            choosedTemplate: {
                handler(newValue, oldValue) {
                    for (var i in newValue) {
                        if (this.moduleIdList.indexOf(newValue[i]) == -1) {
                            this.moduleIdList.push(newValue[i])
                        }
                    }
        　　　　 },
        　　　　 deep: true
            },
            lastTemplate: {
                handler(newValue, oldValue) {
                    for (var i in newValue) {
                        if (this.moduleIdList.indexOf(newValue[i]+'') != -1) {
                            this.moduleIdList.splice(this.moduleIdList.indexOf(newValue[i]), 1);
                        }
                    }
        　　　　 },
        　　　　 deep: true
            },
            // 监听数组
            // 已选择的数组
            chooseMudule: {
        　　　　 handler(newValue, oldValue) {
                    // 加上
                    for(var i in newValue) {
                        if (this.moduleIdList.indexOf(newValue[i].split('.')[0]) == -1) {
                            this.moduleIdList.push(newValue[i].split('.')[0])
                        }
                    }
                    // 减掉
                    for(var i in oldValue) {
                        // 新的里面没有就删掉
                        if (this.moduleIdList.indexOf(oldValue[i].split('.')[0]) != -1 && newValue.indexOf(oldValue[i]) == -1) {
                            this.moduleIdList.splice(this.moduleIdList.indexOf(oldValue[i].split('.')[0]), 1);
                        }
                    }
                    //console.log(newValue);
                    //console.log(this.moduleIdList);
        　　　　 },
        　　　　 deep: true
    　　     },
            // 处理后的id,有删掉，没有加上
            moduleIdList: {
        　　　　 handler(newValue, oldValue) {
                    // 加上
                    for(var i in newValue) {
                        var flag = 0;
                        for (var j in this.chooseMudule) {
                            if (this.chooseMudule[j].split('.')[0] == newValue[i]) {
                                break;
                            } else {
                                ++flag; 
                            }
                        }
                        if (flag == this.chooseMudule.length) {
                            for (var k in this.moduleList) {
                                if (this.moduleList[k].id == newValue[i]) {
                                    this.chooseMudule.push(this.moduleList[k].id + '.' + this.moduleList[k].name);
                                    break;
                                }
                            }
                        }
                    }
                    //删掉
                    for (var k in this.moduleList) {
                        if (newValue.indexOf(this.moduleList[k].id+'') == -1 && this.chooseMudule.indexOf(this.moduleList[k].id + '.' + this.moduleList[k].name) != -1) {
                            this.chooseMudule.splice(this.chooseMudule.indexOf(this.moduleList[k].id + '.' + this.moduleList[k].name),1);    
                        }
                    }
                    //console.log(newValue);
                    //console.log(this.chooseMudule);
        　　　　 },
        　　　　 deep: true
    　　     },
        },
        methods: {
            sequence(id,sequence,name) {
                this.$prompt('请输入排序权重,当前 (' + name + ': ' + sequence + ')', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[0-9]*$/,
                inputErrorMessage: '格式不正确,请输入数字'
                }).then(({ value }) => {
                    if (value == null) {
                        //console.log("value is null");
                        return;
                    }
                    let url = resources.tabModule(id);
                    let params = new URLSearchParams();
                    params.append('sequence',value);
                    this.$ajax.post(url,params)
                        .then(res => {
                            for (var i in this.tabModuleList) {
                                if (this.tabModuleList[i].id == id) {
                                    this.tabModuleList[i].sequence = value;
                                    break;
                                }
                            }
                            this.$message({
                                type: 'success',
                                message: '修改成功!'
                            });
                        })
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });       
                });
            },
            updateSchemeUrl() {
                let url = resources.tabModule(this.urlForm.id);
                let params = new URLSearchParams();
                params.append('schemeUrl',this.urlForm.schemeUrl);
                this.$ajax.post(url,params)
                    .then(res => {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        for (var i in this.tabModuleList) {
                            if (this.tabModuleList[i].id == this.urlForm.id) {
                                this.tabModuleList[i].schemeUrl = this.urlForm.schemeUrl;
                                break;
                            }
                        }
                        this.urlDialog=false;
                    })
            },
            alterUrl(id,url,appName,tabName,moduleId) {
                this.urlForm.id = id;
                this.urlForm.schemeUrl = url;
                this.urlForm.moduleId = moduleId;
                this.urlForm.appName = appName;
                this.urlForm.tabName = tabName;
                this.urlDialog=true;
            },
            update() {
                console.log(this.moduleIdList)
                let url = resources.updateTabModule(this.clientVersion.id);
                let params = new URLSearchParams();
                params.append('appName',this.dialogForm.appName);
                params.append('moduleIdList',this.moduleIdList);
                if (this.dialogForm.templateId != '') {
                    params.append('templateId',this.dialogForm.templateId)
                }
                this.$ajax.post(url, params)
                    .then(res => {
                        location.reload();//刷新当前页面
                        this.succeed();
                    });
            },
            chooseTemplate() {
                // 添加设置数组
                // 深拷贝
                [...this.lastTemplate] = this.choosedTemplate;
                // 初始化
                this.choosedTemplate = [];
                let templateId = this.dialogForm.templateId;
                if (templateId == '' || templateId == null || templateId == 'undefined') {
                    return;
                }
                let url = resources.templateModule(templateId);
                let params = new URLSearchParams();
                this.$ajax.get(url, params)
                    .then(res => {
                        for (var i in res.data.obj1) {
                            this.choosedTemplate.push(res.data.obj1[i].moduleId + '')
                        }
                    });
            },
            editTabModule() {
                // 重置已选的module
                this.dialogForm.platformId = this.clientVersion.platformId;
                this.dialogForm.appName = this.clientVersion.name;
                this.dialogForm.channelId = this.clientVersion.channelId;
                this.dialogForm.packageName = this.clientVersion.packageName;
                this.dialogForm.versionCode = this.clientVersion.versionCode;
                this.dialogForm.versionName = this.clientVersion.versionName;
                // 获取所有模版数据
                let url = resources.template();
                let params = new URLSearchParams();
                params.append('packageName',"template%");
                this.$ajax.post(url,params)
                .then(res => {
                    this.templateList = res.data.obj1;      
                })
                this.initModuleList();
                this.dialog = true;
            },
            initModuleList() {
                // 获取所有菜单信息
                let url = resources.mudule();
                let params = new URLSearchParams();
                this.$ajax.post(url,params)
                .then(res => {
                    this.moduleList = new Array();
                    for (var x of res.data.obj1) {
                        this.moduleObject = new Object();
                        this.moduleObject.id = x.id;
                        this.moduleObject.name = x.name;
                        this.moduleList.push(this.moduleObject);
                    }
                })
            },
            alterVersion(id,version,name,versionCode) {
                let tab = version == versionCode ? "隐藏":"展示";
                let finalVersion = version == versionCode ? '9999' : versionCode;
                let message = '此操作将'+tab+'"'+name+'"'+', 是否继续?';
                let url = resources.tabModule(id);
                let params = new URLSearchParams();
                params.append('version',version);
                params.append('versionCode',versionCode);
                this.basetip(message,url,params,id,finalVersion,true);
                
            },
            reflush(id,forceRefresh,name) {
                let tab = forceRefresh == 1 ? '不自动刷新':'自动刷新';
                let finalFlag = forceRefresh == 1 ? 0 : 1;
                let message = '此操作将修改'+'"'+name+'"'+'为'+tab+', 是否继续?';
                let url = resources.tabModule(id);
                let params = new URLSearchParams();
                params.append('forceRefresh',forceRefresh);
                this.basetip(message,url,params,id,finalFlag,false);
            },
            alterBed(id,tabType,name) {
                let tab = tabType == 10 ? '遮挡层':'业务层';
                let message = '此操作将修改'+'"'+name+'"'+'为'+tab+', 是否继续?';
                let url = resources.tabModule(id);
                let params = new URLSearchParams();
                params.append('tabType',tabType);
                this.basetip(message,url,params);
            },
            search() {
                let params = {
                    "pageSize": this.pageSize,
                    "pageNumber": this.pageNumber
                }
                if (this.filters.platformId != '') {
                    params.platformId = this.filters.platformId;
                }
                if (this.filters.appName != '') {
                    params.appName = this.filters.appName;
                }
                if (this.filters.channelId != '') {
                    params.channelId = this.filters.channelId;
                }
                if (this.filters.versionCode != '') {
                    params.versionCode = this.filters.versionCode;
                }
                if (this.filters.packageName != '') {
                    params.packageName = this.filters.packageName;
                }
                this.$ajax.post(`${resources.graphQlApi}`,{
                    'query': `${tabModuleMappingQuery}`,
                    variables: params
                }).then(res => {
                    this.dataCount = res.data.data.tabModule.dataCount;
                    this.tabModuleList = res.data.data.tabModule.data;
                    // 拿出这个版本已经配置的moduleId
                    if (this.clientVersion != null) {
                        this.lastTemplate = [];
                        this.choosedTemplate = [];
                        this.chooseMudule = new Array();
                        this.moduleIdList = new Array();
                        for (var i in this.tabModuleList) {
                            // 把数字类型变成字符串
                            this.moduleIdList.push(this.tabModuleList[i].moduleId+'')
                        }
                    }
                })
            },
            // 筛选条件
            clientMessage(){
                let url = resources.searchCondition();
                let params = new URLSearchParams();
                // this.filters.platformId != '' ? params.append("platformId",this.filters.platformId) : ;
                if (this.filters.platformId != '') {
                    params.append("platformId",this.filters.platformId);
                }
                if (this.filters.appName != '') {
                    params.append("appName",this.filters.appName);
                }
                if (this.filters.channelId != '') {
                    params.append("channelId",this.filters.channelId);
                }
                if (this.filters.versionCode != '') {
                    params.append("versionCode",this.filters.versionCode);
                }
                if (this.filters.packageName != '') {
                    params.append("packageName",this.filters.packageName);
                }
                this.$ajax.post(url,params)
                .then(res => {
                    this.filters.appNames = res.data.obj1.appNames;
                    this.filters.channels = res.data.obj1.channels;
                    this.filters.versionCodes = res.data.obj1.versionCodes;
                    this.filters.packageNames = res.data.obj1.packageNames;
                    this.clientVersion = res.data.obj1.clientVersion;
                    // 每次修改筛选条件自动筛选
                    //if (this.clientVersionId != null) {
                        this.search();
                    //}
                }).catch(error => {
                    this.mistake(error.response.data.statusMsg)
                });
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
                    message: mistakeMes,
                    });
            },
            basetip(message,url,params,id,finalValue,version) {
                this.$confirm(message,'提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$ajax.post(url,params)
                    .then(res => {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        if (version) {
                            for (var i in this.tabModuleList) {
                                if (this.tabModuleList[i].id == id) {
                                    this.tabModuleList[i].version = finalValue;
                                    break;
                                }
                            }
                        } else {
                            for (var i in this.tabModuleList) {
                                if (this.tabModuleList[i].id == id) {
                                    this.tabModuleList[i].forceRefresh = finalValue;
                                    break;
                                }
                            }
                        }
                        //location.reload();//刷新当前页面
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
        },
        mounted: function(){
            this.clientMessage();
            this.initModuleList();
        }
    }
</script>



<style lang="scss" scoped>
    .page-container {
        color: #666;
        min-width: 1200px;

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
            width: 100px;
            height: 100px;
            line-height: 100px;
            text-align: center;
        }
        .avatar {
            width: 100px;
            height: 100px;
            display: block;
        }

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
        .pic {
            width: 60px;
            height: 60px;
            display: block;
        }
    }
</style>