<template>
  <div class="admin">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/goods/list' }">办公物品</el-breadcrumb-item>
            <el-breadcrumb-item>采购记录</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form ref="form" :model="search" label-width="90px">
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-form-item label="名称">
                        <el-input v-model="search.searchVal" placeholder="请输入物品名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-button type="primary" icon="search" @click="searchEd()">搜索</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-table :data="list" >
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="(currentPage*10-10)+(scope.$index+1)"></span>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="采购时间" align="center" header-align="center"></el-table-column>
            <el-table-column prop="goodsname" label="名称" align="center" header-align="center"></el-table-column>
            <el-table-column prop="num" label="数量" align="center" header-align="center"></el-table-column>
            <el-table-column prop="price" label="数量" align="center" header-align="center"></el-table-column>
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.row.status" :class="[scope.row.status=='成功'?'success':'fail']"></span>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="status" label="状态" align="center"  header-align="center"></el-table-column> -->
            <el-table-column prop="remark" width="300" label="备注" align="center" header-align="center"></el-table-column>
        </el-table>
        <div class="block page">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pre" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    export default{
        name: 'adminlist',
        data () {
            return {
                search: {
                    searchVal: ''
                },
                currentPage: 1,
                total: 10,
                pre: 10,
                formLabelWidth: '60px',
                // dialogFormVisible: false,
                list: []
            }
        },
        mounted () {
            this.getdata(1)
        },
        methods: {
            searchEd () {
                myFn.ajax('get', { goodsname: this.search.searchVal }, apiAddress.goods.purchaselogs, (res) => {
                    this.list = res.data.data;
                    this.total = res.data.total;
                    this.pre = res.data.per_page;
                    this.currentPage = res.data.current_page;
                });
            },
            handleCurrentChange (val) {
                this.getdata(val);
            },
            getdata (page) {
                myFn.ajax('get', {page: page}, apiAddress.goods.purchaselogs, (res) => {
                    this.list = res.data.data;
                    for (var i = 0; i < this.list.length; i++) {
                        switch (this.list[i].status) {
                            case 2:
                                this.list[i].status = '成功';
                                break;
                            case 3:
                                this.list[i].status = '失败';
                                break;
                        }
                        // newArr.push(this.list[i].status)
                        // console.log(newArr)
                    }
                    this.total = res.data.total;
                    this.pre = res.data.per_page;
                    this.currentPage = res.data.current_page;
                    localStorage.list = JSON.stringify(res.data.data);
                });
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
    }
    .el-breadcrumb {
        padding: 20px 0 15px 10px;
    }
    .el-button-style{
        float: right;
        margin: 0px 10px 10px 0;
    }
    .fail {
        color: red;
    }
    .success {
        color: green;
    }
</style>
