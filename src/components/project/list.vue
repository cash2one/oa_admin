<template>
    <div class="projectlist">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/project/list' }">项目管理</el-breadcrumb-item>
            <el-breadcrumb-item >项目列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索 -->
        <el-form ref="form" :model="search" label-width="90px">
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-form-item label="项目名称：">
                        <el-input v-model="search.name" placeholder="请输入项目名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="开始时间：">
                        <el-date-picker v-model="search.start_time" type="date" placeholder="选择日期" format="yyyy-MM-dd" @change="startDate"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="结束时间：">
                        <el-date-picker v-model="search.end_time" type="date" placeholder="选择日期" format="yyyy-MM-dd" @change="endDate"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="负责人：">
                        <el-input v-model="search.user_name" placeholder="请输入项目名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-button type="primary" icon="search" @click="query()">搜索</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item style="text-align:right">
                        <el-button type="primary" @click="addProject">添加项目</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>        
        <!-- 表格信息 -->
        <el-table :data="tableData">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="name"  label="项目名称" align="center"></el-table-column>
            <el-table-column prop="start_time" label="开始时间" align="center" @change(sex)></el-table-column>
            <el-table-column prop="end_time" label="结束时间" align="center"></el-table-column>
            <el-table-column prop="user_name" label="负责人" align="center"></el-table-column>
            <el-table-column prop="status" label="状态" align="center"></el-table-column>
            <el-table-column label="操作" align="center" header-align="center" width="450">
                <template scope="scope">
                    <el-button type="default" size="small" v-if="rights[145]" @click="open_details(scope.row, scope.$index)">详情</el-button>
                    <el-button type="resource" size="small" v-if="rights[150]" @click="resource(scope.row.id)">资源</el-button>
                    <el-button type="primary" size="small" v-if="rights[155]" @click="progress(scope.row.id)">进度</el-button>
                    <el-button type="warning" size="small" v-if="rights[149]" @click="workTime(scope.row.id)">工时</el-button>
                    <el-button type="success" size="small" v-if="rights[154]" @click="complete(scope.row.id, scope.$index)">完成</el-button>
                    <el-button type="edit" size="small" v-if="rights[147] && rights[145]" @click="edit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" v-if="rights[146]" @click="del(scope.row.id, scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 详情 -->
        <el-dialog title="项目详情" :visible.sync="dialogVisible" size="small">
            <el-form ref="form" :model="detailslist" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="项目名称：" style="height: 36px;">
                            <el-input disabled v-model="detailslist.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="开始时间：">
                            <el-input disabled v-model="detailslist.start_time"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="结束时间：">
                            <el-input disabled v-model="detailslist.end_time"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="负责人：">
                            <el-input disabled v-model="detailslist.user_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="项目金额：">
                            <el-input disabled v-model="detailslist.project_price"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="业务提成：">
                            <el-input disabled v-model="detailslist.business_percent + '%'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="项目类型：">
                            <el-input disabled v-model="detailslist.project_type"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="项目来源：">
                            <el-input disabled v-model="detailslist.project_from"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="项目状态：">
                            <el-input disabled v-model="detailslist.status"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>    
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
        name: 'projectlist',
        data () {
            return {
                tableData: [],
                detailslist: {},
                search: {
                    name: '',
                    start_time: '',
                    end_time: '',
                    user_name: '',
                    page: 1
                },
                currentPage: 1,
                total: 1,
                dialogVisible: false,
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.getData(1);
        },
        methods: {
            getData (page) {
                this.search.page = page;
                myFn.ajax('get', this.search, apiAddress.project.list, (res) => {
                    for (var i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].status = parseInt(res.data.data[i].status) === 1 ? '进行中' : '已完成';
                    }
                    this.tableData = res.data.data;
                    this.total = res.data.total;
                })
            },
            handleCurrentChange: function (val) {
                this.getData(val)
            },
            query () {
                this.getData();
            },
            addProject () {
                this.$router.push({name: 'addProject'})
            },
            workTime (id) {
                this.$router.push({name: 'workTime', params: {id: id}})
            },
            resource (id) {
                this.$router.push({name: 'source', params: {id: id}})
            },
            progress (id) {
                this.$router.push({name: 'progress', params: {id: id}})
            },
            open_details (data, index) {
                this.detailslist = data;
                this.dialogVisible = true;
            },
            startDate (val) {
                this.search.start_time = val;
            },
            endDate (val) {
                this.search.end_time = val;
            },
            complete (id, index) {
                console.log(id)
                this.$confirm('此操作将完成该项目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(() => {
                    myFn.ajax('post', {id: id}, apiAddress.project.complete, (res) => {
                        this.$message({
                            message: '项目已完成',
                            type: 'success'
                        });
                        this.tableData[index].status = '已完成';
                    })
                }).catch(() => {
                    // console.log('取消')
                })
            },
            edit (data) {
                this.$router.push({name: 'addProject', query: {id: data.id}})
            },
            del (id, index) {
                this.$confirm('此操作将删除该项目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    myFn.ajax('post', {id: id}, apiAddress.project.del, (res) => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.tableData.splice(index, 1)
                    })
                }).catch(() => {
                    // console.log('取消')
                })
            }
        }
    }
</script>
<style>
    .projectlist .el-date-editor.el-input {
        width: 163px;
    }
    .projectlist .click-text {
        width: 35px;
        color: #20a0ff;
        cursor: pointer;
        display: inline-block;
        border-bottom: 1px #20a0ff solid;
        line-height: 18px;
    }
    .el-button--edit {
        color: #fff;
        background-color: #40C6FF;
        border-color: #40C6FF;
    }
    .el-button--edit:hover {
        color: #fff;
        border-color: #40C6FF;
    }
    .el-button--resource {
        color: #fff;
        background-color: #8492A6;
        border-color: #8492A6;
    }
    .el-button--resource:hover {
        color: #fff;
        border-color: #8492A6;
    }
</style>