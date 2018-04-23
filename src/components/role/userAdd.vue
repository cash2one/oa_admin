<template>
  <div class="roleAdd">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/user/list' }">管理员列表</el-breadcrumb-item>
            <el-breadcrumb-item v-if="!form.id" >添加管理员</el-breadcrumb-item>
            <el-breadcrumb-item v-else>编辑管理员</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form ref="form" :model="form" label-width="80px" style="width: 700px">
            <el-form-item label="用户名称">
                <el-input placeholder="请输入用户名称" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="选择角色">
              <el-select v-model="form.rid" placeholder="请选择">
                <el-option v-for="item in options" :key="item.id" :label="item.role_name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="账号">
                <el-input placeholder="请输入账号" v-model="form.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input type="password" placeholder="请输入密码" v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item>
                <template scope="scope">
                    <el-button type="primary" @click="onSubmit()">提交</el-button>
                </template>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>
<script>
    export default{
        name: 'roleAdd',
        data () {
            return {
                form: {
                    id: '',
                    rid: '',
                    name: '',
                    username: '',
                    password: ''
                },
                options: [],
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            if (this.rights[1]) {
                this.getlist();
            }
            if (this.$route.params.id) {
                this.form.id = this.$route.params.id;
                if (this.rights[161]) {
                    this.getDetails();
                }
            };
        },
        methods: {
            getlist () {
                myFn.ajax('get', {}, apiAddress.rights.roleList, res => {
                    this.options = res.data;
                })
            },
            getDetails () {
                myFn.ajax('get', {id: this.form.id}, apiAddress.rights.userDetails, res => {
                    // console.log(res)
                    this.form.rid = res.data.rid;
                    this.form.name = res.data.name;
                    this.form.username = res.data.username;
                    this.form.name = res.data.name;
                })
            },
            onSubmit () {
                myFn.ajax('post', {
                    id: this.form.id || 0,
                    rid: this.form.rid || 0,
                    username: this.form.username,
                    password: this.form.password,
                    name: this.form.name
                }, apiAddress.rights.userModify, res => {
                    this.$router.back(-1)
                })
            }
        }
    }
</script>
<style>
    .el-checkbox {
        margin-right: 20px;
    }
    .el-checkbox+.el-checkbox {
        margin-left: 0;
        margin-right: 20px;
    }
</style>
<style scoped>
    .el-breadcrumb {
        padding: 20px 0 15px 10px;
    }
    .breadcrumb{
        padding: 0 0 40px 10px;
    }
    .el-form{
        margin-top: 50px;
    }
    .el-input, .el-input__inner {
        width: 220px;
    }
</style>
