<template>
    <div class="source">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/project/list' }">项目管理</el-breadcrumb-item>
            <el-breadcrumb-item >项目资源</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 添加人员 -->
        <div class="add">
            <el-button type="primary" v-if="rights[160]" @click="goAdd">添加资源</el-button>
        </div>
        <!-- 表格信息 -->
        <el-table :data="tableData">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="resource_name"  label="名称" align="center"></el-table-column>
            <el-table-column prop="resource_price" label="金额" align="center"></el-table-column>
            <el-table-column prop="remark" label="备注" align="center"></el-table-column>
            <el-table-column label="操作" align="center" header-align="center" width="300">
                <template scope="scope">
                    <el-button type="danger" size="small" v-if="rights[153]" @click="del(scope.row.id, scope.$index)">删除</el-button>
                </template>
            </el-table-column>
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
        name: 'source',
        data () {
            return {
                tableData: [],
                currentPage: 1,
                total: 0,
                dialogVisible: false,
                id: '',
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.id = this.$route.params.id;
            this.getData(1);
        },
        methods: {
            getData (page) {
                myFn.ajax('get', {project_id: this.id, page}, apiAddress.project.resource, (res) => {
                    // console.log(res)
                    this.tableData = res.data.data;
                    this.total = res.data.total;
                })
            },
            handleCurrentChange: function (val) {
                this.getData(val)
            },
            del (id, index) {
                this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    myFn.ajax('post', {id: id}, apiAddress.project.resourceDel, (res) => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.tableData.splice(index, 1);
                    })
                }).catch(() => {
                    // console.log('取消')
                })
            },
            goAdd () {
                this.$router.push({name: 'addSource', params: {id: this.id}})
            }
        }
    }
</script>

<style scoped>
    .add {
        margin-bottom: 15px;
        text-align: right;
    }
</style>