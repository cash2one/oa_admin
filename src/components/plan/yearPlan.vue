<template>
    <div class="yearPlan">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/paln/day' }">计划表</el-breadcrumb-item>
            <el-breadcrumb-item >年目标</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索 -->
        <el-form ref="form" :model="search" label-width="90px">
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-form-item label="用户名称：">
                        <el-input v-model="search.name" placeholder="请输入用户名"></el-input>
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
        <el-table :data="list" style="width: 100%"  @expand="expand">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="name"  label="用户名" align="center"></el-table-column>
            <el-table-column prop="num"  label="总计目标" align="center"></el-table-column>
            <el-table-column prop="numed"  label="已完成" align="center"></el-table-column>
            <el-table-column type="expand">
                <template scope="props">
                    <el-tabs value="a">
                        <el-tab-pane label="事业目标" name="a">
                            <el-table :data="props.row.worklist">
                                <el-table-column label="序号" width="100" align="center" header-align="center">
                                    <template scope="scope">
                                        <span v-html="scope.$index*10+1"></span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="content"  label="目标内容" align="center"></el-table-column>
                                <el-table-column prop="method"  label="方法和措施" align="center"></el-table-column>
                                <el-table-column label="是否完成" align="center">
                                    <template scope="scope">
                                        <span v-html="scope.row.is_success?'已完成':'未完成'"></span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" align="center">
                                    <template scope="scope">
                                        <el-button type="danger" size="small" v-if="rights[101]" @click="del(scope.row.id, scope.$index)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="个人目标" name="b">
                            <el-collapse accordion>
                                <el-collapse-item v-for="(item,index) in props.row.otherList" :title="item.cate_name">
                                    <el-table :data="item.list">
                                        <el-table-column label="序号" width="100" align="center" header-align="center">
                                            <template scope="scope">
                                                <span v-html="scope.$index+1"></span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="content"  label="目标" align="center"></el-table-column>
                                        <el-table-column label="是否完成" align="center">
                                            <template scope="scope">
                                                <span v-html="scope.row.is_success?'已完成':'未完成'"></span>
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="操作" align="center">
                                            <template scope="scope">
                                                <el-button type="danger" size="small" v-if="rights[101]" @click="del(item.list[scope.$index].id, index, scope.$index)">删除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-collapse-item>
                            </el-collapse>
                        </el-tab-pane>
                    </el-tabs>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block page">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :total="total">
            </el-pagination>
        </div>
        <!-- 删除dialog -->
        <el-dialog title="提示" :visible.sync="dialogVisible3" size="tiny">
            <span >是否删除目标？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible3 = false">取 消</el-button>
                <el-button type="primary" @click="delConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'yearPlan',
        data () {
            return {
                search: {
                    name: '',
                    page: 1
                },
                list: [],
                total: 2,
                currentPage: 1,
                activeName: '1',
                delInfo: {
                    index: '',
                    sIndex: '',
                    tIndex: '',
                    id: ''
                },
                dialogVisible3: false,
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.getData(1);
        },
        methods: {
            getData (page) {
                this.search.page = page;
                myFn.ajax('get', this.search, apiAddress.plan.year, (res) => {
                    for (var i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].worklist = [];
                        res.data.data[i].otherList = [];
                    };
                    this.list = res.data.data;
                    this.total = res.data.total;
                })
            },
            handleCurrentChange (val) {
                this.getData(val)
            },
            del (id, index, sIndex) {
                this.delInfo.sIndex = index;
                this.delInfo.tIndex = sIndex;
                this.delInfo.id = id;
                // this.dialogVisible3 = true;
                // console.log(obj, this.delInfo.index, index, sIndex)

                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delConfirm();
                }).catch(() => {
                    // cancel
                })
            },
            delConfirm () {
                // console.log(this.delInfo.index, this.delInfo.sIndex, this.delInfo.tIndex)
                myFn.ajax('get', {id: this.delInfo.id, model_type: 4}, apiAddress.plan.del, (res) => {
                    if (this.delInfo.tIndex !== undefined) {
                        this.list[this.delInfo.index].otherList[this.delInfo.sIndex].list.splice(this.delInfo.tIndex, 1);
                    } else {
                        this.list[this.delInfo.index].worklist.splice(this.delInfo.sIndex, 1);
                    }
                    this.dialogVisible3 = false;
                })
            },
            getDetail (index, year, uid, type) {
                var data = {
                    start_time: year,
                    uid: uid,
                    type: type
                }
                myFn.ajax('get', data, apiAddress.plan.yearDetails, (res) => {
                    switch (parseInt(type)) {
                        case 1:
                            this.list[index].worklist = res.data.data;
                            break;
                        case 2:
                            this.list[index].otherList = res.data;
                            break;
                    }
                    console.log()
                })
            },
            expand (row, expanded) {
                var index = '';
                for (var i = 0; i < this.list.length; i++) {
                    if (this.list[i].uid === row.uid && this.list[i].month === row.month) {
                        index = i;
                        this.delInfo.index = i;
                    }
                };
                if (!expanded) return;
                this.getDetail(index, row.year, row.uid, 1);
                this.getDetail(index, row.year, row.uid, 2);
            },
            query () {
                this.getData();
            }
        }
    }
</script>

<style>
    .yearPlan .el-table__expanded-cell {
        box-shadow: none;
    }
</style>