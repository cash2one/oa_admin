<template>
  <div class="admin">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index/homePage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/index/homePage/message' }">私信</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/index/homePage/messageEdit' }">新建</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <el-col class="el-button-style">
                <el-button >取消</el-button>
            </el-col>
        </el-row>       
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="发送">
                <el-select  v-model="form.region">
                   <el-option label="设计部" value="0"></el-option>
                   <el-option v-for="item in list" :label="item.name" :key="item.id" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标题" >
                <el-input placeholder="单行输入" v-model="form.num" ></el-input>
            </el-form-item>
            <el-form-item label="内容">
                <el-input type="textarea" v-model="form.remark" placeholder="单行输入" :rows="10"></el-input>
            </el-form-item>
            <el-form-item align="center">
                <template scope="scope">
                    <el-button type="primary" @click="onSubmit()" size="large">发送</el-button>
                </template>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>
<script>
    export default{
        data () {
            return {
                form: {
                    region: '0',
                    name: '',
                    num: '',
                    remark: ''
                },
                list: [],
                labelPosition: 'right'
            }
        },
        mounted () {
        },
        methods: {
            onSubmit () {
                this.$router.push({name: 'message'})
            }
        }
    }
</script>
<style scoped>
  /*  .el-form{
        margin-top: 50px;
    }*/
    .el-button-style{
        text-align: right;
        margin: 9px 61px 19px 0;
    }
    .el-select {
        width: 100%;
    }
</style>
