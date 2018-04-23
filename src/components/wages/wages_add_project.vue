<template>
    <div class="wagesAddProject">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>财务管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'wagesMonth' }">工资管理</el-breadcrumb-item>
            <el-breadcrumb-item >工资项添加</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 表格信息 -->
        <el-table :data="tableData">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="salary_field" label="类型名称" align="center"></el-table-column>
            <el-table-column label="操作" width="220" align="center">
                <template scope="scope">
                    <el-button size="small" v-if="rights[126]" type="primary" @click="edit(scope.row)">编辑</el-button>
                    <el-button size="small" v-if="rights[136]" type="danger" @click="del(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="工资项" prop="rule_name">
                <el-input v-model="ruleForm.rule_name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" v-if="rights[126]" @click="submitForm()">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        name: 'wagesAddProject',
        data () {
            return {
                editId: '',
                tableData: [],
                ruleForm: {
                    rule_name: ''
                },
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.getlist();
        },
        methods: {
            getlist () {
                myFn.ajax('get', this.search, apiAddress.wages.fieldList, (res) => {
                    this.tableData = res.data;
                })
            },
            edit (item) {
                this.ruleForm.rule_name = item.salary_field;
                this.editId = item.id;
            },
            del (index, data) {
                myFn.ajax('post', {id: data.id}, apiAddress.wages.fieldDel, (res) => {
                    this.tableData.splice(index, 1);
                })
            },
            submitForm () {
                var data = {
                    salary_field: this.ruleForm.rule_name
                }
                console.log(this.editId);
                if (this.editId !== '') {
                    data.id = this.editId;
                }
                myFn.ajax('post', data, apiAddress.wages.fieldEdit, (res) => {
                    this.ruleForm.rule_name = '';
                    this.editId = '';
                    this.getlist();
                })
            }
        }
    }
</script>

<style>
    .wagesAddProject .el-table {
        width: 60%;
    }
    .wagesAddProject .el-form {
        width: 30%;
        margin-top: 60px;
    }
    .wagesAddProject .el-radio+.el-radio {
        margin-left: 0;
    }
</style>