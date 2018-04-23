<template>
    <div class="customerTagDetails">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/customer/tag' }">客户管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/customer/tag' }">客户标签</el-breadcrumb-item>
            <el-breadcrumb-item >标签详情</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索 -->
        <el-form ref="form" :model="search" label-width="90px">
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-form-item label="客户名称：">
                        <el-input v-model="search.client_name" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="标签名称：">
                        <el-input v-model="search.label_name" placeholder="请输入用户名"></el-input>
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
        <el-table :data="customer.list" :expand-row-keys="expands" :row-key="getRowKeys">
            <el-table-column type="expand">
              <template scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                    <div class="details-border">
                        <span class="serialNumber">序号</span>
                        <span class="clientName">名称</span>
                    </div>
                    <div class="details-border" v-for="(item, index) in props.row.list">
                        <span class="serialNumber" v-html="index+1"></span>
                        <span class="clientName">{{item.client_name}}</span>
                    </div>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="标签名称" align="center"></el-table-column>
            <el-table-column label="操作" align="center" header-align="center" width="300">
                <template scope="scope">
                    <el-button v-if="expands.indexOf(scope.row.id) === -1" type="primary" size="small" @click="open_table(scope.row.id)">查看详情</el-button>
                    <el-button v-if="expands.indexOf(scope.row.id) !== -1" type="primary" size="small" @click="open_table(scope.row.id)">关闭详情</el-button>
                </template>    
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <!-- <div class="block page">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :total="total">
            </el-pagination>
        </div> -->
    </div>
</template>

<script>
    export default {
        name: 'customerTagDetails',
        data () {
            return {
                detailsStr: '查看详情',
                expands: [],
                customer: {
                    list: []
                },
                search: {
                    id: '',
                    label_name: '',
                    client_name: ''
                },
                getRowKeys (row) {
                    return row.id;
                }
                // currentPage: 1,
                // total: 0
            }
        },
        mounted () {
            this.search.id = this.$route.params.id;
            this.getData(1);
        },
        methods: {
            getData (page) {
                this.search.page = page;
                myFn.ajax('get', this.search, apiAddress.customer.customerTagDetails, (res) => {
                    this.customer.list = res.data;
                    this.expands = [];
                    // this.total = res.data.total;
                })
            },
            query () {
                this.getData(1);
            },
            open_table (id) {
                var index = this.expands.indexOf(id);
                if (index === -1) {
                    this.expands.push(id);
                } else {
                    this.expands.splice(index, 1);
                }
            }
            // handleCurrentChange (page) {
            //     this.getData(page);
            // }
        }
    }
</script>
<style>
    .el-table__expand-column .cell{
        visibility: hidden;
    }
</style>
<style scoped>
    .details-border {
        border-bottom: 1px #ccc solid;
        padding: 10px 20px;
    }
    .details-border .serialNumber {
        width: 80px;
        text-align: center;
        display: inline-block;
    }
    .details-border .clientName {
        width: 200px;
        text-align: center;
        display: inline-block;
    }
</style>


