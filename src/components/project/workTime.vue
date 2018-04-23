<template>
    <div class="workTime">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/project/list' }">项目管理</el-breadcrumb-item>
            <el-breadcrumb-item >项目工时</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索 -->
        <el-form ref="form" :model="search" label-width="100px">
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-form-item label="工时月份：">
                        <el-date-picker v-model="monthValue" type="month" placeholder="选择月" @change="selectMonth"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-button type="primary" icon="search" @click="query()">搜索</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="4" style="float: right">
                    <el-form-item style="text-align:right">
                        <el-button type="primary" v-if="rights[151] && rights[22] && rights[23]" @click="dialogVisible = true">添加人员</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!-- 表格 -->
        <el-table :data="tableData">
            <el-table-column fixed prop="user_name" label="姓名" width="150"></el-table-column>
            <el-table-column v-for="(item, index) in dayNum" :label="item + ''">
                <template scope="scope">
                    <span v-for="(obj, key) in scope.row.value" v-if="index == key" v-html="obj"></span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template scope="scope">
                    <el-button @click="checkout(scope.row)" v-if="rights[149]" type="text" size="small">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block page">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :total="total">
            </el-pagination>
        </div>
        <!-- 弹出层 -->
        <el-dialog title="添加人员" :visible.sync="dialogVisible" size="tiny">
            <el-form ref="form" label-width="50px">
                <el-form-item label="部门">
                    <el-select v-model="selectDepartValue" placeholder="请选择部门" @change="selectDepart">
                        <el-option v-for="item in departList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="人员">
                    <el-select v-model="selectUserValue" placeholder="请选择人员" @change="selectUser">
                        <el-option v-for="item in userlist" :key="item.id" :label="item.uname" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="selectTypeValue" placeholder="请选择类型" @change="selectType">
                        <el-option v-for="item in identityType" :key="item.type" :label="item.name" :value="item.type"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'workTime',
        data () {
            return {
                id: '',
                dayNum: [],
                tableData: [],
                currentPage: 1,
                total: 0,
                dialogVisible: false,
                name: '',
                departList: [],
                selectDepartValue: '',
                userlist: [],
                selectUserValue: '',
                identityType: [{name: '项目组员', type: '1'}, {name: '项目负责人', type: '2'}],
                selectTypeValue: '',
                monthValue: '',
                search: {},
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            var curDate = new Date();
            var year = curDate.getFullYear();
            var month = parseInt(curDate.getMonth(), 10) + 1;
            var temp = new Date(year, month, 0);
            var length = temp.getDate();
            for (var i = 0; i < length; i++) {
                this.dayNum.push(i + 1)
            }
            this.monthValue = year + '-' + month;
            this.id = this.$route.params.id;
            // this.getData(1);
            if (this.rights[22]) {
                this.getDnameList();
            };
        },
        methods: {
            getData (page) {
                var self = this;
                myFn.ajax('get', {project_id: self.id, page}, apiAddress.project.userlist, (res) => {
                    self.tableData = res.data.data;
                    console.log(res.data.data)
                    self.total = res.data.total;
                    for (var i = 0; i < self.tableData.length; i++) {
                        self.$set(self.tableData[i], 'value', [])
                        self.creatArr(i);
                        if (parseInt(self.tableData[i].type) === 2) {
                            self.tableData[i].user_name = self.tableData[i].user_name + ' (负责人)';
                        }
                    }
                })
            },
            creatArr (index) {
                var self = this;
                // console.log(index)
                myFn.ajax('get', {
                    uid: self.tableData[index].uid,
                    project_id: self.id,
                    month_time: self.monthValue
                }, apiAddress.project.workTime, result => {
                    for (var j = 0; j < self.dayNum.length; j++) {
                        if (result.data.length > 0) {
                            for (var k = 0; k < result.data.length; k++) {
                                if (parseInt(self.dayNum[j]) === parseInt(result.data[k].day)) {
                                    self.tableData[index].value.push(result.data[k].total);
                                } else {
                                    self.tableData[index].value.push('0');
                                }
                            }
                        } else {
                            self.tableData[index].value.push('0');
                        }
                    }
                    // console.log(self.tableData[index])
                })
            },
            handleCurrentChange: function (val) {
                this.getData(val)
            },
            getDnameList () {
                myFn.ajax('get', {}, apiAddress.depart.departList, (res) => {
                    this.departList = res.data;
                })
            },
            selectDepart (val) {
                this.getUserList(val);
            },
            getUserList (id) {
                myFn.ajax('get', {id}, apiAddress.depart.departUserList, (res) => {
                    this.userlist = res.data.data;
                })
            },
            selectUser (val) {
                this.selectUserValue = val;
            },
            selectType (val) {
                this.selectTypeValue = val;
            },
            selectMonth (val) {
                this.monthValue = val;
                this.getData();
            },
            submit () {
                var data = {
                    id: 0,
                    project_id: this.id,
                    uid: this.selectUserValue,
                    type: this.selectTypeValue
                }
                myFn.ajax('post', data, apiAddress.project.adduser, (res) => {
                    this.dialogVisible = false;
                    // this.selectDepartValue = '';
                    this.selectUserValue = '';
                    this.selectTypeValue = '';
                    this.getData(1);
                })
            },
            checkout (data) {
                // console.log(data)
                this.$router.push({name: 'workDetail', params: {uid: data.uid, project_id: data.project_id}})
            }
        }
    }
</script>

<style>
    .workTime .el-table__body,
    .workTime .el-table__footer,
    .workTime .el-table__header {
        width: 100%!important;
    }
    .workTime .el-dialog__footer {
        text-align: left;
        padding-left: 70px;
    }
    .workTime .el-select {
        width: 100%;
    }
    .workTime .el-table__fixed-right {
        border-right: 1px solid #d3d4d6;
    }
    .workTime .el-date-editor.el-input {
        width: 163px;
    }
</style>

<style scoped>
    .add {
        margin-bottom: 15px;
        text-align: right;
    }
</style>