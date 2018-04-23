<template>
    <div class="customerTag">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/customer/tag' }">客户管理</el-breadcrumb-item>
            <el-breadcrumb-item >客户标签</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索 -->
        <el-form ref="form" :model="search" label-width="90px">
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-form-item label="用户名：">
                        <el-input v-model="search.name" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="标签：">
                        <el-input v-model="search.lable_name" placeholder="请输入标签名称"></el-input>
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
        <el-table :data="customer.list">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="用户名称" align="center"></el-table-column>
            <el-table-column label="标签名称" align="center">
                <template scope="scope">
                    <span v-for="item in scope.row.list">{{item.label_name}}、</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="操作" align="center" header-align="center" width="300">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="go_details(scope.row.id)">查看详情</el-button>
                </template>    
            </el-table-column> -->
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
        name: 'customerTag',
        data () {
            return {
                customer: {
                    list: [],
                    type: []
                },
                search: {
                    name: '',
                    lable_name: ''
                },
                currentPage: 1,
                total: 0
            }
        },
        mounted () {
            this.getData(1);
        },
        methods: {
            getData (page) {
                this.search.page = page;
                myFn.ajax('get', this.search, apiAddress.customer.customerTag, (res) => {
                    this.customer.list = res.data.data;
                    this.total = res.data.total;
                })
            },
            query () {
                this.getData(1);
            },
            go_details (id) {
                this.$router.push({name: 'customerTagDetails', params: {id: id}})
            },
            handleCurrentChange (page) {
                this.getData(page);
            }
        }
    }
</script>