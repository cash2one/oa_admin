<template>
    <div class="departmentList">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/department/departmentManagement' }">部门管理</el-breadcrumb-item>
            <el-breadcrumb-item >部门人员</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索 -->
        <el-form ref="form" :model="search" label-width="90px">
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-form-item label="姓名：">
                        <el-input v-model="search.name" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="电话：">
                        <el-input v-model="search.mobile" placeholder="请输入电话号码"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-button type="primary" icon="search" @click="query()">搜索</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="positionlist">
            <!-- <span>部门负责人：谭某某</span> -->
            <span class="assessment" v-if="rights[106]" @click="go_assessment_stager">成员考核 ></span>
            <span class="assessmentAdd" v-if="rights[103]" @click="goAdd">考核内容 ></span>
         <!--    <span @click="dialogTableVisible = true">部门职称 ></span> -->
        </div>
        <!-- 表格信息 -->
        <el-table :data="tableData">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="uname" label="姓名" align="center"></el-table-column>
            <el-table-column prop="sex" label="性别" align="center"></el-table-column>
            <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
            <el-table-column prop="birthday" label="生日" align="center"></el-table-column>
            <el-table-column prop="pname" label="职位" align="center"></el-table-column>
            <el-table-column label="是否负责人" align="center">
                <template scope="scope">
                    <span v-html="scope.row.is_manage == 1 ? '是' : '否'"></span>
                </template>
            </el-table-column>
            <el-table-column prop="entry_time" label="入职时间" align="center"></el-table-column>
            <el-table-column label="操作" width="220" align="center">
                <template scope="scope">
                    <el-button size="small" v-if="rights[16] && rights[18] && rights[22] && rights[23]" @click="handlEdit(scope.$index,scope.row)">编辑</el-button>
                    <el-button size="small" v-if="rights[17]" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="用户编辑" :visible.sync="dialogVisible" size="small">
            <el-form :model="tableDataList"  label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="姓名">
                            <el-input v-model="tableDataList.truename"  placeholder="请输入姓名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别">
                            <el-select v-model="tableDataList.sex" placeholder="请选择性别">
                                <el-option label="男" value="男"></el-option>
                                <el-option label="女" value="女"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="身份证">
                            <el-input v-model="tableDataList.card_id"  placeholder="请输入身份证"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="生日">
                            <el-date-picker v-model="tableDataList.birthday" type="date" placeholder="请选择生日日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <p style="border-top: 1px #ddd solid;margin-bottom: 35px;"></p>
                <el-row :gutter="20">
                    <el-col :span="12" style="height: 58px">
                        <el-form-item label="昵称">
                            <el-input v-model="tableDataList.name"  placeholder="如不填写默认为真实姓名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="height: 58px">
                        <el-form-item label="负责人">
                            <el-select v-model="tableDataList.is_manage" placeholder="请选择" @change="select(tableDataList.did)">
                                <el-option label="否" :value="0"></el-option>
                                <el-option label="是" :value="1"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="手机号码">
                            <el-input v-model="tableDataList.mobile"  placeholder="请输入手机号码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="登录密码">
                            <el-input v-model="tableDataList.password"  placeholder="输入则修改"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="部门">
                            <el-select v-model="tableDataList.did" placeholder="请选择你的部门" @change="select(tableDataList.did)">
                                <el-option
                                v-for="item in dnameList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="职位">
                            <el-select v-model="tableDataList.poid" placeholder="请选择你的职位">
                                <el-option
                                v-for="item in pnameList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="入职时间">
                            <el-date-picker v-model="tableDataList.entry_time" type="date" placeholder="选择你的入职日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="转正时间">
                           <el-date-picker v-model="tableDataList.positive_time" type="date" placeholder="请选择你的转正日期">
                           </el-date-picker>
                       </el-form-item>
                   </el-col>
                </el-row>
                <el-row >
                    <el-form-item>
                        <el-col :span="24" style="text-align:left">
                            <el-button @click="dialogVisible=false">取消</el-button>
                            <el-button type="primary" @click="submit()">保存</el-button>
                        </el-col>
                    </el-form-item>
                </el-row>
            </el-form>
        </el-dialog>
        <!-- 分页 -->
        <div class="block page">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pre" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="提示" :visible.sync="del_dialog" size="tiny">
            <span>是否删除记录？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="del_dialog = false">取 消</el-button>
                <el-button type="primary" @click="delete_item">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'departmentList',
        data () {
            return {
                tableData: [],
                tableDataList: {},
                // gridData: [
                //     {position: '设计主管'},
                //     {position: '高级设计员'},
                //     {position: '前端程序员'},
                //     {position: 'php后台程序员'}
                // ],
                search: {
                    name: '',
                    mobile: ''
                },
                dnameList: [],
                pnameList: [],
                departID: '',
                // positionID: '',
                // detailsIndex: 0,
                // 分页
                currentPage: 1,
                total: 10,
                pre: 10,
                // table edit dialog
                dialogVisible: false,
                // position dialog
                dialogTableVisible: false,
                // position add
                // positionValue: '',
                thisItem: {},
                // 删除提示
                del_dialog: false,
                del_item: {
                    index: '',
                    id: ''
                },
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.departID = this.$route.params.id;
            this.getDnameList();
            this.getdata(1)
        },
        methods: {
            /*
            接口数据
             */
            getdata (page) {
                let Data = {
                    id: this.departID,
                    page: page
                }
                myFn.ajax('get', Data, apiAddress.depart.departUserList, (res) => {
                    this.tableData = res.data.data
                    this.currentPage = res.data.current_page
                    this.pre = res.data.per_page
                    this.total = res.data.total
                })
            },
            handleCurrentChange (val) {
                this.getdata(val);
            },
            /*
            打开用户编辑
             */
            handlEdit (index, item) {
                this.thisItem = item;
                this.dialogVisible = true;
                myFn.ajax('get', {id: item.id}, apiAddress.user.userDetail, (res) => {
                    this.tableDataList = res.data;
                    /* if (this.tableDataList.sex === '男') {
                        this.tableDataList.sex = '1';
                    } else {
                        this.tableDataList.sex = '2';
                    } */
                })
                this.getDnameList()
            },
            /*
            部门列表
            */
            getDnameList () {
                myFn.ajax('get', {}, apiAddress.depart.departList, (res) => {
                    console.log(1);
                    this.dnameList = res.data;
                    localStorage.departmentList = JSON.stringify(res.data);
                })
            },
            /*
            职位列表
            */
            getPnameList (did) {
                myFn.ajax('get', {id: did}, apiAddress.user.pname, (res) => {
                    this.pnameList = res.data
                })
            },
            /*
            部门选择
             */
            select () {
                this.getPnameList(this.tableDataList.did)
            },
            /*
            提交
            */
            submit () {
                function getTime (obj) {
                    if (typeof obj === 'string') {
                        return obj;
                    } else {
                        var time = new Date(obj)
                        var year = time.getFullYear();
                        var month = time.getMonth() + 1;
                        var day = time.getDate();
                        if (parseInt(month) < 10) {
                            month = '0' + month;
                        }
                        if (parseInt(day) < 10) {
                            day = '0' + day;
                        }
                        return year + '-' + month + '-' + day;
                    }
                }
                let Mydata = {
                    id: this.tableDataList.id,
                    name: this.tableDataList.name,
                    birthday: getTime(this.tableDataList.birthday),
                    sex: this.tableDataList.sex,
                    departmentid: this.tableDataList.did,
                    positionid: this.tableDataList.poid,
                    entry_time: getTime(this.tableDataList.entry_time),
                    positive_time: getTime(this.tableDataList.positive_time),
                    mobile: this.tableDataList.mobile,
                    // password: this.tableDataList.password,
                    card_id: this.tableDataList.card_id,
                    truename: this.tableDataList.truename,
                    is_manage: this.tableDataList.is_manage
                }
                if (this.tableDataList.password !== '******') {
                    Mydata.password = this.tableDataList.password
                }
                if (this.tableDataList.positive_time > new Date()) {
                    Mydata.positive_status = 1;
                } else {
                    Mydata.positive_status = 2;
                }
                switch (Mydata.sex) {
                    case '男':
                        Mydata.sex = '1';
                        break;
                    case '女':
                        Mydata.sex = '2';
                        break;
                }
                myFn.ajax('post', Mydata, apiAddress.user.userSubmit, (res) => {
                    this.thisItem.id = Mydata.id
                    this.thisItem.name = Mydata.name
                    this.thisItem.birthday = Mydata.birthday
                    this.thisItem.sex = Mydata.sex
                    for (var i in this.dnameList) {
                        if (this.dnameList[i].id === this.tableDataList.did) {
                            this.thisItem.dname = this.dnameList[i].name
                        }
                    }
                    for (var o in this.pnameList) {
                        if (this.pnameList[o].id === this.tableDataList.poid) {
                            this.thisItem.pname = this.pnameList[o].name
                        }
                    }
                    switch (this.thisItem.sex) {
                        case '1':
                            this.thisItem.sex = '男';
                            break;
                        case '2':
                            this.thisItem.sex = '女';
                            break;
                    }
                    this.thisItem.entry_time = Mydata.entry_time;
                    this.thisItem.positive_time = Mydata.positive_time;
                    this.dialogFormVisible = false
                    this.$notify({
                        title: '成功保存',
                        type: 'success'
                    });
                    this.dialogVisible = false
                })
            },
            /*
            删除
            */
            delete_item () {
                myFn.ajax('get', {id: this.del_item.id}, apiAddress.user.userDelect, (res) => {
                    this.tableData.splice(this.del_item.index, 1);
                    this.$notify({
                        title: '成功删除',
                        type: 'success'
                    });
                    this.del_dialog = false;
                })
            },
            handleDelete (index, id) {
                this.del_item.id = id;
                this.del_item.index = index;
                this.del_dialog = true;
            },
            changeDate: function () {
                /* switch (type) {
                    case 0:
                        this.tableData[detailsIndex].birthday
                } */
            },
            /*
            搜索
             */
            query () {
                let searchData = {
                    id: this.departID,
                    name: this.search.name,
                    mobile: this.search.mobile
                }
                myFn.ajax('get', searchData, apiAddress.depart.departUserList, (res) => {
                    this.tableData = res.data.data
                })
            },
            go_assessment_stager () {
                this.$router.push({name: 'assessmentStage', params: {id: this.departID}});
            },
            goAdd () {
                this.$router.push({name: 'assessmentContentAdd', params: {id: this.departID}})
            }
            // select: function () {
            //     console.log(this.departID)
            // },
            // gridDataDelete: function (index, data) {
            //     this.gridData.splice(index, 1);
            // },
            // positionAdd: function () {
            //     if (!this.positionValue) {
            //         this.$message({
            //             message: '职称不能为空！',
            //             type: 'warning',
            //             duration: 2000
            //         });
            //         return false;
            //     };
            //     var data = {};
            //     data.position = this.positionValue;
            //     this.gridData.push({position: this.positionValue});
            //     console.log(1)
            // }
        }
    }
</script>

<style>
    .departmentList .slot {
        visibility: hidden;
    }
    .departmentList .el-date-editor.el-input {
        width: 100%;
    }
    .departmentList .positionlist {
        font-size: 14px;
        padding-bottom: 15px;
        color: #48576a;
        position: relative;
        min-height: 20px;
    }
/*    .departmentList .positionlist span:last-child {
        float: right;
        cursor: pointer;
        user-select: none;
    }*/
    .departmentList .el-dialog .el-table__header,
    .departmentList .el-dialog .el-table__body {
        width: 100%!important;
    }
    .departmentList .table-input-width {
        padding: 3px 0;
    }
    .departmentList .table-input-width .el-input{
        width: 180px;
    }
    .el-select {
        width: 100%;
    }
</style>
<style scoped>
    .assessment {
        position: absolute;
        right: 20px;
        color: #20a0ff;
        font-size: 14px;
        cursor: pointer;
    }
    .assessmentAdd {
        position: absolute;
        right: 120px;
        color: #20a0ff;
        font-size: 14px;
        cursor: pointer;
    }
</style>