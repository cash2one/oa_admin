<template>
    <div class="attendancelog">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item >考勤打卡</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索 -->
        <el-form ref="form" :model="search" label-width="90px">
            <el-row :gutter="20">
                <el-col :span="5">
                    <div class="block">
                        <span class="demonstration">日期：</span>
                        <el-date-picker v-model="search.selectDay" type="date" placeholder="选择日期范围"></el-date-picker>
                    </div>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="姓名：">
                        <el-input v-model="search.name" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="部门：">
                        <template>
                            <el-select v-model="search.department_id">
                                <el-option label="所有" value=""></el-option>
                                <el-option v-for="item in departmentList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-button type="primary" icon="search" @click="query()">搜索</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>        
        <!-- 表格信息 -->
        <el-table :data="attendancelog.list">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="name"  label="姓名" align="center"></el-table-column>
            <el-table-column prop="dname" label="部门" align="center"></el-table-column>
            <el-table-column prop="pname" label="职位" align="center"></el-table-column>
            <el-table-column prop="num" label="今日打卡记录" align="center"></el-table-column>
            <el-table-column label="本月打卡详情" align="center">
                <template scope="scope">
                    <span class="click-text" @click="open_remark_details(scope.row, scope.row.remark)">查看</span>
                </template>
            </el-table-column>
        </el-table>
        <!-- dialog弹出层 -->
        <el-dialog title="打卡详情" :visible.sync="dialogVisible" size="small">
            <div>
                <span>姓名：{{month_sign_log.userInfo.name}}</span>
                <span>部门：{{month_sign_log.userInfo.dname}}</span>
                <el-button class="downloadEx" type="success" @click="downloadEx">导出表格</el-button>
            </div>
            <p>本月打卡次数：{{month_sign_log.log.count}}次</p>
            <p class="detailsMon">
                <span @click="monthChange(1)"><</span>
                    {{month}}月
                <span @click="monthChange(2)">></span>
            </p>
            <el-table :data="month_sign_log.log.list">
                <el-table-column label="序号" width="100" align="center" header-align="center">
                    <template scope="scope">
                        <span v-html="scope.$index+1"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="day"  label="日期" align="center"></el-table-column>
                <el-table-column label="记录" align="center">
                    <template scope="scope">
                        <span v-for="item in month_sign_log.log.list[scope.$index].create_time" v-html="item" style="margin: 0 15px;"></span>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <!-- 分页 -->
        <div class="block page">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'attendancelog',
        data () {
            return {
                search: {
                    name: '',
                    selectDay: '',
                    day: '',
                    department_id: '',
                    page: 1
                },
                departmentList: [],
                attendancelog: {
                    list: []
                },
                currentPage: 1,
                total: 0,
                dialogVisible: false,
                remark: '',
                month_sign_log: {
                    userInfo: {},
                    log: {}
                },
                year: '',
                month: ''
            }
        },
        mounted () {
            this.getData(1);
            this.get_department_list();
            var date = new Date();
            this.year = date.getFullYear();
            this.month = date.getMonth() + 1;
        },
        methods: {
            getData (page) {
                this.search.page = page;
                if (this.search.selectDay !== '') {
                    this.search.day = myFn.getTime(this.search.selectDay);
                }
                myFn.ajax('get', this.search, apiAddress.clockIn.attendancelog, (res) => {
                    this.attendancelog.list = res.data.data;
                    this.total = res.data.total;
                })
            },
            get_department_list () {
                myFn.ajax('get', {}, apiAddress.depart.departList, (res) => {
                    this.departmentList = res.data;
                });
            },
            handleCurrentChange: function (val) {
                this.getData(val)
            },
            query () {
                this.getData();
            },
            monthChange (type) {
                switch (parseInt(type)) {
                    case 1:
                        this.month --;
                        if (this.month < 1) {
                            this.month = 12;
                            this.year --;
                        };
                        break;
                    case 2:
                        this.month ++;
                        if (this.month > 12) {
                            this.month = 1;
                            this.year ++;
                        };
                        break;
                }
                this.getMonthLog();
            },
            downloadEx () {
                var month = this.year + '-' + this.month;
                window.open('http://office.qinhantangtop.com/public/admin/punchCard/getUserPunchList?uid=' + this.month_sign_log.userInfo.id + '&month=' + month)
                // myFn.ajax('get', {uid: this.month_sign_log.userInfo.id, month: month}, apiAddress.clockIn.exportLog, (res) => {})
            },
            getMonthLog () {
                var month = this.year + '-' + this.month;
                myFn.ajax('get', {uid: this.month_sign_log.userInfo.id, month: month}, apiAddress.clockIn.userMonthLog, (res) => {
                    this.month_sign_log.log = res.data;
                })
            },
            open_remark_details (data, val) {
                this.dialogVisible = true;
                this.month_sign_log.userInfo = data;
                this.getMonthLog();
            }
        }
    }
</script>
<style scoped>
    .downloadEx {
        float: right;
    }
    .click-text {
        width: 35px;
        color: #20a0ff;
        cursor: pointer;
        display: inline-block;
        border-bottom: 1px #20a0ff solid;
        line-height: 18px;
    }
    .detailsMon {
        color: #20a0ff;
        text-align: center;
        font-size: 15px;
    }
    .detailsMon span {
        margin: 0px 20px;
        cursor: pointer;
    }
</style>