<template>
    <div class="login">
        <div class="login-box">
            <h1 class="login-title">后台管理系统</h1>
            <div class="login-form">
                <h2 class="login-form-title">登录</h2>
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="账号">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input type="password" v-model="form.passworld"></el-input>
                    </el-form-item>
                    <el-form-item class="login-form-staticCode" label="验证码">
                        <el-input v-model="form.staticCode"></el-input>
                        <img @click="toggleCode" :src="staticCodeUrl" />
                    </el-form-item>
                    <el-form-item>
                        <el-button class="login-form-submit-button" size="large" type="primary" @click="onSubmit">登陆</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>

import '../css/login.css'

export default {
    name: 'login',
    data () {
        return {
            form: {
                username: '',
                password: '',
                code: ''
            },
            list: {
                uname: ''
            },
            staticCodeUrl: '/public' + apiAddress.admin.staticCodeUrl + '?time=' + Math.random(),
            rights: {}
        }
    },
    methods: {
        toggleCode: function () {
            this.staticCodeUrl = '/public' + apiAddress.admin.staticCodeUrl + '?time=' + Math.random();
        },
        getRights (id) {
            myFn.ajax('get', {}, apiAddress.rights.list, res => {
                // console.log(res)
                myFn.ajax('get', {id}, apiAddress.rights.roleDetails, result => {
                    // console.log(result)
                    for (var i = 0; i < res.data.length; i++) {
                        for (var j = 0; j < res.data[i].class_permission.length; j++) {
                            // console.log(parseInt(res.data[i].class_permission[j].id))
                            for (var k = 0; k < result.data.list.length; k++) {
                                var str1 = res.data[i].class_permission[j].id;
                                if (parseInt(res.data[i].class_permission[j].id) === parseInt(result.data.list[k].id)) {
                                    this.rights[str1] = true;
                                } else if (!this.rights[str1]) {
                                    this.rights[str1] = false;
                                }
                            }
                        }
                    }
                    // console.log(this.rights)
                    localStorage.rights = JSON.stringify(this.rights);
                    this.$router.push({name: 'homePage', query: {uname: this.list.uname}});
                })
            })
        },
        onSubmit: function () {
            var data = {
                username: this.form.name,
                password: this.form.passworld,
                code: this.form.staticCode
            }
            myFn.ajax('post', data, apiAddress.login.login, (res) => {
                this.list.uname = res.data.name;
                localStorage.username = this.list.uname;
                this.getRights(res.data.rid);
            });
        }
    }
}
</script>
