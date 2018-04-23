<template>
  <div class="userlist">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/user/list' }">管理员管理</el-breadcrumb-item>
            <el-breadcrumb-item >管理员列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="el-button-style" type="primary" v-if="rights[162]" @click="edit()">添加用户</el-button>
        <el-table :data="tableData">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="管理员名称" align="center" header-align="center"></el-table-column>
            <el-table-column prop="username" label="账号" align="center" header-align="center"></el-table-column>
            <el-table-column prop="create_time" label="创建时间" align="center" header-align="center"></el-table-column>
            <el-table-column prop="role_name" label="角色名称" align="center" header-align="center"></el-table-column>
            <el-table-column width="220" align="center" header-align="center">
                <template scope="scope">
                    <el-button size="small" type="primary" v-if="rights[162]" @click="edit(scope.row.id)">编辑</el-button>
                    <el-button size="small" type="danger" v-if="rights[163]" @click="del(scope.row.id, scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    export default{
        name: 'userlist',
        data () {
            return {
                dialogVisible: false,
                formLabelWidth: '60px',
                tableData: [],
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
            this.getdata()
            this.rights = JSON.parse(localStorage.rights);
        },
        methods: {
            getdata () {
                myFn.ajax('get', {}, apiAddress.rights.userList, (res) => {
                    this.tableData = res.data.data;
                });
            },
            edit (id) {
                var params = {};
                if (id !== undefined) {
                    params.id = id;
                }
                this.$router.push({name: 'userAdd', params})
            },
            del (id, index) {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // this.confirmDel(id, index);
                    myFn.ajax('post', {id: id}, apiAddress.rights.userDel, (res) => {
                        // this.del_dialog = false;
                        this.$message({
                            type: 'success',
                            message: '成功删除'
                        });
                        this.tableData.splice(index, 1)
                    })
                })
            }
        }
    }
</script>
<style scoped>
    .el-breadcrumb {
        padding: 20px 0 15px 10px;
    }
    .el-button-style{
        float: right;
        margin: 0px 10px 10px 0;
    }
</style>
