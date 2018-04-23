<template>
    <div class="wagesMonth">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item >财务管理</el-breadcrumb-item>
            <el-breadcrumb-item >工资管理</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="tabs">
            <span :class="{'active': isShowTable}" @click="toggle_show(true)">考核期数</span>
            <span v-if="tableData.length == 0">|</span>
            <span :class="{'active': isShowTable == false}" v-if="tableData.length == 0" @click="toggle_show(false)">设置工资开始日期</span>
            <span class="assessmentAdd" v-if="rights[127]" @click="add_project">添加考核项目 ></span>
        </div>

        <el-form ref="form" label-width="90px" v-show="isShowTable == false">
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-form-item label="开始时间：">
                        <el-date-picker v-model="wages_start_time" type="date" placeholder="请输本期结束时间" width="200"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-button class="submit" type="primary" size="large" @click="set_wages()">添加</el-button>
        </el-form>
        <div class="addMonth">
            <el-button size="small" type="primary" v-if="rights[128]" @click="add_wages">添加期数</el-button>
        </div>
        <!-- 表格信息 -->
        <el-table :data="tableData"  v-show="isShowTable">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="start_time" label="开始时间" align="center"></el-table-column>
            <el-table-column prop="end_time" label="结束时间" align="center"></el-table-column>
            <el-table-column label="是否确认" align="center">
                <template scope="scope">
                    <span v-show="scope.row.is_sure==0">未处理</span>
                    <span v-show="scope.row.is_sure==1">已确认</span>
                    <span v-show="scope.row.is_sure==2">已拒绝</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="220" align="center">
                <template scope="scope">
                    <el-button size="small" v-if="rights[132]" @click="go_details(scope.row.id)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block page" v-show="isShowTable">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pre" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'wagesMonth',
        data () {
            return {
                tableData: [],
                currentPage: 1,
                pre: 10,
                total: 0,
                isShowTable: true,
                wages_start_time: new Date(),
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.getdata(1);
        },
        methods: {
            getdata (page) {
                myFn.ajax('get', {page: page}, apiAddress.wages.wagesList, (res) => {
                    this.tableData = res.data.data
                    this.currentPage = res.data.current_page
                    this.pre = res.data.per_page
                    this.total = res.data.total
                })
            },
            handleCurrentChange (val) {
                this.getdata(val);
            },
            go_details (id) {
                this.$router.push({name: 'wagesMonthDetails', params: {id: id}});
            },
            add_project () {
                this.$router.push({name: 'wagesAddProject'});
            },
            toggle_show (bool) {
                this.isShowTable = bool;
            },
            add_wages () {
                myFn.ajax('post', {}, apiAddress.wages.wagesAddList, (res) => {
                    this.getdata(1);
                });
            },
            set_wages () {
                myFn.ajax('post', {start_time: myFn.getTime(this.wages_start_time)}, apiAddress.wages.wagesAddList, (res) => {
                    this.isShowTable = true;
                    this.getdata(1);
                });
            }
        }
    }
</script>

<style>
    .wagesMonth .slot {
        visibility: hidden;
    }
    .wagesMonth .el-date-editor.el-input {
        width: 100%;
    }
    .wagesMonth .positionlist {
        font-size: 14px;
        padding-bottom: 15px;
        color: #48576a;
        position: relative;
    }
    .wagesMonth .el-dialog .el-table__header,
    .wagesMonth .el-dialog .el-table__body {
        width: 100%!important;
    }
    .wagesMonth .table-input-width {
        padding: 3px 0;
    }
    .wagesMonth .table-input-width .el-input{
        width: 180px;
    }
    .el-select {
        width: 100%;
    }
</style>
<style scoped>
    
    .tabs {
        margin: 30px 0 10px 5px;
        border-bottom: 1px #ccc solid;
        padding-bottom: 15px;
    }
    .tabs span {
        margin: 0 5px;
        cursor: pointer;
    }
    .tabs .active {
        color: red;
    }
    .addMonth {
        margin-bottom: 10px;
        text-align: right;
        padding-right: 15px;
    }
    .assessment {
        position: absolute;
        right: 20px;
        color: #20a0ff;
        font-size: 14px;
        cursor: pointer;
    }
    .assessmentAdd {
        position: absolute;
        right: 50px;
        color: #20a0ff;
        font-size: 14px;
        cursor: pointer;
    }
    .submit {
        margin-top: 30px;
        margin-left: 50px;
    }
</style>