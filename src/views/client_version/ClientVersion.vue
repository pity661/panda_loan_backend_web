<template>
    <div class="page-container">
        <div class="main-panel">
            <el-col class="table-panel">
                <el-form :inline="true" :model="filters">
                    <el-form-item label="发布平台">
                        <el-select class="sm" v-model="filters.platformId" placeholder="发布平台" clearable v-on:change="clientMessage()" style="width:150px">
                            <el-option label="Android" value="0"></el-option>
                            <el-option label=IOS value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="App名称">
                        <el-select class="sm" v-model="filters.appName" placeholder="应用名称" filterable v-on:change="clientMessage()" clearable style="width:150px">
                            <el-option v-for="(item,index) in filters.appNames" :key="index" :label="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="渠道名">
                        <el-select class="sm" v-model="filters.channelId" placeholder="渠道名" filterable v-on:change="clientMessage()" clearable style="width:150px">
                            <el-option v-for="(item,index) in filters.channels" :key="index" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="发布状态">
                        <el-select class="sm" v-model="filters.isPublished" placeholder="是否发布" clearable v-on:change="clientMessage()" style="width:150px">
                            <el-option label="已发布" value="1"></el-option>
                            <el-option label="未发布" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search()">筛选</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="addClientVersion()" class="add-new">新增</el-button>
                    </el-form-item>

                    <el-table :data="clientVersionList" style="width:80%">
                        <el-table-column prop="" label="编号" width="70">
                            <template slot-scope="scope">
                                {{(pageNumber - 1) * pageSize + scope.$index + 1}}
                            </template>
                        </el-table-column>
                        <el-table-column label="图片" width="100">
                            <template slot-scope="scope">
                                <img :src="scope.row.logoUrl" class="pic">
                            </template>
                        </el-table-column>
                        <el-table-column label="App名称" width="130">
                            <template scope="scope">
                                <el-button type="text" @click="alterClientVersion(scope.row.id)">{{scope.row.name}}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="packageName" label="包名" width="250">
                        </el-table-column>
                        <el-table-column label="发布平台">
                            <template slot-scope="scope">
                                <span>{{scope.row.platformId == 1 ? 'IOS' : 'Android'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="channelName" label="渠道名">
                        </el-table-column>
                        <el-table-column prop="versionName" label="版本名">
                        </el-table-column>
                        <el-table-column prop="versionCode" label="版本号">
                        </el-table-column>
                        <el-table-column label="发布状态">
                            <template slot-scope="scope">
                                <span>{{scope.row.isPublished ? '已发布':'未发布'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="changeLog" label="版本更新信息" width="200">
                        </el-table-column>
                        <el-table-column prop="downloadUrl" label="下载链接" show-overflow-tooltip width="300">
                        </el-table-column>
                    </el-table>

                    <div class="page" style="width:80%">
                        <el-pagination  @current-change="search()" :current-page.sync="pageNumber" :page-size="pageSize" layout="prev, pager, next, jumper"
                            :total="dataCount">
                        </el-pagination>
                    </div>
                </el-form>
            </el-col>
        </div>

        <el-dialog title="版本编辑" :visible.sync="dialog" size="">
            <el-form :model="dialogForm" :inline="true" label-width="100px">
                <el-form-item label="发布平台">
                    <el-select class="sm" v-model="dialogForm.platformId" placeholder="发布平台" clearable v-on:change="clientMessage()" style="width:150px">
                        <el-option label="Android" :value="2"></el-option>
                        <el-option label=IOS :value="1"></el-option>
                    </el-select>
                    <span @click="upload = true" v-if="dialogForm.platformId == 2 && !upload" style="padding-left:10px;color:blue;cursor:pointer">上传包</span>
                    <span @click="upload = true" v-if="uploadFile && !upload" style="padding-left:10px;color:blue;cursor:pointer">修改上传包</span>
                    <span @click="dialog = false , upload = false , uploadFile = false" v-if="upload" style="padding-left:10px;color:blue;cursor:pointer">取消上传包</span>
                </el-form-item>
                <br/>
                <el-form-item label="上传包：" v-if="upload">
                    <!-- 1080*465 -->
                    <br/>
                    <el-upload
                        class="avatar-uploader"
                        name="file"
                        :action="packageAction"
                        :show-file-list="false"
                        :on-error="uploadError"
                        :on-success="handlePackageSuccess"
                        :on-progress="openFullScreen"
                        :before-upload="beforePackageUpload">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" v-if="uploadFile" class="el-upload__tip">请点击修改需要上传的包</div>
                        <div slot="tip" v-else class="el-upload__tip">请点击选择需要上传的包</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="App名称：" v-if="!upload && !uploadFile">
                    <el-select class="sm" v-model="dialogForm.appName" placeholder="筛选名称" filterable clearable v-on:change="clientMessage()" style="width:150px" v-if="!addAppName">
                        <el-option v-for="(item,index) in options.appNames" :key="index" :label="item" :value="item"></el-option>
                    </el-select>
                    <span @click="addAppName = true" v-if="!addAppName" style="padding-left:10px;color:blue;cursor:pointer">筛选(点击新增)</span>
                    <el-input v-model="dialogForm.appName" placeholder="新增名称" clearable v-if="addAppName" style="width:150px"></el-input>
                    <span @click="addAppName = false" v-if="addAppName" style="padding-left:10px;color:blue;cursor:pointer">新增(点击筛选)</span>
                </el-form-item>
                <br v-if="!upload && !uploadFile"/>
                <el-form-item label="下载链接：" v-if="uploadFile">
                    <el-input v-model="dialogForm.downloadUrl" style="width:550px" :disabled="true"></el-input>
                </el-form-item>
                <br v-if="uploadFile"/>
                <el-form-item label="App名称：" v-if="uploadFile">
                    <el-input v-model="dialogForm.appName" style="width:150px" :disabled="true"></el-input>
                </el-form-item>
                <br v-if="uploadFile"/>
                <el-form-item label="包名：" v-if="!upload && !uploadFile">
                    <el-select class="sm" v-model="dialogForm.packageName" placeholder="筛选包名" filterable clearable v-on:change="clientMessage()" style="width:250px"  v-if="!addPackageName">
                        <el-option v-for="(item,index) in options.packageNames" :key="index" :label="item" :value="item"></el-option>
                    </el-select>
                    <span @click="addPackageName = true" v-if="!addPackageName" style="padding-left:10px;color:blue;cursor:pointer">筛选(点击新增)</span>
                    <el-input v-model="dialogForm.packageName" placeholder="新增包名" clearable v-if="addPackageName" style="width:250px"></el-input>
                    <span @click="addPackageName = false" v-if="addPackageName" style="padding-left:10px;color:blue;cursor:pointer">新增(点击筛选)</span>
                </el-form-item>
                <el-form-item label="包名：" v-if="uploadFile">
                    <el-input v-model="dialogForm.packageName" style="width:150px" :disabled="true"></el-input>
                </el-form-item>
                <br/>
                <el-form-item label="是否发布：">
                    <span>
                        <el-switch v-model="dialogForm.isPublished"></el-switch>
                    </span>
                </el-form-item>
                <br>
                <el-form-item label="渠道信息：" v-if="!upload && !uploadFile">
                    <el-checkbox-group v-model="chooseChannel">
                        <span style="padding-left:15px"></span>
                        <el-checkbox v-for="(item,index) in options.channels" :key="index" :label="item.name"/>
                    </el-checkbox-group>
                </el-form-item>

                <el-form-item label="渠道信息：" v-if="uploadFile">
                    <el-input v-model="dialogForm.channelName" style="width:150px" :disabled="true"></el-input>
                </el-form-item>
                <br/>
                <el-form-item label="版本名称：" v-if="!upload && !uploadFile">
                    <el-input v-model="dialogForm.versionName" placeholder="*.*.*" clearable></el-input>
                </el-form-item>
                <el-form-item label="版本名称：" v-if="uploadFile">
                    <el-input v-model="dialogForm.versionName" style="width:150px" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="版本号：" v-if="!upload && !uploadFile">
                    <el-input v-model="dialogForm.versionCode" placeholder="版本号" clearable></el-input>
                </el-form-item>
                <el-form-item label="版本号：" v-if="uploadFile">
                    <el-input v-model="dialogForm.versionCode" style="width:150px" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="版本信息：">
                    <el-input v-model="dialogForm.changeLog" placeholder="升级客户端信息" clearable style="width:300px"></el-input>
                </el-form-item>
                <br/>
                <el-form-item label="logo：">
                    <!-- 1080*465 -->
                    <br/>
                    <el-upload
                        class="avatar-uploader"
                        name="image"
                        :action="imgAction"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="showImg" :src="showImg" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">请上传最小尺寸为100px*100px的图片</div>
                    </el-upload>
                </el-form-item>
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

    //clientVersion筛选条件
    const clientVersionQuery = `
        query(
            $appName: String
            $channelId: Long
            $platformId: Int
            $pageNumber: Int
            $isPublished: Int
            $pageSize: Int
        ){
            clientVersions(
                appName: $appName
                channelId: $channelId
                platformId: $platformId
                isPublished: $isPublished
                pageNumber: $pageNumber
                pageSize: $pageSize
            ){
                dataCount
                pagesCount
                pageSize
                pageNum
                data{
                    id
                    name
                    logoUrl
                    versionName
                    versionCode
                    changeLog
                    downloadUrl
                    isForced
                    platformId
                    maskSwitch
                    packageName
                    channelId
                    channelName
                    isPublished
		        }
            }
        }
    `;

    //级联查询
    const cascadeQuery = `
        query(
            $appName: String
            $channelId: String
            $platformId: Int
            $isPublished: Int
            $packageName: String
        ){
            clientVersionsCascade(
                appName: $appName
                channelId: $channelId
                packageName: $packageName
                platformId: $platformId
                isPublished: $isPublished
            ){
                id
                name
                logoUrl
                versionName
                versionCode
                changeLog
                downloadUrl
                isForced
                platformId
                maskSwitch
                packageName
		        channelId
		        channelName
            }
        }
    `
    export default {
        data() {
            return {
                loading: null,

                upload: false,
                uploadFile: false,

                first: true,
                addAppName: false,
                addPackageName: false,
                loading: true,
                pageSize: 10,
                pageNumber: 1,
                dataCount: 0,
                dialogForm: {
                    
                },
                options: {
                    appNames: [],
                    packageNames: [],
                    channels: []
                },
                filters: {
                    appName: '',
                    channelId: '',
                    platformId: '',
                    isPublished: '',
                    appNames: [],
                    channels: []
                },
                dialog: false,
                showImg: '',
                imgAction: resources.uploadImage(),
                packageAction: resources.uploadPackage(),
                clientVersionList: [],
                appNames: [],
                packageNames: [],
                channels: [],

                allChannels: [],
                chooseChannel: []
            }
        },
        watch: {
            chooseChannel: {
                handler(newValue, oldValue) {
                    if (newValue.length > 1) {
                        this.chooseChannel.splice(0,1);
                    }
                },
                deep: true
            },
        },
        methods: {
            alterClientVersion(id) {
                this.upload = false;
                this.uploadFile = false;
                for (var i = 0; i < this.clientVersionList.length; i++) {
                    if (this.clientVersionList[i].id == id) {
                        let newObj = {
                            platformId: this.clientVersionList[i].platformId,
                            id: this.clientVersionList[i].id,
                            appName: this.clientVersionList[i].name,
                            packageName: this.clientVersionList[i].packageName,
                            versionName: this.clientVersionList[i].versionName,
                            versionCode: this.clientVersionList[i].versionCode,
                            changeLog: this.clientVersionList[i].changeLog,
                            channel: [], //在update里需要处理成id
                            imgUrl: this.clientVersionList[i].logoUrl,
                            isPublished: this.clientVersionList[i].isPublished,
                            downloadUrl: this.clientVersionList[i].downloadUrl
                        };
                        for (var obj of this.options.channels) {
                            if (this.clientVersionList[i].channelId == obj.id) {
                                newObj.channel.push(obj.name);
                                this.chooseChannel.push(obj.name)
                            }
                        }
                        var { ...copyObj } = newObj;
                        this.dialogForm = copyObj;
                        this.showImg = this.clientVersionList[i].logoUrl;
                    }
                }
                this.dialog = true;
            },
            addClientVersion() {
                this.upload = false;
                this.uploadFile = false;
                let newObj = {
                    platformId: '',
                    appName: '',
                    packageName: '',
                    versionName: '',
                    versionCode: '',
                    changeLog: '',
                    channel: [], //在update里需要处理成id
                    imgUrl: '',
                    isPublished: false,
                    downloadUrl: ''
                };
                this.chooseChannel = [];
                var { ...copyObj } = newObj;
                this.dialogForm = copyObj;
                this.showImg = '';
                this.dialog = true;
            },
            search() {
                let params = {
                    "pageSize": this.pageSize,
                    "pageNumber": this.pageNumber
                }
                if (this.filters.appName != '') {
                    params.appName = this.filters.appName;
                }
                if (this.filters.channelId != '') {
                    params.channelId = this.filters.channelId;
                }
                if (this.filters.platformId != '') {
                    params.platformId = this.filters.platformId;
                }
                if (this.filters.isPublished != '') {
                    params.isPublished = this.filters.isPublished;
                }
                this.$ajax.post(`${resources.graphQlApi}`,{
                    'query': `${clientVersionQuery}`,
                    variables: params
                }).then(res => {
                    console.log(res)
                    this.dataCount = res.data.data.clientVersions.dataCount;
                    this.clientVersionList = res.data.data.clientVersions.data;
                    this.clientVersionList.forEach(item => {
                        if (item.platformId == 0) {
                            item.platformId = 2
                        }
                        for (var obj of this.allChannels) {
                            if (item.channelId == obj.id) {
                                item.channelName = obj.name
                            }
                        }
                    });
                })
            },
            update() {
                let params = new URLSearchParams();
                if (this.upload && this.dialogForm.appName == '') {
                    if (this.dialogForm.downloadUrl == '') {
                        this.lackMessage("请先上传产品")
                        return;
                    }
                }
                if (this.dialogForm.appName == '') {
                    this.lackMessage("app名称不能为空")
                    return;
                }
                if (this.dialogForm.packageName == '') {
                    this.lackMessage("包名不能为空")
                    return;
                }
                if (this.dialogForm.versionName == '') {
                    this.lackMessage("版本名不能为空")
                    return;
                }
                if (this.dialogForm.versionCode == '') {
                    this.lackMessage("版本号不能为空")
                    return;
                }
                if (this.chooseChannel.length == '') {
                        this.lackMessage("请选择渠道")
                        return;
                }
                if (this.dialogForm.imgUrl == '') {
                    this.lackMessage("logo未添加")
                    return;
                }
                if (this.dialogForm.downloadUrl != '') {
                    params.append('downloadUrl',this.dialogForm.downloadUrl);
                }
                let url = resources.clientVersions(this.dialogForm.id);
                console.log(url)
                if (typeof (this.dialogForm.id) != 'undefined')  {
                    params.append('id',this.dialogForm.id);
                }
                params.append('name',this.dialogForm.appName);
                params.append('logoUrl',this.dialogForm.imgUrl);
                params.append('versionName',this.dialogForm.versionName);
                params.append('versionCode',this.dialogForm.versionCode);
                params.append('packageName',this.dialogForm.packageName);
                params.append('changeLog',this.dialogForm.changeLog);
                params.append('isPublished',this.dialogForm.isPublished);
                var channelId;
                for (var channel of this.allChannels) {
                    if (channel.name == this.chooseChannel[0])
                    channelId = channel.id;
                }
                params.append('channelId',channelId);
                console.log(params)
                this.$ajax.post(url,params)
                .then(res => {
                    console.log(res)
                    this.dialog = false;
                    this.succeed();
                    this.search();
                    //this.getTerm();
                }).catch(error => {              
                    //this.lackMessage(error.response.data.statusMsg)
                    this.mistake(error.response.data.statusMsg)
                });
            },
            clientMessage() {
                let params = { };
                this.options.appNames = [];
                this.options.packageNames = [];
                this.filters.appNames = [];
                this.filters.channels = [];
                if (!this.dialog) {
                    if (this.filters.appName != '') {
                        params.appName = this.filters.appName;
                    }
                    if (this.filters.channelId != '') {
                        params.channelId = this.filters.channelId;
                    }
                    if (this.filters.platformId != '') {
                        params.platformId = this.filters.platformId;
                    }
                    if (this.filters.isPublished != '') {
                        params.isPublished = this.filters.isPublished;
                    }
                } else {
                    if (this.dialogForm.platformId != '') {
                        if (this.dialogForm.platformId == 2) {
                            params.platformId = 0;
                        } else {
                            params.platformId = this.dialogForm.platformId;
                        }
                        this.options.channels = [];
                        if (this.dialogForm.platformId == 1) {
                            for (var i = 0;i < this.allChannels.length;i ++) {
                                if (this.allChannels[i].id === 13) {
                                    this.options.channels.push(this.allChannels[i]);
                                }
                            }
                        } else if (this.dialogForm.platformId == 2) {
                            for (var i = 0;i < this.allChannels.length;i ++) {
                                if (this.allChannels[i].id != 13) {
                                    this.options.channels.push(this.allChannels[i]);
                                }
                            }
                        }
                    } else {
                        [ ...this.options.channels] = this.allChannels;
                    }
                    if (this.dialogForm.appName != '') {
                        params.appName = this.dialogForm.appName;
                    }
                    if (this.dialogForm.packageName !='') {
                        params.packageName = this.dialogForm.packageName;
                    }
                }
                this.$ajax.post(`${resources.graphQlApi}`,{
                    'query': `${cascadeQuery}`,
                    variables: params
                }).then(res => {
                    console.log(res)
                    var appNames = new Array();
                    var packageNames = new Array();
                    var channels = new Array();
                    for (var obj of res.data.data.clientVersionsCascade) {
                        appNames.push(obj.name);
                        packageNames.push(obj.packageName);
                        channels.push(obj.channelId);
                    }
                    appNames = [...new Set(appNames)];
                    packageNames = [...new Set(packageNames)];
                    channels = [...new Set(channels)];
                    if (this.first) {
                        [ ...this.appNames] = appNames;
                        [ ...this.channels] = channels;
                        [ ...this.packageNames] = packageNames;
                        this.first = false;
                    }
                    if (!this.dialog) {
                        [ ...this.filters.appNames] = appNames;
                        [ ...this.filters.channels] = channels;
                        [ ...this.options.packageNames] = this.packageNames;
                        [ ...this.options.appNames] = this.appNames;
                    } else {
                        [ ...this.options.appNames] = appNames;
                        [ ...this.options.packageNames] = packageNames;
                        [ ...this.filters.appNames] = this.appNames;
                        [ ...this.filters.channels] = this.channels;
                    }
                    this.filters.channels = this.channelIdToObj(this.filters.channels);
                })
            },
            channelIdToObj(array) {
                var objArr = new Array();
                this.allChannels.forEach(item => {
                    for (var channelId of array) {
                        if (channelId == item.id) {
                            objArr.push(item);
                        }
                    }
                });
                return objArr;
            },
            //上传时展示的动画效果
            openFullScreen(){
                this.loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.05)'
                });
            },
            //上传失败
            uploadError(){
                this.loading.close();
                this.mistake("服务器发生错误，上传失败");
            },
            //上传包
            handlePackageSuccess(res,file) {
                this.loading.close();
                this.upload = false;
                this.uploadFile = true;
                console.log(res)
                this.dialogForm.appName = res.name;
                this.dialogForm.packageName = res.packageName;
                this.dialogForm.versionName = res.versionName;
                this.dialogForm.versionCode = res.versionCode;
                this.dialogForm.channelId = res.channelId;
                this.dialogForm.downloadUrl = res.downloadUrl;
                for (var obj of this.allChannels) {
                    if (this.dialogForm.channelId == obj.id) {
                        this.dialogForm.channelName = obj.name;
                        this.chooseChannel.push(obj.name); 
                    }
                }
            },
            beforePackageUpload(file) {
                return true;
            },
            //上传图片
            handleAvatarSuccess(res, file) {
                this.dialogForm.imgUrl = res;
                this.showImg = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                let _this = this;
                let isValidWH = true;
                let imgObj = new Image();
                imgObj.src = URL.createObjectURL(file);
                imgObj.onload = function() {
                    if (imgObj.width < 100 || imgObj.height < 90) {
                        isValidWH = false;
                        _this.$message.error('上传图片尺寸必须大于100px*100px');
                    }
                };
                console.log(isValidWH)
                return isValidWH;
            },
            appChannels() {
                this.options.channel = [];
                let url = resources.appChannels();
                let params = new URLSearchParams();
                this.$ajax.get(url, params)
                    .then(res => {
                        [ ...this.options.channels ] = res.data.obj1;
                        [ ...this.allChannels ] = res.data.obj1;
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
        },
        mounted: function(){
            this.appChannels();
            this.clientMessage();
            this.search();
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