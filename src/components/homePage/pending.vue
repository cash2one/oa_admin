<template>
  <div class="pending">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index/homePage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/index/homePage/pending' }">审核</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <el-col class="border-title">待审核（{{total}}）</el-col>
        </el-row>
        <el-table :data="list" v-if="rights[19]">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="(currentPage*10-10)+(scope.$index+1)"></span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" align="center" header-align="center"></el-table-column>
            <el-table-column prop="sex" label="性别" align="center" header-align="center"></el-table-column>
            <el-table-column prop="create_time" label="提交时间" align="center" header-align="center"></el-table-column>
            <el-table-column prop="mobile" label="电话" align="center" header-align="center"></el-table-column>
            <el-table-column label="操作" align="center" header-align="center" width="300">
                <template scope="scope">
                    <el-button size="small" type="success" v-if="rights[20]" @click="agree(scope.$index,scope.row.id)">同意</el-button>
                    <el-button size="small" type="danger" v-if="rights[21]" @click="disagree(scope.$index,scope.row.id)">拒绝</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogFormVisible" align="center" size="small" :show-close="false" title="待审核">
            <el-form :model="listDetail" label-width="80px" label-position="left">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="姓名">
                            <el-input v-model="listDetail.name"  placeholder="请输入姓名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别">
                            <el-select v-model="listDetail.sex" >
                                <el-option :key="'1'" :label="'男'" :value="'男'"></el-option>
                                <el-option :key="'2'" :label="'女'" :value="'女'"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="生日">
                            <el-date-picker v-model="listDetail.birthday" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="部门">
                            <el-select v-model="listDetail.did" placeholder="请选择部门" @change="select">
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
                            <el-select v-model="listDetail.poid" placeholder="">
                            <el-option
                            v-for="item in pnameList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"></el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="入职时间">
                            <el-date-picker v-model="listDetail.entry_time" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="转正时间">
                            <el-date-picker v-model="listDetail.positive_time" type="date" placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item>
                        <el-col :span="24" style="text-align:left">
                         <el-button @click="dialogFormVisible=false">取消</el-button>
                         <el-button type="primary" @click="submit(listDetail)">同意</el-button>
                        </el-col>
                    </el-form-item> 
                </el-row>
            </el-form>
        </el-dialog>
        <div class="block page">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pre" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    export default{
        name: 'pending',
        data () {
            return {
                formLabelWidth: '50px',
                dialogFormVisible: false,
                // 列表数据
                list: [],
                // 列表详情数据
                listDetail: {},
                // 部门列表数据
                dnameList: [''],
                // 职位列表
                pnameList: [''],
                currentPage: 1,
                total: 0,
                pre: 10,
                // 指代列表index，方便弹窗同意
                listIndex: '',
                rights: {}
            }
        },
        mounted () {
            this.getdata(1);
            this.rights = JSON.parse(localStorage.rights);
            if (this.rights[22]) {
                this.getDnameList();
            }
        },
        methods: {
            /*
            接口数据
            */
            getdata (page) {
                myFn.ajax('get', {page: page}, apiAddress.homePage.pending, (res) => {
                    this.list = res.data.data;
                    this.total = res.data.total;
                    this.pre = res.data.per_page;
                    this.currentPage = res.data.current_page;
                    localStorage.list = JSON.stringify(res.data.data);
                });
            },
            handleCurrentChange (val) {
                this.getdata(val);
            },
            /*
            同意弹窗
            */
            agree (index, id) {
                this.listIndex = index
                this.dialogFormVisible = true;
                myFn.ajax('get', {id: id}, apiAddress.user.userDetail, (res) => {
                    this.listDetail = res.data;
                    this.listDetail.entry_time = new Date();
                    this.listDetail.positive_time = new Date();
                })
            },
            /*
            不同意
            */
            disagree (index, id) {
                myFn.ajax('get', {id: id}, apiAddress.homePage.disagree, (res) => {
                    this.list.splice(index, 1)
                })
            },
            /*
            同意弹窗提交保存
            */
            submit (listDetail, listIndex) {
                let index = this.listIndex
                function getTime (obj) {
                    if (typeof obj === 'string') {
                        return obj;
                    } else {
                        return obj.toLocaleDateString().replace(/\//g, '-')
                    }
                }
                var sex = ''
                switch (listDetail.sex) {
                    case '男':
                        sex = 1;
                        break;
                    case '女':
                        sex = 2;
                        break;
                }
                if (!listDetail.birthday) {
                    alert('请选择生日')
                    return false;
                }
                if (!listDetail.did) {
                    alert('请选择部门')
                    return false;
                }
                var Mydata = {
                    id: listDetail.id,
                    name: listDetail.name,
                    birthday: getTime(listDetail.birthday),
                    sex: sex,
                    departmentid: listDetail.did,
                    positionid: listDetail.poid,
                    entry_time: getTime(listDetail.entry_time),
                    positive_time: getTime(listDetail.positive_time)
                }
                console.log(Mydata)
                myFn.ajax('post', Mydata, apiAddress.homePage.agree, (res) => {
                    this.dialogFormVisible = false
                    this.$notify({
                        title: '审核成功',
                        type: 'success'
                    });
                    this.list.splice(index, 1)
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
            选择部门
            */
            select () {
                if (this.listDetail.did && this.rights[23]) {
                    this.getPnameList(this.listDetail.did)
                }
            },
            /*
            职位列表
            */
            getPnameList (did) {
                myFn.ajax('get', {id: did}, apiAddress.user.pname, (res) => {
                    this.pnameList = res.data
                    this.listDetail.poid = res.data[0].id;
                })
            }
        }
    }
</script>
<style scoped>
    .border-title{
        line-height: 29px;
        font-size: 20px;
        margin: 0 0 14px 12px;
    }
    .el-select {
        width: 100%;
    }
    .el-date-editor.el-input{
        width: 100%;
    }
    /**
     * dialog头部隐藏
     */
</style>
