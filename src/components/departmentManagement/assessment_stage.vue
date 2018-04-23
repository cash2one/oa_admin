<template>
    <div class="assessment_stage">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/department/departmentManagement' }">部门管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/department/departmentList/' + id}">部门人员</el-breadcrumb-item>
            <el-breadcrumb-item >成员考核</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="tabs">
            <span :class="{'active': isShow_assessment_stage}" @click="toggle_show(1)">考核期数</span>
            <span>|</span>
            <span :class="{'active': isShow_assessment_stage == false}" v-if="rights[107]" @click="toggle_show(2)">添加期数</span>
        </div>
        <!-- 表格信息 -->
        <el-table :data="tableData" v-show="isShow_assessment_stage">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="id" label="期数" align="center"></el-table-column>
            <el-table-column prop="sex" label="是否结算" align="center">
                <template scope="scope">
                    <span v-if="scope.row.is_clearing == 1">已结算</span>
                    <span v-if="scope.row.is_clearing == 0">未结算</span>
                </template>
            </el-table-column>
            <el-table-column label="是否确认" align="center">
                <template scope="scope">
                    <span v-if="scope.row.is_sure == 1">已确认</span>
                    <span v-if="scope.row.is_sure == 0">未确认</span>
                </template>
            </el-table-column>
            <el-table-column prop="end_time" label="真实时间" align="center"></el-table-column>
            <el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>
            <el-table-column label="操作" width="220" align="center">
                <template scope="scope">
                    <el-button size="small" v-if="rights[109]" @click="go_details(scope.row)">查看详情</el-button>
                    <el-button size="small" :disabled="scope.row.is_sure == 1" type="primary" v-if="rights[112]" @click="go_settlement(scope.$index,scope.row)">结算</el-button>
                    <el-button size="small" :disabled="scope.row.is_sure == 1 || scope.row.is_clearing == 0" type="danger" v-if="rights[113]" @click="go_confirm(scope.$index, scope.row)">确认</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block page" v-show="isShow_assessment_stage">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pre" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <el-form ref="form" label-width="90px" v-show="isShow_assessment_stage == false">
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-form-item label="实际时间：">
                        <el-date-picker v-model="assessment_stop_time" type="date" placeholder="请输本期结束时间" width="250"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-button class="submit" type="primary" size="large" @click="add_assessment_stage(assessment_stop_time)">添加</el-button>
        </el-form>
        <!-- dialog -->     
        <el-dialog title="提示" :visible.sync="dialogVisible" size="tiny">
            <span>是否确认？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'assessment_stage',
        data () {
            return {
                aa: true,
                id: '',
                tableData: [],
                currentPage: 1,
                total: 10,
                pre: 1,
                isShow_assessment_stage: true,
                assessment_stop_time: '',
                dialogVisible: false,
                sendInfo: {
                    id: '',
                    index: ''
                },
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.id = this.$route.params.id;
            this.get_data(1);
        },
        methods: {
            get_data (page) {
                myFn.ajax('get', {did: this.id, page: page}, apiAddress.assessment.assessmentStageList, (res) => {
                    this.tableData = res.data.data;
                    this.currentPage = res.data.current_page
                    this.pre = res.data.per_page
                    this.total = res.data.total
                });
            },
            handleCurrentChange (page) {
                this.get_data(page);
            },
            toggle_show (val) {
                if (val === 1) {
                    this.isShow_assessment_stage = true;
                } else {
                    this.isShow_assessment_stage = false;
                }
            },
            go_details (data) {
                // 查看详情跳转
                console.log(data);
                this.$router.push({name: 'assessmentMemberList', params: {id: this.id, qID: data.id}})
            },
            go_settlement (index, item) {
                myFn.ajax('post', {aid: item.id}, apiAddress.assessment.assessmentStageClearing, (res) => {
                    item.is_clearing = 1;
                    this.$notify({
                        title: '结算成功',
                        type: 'success'
                    });
                });
            },
            go_confirm (index, item) {
                this.dialogVisible = true;
                this.sendInfo.id = item.id;
                this.sendInfo.index = index;
            },
            submit () {
                myFn.ajax('post', {aid: this.sendInfo.id}, apiAddress.assessment.assessmentStageSure, (res) => {
                    this.tableData[this.sendInfo.index].is_sure = 1;
                    this.dialogVisible = false;
                });
            },
            add_assessment_stage (val) {
                var data = {
                    did: this.id,
                    end_time: myFn.getTime(this.assessment_stop_time)
                };
                myFn.ajax('post', data, apiAddress.assessment.assessmentStageAdd, (res) => {
                    this.isShow_assessment_stage = true;
                    this.get_data(1);
                    this.assessment_stop_time = '';
                });
            }
        }
    }
</script>
<style scoped>
    .tabs {
        margin: 30px 0 30px 5px;
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
    .submit {
        margin-top: 30px;
        margin-left: 50px;
    }
</style>