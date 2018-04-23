<template>
    <div class="industryListItem">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>客户管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ name: 'industryList'}">行业管理</el-breadcrumb-item>
            <el-breadcrumb-item >行业名称</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="el-button-style" type="primary" @click="add_industry()">添加行业</el-button>     
        <!-- 表格信息 -->
        <el-table :data="customer.list">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="行业名称" align="center"></el-table-column>
            <el-table-column label="操作" align="center" header-align="center" width="300">
                <template scope="scope">
                    <el-button type="success" v-if="rights[89]" size="small" @click="edit_industry(scope.row.id)">编辑</el-button>
                    <el-button type="danger" v-if="rights[9]" size="small" @click="del_industry(scope.$index, scope.row.id)">删除</el-button>
                </template>    
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: 'industryListItem',
        data () {
            return {
                customer: {
                    list: []
                },
                search: {
                    name: '',
                    id: ''
                },
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.search.id = this.$route.params.id;
            this.getData();
        },
        methods: {
            getData () {
                myFn.ajax('get', this.search, apiAddress.customer.industryListItem, (res) => {
                    this.customer.list = res.data;
                })
            },
            add_industry () {
                this.$router.push({name: 'industryListItemEdit', params: {id: -1, pid: this.search.id}});
            },
            del_industry (index, id) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    myFn.ajax('get', {id: id}, apiAddress.customer.industryListDel, (res) => {
                        this.$message({
                            message: '成功删除',
                            type: 'success'
                        });
                        this.customer.list.splice(index, 1);
                    });
                })
            },
            edit_industry (id) {
                this.$router.push({name: 'industryListItemEdit', params: {id: id, pid: this.search.id}});
            }
        }
    }
</script>

<style scoped>
    .el-button-style{
        float: right;
        margin: 0px 10px 10px 0;
    }
</style>