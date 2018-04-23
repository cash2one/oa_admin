<template>
  <div class="admin">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/goods/list' }">办公物品</el-breadcrumb-item>
            <el-breadcrumb-item >物品申请</el-breadcrumb-item>
        </el-breadcrumb>
        <el-table :data="list">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="(currentPage*10-10)+(scope.$index+1)"></span>
                </template>
            </el-table-column>
            <el-table-column prop="uid" label="工号" align="center" header-align="center"></el-table-column>
            <el-table-column prop="username" label="申请人" align="center" header-align="center"></el-table-column>
            <el-table-column prop="create_time" label="申请时间" align="center" header-align="center"></el-table-column>
            <el-table-column label="物品" align="center" header-align="center">
            <template scope="scope">
                <el-select v-model="scope.row.gid" @change="toggleSelectType(scope.row)">
                    <el-option v-for="item in goods" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    <el-option :label="scope.row.goodsname" :value="0" v-if="scope.row.gid == 0"></el-option>
                </el-select>
            </template>
            </el-table-column>
            <el-table-column prop="surplus_num" label="库存" align="center" header-align="center"></el-table-column>
            <el-table-column prop="num" label="申请数量" align="center" header-align="center"></el-table-column>
            <el-table-column prop="remark" label="备注" align="center" header-align="center"></el-table-column>
            <el-table-column width="300">
                <template scope="scope">
                    <el-button size="small" v-if="rights[71]" type="primary" @click="agree(scope.row,scope.$index)">同意</el-button>
                    <el-button size="small" v-if="rights[71]" type="danger" style="margin-right:5px;" @click="refuse(scope.row,scope.$index)">拒绝</el-button>
                    <el-button size="small" v-if="rights[71]" :disabled="scope.row.status == 4" type="success" @click="changeWait(scope.row)">等待</el-button>
                    <el-button size="small" v-if="rights[68]" type="warning" @click="go_goodsAdd(scope.row.gid)">采购</el-button>
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
        name: 'apply_list',
        data () {
            return {
                dialogFormVisible: false,
                styles: 'button-style',
                currentPage: 1,
                total: 10,
                pre: 10,
                list: [],
                goods: [],
                refuseInfo: {},
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            myFn.ajax('get', {}, apiAddress.goods.list, (res) => {
                this.goods = res.data.data
                localStorage.list = JSON.stringify(res.data.data);
            })
            this.getdata(1)
        },
        methods: {
            toggleSelectType (item) {
                for (var i = 0; i < this.goods.length; i++) {
                    if (this.goods[i].id === item.gid) {
                        item.surplus_num = this.goods[i].surplus_num;
                    }
                }
            },
            handleCurrentChange (val) {
                this.getdata(val);
            },
            getdata (page) {
                myFn.ajax('get', {page: page}, apiAddress.goods.applylist, (res) => {
                    this.list = res.data.data;
                    this.total = res.data.total;
                    this.pre = res.data.per_page;
                    this.currentPage = res.data.current_page;
                });
            },
            agree (item, index) {
                var data = {
                    id: item.id,
                    gid: item.gid,
                    status: 2
                }
                myFn.ajax('post', data, apiAddress.goods.applyoper, (res) => {
                    this.list.splice(index, 1);
                })
            },
            refuse (item, index) {
                this.$confirm('是否拒绝申请?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var data = {};
                    data.id = item.id;
                    data.gid = item.gid;
                    data.status = 3;
                    myFn.ajax('post', data, apiAddress.goods.applyoper, (res) => {
                        this.list.splice(index, 1)
                    })
                })
            },
            changeWait (item) {
                var data = {
                    id: item.id,
                    gid: item.gid,
                    status: 4
                }
                myFn.ajax('post', data, apiAddress.goods.applyoper, (res) => {
                    item.status = 4;
                });
            },
            go_goodsAdd (id) {
                this.$router.push({name: 'goodsAdd', params: {id: id}})
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
    .button-style{
        background: #13CE66;
        color:#fff;
    }
    .button-style-change{
        background: #ddd;
        color: #fff;
    }
</style>
