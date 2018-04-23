<template>
    <div class="weixin">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item >系统设置</el-breadcrumb-item>
            <el-breadcrumb-item >微信接口</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="form" ref="form" label-width="100px">
            <el-form-item label="微信appid" >
                <el-input v-model="form.appid"></el-input>
            </el-form-item>
            <el-form-item label="微信secret">
                <el-input v-model="form.appsecret"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">提交</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: 'weixin',
        data () {
            return {
                form: {
                    appid: '',
                    appsecret: ''
                }
            }
        },
        mounted () {
            this.getInfo();
        },
        methods: {
            getInfo () {
                myFn.ajax('get', {}, apiAddress.system.weixin, (res) => {
                    this.form = res.data;
                })
            },
            submitForm () {
                myFn.ajax('post', this.form, apiAddress.system.weixinSet, (res) => {
                    alert('修改成功')
                })
            }
        }
    }
</script>

<style>
    .weixin .el-form {
        width: 50%;
    }
    .weixin .el-form-item__label {
        font-weight: 600;
    }
</style>