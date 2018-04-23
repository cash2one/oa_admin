<template>
    <div class="weekPlan">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/paln/day' }">计划表</el-breadcrumb-item>
            <el-breadcrumb-item >周目标</el-breadcrumb-item>
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
                        <el-date-picker v-model="search.week" type="date" @change="pickerTime" placeholder="请选择日期">
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
            <el-table-column label="日期" align="center">
                <template scope="scope">
                    <span v-html="scope.row.week_monday"></span>
                    <span>—</span>
                    <span v-html="scope.row.week_monday_end"></span>
                </template>
            </el-table-column>
            <el-table-column label="事项" align="center">
                <template scope="scope">
                    <div :class="scope.row.active_show?'':'isShow'">
                        <div v-for="(item,index) in scope.row.content">
                            <span v-html="item"></span>&nbsp
                            <span style="cursor:pointer" class="el-icon-delete" @click="delOther(scope.row.ids[index], scope.$index, index, 3)"></span>
                        </div>
                        <div class="show-control" v-if="scope.row.content.length>1">
                            <span v-if="scope.row.active_show" @click="scope.row.active_show=false" class="el-icon-arrow-up"></span>
                            <span v-if="!scope.row.active_show" @click="scope.row.active_show=true" class="el-icon-arrow-down"></span>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="完成期限" align="center">
                <template scope="scope">
                    <div :class="scope.row.active_show?'':'isShow'">
                        <div v-for="item in scope.row.dead_time" v-html="item||'空'"></div>
                        <div v-if="scope.row.dead_time.length>1" style="visibility:hidden">
                            <span class="el-icon-arrow-down"></span>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="其他目标" align="center" v-if="rights[98]">
                <template scope="scope">
                    <span @click="checkOther(scope.row)" style="cursor: pointer">点击查看</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template scope="scope">
                    <el-button type="primary" size="small" v-if="rights[97]" @click="checkSummary(scope.row)">总结</el-button>
                    <el-button type="danger" size="small" v-if="rights[101]" @click="del(scope.$index, scope.row.week_monday, scope.row.uid, 1)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- dialog弹出层 -->
        <el-dialog title="周总结" :visible.sync="dialogVisible" size="small">
            <p>用户名：<span v-html="userInfo.name"></span></p>
            <p>日期：<span v-html="userInfo.week_monday"></span>——<span v-html="userInfo.week_monday_end"></span></p>
            <p v-if="!summary.create_time">暂无总结...</p>
            <el-form ref="form" v-if="summary.create_time" :model="summary">
                <div>
                    <el-form-item label="目标完成情况">
                        <el-input type="textarea" readonly v-model="summary.finish_description"></el-input>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="未完成目标原因和障碍">
                        <el-input type="textarea" readonly v-model="summary.finish_difficult"></el-input>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="克服障碍的对策和方法">
                        <el-input type="textarea" readonly v-model="summary.overcome"></el-input>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="本周创新与收获">
                        <el-input type="textarea" readonly v-model="summary.harvest"></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </el-dialog>
        <el-dialog title="其他目标" :visible.sync="dialogVisible2" size="small">
            <p>用户名：<span v-html="userInfo.name"></span></p>
            <p>日期：<span v-html="userInfo.week_monday"></span>——<span v-html="userInfo.week_monday_end"></span></p>
            <p v-if="!otherlist.length">暂无目标...</p>
            <el-collapse v-if="otherlist.length" v-model="activeName" accordion>
                <el-collapse-item v-for="(item,index) in otherlist" :title="item.name">
                    <el-table :data="item.list">
                        <el-table-column label="序号" width="100" align="center" header-align="center">
                            <template scope="scope">
                                <span v-html="scope.$index+1"></span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="content"  label="目标" align="center"></el-table-column>
                        <el-table-column label="是否完成" align="center">
                            <template scope="scope">
                                <span v-html="scope.row.is_success == '1'?'已完成':'未完成'"></span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template scope="scope">
                                <el-button type="danger" size="small" v-if="rights[101]" @click.stop="delOther(scope.row.id, index, scope.$index, 2)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-collapse-item>
            </el-collapse>
        </el-dialog>
        <!-- 分页 -->
        <div class="block page">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :total="total">
            </el-pagination>
        </div>
        <!-- 删除dialog -->
        <el-dialog title="提示" :visible.sync="dialogVisible3" size="tiny">
            <span v-if="delType == 1">是否删除整周目标？</span>
            <span v-else>是否删除目标？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible3 = false">取 消</el-button>
                <el-button type="primary" @click="delConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'weekPlan',
        data () {
            return {
                search: {
                    name: '',
                    week: '',
                    page: 1
                },
                list: [],
                otherlist: [],
                summary: {},
                userInfo: {},
                total: 2,
                currentPage: 1,
                dialogVisible: false,
                dialogVisible2: false,
                dialogVisible3: false,
                delInfo: {
                    id: '',
                    index: '',
                    sIndex: '',
                    time: ''
                },
                activeName: 0,
                delType: 1,
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
                myFn.ajax('get', this.search, apiAddress.plan.week, (res) => {
                    for (var i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].active_show = false;
                    };
                    this.list = res.data.data;
                    this.total = res.data.total;
                })
            },
            handleCurrentChange (val) {
                this.getData(val)
            },
            checkSummary (val) {
                this.userInfo = val;
                myFn.ajax('get', {uid: val.uid, type: 1, sum_start_time: val.week_monday}, apiAddress.plan.summary, (res) => {
                    this.summary = res.data
                })
                this.dialogVisible = true;
            },
            checkOther (val) {
                this.userInfo = val;
                myFn.ajax('get', {uid: val.uid, week_start: val.week_monday}, apiAddress.plan.weekOtherDetails, (res) => {
                    this.otherlist = res.data;
                })
                this.dialogVisible2 = true;
            },
            pickerTime (value) {
                this.search.week = value;
            },
            query () {
                this.getData();
            },
            del (index, time, id, type) {
                this.delInfo.id = id;
                this.delInfo.index = index;
                this.delInfo.time = time;
                // this.dialogVisible3 = true;
                this.delType = type;

                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delConfirm();
                })
            },
            delOther (id, index, sIndex, type) {
                this.delInfo.id = id;
                this.delInfo.index = index;
                this.delInfo.sIndex = sIndex;
                this.delType = type;
                // this.dialogVisible3 = true;

                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delConfirm();
                })
            },
            delConfirm () {
                switch (parseInt(this.delType)) {
                    case 1:
                        myFn.ajax('get', {uid: this.delInfo.id, time: this.delInfo.time}, apiAddress.plan.delWeek, (res) => {
                            this.dialogVisible3 = false;
                            this.list.splice(this.delInfo.index, 1);
                            this.delInfo = {}
                            this.$message({
                                type: 'success',
                                message: '成功删除'
                            });
                        })
                        break;
                    case 2:
                        myFn.ajax('get', {id: this.delInfo.id, model_type: 2}, apiAddress.plan.del, (res) => {
                            this.otherlist[this.delInfo.index].list.splice(this.delInfo.sIndex, 1);
                            this.delInfo = {}
                            this.dialogVisible3 = false;
                            this.$message({
                                type: 'success',
                                message: '成功删除'
                            });
                        })
                        break;
                    case 3:
                        myFn.ajax('get', {id: this.delInfo.id, model_type: 2}, apiAddress.plan.del, (res) => {
                            this.list[this.delInfo.index].content.splice(this.delInfo.sIndex, 1);
                            this.list[this.delInfo.index].dead_time.splice(this.delInfo.sIndex, 1);
                            this.delInfo = {}
                            this.dialogVisible3 = false;
                            this.$message({
                                type: 'success',
                                message: '成功删除'
                            });
                        })
                }
            }
        }
    }
</script>

<style>
    .weekPlan .isShow {
        height: 48px;
        position: relative;
    }
    .weekPlan .isShow > div:nth-child(2) {
        visibility: hidden;
    } 
    .weekPlan .isShow .show-control {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
    }
</style>

<style scoped>
    .weekPlan .el-form-item__label {
        float: none;
    }
</style>