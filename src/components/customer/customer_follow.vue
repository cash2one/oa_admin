<template>
    <div class="customerFllow">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/customer/list' }">客户管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/customer/list' }">客户列表</el-breadcrumb-item>
            <el-breadcrumb-item >客户跟进</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索 -->
        <el-form ref="form" :model="search" label-width="90px">
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-form-item label="开始时间：">
                        <el-date-picker v-model="search.start_time" type="date" placeholder="请选择开始日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="结束时间：">
                        <el-date-picker v-model="search.end_time" type="date" placeholder="请选择结束日期">
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
        <el-table :data="list" header-align="center">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="name" :width="100"  label="名称" align="center"></el-table-column>
            <el-table-column prop="create_time" :width="300"  label="跟进时间" align="center" ></el-table-column>
            <el-table-column prop="content" label="跟进内容" align="left" header-align="center"></el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block page">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'customerFllow',
        data () {
            return {
                list: [],
                search: {
                    id: '',
                    start_time: '',
                    end_time: '',
                    page: 1
                },
                currentPage: 1,
                total: 0,
                dialogVisible: false,
                remark: ''
            }
        },
        mounted () {
            this.search.id = this.$route.params.id;
            this.getData(1);
        },
        methods: {
            getData (page) {
                this.search.page = page;
                if (this.search.start_time !== '') {
                    this.search.start_time = myFn.getTime(this.search.start_time)
                }
                if (this.search.end_time !== '') {
                    this.search.end_time = myFn.getTime(this.search.end_time)
                }
                myFn.ajax('get', this.search, apiAddress.customer.customerFollow, (res) => {
                    this.list = res.data.data;
                    this.total = res.data.total;
                })
            },
            handleCurrentChange: function (val) {
                this.getData(val)
            },
            query () {
                this.getData();
            }
        }
    }
</script>