<template>
    <div class="industryList">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/customer/tag' }">客户管理</el-breadcrumb-item>
            <el-breadcrumb-item >行业管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="el-button-style" type="primary" v-if="rights[8]" @click="add_industry()">添加类别</el-button>     
        <!-- 表格信息 -->
        <el-table :data="customer.list">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="行业类别" align="center"></el-table-column>
            <el-table-column label="行业名称" align="center">
                <template scope="scope">
                    <span v-for="item in scope.row.list">{{item.name}}、</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" header-align="center" width="300">
                <template scope="scope">
                    <el-button type="primary" size="small" v-if="rights[88]" @click="go_details(scope.row.id)">查看详情</el-button>
                    <el-button type="success" size="small" v-if="rights[8]" @click="edit_industry(scope.row.id)">编辑</el-button>
                    <el-button type="danger" size="small" v-if="rights[9]" @click="del_industry(scope.$index, scope.row.id)">删除</el-button>
                </template>    
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <!-- <div class="block page">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :total="total">
            </el-pagination>
        </div> -->
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
        name: 'industryList',
        data () {
            return {
                customer: {
                    list: [],
                    type: []
                },
                search: {
                    name: ''
                },
                // 删除提示
                del_dialog: false,
                del_item: {
                    index: '',
                    id: ''
                },
                rights: {}
                // currentPage: 1,
                // total: 0
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.getData(1);
        },
        methods: {
            getData (page) {
                this.search.page = page;
                myFn.ajax('get', this.search, apiAddress.customer.industryList, (res) => {
                    this.customer.list = res.data;
                    // this.total = res.data.total;
                })
            },
            query () {
                this.getData(1);
            },
            go_details (id) {
                this.$router.push({name: 'industryListItem', params: {id: id}})
            },
            handleCurrentChange (page) {
                this.getData(page);
            },
            add_industry () {
                this.$router.push({name: 'industryAddOrEdit', params: {id: -1}});
            },
            delete_item () {
                myFn.ajax('get', {id: this.del_item.id}, apiAddress.customer.industryListDel, (res) => {
                    this.customer.list.splice(this.del_item.index, 1);
                    this.del_dialog = false;
                });
            },
            del_industry (index, id) {
                /* this.del_item.id = id;
                this.del_item.index = index;
                this.del_dialog = true; */

                this.$confirm('此操作将永久删除该行业, 是否继续?', '提示', {
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
                    })
                })
            },
            edit_industry (id) {
                this.$router.push({name: 'industryAddOrEdit', params: {id: id}});
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