<template>
  <div class="admin">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/goods/list' }">办公物品</el-breadcrumb-item>
            <el-breadcrumb-item >采购状态</el-breadcrumb-item>
        </el-breadcrumb>
        <el-table :data="tableData" >
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="(currentPage*10-10)+(scope.$index+1)"></span>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="申请时间" align="center" header-align="center"></el-table-column>
            <el-table-column prop="goodsname" label="名称" align="center" header-align="center"></el-table-column>
            <el-table-column prop="num" label="数量" align="center" header-align="center">
                <template scope="scope">
                    <input  :id="'input'+scope.row.id" type="text" :class="{isDisableInput: scope.row.disabled}" v-model.number="scope.row.num" :disabled="scope.row.disabled"  @blur="blurInput(scope.row.num, scope.row)"/>
                    <i class="el-icon-edit" @click="edit_count(scope.row)"></i>
                </template>
            </el-table-column>
            <el-table-column prop="username" label="操作人" align="center" header-align="center"></el-table-column>
            <el-table-column align="center" header-align="center">
                <template scope="scope">
                    <el-button size="small" type="primary" v-if="rights[70]" @click="success(scope.row.id,scope.row.status,scope.$index)">成功</el-button>
                    <el-button size="small" type="danger" v-if="rights[70]" @click="fail(scope.row.id,scope.row.status,scope.$index)">取消</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block page">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pre" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    export default{
        name: 'purchas_list',
        data () {
            return {
                dialogFormVisible: false,
                currentPage: 1,
                total: 10,
                pre: 10,
                tableData: [
                    {
                        disabled: true
                    }
                ],
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.getdata(1)
        },
        methods: {
            handleCurrentChange (val) {
                this.getdata(val);
            },
            getdata (page) {
                myFn.ajax('get', {page: page}, apiAddress.goods.purchaselist, (res) => {
                    for (var i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].disabled = true;
                    };
                    this.tableData = res.data.data;
                    this.total = res.data.total;
                    this.pre = res.data.per_page;
                    this.currentPage = res.data.current_page;
                    localStorage.list = JSON.stringify(res.data.data);
                    console.log(this.tableData)
                });
            },
            blurInput: function (val, item) {
                if (!this.rights[141]) return;
                item.disabled = true;
                myFn.ajax('post', {id: item.id, num: val}, apiAddress.goods.editnum, (res) => {})
            },
            edit_count: function (item) {
                item.disabled = false
                // 不知道为什么需要加个延迟才有效
                setTimeout(function () {
                    document.getElementById('input' + item.id).focus();
                }, 100);
            },
            success (id, status, index) {
                this.$prompt('请输入采购金额', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({ value }) => {
                    var data = {
                        id: id,
                        status: 2,
                        price: value
                    }
                    myFn.ajax('post', data, apiAddress.goods.finish, (res) => {
                        this.tableData[index].status = 2
                        this.tableData.splice(index, 1)
                    })
                })
            },
            fail (id, status, index) {
                this.$confirm('此操作取消该次申请, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    myFn.ajax('post', {id: id, status: 3}, apiAddress.goods.finish, (res) => {
                        this.$message({
                            type: 'success',
                            message: '取消成功'
                        });
                        this.tableData[index].status = 3
                        this.tableData.splice(index, 1)
                    })
                })
            }

        }
    }
</script>
<style scoped>
    .el-table--enable-row-hover .el-table__body tr > td input {
        width: 70px;
        transition: background-color .25s ease;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td input {
        background: #eef1f6;
    }
    .isDisableInput {
        border: none;
        text-align: center;
        background: #fff;
        color: #000;
    }
    .el-icon-edit {
        width: 30px;
        height: 30px;
        line-height: 22px;
        margin-left: 0px;
        position: absolute;
        cursor: pointer;
    }
    .el-breadcrumb {
        padding: 20px 0 15px 10px;
    }
    .el-button-style{
        float: right;
        margin: 0px 10px 10px 0;
    }
</style>
