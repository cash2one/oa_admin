<template>
    <div class="customerList">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/customer/list' }">客户管理</el-breadcrumb-item>
            <el-breadcrumb-item >客户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索 -->
        <el-form ref="form" :model="search" label-width="90px">
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-form-item label="客户来源：">
                        <el-input v-model="search.name" placeholder="请输入客户来源"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="分类：">
                        <template>
                            <el-select v-model="search.classify_id">
                                <el-option label="所有" value=""></el-option>
                                <el-option v-for="(item,index) in customer.type" :key="index" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </template>
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
        <el-table :data="customer.list">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="name"  label="名称" align="center"></el-table-column>
            <el-table-column prop="sex" label="性别" align="center" @change(sex)></el-table-column>
            <!-- <el-table-column prop="birthday" label="生日" align="center"></el-table-column> -->
            <el-table-column prop="phone" label="电话" align="center"></el-table-column>
            <el-table-column prop="trade_name" label="行业" align="center"></el-table-column>
            <!-- <el-table-column prop="position" label="职位" align="center"></el-table-column> -->
            <!-- <el-table-column prop="email" label="邮箱" align="center"></el-table-column> -->
            <el-table-column prop="classify_name" label="分类" align="center"></el-table-column>
            <el-table-column class="source" prop="user_name" label="来源" align="center"></el-table-column>
            <!-- <el-table-column label="跟进状态" align="center">
                <template scope="scope">
                    <span class="click-text" @click="go_source_details(scope.row.id)">查看</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center">
                <template scope="scope">
                    <span class="click-text" @click="open_remark_details(scope.row.remark)">查看</span>
                </template>
            </el-table-column> -->
            <el-table-column label="操作" align="center" header-align="center" width="300">
                <template scope="scope">
                    <el-button type="success" size="small" @click="open_remark_details(scope.row.remark, scope.$index)">详情</el-button>
                    <el-button type="primary" size="small" @click="go_source_details(scope.row.id)">跟进状态</el-button>
                    <el-button type="danger" size="small" @click="del(scope.$index, scope.row.id)">删除</el-button>
                </template>    
            </el-table-column>
        </el-table>
        <!-- dialog弹出层 -->
        <el-dialog title="详情" v-if="dialogVisible" :visible.sync="dialogVisible" size="small">
            <el-form ref="form" :model="customer.list[row_index]" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="名称：">
                            <el-input disabled v-model="customer.list[row_index].name || '无'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别：">
                            <el-input disabled v-model="customer.list[row_index].sex || '无'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="电话：">
                            <el-input disabled v-model="customer.list[row_index].phone || '无'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="生日：">
                            <el-input disabled v-model="customer.list[row_index].birthday || '无'"></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item label="公司：">
                            <el-input disabled v-model="customer.list[row_index].company || '无'"></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="职位：">
                            <el-input disabled v-model="customer.list[row_index].position || '无'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="地址：">
                            <el-input disabled v-model="customer.list[row_index].address || '无'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="邮箱：">
                            <el-input disabled v-model="customer.list[row_index].email || '无'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="行业：">
                            <el-input disabled v-model="customer.list[row_index].trade_name || '无'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="分类：">
                            <el-input disabled v-model="customer.list[row_index].classify_name || '无'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="来源：">
                            <el-input disabled v-model="customer.list[row_index].user_name || '无'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="公司：">
                            <el-input disabled v-model="customer.list[row_index].company || '无'"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="备注：">
                            <el-input type="textarea" disabled v-model="remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!-- <p>{{customer.list[row_index]}}</p> -->
            <!-- <p v-html="remark"></p>
            <p v-if="!remark">暂无备注...</p> -->
        </el-dialog>
        <!-- 分页 -->
        <div class="block page">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'customerList',
        data () {
            return {
                industryList: [],
                customer: {
                    list: [],
                    type: []
                },
                search: {
                    name: '',
                    trade_id: '',
                    classify_id: '',
                    page: 1
                },
                currentPage: 1,
                total: 0,
                dialogVisible: false,
                remark: '',
                row_index: '',
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.getData(1);
            this.get_customer_type();
        },
        methods: {
            getData (page) {
                this.search.page = page;
                myFn.ajax('get', this.search, apiAddress.customer.customerList, (res) => {
                    for (var i in res.data.data) {
                        res.data.data[i].sex = this.getSex(res.data.data[i].sex);
                    }
                    this.customer.list = res.data.data;
                    this.total = res.data.total;
                })
            },
            getSex (sex) {
                sex === 1 ? sex = '男' : sex = '女';
                return sex;
            },
            get_customer_type () {
                myFn.ajax('get', this.search, apiAddress.customer.customerType, (res) => {
                    this.customer.type = res.data.data;
                })
            },
            del (index, id) {
                this.$confirm('此操作将永久删除该客户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // this.confirmDel(id, index);
                    myFn.ajax('post', {id: id}, apiAddress.customer.customerDel, (res) => {
                        this.dialogVisible = false;
                        this.$message({
                            type: 'success',
                            message: '成功删除'
                        });
                        this.customer.list.splice(index, 1)
                    })
                }).catch(() => {
                    // console.log('取消')
                })
            },
            handleCurrentChange: function (val) {
                this.getData(val)
            },
            query () {
                this.getData();
            },
            go_source_details (id) {
                this.$router.push({name: 'customerFllow', params: {id: id}})
            },
            open_remark_details (val, index) {
                this.row_index = index;
                this.remark = val;
                this.dialogVisible = true;
            }
        }
    }
</script>
<style>
    .click-text {
        width: 35px;
        color: #20a0ff;
        cursor: pointer;
        display: inline-block;
        border-bottom: 1px #20a0ff solid;
        line-height: 18px;
    }
</style>