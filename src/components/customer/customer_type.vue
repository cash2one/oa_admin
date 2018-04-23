<template>
    <div class="customerType">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/customer/industry/list' }">客户管理</el-breadcrumb-item>
            <el-breadcrumb-item >分类</el-breadcrumb-item>
        </el-breadcrumb>  
        <el-button class="el-button-style" type="primary" @click="add_customer()">添加分类</el-button>
        <!-- 表格信息 -->
        <el-table :data="list" header-align="center">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="name"  label="分类名称" align="center"></el-table-column>
            <el-table-column label="操作" align="center" header-align="center" width="300">
                <template scope="scope">
                    <el-button type="success" v-if="rights[74]" size="small" @click="edit_type(scope.$index, scope.row.id)">编辑</el-button>
                    <el-button type="danger" v-if="rights[75]" size="small" @click="delete_type(scope.$index, scope.row.id)">删除</el-button>
                </template>    
            </el-table-column>
        </el-table>
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
        name: 'customerType',
        data () {
            return {
                list: [],
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
            getData (page) {
                myFn.ajax('get', {}, apiAddress.customer.customerType, (res) => {
                    this.list = res.data.data;
                    this.total = res.data.total;
                })
            },
            delete_item () {
                myFn.ajax('post', {id: this.del_item.id}, apiAddress.customer.customerTypeDel, (res) => {
                    this.list.splice(this.del_item.index, 1);
                    this.del_dialog = false;
                })
            },
            delete_type (index, id) {
                /* this.del_item.id = id;
                this.del_item.index = index;
                this.del_dialog = true; */

                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    myFn.ajax('post', {id: id}, apiAddress.customer.customerTypeDel, (res) => {
                        this.$message({
                            message: '成功删除',
                            type: 'success'
                        });
                        this.list.splice(index, 1);
                    })
                })
            },
            edit_type (index, id) {
                this.$router.push({name: 'customerTypeAddOrEdit', params: {id: id}});
            },
            add_customer () {
                this.$router.push({name: 'customerTypeAddOrEdit', params: {id: -1}});
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