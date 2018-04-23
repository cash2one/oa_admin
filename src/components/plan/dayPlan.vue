<template>
    <div class="dayPlan">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/paln/day' }">计划表</el-breadcrumb-item>
            <el-breadcrumb-item >日目标</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索 -->
        <el-form ref="form" :model="search" label-width="90px">
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-form-item label="用户名称：">
                        <el-input v-model="search.name" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="日期：">
                        <el-date-picker v-model="search.day" type="date" @change="pickerTime" placeholder="请选择日期">
                        </el-date-picker>
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
        <el-table :data="list">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="name"  label="用户名" align="center"></el-table-column>
            <el-table-column prop="start_time_day"  label="日期" align="center"></el-table-column>
            <el-table-column prop="content"  label="事项" align="center"></el-table-column>
            <el-table-column label="时间段" align="center">
                <template scope="scope">
                    <span v-html="scope.row.start_time_detail"></span>
                    <span>—</span>
                    <span v-html="scope.row.end_time_detail"></span>
                </template>
            </el-table-column>
            <el-table-column prop="prior_code"  label="优先级" align="center"></el-table-column>
            <el-table-column label="状态" align="center">
                <template scope="scope">
                    <span :class="[scope.row.is_success?'finished':'unfinish']" v-html="scope.row.is_success?'已完成':'未完成'"></span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template scope="scope">
                    <el-button type="danger" size="small" v-if="rights[96]" @click="del(scope.$index, scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block page">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :total="total">
            </el-pagination>
        </div>
        <!-- 删除dialog -->
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          size="tiny">
          <span>是否删除？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="delConfirm">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'dayPlan',
        data () {
            return {
                search: {
                    name: '',
                    day: '',
                    page: 1
                },
                list: [],
                total: 2,
                currentPage: 1,
                delInfo: {
                    index: '',
                    id: ''
                },
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
                myFn.ajax('get', this.search, apiAddress.plan.day, (res) => {
                    this.list = res.data.data;
                    this.total = res.data.total;
                })
            },
            handleCurrentChange (val) {
                this.getData(val)
            },
            query () {
                this.getData(1);
            },
            pickerTime (val) {
                this.search.day = val;
            },
            del (index, id) {
                /* this.delInfo.id = id;
                this.delInfo.index = index;
                this.dialogVisible = true; */

                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    myFn.ajax('post', {id: id}, apiAddress.plan.del, (res) => {
                        this.$message({
                            type: 'success',
                            message: '成功删除'
                        });
                        this.tableData[index].status = 3
                        this.list.splice(index, 1)
                    })
                })
            },
            delConfirm () {
                myFn.ajax('get', {id: this.delInfo.id}, apiAddress.plan.del, (res) => {
                    this.dialogVisible = false;
                    this.list.splice(this.delInfo.index, 1)
                })
            }
        }
    }
</script>

<style scoped>
    .finished {
        color: green;
    }
    .unfinish {
        color: red;
    }
</style>