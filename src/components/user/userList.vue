<template>
  <div class="admin">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/index/homePage' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/user/userList'}">用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form label-width="90px">
        <el-row :gutter="24">
            <el-col :span="5">
                <el-form-item label="姓名">
                    <el-input v-model="search.name"  placeholder="请输入姓名搜索"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="5">
                <el-form-item label="电话">
                    <el-input v-model="search.mobile"  placeholder="请输入电话搜索"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" icon="search"  @click="searchEd()">搜索</el-button>
            </el-col>
            <el-col :span="10" style="text-align: right;">
                <el-button v-if="rights[124] && rights[22] && rights[23]" type="primary" @click="add_user">添加用户</el-button>
            </el-col>
        </el-row>
    </el-form>
    <el-table :data="list" tooltip-effect="dark" ref="selectTable">
        <el-table-column label="序号" width="100" align="center" header-align="center">
            <template scope="scope">
                <span v-html="(currentPage*10-10)+(scope.$index+1)"></span>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center" header-align="center"></el-table-column>
        <el-table-column prop="work_id" label="工号" align="center" header-align="center"></el-table-column>
        <el-table-column prop="sex" label="性别" align="center" header-align="center"></el-table-column>
        <el-table-column prop="mobile" label="电话" align="center" header-align="center"></el-table-column>
        <el-table-column prop="dname" label="部门" align="center" header-align="center"></el-table-column>
        <el-table-column prop="pname" label="职位" align="center" header-align="center"></el-table-column>
        <el-table-column prop="entry_time" label="入职时间" align="center" header-align="center"></el-table-column>
        <el-table-column align="center" header-align="center">
            <template scope="scope">
                <el-button v-if="rights[16] && rights[22] && rights[23]" type="primary" size="small" @click="go_Edit(scope.row)">编辑</el-button>
                <el-button v-if="rights[17]" type="danger" size="small" @click="delectTable(scope.$index, scope.row.id)">删除</el-button>
            </template>    
        </el-table-column>
    </el-table>
    <el-dialog  title="添加用户" :visible.sync="addUserPopup" align="center" size="small" >
        <el-form :model="listDetail"  label-width="80px" v-loading="upload_idCard_loading" element-loading-text="识别中">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="姓名">
                        <el-input v-model="add_user_form.name"  placeholder="请输入姓名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="性别">
                        <!-- <el-input v-model="listDetail.sex"  placeholder="2017-02-05"></el-input> -->
                        <el-select v-model="add_user_form.sex" placeholder="请选择性别">
                            <el-option label="男" value="1"></el-option>
                            <el-option label="女" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="身份证">
                        <el-input v-model="add_user_form.iDcard"  placeholder="请输入身份证"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="生日">
                        <el-date-picker v-model="add_user_form.birthday" type="date" placeholder="请选择生日日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-if="rights[139]">
                <el-col :span="24">
                    <el-form-item label="" style="text-align: left;margin-bottom: 10px">
                        <input type="file" @change='upload_card' id="id_card_btn">
                        <p style="margin: 0; color: red;">上传身份证图片可智能识别身份证号码和姓名</p>
                    </el-form-item>
                </el-col>
            </el-row>
            <p style="border-top: 1px #ddd solid;margin-bottom: 35px;"></p>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="昵称">
                        <el-input v-model="add_user_form.nickname"  placeholder="不填写默认为真实姓名"></el-input>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="12">
                    <el-form-item label="角色">
                        <el-select v-model="add_user_form.role" placeholder="请选择角色">
                            <el-option v-for="item in rolelist" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col> -->
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="手机号码">
                        <el-input v-model="add_user_form.mobile"  placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="登录密码">
                        <el-input v-model="add_user_form.password"  placeholder="请输入登录密码"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="部门">
                        <el-select v-model="add_user_form.department" placeholder="请选择你的部门" @change="select(add_user_form.department)">
                            <el-option v-for="item in dnameList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="职位">
                        <el-select v-model="add_user_form.position" placeholder="请选择你的职位">
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
                        <el-date-picker v-model="add_user_form.entry_time" type="date" placeholder="选择你的入职日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="转正时间">
                       <el-date-picker v-model="add_user_form.formal_time" type="date" placeholder="请选择你的转正日期">
                       </el-date-picker>
                   </el-form-item>
               </el-col>
            </el-row>
            <el-row >
                <el-form-item>
                    <el-col :span="24" style="text-align:left">
                        <el-button @click="addUserPopup = false">取消</el-button>
                        <el-button type="primary" @click="add_user_submit()">保存</el-button>
                    </el-col>
                </el-form-item>
            </el-row>
        </el-form>
    </el-dialog>
    <el-dialog  title="用户列表编辑" :visible.sync="dialogFormVisible" align="center" size="small" >
        <el-form :model="listDetail"  label-width="80px">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="姓名">
                        <el-input v-model="listDetail.truename"  placeholder="请输入姓名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="性别">
                        <el-select v-model="listDetail.sex" placeholder="请选择性别">
                            <el-option label="男" value="男"></el-option>
                            <el-option label="女" value="女"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="身份证">
                        <el-input v-model="listDetail.card_id"  placeholder="请输入身份证"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="生日">
                        <el-date-picker v-model="listDetail.birthday" type="date" placeholder="请选择生日日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <p style="border-top: 1px #ddd solid;margin-bottom: 35px;"></p>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="昵称">
                        <el-input v-model="listDetail.name"  placeholder="如不填写默认为真实姓名"></el-input>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="12">
                    <el-form-item label="角色">
                        <el-select v-model="add_user_form.role" placeholder="请选择角色">
                            <el-option v-for="item in rolelist" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col> -->
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="手机号码">
                        <el-input v-model="listDetail.mobile"  placeholder="请输入手机号码"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="登录密码">
                        <el-input v-model="listDetail.password"  placeholder="输入则修改"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="部门">
                        <el-select v-model="listDetail.did" placeholder="请选择你的部门" @change="select(listDetail.did)">
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
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="入职时间">
                        <el-date-picker v-model="listDetail.entry_time" type="date" placeholder="选择你的入职日期">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="转正时间">
                       <el-date-picker v-model="listDetail.positive_time" type="date" placeholder="请选择你的转正日期">
                       </el-date-picker>
                   </el-form-item>
               </el-col>
            </el-row>
            <el-row >
                <el-form-item>
                    <el-col :span="24" style="text-align:left">
                        <el-button @click="dialogFormVisible=false">取消</el-button>
                        <el-button type="primary" @click="submit()">保存</el-button>
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
        name: 'userList',
        data () {
            return {
                dialogFormVisible: false,
                currentPage: 1,
                total: 10,
                pre: 10,
                formLabelWidth: '60px',
                list: [],
                listDetail: {
                    password: '******'
                },
                birthday: '',
                entry_time: '',
                positive_time: '',
                dnameList: [],
                pnameList: [],
                dataIndex: 0,
                listId: '',
                listIndex: '',
                didId: '',
                thisItem: {},
                addUserPopup: false,
                // 搜索条件
                search: {name: '', mobile: ''},
                // 编辑用户表单
                // edit_user_form: {},
                // 添加用户表单
                rolelist: [{id: 1, name: '经理'}, {id: 2, name: '主管'}, {id: 3, name: '职员'}],
                add_user_form: {
                    name: '',
                    nickname: '',
                    role: '',
                    sex: '',
                    mobile: '',
                    iDcard: '',
                    department: '',
                    position: '',
                    entry_time: '',
                    formal_time: '',
                    birthday: '',
                    positive_status: '1',
                    password: '',
                    truename: '',
                    card_image: ''
                },
                upload_idCard_loading: false,
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.getdata(1);
            if (this.rights[22]) {
                this.getDnameList();
            }
        },
        methods: {
            /*
            搜索
            */
            searchEd () {
                myFn.ajax('get', {name: this.search.name, mobile: this.search.mobile}, apiAddress.user.userList, (res) => {
                    this.list = res.data.data;
                    this.total = res.data.total;
                    this.pre = res.data.per_page;
                    this.currentPage = res.data.current_page;
                });
            },
            /*
            打开删除确认取消弹窗
            */
            delectTable (index, id) {
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // this.confirmDel(id, index);
                    myFn.ajax('get', {id: id}, apiAddress.user.userDelect, (res) => {
                        this.dialogVisible = false;
                        this.$message({
                            type: 'success',
                            message: '成功删除'
                        });
                        this.list.splice(index, 1)
                    })
                })
                // this.listId = id
                // this.listIndex = index
                // this.dialogVisible = true;
            },
            // 编辑用户
            // 没有编辑权限、详情权限不必做限制
            go_Edit (item) {
                this.thisItem = item;
                this.dialogFormVisible = true;
                myFn.ajax('get', {id: item.id}, apiAddress.user.userDetail, (res) => {
                    this.listDetail = res.data;
                    this.listDetail.password = '******'
                });
            },
            add_user () {
                for (var i in this.add_user_form) {
                    this.add_user_form[i] = '';
                }
                this.addUserPopup = true;
                this.upload_idCard_loading = false;
            },
            add_user_submit () {
                if (this.add_user_form.name === '') {
                    alert('姓名不能为空');
                    return false;
                }

                if (this.add_user_form.sex === '') {
                    alert('性别不能为空');
                    return false;
                }
                if (this.add_user_form.iDcard === '') {
                    alert('身份证不能为空');
                    return false;
                }

                if (this.add_user_form.birthday === '') {
                    alert('生日不能为空');
                    return false;
                }

                if (this.add_user_form.mobile === '') {
                    alert('手机号码不能为空');
                    return false;
                }

                if (this.add_user_form.password === '') {
                    alert('密码不能为空');
                    return false;
                }

                if (this.add_user_form.department === '') {
                    alert('部门不能为空');
                    return false;
                }

                if (this.add_user_form.position === '') {
                    alert('职位不能为空');
                    return false;
                }

                if (this.add_user_form.entry_time === '') {
                    alert('入职时间不能为空');
                    return false;
                }

                if (this.add_user_form.formal_time === '') {
                    alert('转正时间不能为空');
                    return false;
                }

                var data = {
                    truename: this.add_user_form.name,
                    name: this.add_user_form.nickname,
                    sex: this.add_user_form.sex,
                    departmentid: this.add_user_form.department,
                    positionid: this.add_user_form.position,
                    entry_time: myFn.getTime(this.add_user_form.entry_time),
                    positive_time: myFn.getTime(this.add_user_form.formal_time),
                    mobile: this.add_user_form.mobile,
                    password: this.add_user_form.password,
                    card_id: this.add_user_form.iDcard,
                    card_image: this.add_user_form.card_image
                }
                if (typeof this.add_user_form.birthday === 'string') {
                    data.birthday = this.add_user_form.birthday;
                } else {
                    data.birthday = myFn.getTime(this.add_user_form.birthday);
                }
                if (this.add_user_form.formal_time > new Date()) {
                    data.positive_status = 1;
                } else {
                    data.positive_status = 2;
                }
                myFn.ajax('post', data, apiAddress.user.userAdd, (res) => {
                    this.getdata(1);
                    this.addUserPopup = false;
                    this.$notify({
                        title: '添加成功',
                        type: 'success'
                    });
                });
            },
            upload_card () {
                var self = this;
                this.upload_idCard_loading = true;
                var formData = new FormData();
                formData.append('card_image', document.getElementById('id_card_btn').files[0]);
                /* myFn.uploadImg(formData, apiAddress.user.getCardId, (res) => {
                    this.add_user_form.name = res.data.truename;
                    this.add_user_form.iDcard = res.data.card_id;
                    this.add_user_form.card_image = res.data.card_image;
                    this.add_user_form.sex = res.data.sex.toString();
                    this.add_user_form.birthday = res.data.birthday;
                    this.upload_idCard_loading = false;
                }); */
                $.ajax({
                    url: '/public' + apiAddress.user.getCardId,
                    type: 'post',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (res) {
                        if (res.code === 200) {
                            self.add_user_form.name = res.data.truename;
                            self.add_user_form.iDcard = res.data.card_id;
                            self.add_user_form.card_image = res.data.card_image;
                            self.add_user_form.sex = res.data.sex.toString();
                            self.add_user_form.birthday = res.data.birthday;
                            self.upload_idCard_loading = false;
                        } else {
                            alert(res.msg);
                            self.upload_idCard_loading = false;
                        }
                    }
                });
            },
            /*
            提交
            */
            submit () {
                function getTime (obj) {
                    if (typeof obj === 'string') {
                        return obj;
                    } else {
                        var time = new Date(obj)
                        var year = time.getFullYear();
                        var month = time.getMonth() + 1;
                        var day = time.getDate();
                        if (parseInt(month) < 10) {
                            month = '0' + month;
                        }
                        if (parseInt(day) < 10) {
                            day = '0' + day;
                        }
                        return year + '-' + month + '-' + day;
                    }
                }
                let Mydata = {
                    id: this.listDetail.id,
                    name: this.listDetail.name,
                    birthday: getTime(this.listDetail.birthday),
                    sex: this.listDetail.sex,
                    departmentid: this.listDetail.did,
                    positionid: this.listDetail.poid,
                    entry_time: getTime(this.listDetail.entry_time),
                    positive_time: getTime(this.listDetail.positive_time),
                    mobile: this.listDetail.mobile,
                    // password: this.listDetail.password,
                    card_id: this.listDetail.card_id,
                    truename: this.listDetail.truename
                }
                if (this.listDetail.password !== '******') {
                    Mydata.password = this.listDetail.password
                }
                if (this.listDetail.positive_time > new Date()) {
                    Mydata.positive_status = 1;
                } else {
                    Mydata.positive_status = 2;
                }
                switch (Mydata.sex) {
                    case '男':
                        Mydata.sex = '1';
                        break;
                    case '女':
                        Mydata.sex = '2';
                        break;
                }
                myFn.ajax('post', Mydata, apiAddress.user.userSubmit, (res) => {
                    this.thisItem.id = Mydata.id
                    this.thisItem.name = Mydata.name
                    this.thisItem.birthday = Mydata.birthday
                    this.thisItem.sex = Mydata.sex
                    for (var i in this.dnameList) {
                        if (this.dnameList[i].id === this.listDetail.did) {
                            this.thisItem.dname = this.dnameList[i].name
                        }
                    }
                    for (var o in this.pnameList) {
                        if (this.pnameList[o].id === this.listDetail.poid) {
                            this.thisItem.pname = this.pnameList[o].name
                        }
                    }
                    switch (this.thisItem.sex) {
                        case '1':
                            this.thisItem.sex = '男';
                            break;
                        case '2':
                            this.thisItem.sex = '女';
                            break;
                    }
                    this.thisItem.entry_time = Mydata.entry_time;
                    this.thisItem.positive_time = Mydata.positive_time;
                    this.dialogFormVisible = false
                    this.$notify({
                        title: '保存成功',
                        type: 'success'
                    });
                })
            },
            /*
            获取当前页
            */
            handleCurrentChange (val) {
                this.getdata(val);
            },
            /*
            接口数据
            */
            getdata (page) {
                myFn.ajax('get', {page: page}, apiAddress.user.userList, (res) => {
                    this.list = res.data.data;
                    console.log(this.list);
                    this.total = res.data.total;
                    this.pre = res.data.per_page;
                    this.currentPage = res.data.current_page;
                    localStorage.list = JSON.stringify(res.data.data);
                });
            },
            /*
            部门列表
            */
            getDnameList () {
                myFn.ajax('get', {}, apiAddress.depart.departList, (res) => {
                    this.dnameList = res.data
                })
            },
            select (id) {
                if (this.rights[23]) {
                    this.getPnameList(id);
                }
            },
            /*
            职位列表
            */
            getPnameList (did) {
                myFn.ajax('get', {id: did}, apiAddress.user.pname, (res) => {
                    this.pnameList = res.data;
                    // this.add_user_form.position = '';
                    // this.listDetail.poid = '';
                })
            }
        }
    }
</script>
<style scoped>
    .content-right{
        text-align: left;
        margin-bottom:32px;
    }
    .dialogContent{
        height: 20px;
        padding:20px;
    }
    .el-form--label-left .el-form-item__label {
        text-align: center;
    }
    .el-date-editor.el-input{
        width: 100%;
    }
    .el-select {
        width: 100%;
    }
</style>
