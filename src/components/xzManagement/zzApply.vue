<template>
    <div class="zzApply">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/xzManagement/leaveApply' }">行政管理</el-breadcrumb-item>
            <el-breadcrumb-item >转正申请</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索 -->
        <el-form ref="form" :model="search" label-width="90px">
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-form-item label="姓名：">
                        <el-input v-model="search.name" placeholder="输入姓名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item label="部门：" v-if="rights[22]">
                        <el-select v-model="search.dname" placeholder="选择部门">
                            <el-option label="所有" value=""></el-option>
                            <el-option
                            v-for="item in dnameList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"></el-option>
                        </el-select>
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
        <el-table :data="list">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="entry_time" label="入职时间" align="center"></el-table-column>
            <el-table-column prop="positive_time" label="转正时间" align="center"></el-table-column>
            <el-table-column prop="name" label="申请人" align="center"></el-table-column>
            <el-table-column prop="dname" label="部门" align="center"></el-table-column>
            <el-table-column prop="pname" label="职位" align="center"></el-table-column>
            <el-table-column width="220" align="center">
                <template scope="scope">
                    <el-button size="small" v-if="rights[33]" type="success" @click="fullApply(scope.$index,scope.row)">转正</el-button>
                    <el-button size="small" v-if="rights[34]" type="primary" @click="delayApply(scope.$index,scope.row)">延时</el-button>
                    <el-button size="small" v-if="rights[37]" type="danger" @click="handleDelete(scope.$index, scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 弹窗1 -->
        <el-dialog title="转正申请" :visible.sync="dialogVisible" size="tiny">
            <el-form :model="listDetail"  label-width="80px">
            <!-- <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="姓名">
                        <el-input v-model="listDetail.name"  placeholder="请输入你的姓名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="性别">
                        <el-input v-model="tableDataList.sex"  placeholder="请输入你的性别"></el-input>
                        <el-select v-model="listDetail.sex" placeholder="请选择">
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="2"></el-option>
                    </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="生日">
                        <el-date-picker v-model="listDetail.birthday" type="date" placeholder="请选择你的生日日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="部门">
                        <el-select v-model="listDetail.did" placeholder="请选择你的部门" @change="select()">
                            <el-option
                            v-for="item in dnameList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="职位">
                        <el-select v-model="listDetail.poid" placeholder="请选择你的职位">
                            <el-option
                            v-for="item in pnameList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
                       <el-row > -->
            <p>是否转正？</p>
            <el-form-item>
                <el-col :span="24" style="text-align:left">
                    <el-button @click="dialogVisible=false">取消</el-button>
                    <el-button type="primary" @click="submit()">确 定</el-button>
                </el-col>
            </el-form-item>
        </el-row>
    </el-form>   
        </el-dialog>
        <!-- 弹窗2 -->
        <el-dialog title="转正延时申请" :visible.sync="dialogTableVisible" size="tiny">
            <el-form :model="listDetail"  label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="转正时间">
                           <el-date-picker v-model="listDetail.positive_time" type="date" placeholder="请选择你的转正时间">
                           </el-date-picker>
                       </el-form-item>
                   </el-col>
               </el-row>
               <el-form-item>
                <el-col :span="24" style="text-align:left">
                    <el-button @click="dialogTableVisible=false">取消</el-button>
                    <el-button type="primary" @click="delaySubmit()">保存</el-button>
                </el-col>
            </el-form-item>
        </el-row>
    </el-form>   
        </el-dialog>
        <!-- 分页 -->
        <div class="block page">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pre" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
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
        name: 'departmentList',
        data () {
            return {
                list: [],
                listDetail: {},
                search: {
                    name: '',
                    dname: ''
                },
                dnameList: [],
                pnameList: [],
                departID: '',
                currentPage: 1,
                total: 10,
                pre: 10,
                dialogVisible: false,
                dialogTableVisible: false,
                thisIndex: '',
                thisItem: {},
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
            this.getdata(1)
            if (this.rights[22]) {
                this.getDnameList()
            }
        },
        methods: {
            /*
            接口数据
             */
            getdata (page) {
                let Data = {
                    id: this.departID,
                    page: page
                }
                myFn.ajax('get', Data, apiAddress.xzManagement.zzApply, (res) => {
                    this.list = res.data.data
                    this.currentPage = res.data.current_page
                    this.pre = res.data.per_page
                    this.total = res.data.total
                    console.log(this.list)
                })
            },
            handleCurrentChange (val) {
                this.getdata(val);
                console.log(val)
            },
            /*
            打开用户编辑
             */
            fullApply (index, item) {
                this.thisIndex = index;
                // console.log(this.thisIndex)
                this.thisItem = item;
                // this.dialogVisible = true;
                myFn.ajax('get', {id: item.id}, apiAddress.user.userDetail, (res) => {
                    this.listDetail = res.data;
                    if (this.listDetail.sex === '男') {
                        this.listDetail.sex = '1';
                    } else {
                        this.listDetail.sex = '2';
                    }
                    console.log(this.listDetail.id)
                })
                this.getDnameList()

                this.$confirm('是否确认转正?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.submit();
                })
            },
            /*
            打开延时编辑
             */
            delayApply (index, item) {
                this.thisItem = item;
                this.dialogTableVisible = true;
                myFn.ajax('get', {id: item.id}, apiAddress.user.userDetail, (res) => {
                    this.listDetail = res.data;
                    console.log(this.listDetail.id)
                })
            },
            /*
            部门列表
            */
            getDnameList () {
                myFn.ajax('get', {}, apiAddress.depart.departList, (res) => {
                    this.dnameList = res.data
                })
            },
            /*
            职位列表
            */
            getPnameList (did) {
                myFn.ajax('get', {id: did}, apiAddress.user.pname, (res) => {
                    this.pnameList = res.data
                })
            },
            /*
            部门选择
             */
            select () {
                // console.log(this.listDetail.did)
                this.getPnameList(this.listDetail.did)
            },
            /*
            转正提交
            */
            submit (listIndex) {
                let index = this.thisIndex
                function getTime (obj) {
                    if (typeof obj === 'string') {
                        return obj;
                    } else {
                        return obj.toLocaleDateString().replace(/\//g, '-');
                    }
                }
                let Mydata = {
                    id: this.listDetail.id,
                    name: this.listDetail.name,
                    birthday: getTime(this.listDetail.birthday),
                    sex: this.listDetail.sex,
                    departmentid: this.listDetail.did,
                    positionid: this.listDetail.poid
                }
                console.log(Mydata)
                myFn.ajax('post', Mydata, apiAddress.xzManagement.passApply, (res) => {
                    if (res.code === 200) {
                        this.list.splice(index, 1)
                        this.$message({
                            type: 'success',
                            message: '转正申请成功提交'
                        });
                    }
                    this.dialogVisible = false;
                })
            },
            /*
            转正延时提交
             */
            delaySubmit () {
                let index = this.thisIndex
                function getTime (obj) {
                    if (typeof obj === 'string') {
                        return obj;
                    } else {
                        return obj.toLocaleDateString().replace(/\//g, '-');
                    }
                }
                let Mytime = {
                    id: this.listDetail.id,
                    delay_time: getTime(this.listDetail.positive_time)
                }
                console.log(Mytime)
                myFn.ajax('post', Mytime, apiAddress.xzManagement.delayApply, (res) => {
                    this.thisItem.positive_time = Mytime.positive_time;
                    if (res.code === 200) {
                        this.list.splice(index, 1)
                        this.$notify({
                            title: '成功修改转正延时时间',
                            type: 'success'
                        });
                    }
                    this.dialogTableVisible = false;
                })
            },
            /*
            删除
            */
            delete_item () {
                myFn.ajax('get', {id: this.del_item.id}, apiAddress.xzManagement.deleteApply, (res) => {
                    if (res.code === 200) {
                        this.list.splice(this.del_item.index, 1);
                        this.$notify({
                            title: '成功删除转正用户',
                            type: 'success'
                        });
                    }
                    this.del_dialog = false;
                })
            },
            handleDelete (index, id) {
                /* this.del_item.id = id;
                this.del_item.index = index;
                this.del_dialog = true; */

                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    myFn.ajax('get', {id: id}, apiAddress.xzManagement.deleteApply, (res) => {
                        this.$message({
                            message: '成功删除',
                            type: 'success'
                        });
                        this.list.splice(index, 1);
                    })
                })
            },
            /*
            搜索
             */
            query () {
                let searchData = {
                    name: this.search.name,
                    department_id: this.search.dname
                }
                myFn.ajax('get', searchData, apiAddress.xzManagement.zzApply, (res) => {
                    this.list = res.data.data
                })
            }
        }
    }
</script>

<style>
    .el-date-editor.el-input {
        width: 100%;
    }
    .el-select {
        width: 100%;
    }
</style>