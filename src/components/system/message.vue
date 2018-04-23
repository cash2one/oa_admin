<template>
    <div class="message">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item >系统设置</el-breadcrumb-item>
            <el-breadcrumb-item >微信接口</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="form" ref="form" label-width="100px">
            <el-form-item label="账号" >
                <el-input v-model="form.account"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input type="password" v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: 'message',
        data () {
            return {
                form: {
                    account: '',
                    password: ''
                }
            }
        },
        mounted () {
            this.getInfo();
        },
        methods: {
            getInfo () {
                myFn.ajax('get', {}, apiAddress.system.message, (res) => {
                    this.form = res.data;
                })
            },
            submitForm () {
                myFn.ajax('post', this.form, apiAddress.system.messageSet, (res) => {
                    alert('修改成功')
                })
            }
        }
    }
</script>

<style>
    .message .el-form {
        width: 50%;
    }
    .message .el-form-item__label {
        font-weight: 600;
    }
</style>