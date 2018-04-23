<template>
    <div class="assessment_content_add">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/department/departmentManagement' }">部门管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'departmentList' }">部门人员</el-breadcrumb-item>
            <el-breadcrumb-item >考核内容添加</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 表格信息 -->
        <el-table :data="tableData">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="rule_name" label="类型名称" align="center"></el-table-column>
            <el-table-column prop="rule_score" label="总分数" align="center"></el-table-column>
            <el-table-column label="操作" width="220" align="center">
                <template scope="scope">
                    <el-button size="small" type="primary" v-if="rights[104]" @click="edit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" v-if="rights[105]" @click="del(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="考核类型" prop="rule_name">
                <el-input v-model="ruleForm.rule_name"></el-input>
            </el-form-item>
            <p>考核规则（分数计算）</p>
            <el-form-item label="最高值" prop="max_value">
                <el-input v-model="ruleForm.max_value"></el-input>
            </el-form-item>
            <el-form-item label="奖励总分数" prop="rule_score">
                <el-input v-model="ruleForm.rule_score"></el-input>
            </el-form-item>
            <el-form-item label="" prop="is_opposite">
                <!-- <el-switch on-text="" off-text="" v-model="ruleForm.is_opposite"></el-switch>
                <span>（注： 接近最高值奖励总分递增，接近最高值奖励总分递减）</span> -->
                <el-radio class="radio" v-model="ruleForm.is_opposite" label="0">递增（接近最高值奖励总分递增）</el-radio>
                <el-radio class="radio" v-model="ruleForm.is_opposite" label="1">递减（接近最高值奖励总分递减）</el-radio>
                <span>（注：如考核业绩，最高任务值为50000元，奖励总分数为10分，需设置接近最高值奖励总分递增，即当实际完成值=25000元时，可获得奖励5分；当实际完成值≥50000元时，可获得最高奖励10分）</span>
            </el-form-item>
            <el-form-item>
                <el-button v-if="!is_edit && rights[104]" type="primary" @click="submitForm('ruleForm', 1)">添加</el-button>
                <el-button v-if="is_edit && rights[104]" type="primary" @click="submitForm('ruleForm', 2)">确认</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        name: 'assessment_content_add',
        data () {
            return {
                id: '',
                tableData: [],
                search: {
                    did: '',
                    page: 1
                },
                ruleForm: {
                    rule_name: '',
                    max_value: '',
                    rule_score: '',
                    is_opposite: '0',
                    id: 0,
                    did: ''
                },
                // 是否编辑
                is_edit: false,
                // 编辑项索引
                editIndex: '',
                // 表单验证
                rules: {
                    rule_name: [
                        { required: true, message: '请输入类型名称', trigger: 'blur' }
                    ],
                    max_value: [
                        { required: true, message: '请输入最高分', trigger: 'blur' }
                    ],
                    rule_score: [
                        { required: true, message: '请输入总分数', trigger: 'blur' }
                    ]
                },
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.ruleForm.did = this.$route.params.id;
            this.search.did = this.$route.params.id;
            this.getlist();
        },
        methods: {
            getlist () {
                myFn.ajax('get', this.search, apiAddress.assessment.assessmentContentList, (res) => {
                    this.tableData = res.data.data;
                })
            },
            edit (index, data) {
                // console.log(data)
                this.editIndex = index;
                this.ruleForm.id = data.id;
                this.ruleForm.rule_name = data.rule_name;
                this.ruleForm.max_value = data.max_value + '';
                this.ruleForm.rule_score = data.rule_score + '';
                this.ruleForm.is_opposite = data.is_opposite + '';
                this.is_edit = true;
                // console.log(this.ruleForm)
            },
            del (index, data) {
                myFn.ajax('post', {id: data.id}, apiAddress.assessment.assessmentContentDel, (res) => {
                    this.tableData.splice(index, 1);
                })
            },
            submitForm (formName, type) {
                console.log(this.ruleForm)
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (parseInt(this.ruleForm.is_opposite) === 1) {
                            this.ruleForm.is_opposite = '1';
                        } else {
                            this.ruleForm.is_opposite = '0';
                        }
                        myFn.ajax('post', this.ruleForm, apiAddress.assessment.assessmentContentAdd, (res) => {
                            if ((type) === 1) {
                                this.tableData.push(res.data);
                            } else {
                                this.tableData[this.editIndex].id = res.data.id;
                                this.tableData[this.editIndex].rule_name = res.data.rule_name;
                                this.tableData[this.editIndex].max_value = res.data.max_value;
                                this.tableData[this.editIndex].rule_score = res.data.rule_score;
                                this.tableData[this.editIndex].is_opposite = res.data.is_opposite + '';
                            }
                            this.$refs[formName].resetFields();
                            this.is_edit = false;
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style>
    .assessment_content_add .el-table {
        width: 60%;
    }
    .assessment_content_add .el-form {
        width: 30%;
        margin-top: 60px;
    }
    .assessment_content_add .el-radio+.el-radio {
        margin-left: 0;
    }
</style>