<template>
    <div class="contractApply">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/financeManagement/baoxiaoApply' }">财务管理</el-breadcrumb-item>
            <el-breadcrumb-item >合同付款申请</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索 -->
        <el-form ref="form" :model="search" label-width="90px">
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-form-item label="申请人：">
                        <el-input v-model="search.name" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="收款方：">
                        <el-input v-model="search.receive_name" placeholder="请输入收款方名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="开始时间：">
                        <el-date-picker v-model="start_time" type="date" placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="结束时间：">
                        <el-date-picker v-model="end_time" type="date" placeholder="选择日期">
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
            <el-table-column prop="pay_time" label="日期" align="center"></el-table-column>
            <el-table-column prop="uname" label="申请人" align="center"></el-table-column>
            <el-table-column prop="dname" label="部门" align="center"></el-table-column>
            <el-table-column prop="pname" label="职位" align="center"></el-table-column>
            <el-table-column prop="money" label="申请金额" align="center"></el-table-column>
            <!-- <el-table-column prop="reason" width="220" label="事由" align="center"></el-table-column> -->
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
                    <el-button size="small" v-if="rights[42]" @click="checkdetails(scope.$index,scope.row)">查看详情</el-button>
                    <el-button size="small" v-if="rights[43]" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- dialog弹出层 -->
        <el-dialog title="合同付款申请" :visible.sync="dialogVisible" size="small">
            <el-form ref="form" :model="detaillist" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="申请人：">
                            <el-input disabled v-model="detaillist.uname"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="部门：">
                            <el-input disabled v-model="detaillist.dname"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="职位：">
                            <el-input disabled v-model="detaillist.pname"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="收款方：">
                            <el-input disabled v-model="detaillist.receive_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="申请金额：">
                            <el-input disabled v-model="detaillist.money"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="日期：">
                            <el-input disabled v-model="detaillist.pay_time"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24" v-if="detaillist.image.length !== 0">
                        <el-form-item label="图片：">
                            <img v-for="item in detaillist.image" :src="'/public' + item" class="img-style">
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="事由：">
                            <el-input type="textarea" disabled v-model="detaillist.reason"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item label="审核意见：">
                            <p style="margin-top: 0;"  v-for="item in detaillist.suggestion">
                                <span>{{item.name}}:</span>
                                <span v-if="item.content === '' ">无意见</span>
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
        name: 'contractApply',
        data () {
            return {
                tableData: [],
                detaillist: {
                    suggestion: [],
                    image: []
                },
                search: {
                    name: '',
                    receive_name: '',
                    start_time: '',
                    end_time: ''
                },
                start_time: '',
                end_time: '',
                detailsIndex: 0,
                currentPage: 1,
                pre: 10,
                total: 2,
                dialogVisible: false,
                thisItem: {},
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
                myFn.ajax('get', this.search, apiAddress.finance.contractList, (res) => {
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
            checkdetails (index, item) {
                this.thisItem = item;
                this.dialogVisible = true;
                myFn.ajax('get', {id: item.id}, apiAddress.finance.contractDetails, (res) => {
                    this.detaillist = res.data;
                })
            },
            delete_item () {
                myFn.ajax('get', {id: this.del_item.id}, apiAddress.finance.contractDel, (res) => {
                    this.$notify({
                        title: '成功删除',
                        type: 'success'
                    });
                    this.tableData.splice(this.del_item.index, 1);
                    this.del_dialog = false;
                })
            },
            handleDelete (index, item) {
                /* this.thisItem = item;
                this.del_item.id = item.id;
                this.del_item.index = index;
                this.del_dialog = true; */

                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    myFn.ajax('get', {id: item.id}, apiAddress.finance.contractDel, (res) => {
                        this.$message({
                            message: '成功删除',
                            type: 'success'
                        });
                        this.tableData.splice(index, 1);
                    })
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
        }
    }
</script>

<style scoped>
    .img-style {
        width: 100px;
        height: 100px;
        margin-right: 15px;
        margin-bottom: 15px;
    }
</style>