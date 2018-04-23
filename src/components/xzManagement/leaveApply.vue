<template>
    <div class="leaveApply">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/xzManagement/leaveApply' }">行政管理</el-breadcrumb-item>
            <el-breadcrumb-item >请假申请</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索 -->
        <el-form ref="form" :model="search" label-width="90px">
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-form-item label="姓名：">
                        <el-input v-model="search.name" placeholder="请输入申请人姓名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="部门：" v-if="rights[22]">
                        <template scope="scope">
                            <el-select v-model="search.department_id" placeholder="请选择部门" @change="select(search.department_id)">
                                <el-option label="所有" value=""></el-option>
                                <el-option v-for="(item, index) in departlist" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="职位：" v-if="rights[23]">
                        <template>
                            <el-select v-model="search.position_id" placeholder="请选择职位">
                                <el-option label="所有" value=""></el-option>
                                <el-option v-for="(item,index) in positionlist" :key="index" :label="item.name" :value="item.id"></el-option>
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
        <el-table :data="tableData">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="create_time" label="申请时间" align="center"></el-table-column> -->
            <el-table-column prop="aspan" width="220" label="时间" align="center"></el-table-column>
            <el-table-column prop="days" label="天数" align="center"></el-table-column>
            <el-table-column prop="uname" label="申请人" align="center"></el-table-column>
            <el-table-column prop="dname" label="部门" align="center"></el-table-column>
            <el-table-column prop="pname" label="职位" align="center"></el-table-column>
            <el-table-column prop="type_name" label="类型" align="center"></el-table-column>
            <!-- <el-table-column prop="reason" width="220" label="事由" align="center" show-overflow-tooltip></el-table-column> -->
            <el-table-column label="状态" align="center" >
                <template scope="scope">
                    <span v-show="scope.row.status===1">待审核</span>
                    <span v-show="scope.row.status===2">同意</span>
                    <span v-show="scope.row.status===3">拒绝</span>
                    <span v-show="scope.row.status===4">等待</span>
                    <span v-show="scope.row.status===5">已取消</span>
                </template>
            </el-table-column>
            <el-table-column width="220" align="center">
                <template scope="scope">
                    <el-button size="small" v-if="rights[25]" @click="checkdetails(scope.row.id)">查看详情</el-button>
                    <el-button size="small" v-if="rights[26]" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- dialog弹出层 -->
        <el-dialog title="请假详情" :visible.sync="dialogVisible" size="small">
            <el-form ref="form" :model="tableDetails" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="姓名：">
                            <el-input disabled v-model="tableDetails.uname"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="电话：">
                            <el-input disabled v-model="tableDetails.urgency_mobile"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="部门：">
                            <el-input disabled v-model="tableDetails.dname"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="职位：">
                            <el-input disabled v-model="tableDetails.pname"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="紧急联系人：">
                            <el-input disabled v-model="tableDetails.urgency_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="电话：">
                            <el-input disabled v-model="tableDetails.urgency_mobile"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="电话：">
                            <el-input disabled v-model="tableDetails.urgency_mobile"></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item label="直属上司：">
                            <el-input disabled v-model="tableDetails.boss"></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="24">
                        <el-form-item label="请假事由：">
                            <el-input type="textarea" disabled v-model="tableDetails.reason"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="审核意见：">
                            <p style="margin-top: 0;" v-if="tableDetails.suggestion.length !== 0"  v-for="item in tableDetails.suggestion">
                                <span>{{item.name}}:</span>
                                <span v-if="item.content === '' ">无意见...</span>
                                <span>{{item.content}}</span>
                            </p>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>    
        </el-dialog>
        <el-dialog title="提示" :visible.sync="dialogVisible2" size="tiny">
            <span>是否删除记录？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="del">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分页 -->
        <div class="block page">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pre" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'leaveApply',
        data () {
            return {
                tableData: [],
                tableDetails: {
                    suggestion: []
                },
                departlist: [],
                positionlist: [],
                suggestionlength: '',
                search: {
                    name: '',
                    department_id: '',
                    position_id: ''
                },
                selectDid: '',
                detailsIndex: 0,
                currentPage: 1,
                pre: 10,
                total: 2,
                dialogVisible: false,
                dialogVisible2: false,
                delInfo: {
                    id: '',
                    index: ''
                },
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.getData(1);
            if (this.rights[22]) {
                this.getDepartList();
            }
        },
        methods: {
            getData: function (page) {
                this.search.page = page;
                myFn.ajax('get', this.search, apiAddress.xzManagement.leaveList, (res) => {
                    for (var i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].aspan = res.data.data[i].start_time + ' 至 ' + res.data.data[i].end_time;
                    };
                    this.tableData = res.data.data;
                    console.log(this.tableData)
                    this.currentPage = res.data.current_page;
                    this.pre = res.data.per_page;
                    this.total = res.data.total;
                })
            },
            getDepartList: function () {
                myFn.ajax('get', {}, apiAddress.depart.departList, (res) => {
                    this.departlist = res.data;
                    // this.search.department_id = res.data[0].id;
                })
            },
            /*
            职位列表
            */
            getPnameList (did) {
                myFn.ajax('get', {id: did}, apiAddress.user.pname, (res) => {
                    this.positionlist = res.data
                })
            },
            select () {
                console.log(this.search.department_id)
                if (this.search.department_id === '') {
                    this.search.department_id = '';
                    this.positionlist = [];
                } else {
                    this.selectDid = this.search.department_id;
                    this.getPnameList(this.selectDid)
                }
                this.search.position_id = ''
            },
            handleCurrentChange: function (val) {
                this.getData(val)
            },
            checkdetails: function (id) {
                this.dialogVisible = true;
                myFn.ajax('get', {id: id}, apiAddress.xzManagement.leaveDetails, (res) => {
                    this.tableDetails = res.data;
                    this.suggestionlength = res.data.suggestion.length;
                })
            },
            handleDelete: function (index, data) {
                /* this.delInfo.id = data.id;
                this.delInfo.index = index;
                this.dialogVisible2 = true; */
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    myFn.ajax('get', {id: data.id}, apiAddress.xzManagement.leaveDel, (res) => {
                        this.$message({
                            message: '成功删除',
                            type: 'success'
                        });
                        this.tableData.splice(index, 1);
                    })
                })
            },
            del: function () {
                myFn.ajax('get', {id: this.delInfo.id}, apiAddress.xzManagement.leaveDel, (res) => {
                    this.$notify({
                        title: '成功删除',
                        type: 'success'
                    });
                    this.tableData.splice(this.delInfo.index, 1);
                    this.dialogVisible2 = false;
                })
            },
            query: function () {
                this.getData(1);
            }
        }
    }
</script>

<style>
    .leaveApply .el-form-item {
        height: 36px;
    }
</style>