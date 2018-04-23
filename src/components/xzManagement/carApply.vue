<template>
    <div class="carApply">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/xzManagement/leaveApply' }">行政管理</el-breadcrumb-item>
            <el-breadcrumb-item >用车申请</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索 -->
        <el-form ref="form" :model="search" label-width="90px">
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-form-item label="姓名：">
                        <el-input v-model="search.name" placeholder="输入姓名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="开始时间：">
                        <el-date-picker v-model="start_time" type="date" placeholder="选择开始日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="结束时间：">
                        <el-date-picker v-model="end_time" type="date" placeholder="选择结束日期">
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
        <el-table :data="tableData">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="create_time" label="申请时间" align="center"></el-table-column> -->
            <el-table-column prop="aspan" width="220" label="用车时间" align="center"></el-table-column>
            <el-table-column prop="uname" label="申请人" align="center"></el-table-column>
            <el-table-column prop="dname" label="部门" align="center"></el-table-column>
            <el-table-column prop="pname" label="职位" align="center"></el-table-column>
            <el-table-column prop="type_name" label="车种" align="center"></el-table-column>
            <!-- <el-table-column prop="reason" width="220" label="用车原因" align="center"></el-table-column> -->
            <el-table-column label="状态" align="center" >
                <template scope="scope">
                    <span v-show="scope.row.status===1">待审核</span>
                    <span v-show="scope.row.status===2">同意</span>
                    <span v-show="scope.row.status===3">拒绝</span>
                    <span v-show="scope.row.status===4">等待</span>
                    <span v-show="scope.row.status===5">已取消</span>
                </template>
            </el-table-column>
            <el-table-column width="200" align="center">
                <template scope="scope">
                    <el-button size="small" v-if="rights[28]" @click="checkdetails(scope.row.id)">查看详情</el-button>
                    <el-button size="small" v-if="rights[29]" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- dialog弹出层 -->
        <el-dialog title="用车申请详情" :visible.sync="dialogVisible" size="small">
            <el-form ref="form" :model="tableDetails" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="申请人：">
                            <el-input disabled v-model="tableDetails.uname"></el-input>
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
                        <el-form-item label="车种：">
                            <el-input disabled v-model="tableDetails.type_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="时间：">
                            <el-input disabled v-model="tableDetails.aspan"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="天数：">
                            <el-input disabled v-model="tableDetails.days"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="用车原因：">
                            <el-input type="textarea" disabled v-model="tableDetails.reason"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="起始地点：">
                                <el-input disabled v-model="tableDetails.start_location"></el-input>
                            </el-form-item>
                    </el-col>
                    <el-col :span="24">
                    <el-form-item label="到达地点：">
                            <el-input disabled v-model="tableDetails.end_location"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="往返旅程：">
                            <el-input disabled v-model="tableDetails.round_trips"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="随同人员：">
                            <el-input disabled v-model="tableDetails.fellow_member"></el-input>
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="24">
                        <el-form-item label="审核意见：">
                            <p style="margin-top: 0;" v-for="item in tableDetails.suggestion">
                                <span>{{item.name}}:</span>
                                <span v-if="item.content === '' ">无意见...</span>
                                <span>{{item.content}}</span>
                            </p>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>    
        </el-dialog>
        <!-- 分页 -->
        <div class="block page">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pre" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="提示" :visible.sync="del_dialog" size="tiny">
            <span>是否删除记录？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="del_dialog = false">取 消</el-button>
                <el-button type="primary" @click="delete_item">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'carApply',
        data () {
            return {
                tableData: [],
                tableDetails: {
                    suggestion: []
                },
                suggestionlength: '',
                search: {
                    name: '',
                    start_time: '',
                    end_time: ''
                },
                start_time: '',
                end_time: '',
                currentPage: 1,
                pre: 10,
                total: 2,
                dialogVisible: false,
                // 删除提示
                del_dialog: false,
                del_item: {
                    index: '',
                    id: ''
                },
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.getData(1);
        },
        methods: {
            getData: function (page) {
                this.search.page = page;
                myFn.ajax('get', this.search, apiAddress.xzManagement.carlist, (res) => {
                    for (var i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].aspan = res.data.data[i].start_time + '至' + res.data.data[i].end_time;
                    };
                    this.tableData = res.data.data;
                    console.log(this.tableData)
                    this.currentPage = res.data.current_page;
                    this.pre = res.data.per_page;
                    this.total = res.data.total;
                })
            },
            handleCurrentChange: function (val) {
                this.getData(val)
            },
            checkdetails: function (id) {
                this.dialogVisible = true;
                myFn.ajax('get', {id: id}, apiAddress.xzManagement.carDetails, (res) => {
                    res.data.aspan = res.data.start_time + ' 至 ' + res.data.end_time;
                    this.tableDetails = res.data;
                    this.suggestionlength = res.data.suggestion.length;
                    console.log(this.tableDetails)
                })
            },
            handleDelete: function (index, data) {
                /* this.del_item.id = data.id;
                this.del_item.index = index;
                this.del_dialog = true; */

                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    myFn.ajax('get', {id: data.id}, apiAddress.xzManagement.carDel, (res) => {
                        this.$message({
                            message: '成功删除',
                            type: 'success'
                        });
                        this.tableData.splice(index, 1);
                    })
                })
            },
            delete_item () {
                myFn.ajax('get', {id: this.del_item.id}, apiAddress.xzManagement.carDel, (res) => {
                    this.$notify({
                        title: '成功删除',
                        type: 'success'
                    });
                    this.tableData.splice(this.del_item.index, 1);
                    this.del_dialog = false;
                })
            },
            query: function () {
                if (this.end_time) {
                    this.search.end_time = myFn.getTime(this.end_time);
                }
                if (this.start_time) {
                    this.search.start_time = myFn.getTime(this.start_time);
                }
                this.getData(1);
            }
            // select: function () {
            //     console.log(this.departID)
            // }
        }
    }
</script>

<style>
    .label-width label {
        width: 30px!important;
    }
    .label-width .el-form-item__content {
        margin-left: 30px!important;
        margin-bottom: 22px;
    }
    .margin-b-0 .el-form-item__content {
        margin-bottom: 0;
    }
</style>