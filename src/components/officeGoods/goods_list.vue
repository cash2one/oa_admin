<template>
  <div class="admin">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/goods/list' }">办公物品</el-breadcrumb-item>
            <el-breadcrumb-item >物品库存</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button class="el-button-style" type="primary" v-if="rights[68]" @click="go_goodsAdd()">物品采购</el-button>
        <el-table :data="tableData">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="(currentPage*10-10)+(scope.$index+1)"></span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="名称" align="center" header-align="center"></el-table-column>
            <el-table-column prop="total_num" label="总量" align="center" header-align="center"></el-table-column>
            <el-table-column prop="surplus_num" label="库存" align="center" header-align="center"></el-table-column>
            <el-table-column prop="use_num" label="使用量" align="center" header-align="center"></el-table-column>
            <el-table-column width="220" align="center" header-align="center">
                <template scope="scope">
                    <el-button size="small" type="warning" v-if="rights[68]" @click="go_goodsAdd(scope.row.id)">采购</el-button>
                    <el-button size="small" type="primary" v-if="rights[67]" @click="open_log(scope.row.id)">记录</el-button>
                    <el-button size="small" type="danger" v-if="rights[102]" @click="del(scope.row.id, scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block page">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pre" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="发放记录（本）" :visible.sync="dialogVisible" size="small" align="center"> 
            <el-table :data="tableDataRecord">
                <el-table-column label="序号" width="100" align="center" header-align="center">
                    <template scope="scope">
                        <span v-html="scope.$index+1"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="时间" align="center" header-align="center"></el-table-column>
                <!-- <el-table-column prop="total_num" label="总量" align="center" header-align="center"></el-table-column> -->
                <el-table-column prop="surplus_num" label="库存" align="center" header-align="center"></el-table-column>
                <!-- <el-table-column prop="use_num" label="使用量" align="center" header-align="center"></el-table-column> -->
                <el-table-column prop="use_num_change" label="申请数" align="center" header-align="center"></el-table-column>
                <el-table-column prop="username" label="申请人" align="center" header-align="center"></el-table-column>
                <el-table-column prop="remark" label="备注" align="center" header-align="center"></el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="del_dialog" size="tiny">
            <span>是否删除记录？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="del_dialog = false">取 消</el-button>
                <el-button type="primary" @click="delete_item">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 删除dialog -->
        <!-- <el-dialog title="提示" :visible.sync="dialogVisible3" size="tiny">
            <span >是否删除？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible3 = false">取 消</el-button>
                <el-button type="primary" @click="delConfirm">确 定</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>
<script>
    export default{
        name: 'goods_list',
        data () {
            return {
                dialogVisible: false,
                formLabelWidth: '60px',
                tableData: [],
                tableDataRecord: [],
                currentPage: 1,
                total: 10,
                pre: 10,
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
            this.getdata(1)
            this.rights = JSON.parse(localStorage.rights)
        },
        methods: {
            handleCurrentChange (val) {
                this.getdata(val);
            },
            getdata (page) {
                myFn.ajax('get', {page: page}, apiAddress.goods.list, (res) => {
                    this.tableData = res.data.data;
                    this.total = res.data.total;
                    this.pre = res.data.per_page;
                    this.currentPage = res.data.current_page;
                    localStorage.list = JSON.stringify(res.data.data);
                });
            },
            go_goodsAdd (id) {
                var params = {};
                if (id !== undefined) {
                    params.id = id;
                }
                this.$router.push({name: 'goodsAdd', params: params})
            },
            deletePerson (index) {
                this.tableData.splice(index, 1)
            },
            open_log (id) {
                myFn.ajax('get', {id: id, page: '1'}, apiAddress.goods.applylogs, (res) => {
                    this.tableDataRecord = res.data.data;
                })
                this.dialogVisible = true;
            },
            delete_item () {
                myFn.ajax('get', {id: this.del_item.id}, apiAddress.goods.del, (res) => {
                    this.tableData.splice(this.del_item.index, 1)
                    this.del_dialog = false;
                })
            },
            del (id, index) {
                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // this.confirmDel(id, index);
                    myFn.ajax('get', {id: id}, apiAddress.goods.del, (res) => {
                        // this.del_dialog = false;
                        this.$message({
                            type: 'success',
                            message: '成功删除'
                        });
                        this.tableData.splice(index, 1)
                    })
                })
                // this.del_item.id = id;
                // this.del_item.index = index;
                // this.del_dialog = true;
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
