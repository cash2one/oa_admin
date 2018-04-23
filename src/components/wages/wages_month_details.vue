<template>
    <div class="wagesMonthDetails">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item >财务管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/wages/wagesMonth'}">工资管理</el-breadcrumb-item>
            <el-breadcrumb-item >月份详情</el-breadcrumb-item>
        </el-breadcrumb>

        <div style="margin-bottom: 15px;text-align: right;">
            <el-button size="small" type="success" v-if="rights[135]" @click="open_file">导入员工工资</el-button>
            <el-button size="small" type="primary" v-if="rights[131]" @click="downloadExcel">下载工资模板</el-button>
            <input type="file" id="excelFile" style="display: none;" @change="importExcel"/>
        </div>
        <!-- 表格信息 -->
        <el-table :data="tableData">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" align="center"></el-table-column>

            <el-table-column v-for="(item, key) in fieldList" :label="item.salary_field" align="center">
                <template scope="scope">
                    <span>{{scope.row.salary_json[item.id]}}</span>
                </template>
            </el-table-column>

            <el-table-column prop="salary" label="总工资" align="center"></el-table-column>
            <el-table-column label="是否确认" align="center">
                <template scope="scope">
                    <span v-show="scope.row.is_sure==0">未处理</span>
                    <span v-show="scope.row.is_sure==1">已确认</span>
                    <span v-show="scope.row.is_sure==2">已拒绝</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="220" align="center">
                <template scope="scope">
                    <el-button size="small" v-if="rights[134]" type="primary" @click="go_details(scope.row.id)">编辑</el-button>
                    <!-- <el-button size="small" type="danger" @click="go_send(scope.$index, scope.row.id)">发送</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block page">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pre" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'wagesMonthDetails',
        data () {
            return {
                id: '',
                tableData: [],
                pre: 0,
                total: 0,
                currentPage: 0,
                fieldList: [],
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.id = this.$route.params.id;
            this.getdata(1);
            this.get_fieldList();
        },
        methods: {
            getdata (page) {
                let Data = {
                    id: this.id,
                    page: page
                }
                myFn.ajax('get', Data, apiAddress.wages.wagesStaffList, (res) => {
                    this.tableData = res.data.data
                    this.currentPage = res.data.current_page
                    this.pre = res.data.per_page
                    this.total = res.data.total
                });
            },
            handleCurrentChange (val) {
                this.getdata(val);
            },
            go_send () {
                // this.$router.push({name: 'assessmentContentAdd', params: {id: this.departID}})
            },
            downloadExcel () {
                window.location.href = apiAddress.wages.downloadExcel + '?id=' + this.id;
            },
            open_file () {
                $('#excelFile').click();
            },
            importExcel () {
                var form = new FormData();
                form.append('id', this.id);
                form.append('salary_excel', document.getElementById('excelFile').files[0]);
                myFn.uploadImg(form, apiAddress.wages.importExcel, (res) => {
                    this.getdata(1);
                });
            },
            get_fieldList () {
                myFn.ajax('get', {id: this.id}, apiAddress.wages.fieldThisList, (res) => {
                    this.fieldList = res.data.salary_rule;
                });
            },
            go_details (id) {
                this.$router.push({name: 'wagesPersonalDetails', params: {month: this.id, id: id}});
            }
        }
    }
</script>

<style>
    .wagesMonthDetails .slot {
        visibility: hidden;
    }
    .wagesMonthDetails .el-date-editor.el-input {
        width: 100%;
    }
    .wagesMonthDetails .positionlist {
        font-size: 14px;
        padding-bottom: 15px;
        color: #48576a;
        position: relative;
    }
/*    .wagesMonthDetails .positionlist span:last-child {
        float: right;
        cursor: pointer;
        user-select: none;
    }*/
    .wagesMonthDetails .el-dialog .el-table__header,
    .wagesMonthDetails .el-dialog .el-table__body {
        width: 100%!important;
    }
    .wagesMonthDetails .table-input-width {
        padding: 3px 0;
    }
    .wagesMonthDetails .table-input-width .el-input{
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
        right: 30px;
        color: #20a0ff;
        font-size: 14px;
        cursor: pointer;
    }
</style>