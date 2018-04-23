<template>
    <div class="carApply">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/xzManagement/leaveApply' }">行政管理</el-breadcrumb-item>
            <el-breadcrumb-item >物品申请</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索 -->
        <el-form ref="form" :model="search" label-width="90px">
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-form-item label="物品名称：">
                        <el-input v-model="search.name" placeholder="请输入物品名称"></el-input>
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
            <el-table-column prop="create_time" label="申请时间" align="center"></el-table-column>
            <!-- <el-table-column prop="create_time" label="日期" align="center"></el-table-column> -->
            <el-table-column prop="uname" label="申请人" align="center"></el-table-column>
            <el-table-column prop="dname" label="部门" align="center"></el-table-column>
            <el-table-column prop="pname" label="职位" align="center"></el-table-column>
            <el-table-column prop="goodsname" label="物品名称" align="center"></el-table-column>
            <el-table-column prop="num" label="数量" align="center"></el-table-column>
            <el-table-column label="状态" align="center" >
                <template scope="scope">
                    <span v-show="scope.row.status===1">待审核</span>
                    <span v-show="scope.row.status===2">同意</span>
                    <span v-show="scope.row.status===3">拒绝</span>
                    <span v-show="scope.row.status===4">等待</span>
                    <span v-show="scope.row.status===5">已取消</span>
            </template>
            </el-table-column>
            <!-- <el-table-column label="操作" width="100" align="center">
                <template scope="scope">
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column> -->
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
        name: 'carApply',
        data () {
            return {
                tableData: [],
                search: {
                    name: ''
                },
                currentPage: 1,
                pre: 10,
                total: 2
            }
        },
        mounted () {
            this.getData(1);
        },
        methods: {
            getData: function (page) {
                this.search.page = page;
                myFn.ajax('get', this.search, apiAddress.xzManagement.goodApply, (res) => {
                    this.tableData = res.data.data;
                    this.currentPage = res.data.current_page;
                    this.pre = res.data.per_page;
                    this.total = res.data.total;
                })
            },
            handleCurrentChange: function (val) {
                this.getData(val)
            },
            handleDelete: function (index, data) {
                myFn.ajax('get', {id: data.id}, apiAddress.xzManagement.goodDel, (res) => {
                    this.$notify({
                        title: '成功删除',
                        type: 'success'
                    });
                    this.tableData.splice(index, 1);
                })
            },
            query () {
                let myDataSearch = {
                    goods_name: this.search.name
                }
                myFn.ajax('get', myDataSearch, apiAddress.xzManagement.goodApply, (res) => {
                    this.tableData = res.data.data;
                    this.currentPage = res.data.current_page;
                    this.pre = res.data.per_page;
                    this.total = res.data.total;
                })
            }
        }
    }
</script>

<style>
    .label-width label {
        width: 30px!important;
    }
</style>