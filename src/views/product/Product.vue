<template>
    <div class="zoom">
    <div class="page-container" v-if="show">
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
                        <el-form-item label="发布状态">
                            <el-select class="sm" v-model="filters.isPublished" placeholder="请选择" clearable>
                                <el-option label="未发布" value="0"></el-option>
                                <el-option label="已发布" value="1"></el-option>
                                <el-option label="已下线" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="资质">
                            <!-- <el-select v-model="filters.guarantees" multiple collapse-tags style="width: 250px;padding-right：10px" placeholder="请选择"> -->
                            <el-select class="sm" v-model="filters.guarantees" placeholder="请选择" clearable>
                                <el-option v-for="item in guarantees" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发布时间">
                            <el-date-picker v-model="filters.publishTime" placeholder="开始时间" type="date" style="width: 150px;"></el-date-picker> 至
                            <el-date-picker v-model="filters.anotherPublishTime" placeholder="结束时间" type="date" style="width: 150px;"></el-date-picker>
                        </el-form-item>
                        <br/>
                        <el-form-item label="期数">
                            <el-input v-model="filters.minTerm" placeholder="短"></el-input> 至
                            <el-input v-model="filters.maxTerm" placeholder="长"></el-input>
                        </el-form-item>
                        <el-form-item label="额度">
                            <el-input v-model="filters.minAmount" placeholder="低"></el-input> 至
                            <el-input v-model="filters.maxAmount" placeholder="高"></el-input>
                        </el-form-item>
                        <span style="padding-left:100px"/>
                        <el-form-item>
                            <el-button type="primary" @click="searchProducts()" class="add-new">筛选</el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="addDate()" class="add-new">新增</el-button>
                        </el-form-item>
						<el-form-item>
                            <el-button type="primary" @click="enableSort()" class="sort" v-if="!showSort">开始排序</el-button>
                            <el-button type="primary" @click="disableSort()" class="sort" v-if="showSort">关闭排序</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>

                <el-table :data="allproducts" v-loading="loading" :move="getdata" @update="datadragEnd">
                    <!-- <el-table-column prop="" label="编号" width="70">
                        <template scope="scope">
                            {{(pageNumber - 1) * pageSize + scope.$index + 1}}
                        </template>
                    </el-table-column> -->
					<el-table-column prop="sort" label="排序" width="80" v-if="showSort">
                        <template slot-scope="scope">
						    <!-- <img src="~@/assets/sort.png" class="pic" style="width:20px; height:20px"> -->
							<a href="#"><img src="~@/assets/sort.png" class="pic" style="width:20px; height:20px"></a>
                        </template>
					</el-table-column>
                    <el-table-column prop="id" label="Id" width="80">
                    </el-table-column>
                    <el-table-column label="图片" width="100">
                        <template slot-scope="scope">
                            <img :src="scope.row.imgUrl" class="pic">
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="操作1" width="120">
                        <template slot-scope="scope">
                            <el-button type="text" @click="alterDate(scope.row.id)">修改</el-button>
                            <el-button v-if="scope.row.id != weightId" type="text" @click="stick(scope.row.id,scope.row.title)">置顶</el-button>
                            <span v-if="scope.row.id === weightId" style="padding-left:8px;padding-right:10px;color:#bfcbd9">置顶</span>
                            <el-button style="margin-left:0px;" type="text" @click="upline(scope.row.id,scope.row.title)" v-if="scope.row.isPublished == 0 || scope.row.isPublished == 2">上线</el-button>
                            <span v-if="scope.row.isPublished == 1" style="padding-right:10px;color:#bfcbd9">上线</span>
                            <el-button type="text" @click="offline(scope.row.id,scope.row.title)" v-if="scope.row.isPublished == 1">下线</el-button>
                            <span v-if="scope.row.isPublished != 1" style="padding-left:10px;padding-right:10px;color:#bfcbd9">下线</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="操作2" width="100">
                        <template slot-scope="scope">
                            <el-button type="text" @click="getNew7Field(scope.row.id)">H5字段</el-button>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="id" label="Id" width="80">
                    </el-table-column> -->
                    <el-table-column prop="title" label="产品名称" width="100">
                        <template slot-scope="scope">
                            <el-button type="text" @click="detail(scope.row.id)">{{scope.row.title}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="lenderName" label="机构名称" width="100" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="发布状态" width="100">
                        <template slot-scope="scope">
                            <span>{{scope.row.isPublished === 2 ? '已下线' : (scope.row.isPublished === 1 ? '已发布' : '未发布')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="showFirstTags" label="产品标签" width="100" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="url" label="链接地址" width="250" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="额度" width="130">
                        <template slot-scope="scope">
                            <span>{{scope.row.minedu + '—' + scope.row.maxedu}}元</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="期数" width="100">
                        <template slot-scope="scope">
                            <span>{{scope.row.minTerm + '—' + scope.row.maxTerm}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="showGuarantees" label="借款资格" width="100" show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="description" label="说明" width="190" show-overflow-tooltip>
                    </el-table-column>
                </el-table>

                <div class="page">
                    <el-pagination  @current-change="searchProducts" :current-page.sync="pageNumber" :page-size="pageSize" layout="prev, pager, next, jumper"
                        :total="dataCount">
                    </el-pagination>
                </div>
            </el-col>
        </div>

        <el-dialog title="编辑新增h5字段" :visible.sync="new7FieldDialog">
            <el-form :model="new7FieldDialogForm" :inline="true" size="mini" label-width="150px">
                <el-form-item label="贷款期限:" style="line-height:0px">
                    <input v-model="new7FieldDialogForm.loanTermName" class="my-input" style="width:500px;" autosize placeholder="贷款期限">
                </el-form-item>
                <el-form-item label="放款时效:" style="line-height:0px">
                    <input v-model="new7FieldDialogForm.creditExpiryDate" class="my-input" style="width:500px;" autosize  placeholder="放款时效">
                </el-form-item>
                <el-form-item label="申请条件:" style="line-height:0px">
                    <input v-model="new7FieldDialogForm.applyConditionName" class="my-input" style="width:500px;" autosize  placeholder="申请条件">
                </el-form-item>
                <el-form-item label="产品介绍:" style="line-height:0px">
                    <input v-model="new7FieldDialogForm.productIntroduction" class="my-input" style="width:500px;" autosize  placeholder="产品介绍">
                </el-form-item>
                <el-form-item label="还款方式:" style="line-height:0px">
                    <input v-model="new7FieldDialogForm.repayTypeName" class="my-input" style="width:500px;" autosize  placeholder="还款方式">
                </el-form-item>
                <el-form-item label="逾期政策:" style="line-height:0px">
                    <input v-model="new7FieldDialogForm.overduePolicyName" class="my-input" style="width:500px;" autosize  placeholder="逾期政策">
                </el-form-item>
                <el-form-item label="是否支持提前还款:" style="line-height:0px">
                    <input v-model="new7FieldDialogForm.earlyRepayName" class="my-input" style="width:500px;" autosize  placeholder="是否支持提前还款">
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="new7FieldDialog = false">取 消</el-button>
                <el-button type="primary" @click="updateNew7Field()">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑产品信息" :visible.sync="dialog" >
            <el-steps :active="active" finish-status="success" space="30%" align-center style="margin-left:30px">
                <el-step title="填写基本信息"></el-step>
                <el-step title="填写产品属性"></el-step>
                <el-step title="选择产品分类"></el-step>
                <el-step title="选择发布渠道"></el-step>
            </el-steps>
            <el-form :model="dialogForm" :inline="true" size="mini" style="margin-top:50px">
                <div v-if="active == 1">
                    <el-form-item label="*产品名称：">
                        <span v-if="isAlter">{{title}}</span>
                        <input v-if="!isAlter" v-model="title" class="my-input" autosize>
                    </el-form-item>
                    <span v-if="!isAlter" style="display: inline-block;padding-left:1px;padding-top:16px;color:#bfcbd9">剩余{{titleNumber}}字</span>
                    <el-form-item label="置新：" style="padding-left:20px;">
                        <span>
                            <el-switch v-model="dialogForm.isNew"></el-switch>
                        </span>
                    </el-form-item>
                    <el-form-item label="置顶：" style="padding-left:20px;">
                        <span v-if="isTop && dialogForm.isTop">
                            已置顶
                        </span>
                        <span v-if="!dialogForm.isTop">
                            <el-switch v-model="isTop"></el-switch>
                        </span>
                    </el-form-item>
                    <br/>
                    <el-form-item label="*机构名称：" style="line-height:0px">
                        <!-- <span v-if="isAlter">{{lenderName}}</span> -->
                        <!-- <input v-if="!isAlter" v-model="lenderName" class="my-input" style="width:450px;" autosize> -->
                        <input v-model="lenderName" class="my-input" style="width:450px;" autosize>
                        <!-- <el-input v-model="dialogForm.lenderName" placeholder="50个文字以内"></el-input> -->
                    </el-form-item>
                    <span v-if="!isAlter" style="display: inline-block;padding-left:1px;padding-top:16px;color:#bfcbd9">剩余{{lenderNameNumber}}字</span>
                    <br/>
                    <el-form-item label="产品标签：">
                        <el-checkbox-group v-model="dialogForm.firstTags" :max="2">
                            <span style="padding-left:15px"></span>
                            <el-checkbox v-for="item in tags" :key="item" :label="item"/>
                        </el-checkbox-group>
                        <span style="display: inline-block;padding-left:15px;color:#bfcbd9">最多选两项</span>
                    </el-form-item>
                    <br/>
                    <el-form-item label="*产品链接：">
                        <span v-if="isAlter">{{dialogForm.originUrl}}</span>
                        <el-input v-if="!isAlter" v-model="dialogForm.originUrl" placeholder="http://" style="width:450px">
                            <!-- <template slot="prepend">Http://</template> -->
                        </el-input>
                    </el-form-item>
                    <br/>
                    <el-form-item label="*上传图片：">
                        <!-- 1080*465 -->
                        <el-upload
                            class="avatar-uploader"
                            name="image"
                            :action="action"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="showImg" :src="showImg" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            <div slot="tip" class="el-upload__tip">请上传最小尺寸为100px*100px的图片</div>
                        </el-upload>
                    </el-form-item>
                    <br/>
                </div>

                <div v-if="active == 2">
                    <el-form-item label="额度区间：">
                        <el-input v-model="dialogForm.minAmount" placeholder="低"></el-input>
                        至
                        <el-input v-model="dialogForm.maxAmount" placeholder="高"></el-input>
                        元
                    </el-form-item>
                    <br/>
                    <el-form-item label="计息方式：">
                        <el-radio v-model="rateRadio" label="1">按日计息</el-radio>
                        <el-radio v-model="rateRadio" label="2">按月计息</el-radio>
                    </el-form-item>
                    <br/>
                    <el-form-item label="费率计算：">
                        <el-input v-model="myRate"></el-input>%
                    </el-form-item>
                    <span style="margin-top:6px;display: inline-block;color:#20a0ff">{{dayRate}}% / 天,{{monthRate}}% / 月</span>

                    <br/>
                    <el-form-item label="还款期数：">
                        <el-input v-model="dialogForm.minTerm" placeholder="短"></el-input>
                        至
                        <el-input v-model="dialogForm.maxTerm" placeholder="长"></el-input>
                        期
                    </el-form-item>
                    <br/>
                    <el-form-item label="借款资格：">
                        <el-checkbox-group v-model="dialogForm.guarantees">
                            <el-checkbox-button label="芝麻分" name="guarantees"></el-checkbox-button>
                            <el-checkbox-button label="信用卡" name="guarantees"></el-checkbox-button>
                            <el-checkbox-button label="公积金" name="guarantees"></el-checkbox-button>
                            <el-checkbox-button label="运营商" name="guarantees"></el-checkbox-button>
                            <el-checkbox-button label="房" name="guarantees"></el-checkbox-button>
                            <el-checkbox-button label="社保" name="guarantees"></el-checkbox-button>
                        </el-checkbox-group>
                    </el-form-item>
                    <br/>
                </div>

                <div v-if="active == 3">
                    <el-form-item label="选择栏位：">
                        <el-checkbox-group v-model="editAppColumns">
                            <span style="padding-left:15px"></span>
                            <el-checkbox v-for="item in appColumns" :key="item.columnKey" :label="item.name"/>
                        </el-checkbox-group>
                    </el-form-item>
                    <br/>
                    <el-form-item label="产品说明：">
                        <textarea rows="3" cols="20" type="text" v-model="description" class="my-input" style="width:450px;height:60px;line-height:20px"></textarea>
                        <!-- <input type="text" v-model="description" class="my-input" style="width:400px;"> -->
                        <!-- <el-input type="text" v-model="value" style="width:400px" @input="handleInput"></el-input> -->
                    </el-form-item>
                    <span style="display: inline-block;padding-left:2px;padding-top:40px;color:#bfcbd9">剩余{{wordNumber}}字</span>
                    <br/>
                    <el-form-item label="设置状态：">
                        <el-select class="sm" v-model="dialogForm.isPublished" placeholder="发布状态">
                            <el-option label="未发布" :value="0"></el-option>
                            <el-option label="发布" :value="1"></el-option>
                            <el-option v-if="isAlter" label="下线" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </div>

                <div v-if="active == 4">
                    <el-form-item label="发布到这些App：">
                        <el-checkbox v-model="checkAllApp" @change="handleAllApp" style="padding-left:15px">全选</el-checkbox>
                        <el-checkbox-group v-model="chooseAppNameList">
                            <span style="padding-left:15px"></span>
                            <el-checkbox v-for="(item,index) in appNameList" :key="index" :label="item"/>
                        </el-checkbox-group>
                    </el-form-item>

                    <el-form-item label="可用渠道：">
                        <el-checkbox v-model="checkAllChannel" @change="handleAllChannel" style="padding-left:15px">全选</el-checkbox>
                        <el-checkbox-group v-model="chooseChannelList">
                            <span style="padding-left:15px"></span>
                            <el-checkbox v-for="(item,index) in channelList" :key="index" :label="item"/>
                        </el-checkbox-group>
                    </el-form-item>
                </div>
            </el-form>

            <div slot="footer" class="dialog-footer" style="text-align:center;">
                <el-button v-if="active > 1" @click="active --">
                    <span v-if="active == 2">上一步，填写基本信息</span>
                    <span v-if="active == 3">上一步，填写产品属性</span>
                    <span v-if="active == 4">上一步，选择产品分类</span></el-button>
                <el-button type="primary" @click="nextStep()">
                    <span v-if="active == 1">下一步，填写产品属性</span>
                    <span v-if="active == 2">下一步，选择产品分类</span>
                    <span v-if="active == 3">下一步，选择发布渠道</span>
                    <span v-if="active == 4">保存</span></el-button>
            </div>

        </el-dialog>
    </div>
</div>
</template>

<script>
    import resources from '../../resources'
	import * as Sortable from 'sortablejs/Sortable.js'
    export default {
        data() {
            return {
                active: 1,
                weightId: 0,
                guarantees: [{
                    value: '芝麻分',
                    label: '芝麻分'
                },{
                    value: '信用卡',
                    label: '信用卡'
                },{
                    value: '公积金',
                    label: '公积金'
                },{
                    value: '运营商',
                    label: '运营商'
                },{
                    value: '房',
                    label: '房'
                },{
                    value: '社保',
                    label: '社保'
				}],
				colors: [{
					text: "Aquamarine"
				}, {
					text: "Hotpink"
				}, {
					text: "Gold"
				}, {
					text: "Crimson"
				}, {
					text: "Blueviolet"
				}, {
					text: "Lightblue"
				}, {
					text: "Cornflowerblue"
				}, {
					text: "Skyblue"
				}, {
					text: "Burlywood"
				}],

                tags: ["新品","知名品牌","自动审批","自动下款","大额低息","不查征信","活动中"],

                flagTitle: '',
                titleNumber: 20,
                title: '',
                flagLendName: '',
                lenderNameNumber: 50,
                lenderName: '',
                flagDescription: '',
                wordNumber: 80,
                description: '',

                rateRadio: '1',
                dayRate: '',
                monthRate: '',
                myRate: '',
                show:false,
                action: '',
                pageSize: 30,
                pageNumber: 1,
                dataCount: 0,
                loading: false,
                //筛选
                filters: {
                    title: '',
                    lenderName: '',
                    isPublished: '',
                    guarantees: [],
                    publishTime: '',
                    anotherPublishTime: '',
                    minTerm: '',
                    maxTerm: '',
                    minAmount: '',
                    maxAmount: ''
                },
				allproducts: [],
				appColumns: [],
                myForm: {
                    title: '',
                    lenderName: '',
					isNew: false,
					isTop: false,
                    isPublished: 0,
                    firstTags: [],
                    description: '',
                    imgUrl: '',
                    url: '',
                    minAmount: '',
                    maxAmount: '',
                    dayRate: '',
                    minTerm: '',
                    maxTerm: '',
                    guarantees: [],
                    myRate: '',
                    showImg: '',
					originUrl: '',
					appColumns: []
				},
				// 深拷贝、浅拷贝
                dialogForm:{
                },
                new7FieldDialogForm:{
                },
                dialog: false,
                new7FieldDialog:false,
                result: '',
                mistakeMes: '',
                editAppColumns: '',
                firstTags: '',
                showImg: '',
				isAlter: false,
				dataList: [],
				sorter: 100,
                showSort: false,
                isTop: false,

                appNameList: [],//供选择
                channelList: [],//供选择
                chooseAppNameList: [],//已选择
                chooseChannelList: [],//已选择
                allAppClients: [],//所有add渠道组
                copyOfChannelList: [],

                checkAllApp: false,
                checkAllChannel: false
            }
        },
        watch: {
            myRate: function (newQuestion, oldQuestion) {
                if (this.myRate != ''){
                    if (this.rateRadio === '1') {
                        this.monthRate = this.returnFloat(this.myRate*30);
                        this.dayRate = this.returnFloat(this.myRate);
                    } else if (this.rateRadio === '2') {
                        this.monthRate = this.returnFloat(this.myRate);
                        this.dayRate = this.returnFloat(this.myRate/30);
                    }
                } else {
                    this.monthRate = '';
                    this.dayRate = '';
                }
            },
            rateRadio: function (newQuestion, oldQuestion) {
                if (this.myRate != ''){
                    if (this.rateRadio === '1') {
                        this.monthRate = this.returnFloat(this.myRate*30);
                        this.dayRate = this.returnFloat(this.myRate);
                    } else if (this.rateRadio === '2') {
                        this.monthRate = this.returnFloat(this.myRate);
                        this.dayRate = this.returnFloat(this.myRate/30);
                    }
                }
            },
            description: function (newQuestion, oldQuestion) {
                this.flagDescription = this.description;
                this.wordNumber = 80 - this.description.length;
                if (this.wordNumber < 0) {
                    this.description = this.description.substring(0,80);
                }
            },
            lenderName: function (newQuestion,oldQuestion) {
                this.flagLendName = this.lenderName;
                this.lenderNameNumber = 50 - this.lenderName.length;
                if (this.lenderNameNumber < 0) {
                    this.lenderName = this.lenderName.substring(0,50);
                }
            },
            title: function (newQuestion,oldQuestion) {
                this.flagTitle = this.title;
                this.titleNumber = 20 - this.title.length;
                if (this.titleNumber < 0) {
                    this.title = this.title.substring(0,8);
                }
            },
            chooseChannelList: {
                handler(newValue, oldValue) {},
                deep: true
            },
            chooseAppNameList: {
        　　　　 handler(newValue, oldValue) {
                    this.channelList = [];
                    for (var appName of newValue) {
                        for (var appClient of this.allAppClients) {
                            if (appClient.name == appName) {
                                this.channelList.push(appClient.channelName)
                            }
                        }
                    }
                    // 去重
                    this.channelList = [...new Set(this.channelList)];
                    //console.log(this.channelList)
                    var chooseList = this.chooseChannelList.slice(0);
                    this.chooseChannelList = [];
                    for (var channelName of chooseList) {
                        if (this.channelList.indexOf(channelName) != -1) {
                            this.chooseChannelList.push(channelName);
                        }
                    }
                    this.chooseChannelList = [...new Set(this.chooseChannelList)];
                    
                    if (this.channelList.length == 0) {
                        [ ...this.channelList ]  = this.copyOfChannelList;
                    }
                    console.log(this.chooseChannelList)
        　　　　 },
        　　　　 deep: true
    　　     }
        },
        methods: {
            updateNew7Field() {
                let _this = this;
                let url = resources.productsV2(_this.new7FieldDialogForm.id);
                let params = new URLSearchParams();
                params.append('loanTermName', _this.new7FieldDialogForm.loanTermName);
                params.append('creditExpiryDate', _this.new7FieldDialogForm.creditExpiryDate);
                params.append('applyConditionName', _this.new7FieldDialogForm.applyConditionName);
                params.append('productIntroduction', _this.new7FieldDialogForm.productIntroduction);
                params.append('repayTypeName', _this.new7FieldDialogForm.repayTypeName);
                params.append('overduePolicyName', _this.new7FieldDialogForm.overduePolicyName);
                params.append('earlyRepayName', _this.new7FieldDialogForm.earlyRepayName);
                _this.$ajax.post(url,params)
                .then(res => {
                    console.log(res);
                    this.new7FieldDialog = false;
                    _this.result = res.data.statusMsg;
                    _this.succeed();
                    location.reload();
                })

            },
            handleAllApp() {
                if(this.checkAllApp) {
                    [ ...this.chooseAppNameList] = this.appNameList;
                } else {
                    this.chooseAppNameList = [];
                }
            },
            handleAllChannel() {
                if(this.checkAllChannel) {
                    // 深拷贝
                   [ ...this.chooseChannelList] = this.channelList;
                } else {
                    this.chooseChannelList = [];
                }
            },
            appClients() {
                this.appNameList = [];
                this.channelList = [];
                let params = new URLSearchParams();
                let url = resources.appClients();
                this.$ajax.get(url,params)
                .then(res => {
                    console.log(res);
                    this.allAppClients = res.data.obj1;
                    for (var item of res.data.obj1) {
                        this.appNameList.push(item.name)
                        this.channelList.push(item.channelName);
                    }
                    this.appNameList = [...new Set(this.appNameList)];
                    this.channelList = [...new Set(this.channelList)];
                    this.copyOfChannelList = this.channelList.slice(0);
                    console.log(this.channelList)
                    console.log(this.appNameList)
                })
            },
            nextStep() {
                if (this.active > 0) {
                    if (this.dialogForm.firstTags.length > 3) {
                        this.lackMessage("产品标签数量不能超过3个")
                        this.active = 1;
                        return;
                    }
                    if (this.title == '') {
                        this.lackMessage("产品名称不能为空")
                        this.active = 1;
                        return;
                    }
                    if (this.lenderName == '') {
                        this.lackMessage("机构名称不能为空")
                        this.active = 1;
                        return;
                    }
                    if (this.dialogForm.originUrl == '') {
                        this.lackMessage("产品链接不能为空")
                        this.active = 1;
                        return;
                    }
                    if (this.showImg == '') {
                        this.lackMessage("产品logo不能为空")
                        this.active = 1;
                        return;
                    }
                }

                if (this.active > 1) {
                    if (parseInt(this.dialogForm.minTerm) > parseInt(this.dialogForm.maxTerm)) {
                        this.lackMessage("还款期数应前小后大")
                        this.active = 2;
                        return;
                    }
                    if (parseInt(this.dialogForm.minAmount) > parseInt(this.dialogForm.maxAmount)) {
                        this.lackMessage("额度区间应前小后大")
                        this.active = 2;
                        return;
                    }
                }

                if (this.active === 4) {
                    this.dialog = false;
                    this.updateDate();
                } else {
                    this.active ++;
                }

            },
			getdata: function(evt){
                console.log(evt.draggedContext.element.id);
            },
            datadragEnd:function(evt){
                console.log('拖动前的索引：'+evt.oldIndex);
                console.log('拖动后的索引：'+evt.newIndex);
			},

            detail(id){
                this.$router.push({ path: '/productDetail/' + id });
            },
            returnFloat(value){
                var value=Math.round(parseFloat(value)*100)/100;
                var xsd=value.toString().split(".");
                if(xsd.length==1){
                    value=value.toString()+".00";
                    return value;
                }
                if(xsd.length>1){
                    if(xsd[1].length<2){
                        value=value.toString()+"0";
                    }
                    return value;
                }
            },
            //上传图片
            handleAvatarSuccess(res, file) {
                console.log(res)
                this.dialogForm.imgUrl = res;
                this.showImg = URL.createObjectURL(file.raw);
                //this.runningSportsInfo.imgUrl =
            },
            beforeAvatarUpload(file) {
                let _this = this;
                let isValidWH = true;
                let imgObj = new Image();
                imgObj.src = URL.createObjectURL(file);
                imgObj.onload = function() {
                    if (imgObj.width < 100 || imgObj.height < 100) {
                        isValidWH = false;
                        _this.$message.error('上传图片尺寸必须大于100px*100px');
                    }
                };
                console.log(isValidWH)
                return isValidWH;
            },
            //获取列表
            addDate() {
                this.isAlter = false;
                this.title = this.myForm.title;
                this.description = this.myForm.description;
                this.lenderName = this.myForm.lenderName;
                this.myRate = this.myForm.myRate;
                this.showImg = this.myForm.showImg;
                this.dialogForm = Object.create(this.myForm);
                this.editAppColumns = new Array();
                this.active = 1;
                this.checkAllApp = false;
                this.checkAllChannel = false;
                this.dialog = true;
            },
            getNew7Field(id) {
                //获取id对应产品的新增h5字段数据
                let params = new URLSearchParams();
                let url = resources.productsV2(id);
                this.$ajax.get(url,params)
                .then(res => {
                    this.new7FieldDialog = true;
                    this.new7FieldDialogForm = res.data.obj1;
                })
            },
            alterDate(id) {
                this.checkAllApp = false;
                this.checkAllChannel = false;
				console.log(this.appColumns);
                let _this = this;
                this.isAlter = true;
                this.active = 1;
                for (var i = 0; i < _this.allproducts.length; i++) {
                    if (_this.allproducts[i].id === id) {
                        this.editAppColumns = this.allproducts[i].appColumns;
                        console.log(this.allproducts[i].appColumns)
                        _this.dialogForm = _this.allproducts[i];
                        
                        // 遍历从数据库取出的tags，若不在数组中则删除
                        var length = _this.dialogForm.firstTags.length;
                        for (var k = 0; k < length; k++) {
                            var flag = false;
                            for(var j = 0; j < this.tags.length; j++){
                                if( _this.dialogForm.firstTags[k] == this.tags[j]){
                                    flag = true;
                                }
                            }
                            if (flag == false) {
                                _this.dialogForm.firstTags.splice(k, 1);
                                length--;
                                k--;
                            }
                        }
                        
                        if (_this.allproducts[i].isTop == false) {
                            this.isTop = false;
                        } else {
                            this.isTop = true;
                        }
                        console.log(this.allproducts[i])
                        if (this.allproducts[i].appNames != null) {
                            [ ...this.chooseAppNameList ] = this.allproducts[i].appNames;
                            [ ...this.chooseChannelList ] = this.allproducts[i].channelNames;
                        } else {
							this.chooseAppNameList = [];
							this.chooseChannelList = [];
						}

                        _this.showImg = _this.allproducts[i].imgUrl;
                        this.title = this.allproducts[i].title;
                        this.lenderName = this.allproducts[i].lenderName;
                        this.description = this.allproducts[i].description;
                        this.dayRate = this.allproducts[i].dayRate;
                        this.myRate = this.dayRate;
                        break;
                    }
                }
                //alert(id)
                _this.dialog = true;
            },
            upline(id,title) {
                this.$confirm('此操作将上线'+'"'+title+'"'+', 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = resources.products(id);
                    let params = new URLSearchParams();
                    params.append('isPublished','1');
                    this.$ajax.post(url,params)
                    .then(res => {
                        console.log(res)
                            this.$message({
                            type: 'success',
                            message: '上线成功!'
                        });
                        for (var i = 0; i < this.allproducts.length; i++) {
                            if (this.allproducts[i].id === id) {
                                this.allproducts[i].isPublished = 1;
                                break;
                            }
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消上线操作'
                    });
                });
            },
            offline(id,title) {
                this.$confirm('此操作将下线'+'"'+title+'"'+', 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = resources.products(id);
                    let params = new URLSearchParams();
                    params.append('isPublished','2');
                    this.$ajax.post(url,params)
                    .then(res => {
                        console.log(res)
                            this.$message({
                            type: 'success',
                            message: '下线成功!'
                        });
                        for (var i = 0; i < this.allproducts.length; i++) {
                            if (this.allproducts[i].id === id) {
                                this.allproducts[i].isPublished = 2;
                                break;
                            }
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消下线操作'
                    });
                });
            },
            stick(id,title) {
                this.$confirm('此操作将置顶'+'"'+title+'"'+', 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let url = resources.products(id);
                    let params = new URLSearchParams();
                    params.append('isTop',true);
                    this.$ajax.post(url,params)
                    .then(res => {
                        this.weightId = id;
                        console.log(res)
                            this.$message({
                            type: 'success',
                            message: '置顶成功!'
                        });
                        location.reload();//刷新当前页面
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消置顶操作'
                    });
                });
            },
            updateDate(){
                let _this = this;
                _this.result = '';
                _this.dialogForm.dayRate = _this.dayRate;
                _this.dialogForm.title = _this.title;
                _this.dialogForm.lenderName = _this.lenderName;
                _this.dialogForm.description = _this.description;
                console.log(this.chooseAppNameList + this.chooseChannelList)
                let url = resources.products(_this.dialogForm.id);
                console.log(url)
                let params = new URLSearchParams();
                params.append('title', _this.dialogForm.title);
                params.append('lenderName',_this.dialogForm.lenderName);
                params.append('isNew',_this.dialogForm.isNew);
                params.append('isTop',_this.isTop);
                params.append('isPublished',_this.dialogForm.isPublished);
                params.append('firstTags',_this.dialogForm.firstTags);
                params.append('description',_this.dialogForm.description);
                params.append('imgUrl',_this.dialogForm.imgUrl);
                params.append('url',_this.dialogForm.originUrl);//这里注意一下
                params.append('minAmount',_this.dialogForm.minAmount);
                params.append('maxAmount',_this.dialogForm.maxAmount);
                params.append('minTerm',_this.dialogForm.minTerm);
                params.append('maxTerm',_this.dialogForm.maxTerm);
                params.append('dayRate',_this.dialogForm.dayRate);
				params.append('guarantees',_this.dialogForm.guarantees);
                params.append('appNames',_this.chooseAppNameList);
                params.append('channelNames',_this.chooseChannelList);

				let columnKeys = [];
				for (var i = 0; i < _this.appColumns.length; i++) {
					for (var j = 0; j < _this.editAppColumns.length; j++){
						// console.log(i + " : "  + _this.appColumns[i].name + "     "  + j + " : "  + _this.editAppColumns[j])
						if (_this.appColumns[i].name == _this.editAppColumns[j]) {
							columnKeys.push(_this.appColumns[i].columnKey);
						}
					}
				}
				params.append('columnKeys', columnKeys);
				console.log(columnKeys);
                _this.$ajax.post(url,params)
                .then(res => {
                    if (this.dialogForm.isTop != this.isTop && this.isTop == true) {
                        this.weightId =  this.dialogForm.id;
                    }
                    this.dialogForm.appColumns = new Array();
                    for (var x of this.editAppColumns) {
                        this.dialogForm.appColumns.push(x)
                    }
                    console.log(res)
                    _this.result = res.data.statusMsg;
                    _this.succeed();
                    //location.reload();
                })
                this.dialog = false;
            },
            searchProducts() {
                //console.log('filters:' + this.filters.publishTime.getTime());
                this.getData();
            },
            getData() {
                let _this = this;
                //_this.loading = true;
                _this.allproducts = [];
                let url = resources.selectProducts();
                var anotherPublishTime = '';
                var publishTime = '';
                if (this.filters.publishTime != '') {
                    publishTime = this.filters.publishTime.getTime();
                }
                if (this.filters.anotherPublishTime != '') {
                    anotherPublishTime = this.filters.anotherPublishTime.getTime();
                }
                let params = new URLSearchParams();
                params.append('title', _this.filters.title);
                params.append('lenderName',_this.filters.lenderName);
                params.append('isPublished',_this.filters.isPublished);
                params.append('guarantees',_this.filters.guarantees);
                params.append('publishTime',publishTime);
                params.append('anotherPublishTime',anotherPublishTime);
                params.append('minTerm',_this.filters.minTerm);
                params.append('maxTerm',_this.filters.maxTerm);
                params.append('minAmount',_this.filters.minAmount);
                params.append('maxAmount',_this.filters.maxAmount);
                params.append('pageSize',this.pageSize);
                params.append('pageNumber',this.pageNumber);
                //console.log(params)
                //url = url + '?pageSize=' + this.pageSize + '&pageNumber=' + this.pageNumber;
                this.$ajax.post(url, params)
                    .then(res => {
                        this.show = true;
                        console.log("返回的query结果");
                        console.log(res);
                        _this.loading = false;
                        _this.dataCount = res.data.obj1.dataCount;
						_this.allproducts = res.data.obj1.data;
						_this.dataList = res.data.obj1.data;
                        _this.weightId = res.data.obj2;
                        _this.allproducts.forEach(item => {
                            if (item.id == this.weightId) {
                                this.$set(item,"isTop",true)
                                item.isTop = true;
                            } else {
                                this.$set(item,"isTop",false)
                                item.isTop = false;
                            }
                            if (item.minAmount >= 10000) {
                                item.minedu = item.minAmount/10000 + '万';
                            } else {
                                item.minedu = item.minAmount;
                            }
                            if (item.maxAmount >= 10000) {
                                item.maxedu = item.maxAmount/10000 + '万';
                            } else {
                                item.maxedu = item.maxAmount;
                            }
                            //console.log(item.columns)
                            var arr = new Array;
                            if (item.columns != null) {
                                for (var i = 0; i < item.columns.length; i++) {
                                    arr.push(item.columns[i].name)
                                }
                            }

                            //console.log(arr);
                            item.appColumns = arr;
                            var showFirstTags = '';
                            for (var i = 0; i < item.firstTags.length; i ++) {
                                if ( i === 0) {
                                    showFirstTags = item.firstTags[i];
                                } else {
                                    showFirstTags = showFirstTags + '|' + item.firstTags[i];
                                }
                            }
                            item.showFirstTags = showFirstTags;

                            var showGuarantees = '';
                            for (var i = 0; i < item.guarantees.length; i ++) {
                                if ( i === 0) {
                                    showGuarantees = item.guarantees[i];
                                } else {
                                    showGuarantees = showGuarantees + '|' + item.guarantees[i];
                                }
                            }
                            item.showGuarantees = showGuarantees;
                        });
                    });
			},
			// 获取栏位
			getColumnData() {
				let _this = this;
				_this.appColumns = [];
                let url = resources.selectColumns();
                let params = new URLSearchParams();

                this.$ajax.get(url, params)
                    .then(res => {
                        this.show = true;
                        console.log("columns:"+res);
                        _this.loading = false;
						let columnDatas = res.data.obj1;
						columnDatas.forEach(item => {
							// console.log(item.name);
							// _this.appColumns.push(item.name);
							// _this.appColumns.push({ columnName: item.name, columnKey: item.columnKey });
							_this.appColumns.push(item)
						});
						console.log(_this.appColumns);
                    });
			},
			enableSort() {
				let _this = this;
				var t;
				clearTimeout(t)
				t = setTimeout(function (){
					var table = document.querySelectorAll('.el-table--enable-row-transition .el-table__body-wrapper tbody')[0];

                    console.log(table);
				    _this.showSort = true;
					// const self = this;
					// 前端根据索引能判断是下移还是上移，后端根据id权重判断
					_this.sorter = Sortable.create(table, {
						onEnd({ newIndex, oldIndex }) {
							// 1.考虑移动之后没有变换位置。
							if (newIndex == oldIndex) {
								return;
							}

							// 2.考虑是向上拖动还是向下拖动
							var oldId;
							var newId;
							if (newIndex < oldIndex) {
								// 向上拖动
								if (newIndex == 0) {
									oldId = -1;
								} else {
									oldId = _this.dataList[newIndex-1].id;;
								}
								newId = _this.dataList[oldIndex].id;
							} else {
								// 向下拖动
								oldId = _this.dataList[newIndex].id;
								newId = _this.dataList[oldIndex].id;
							}


							console.log(newIndex); // 插入位置索引
							console.log(oldIndex); // 选中item索引
							console.log(_this.dataList[newIndex-1]);
							console.log(_this.dataList[oldIndex]);
							// alert(newId);
							// alert(oldId);

							// 重新获取数据这块，最好能换成本地数据处理。
							let url = resources.sortProducts();
							let params = new URLSearchParams();
							params.append('touchId', newId);
							params.append('insertId', oldId);

							_this.$ajax.post(url, params)
							.then(res => {
								console.log(res);
								// 更新之后，需要重置dataList, 解决办法是重新刷新页面
								// _this.getData();

								let url = resources.selectProducts();
								var anotherPublishTime = '';
								let publishTime = '';
								if (_this.filters.publishTime != '') {
									publishTime = _this.filters.publishTime.getTime();
								}
								if (_this.filters.anotherPublishTime != '') {
									anotherPublishTime = _this.filters.anotherPublishTime.getTime();
								}
								let params = new URLSearchParams();
								params.append('title', _this.filters.title);
								params.append('lenderName',_this.filters.lenderName);
								params.append('isPublished',_this.filters.isPublished);
								params.append('guarantees',_this.filters.guarantees);
								params.append('publishTime',publishTime);
								params.append('anotherPublishTime',anotherPublishTime);
								params.append('minTerm',_this.filters.minTerm);
								params.append('maxTerm',_this.filters.maxTerm);
								params.append('minAmount',_this.filters.minAmount);
								params.append('maxAmount',_this.filters.maxAmount);
								params.append('pageSize',_this.pageSize);
								params.append('pageNumber',_this.pageNumber);

								_this.$ajax.post(url, params)
								.then(res => {
									_this.dataList = res.data.obj1.data;
									_this.succeed();
								});
							});
						}
					})
				}, 2000);
			},
			disableSort(){
				this.sorter.destroy();
				this.showSort = false;
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
            mistake(){
                this.$notify.error({
                    title: '错误',
                    message: '添加失败'
                    });
            },
        },
        mounted: function () {
            this.appClients();
			this.getData();
			this.getColumnData();
			// this.enableSort();
			// sort.destroy();
			this.action = resources.uploadImage();
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
