<template>
  <div class="customerTypeAddOrEdit">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>客户管理</el-breadcrumb-item>
            <el-breadcrumb-item>客户分类</el-breadcrumb-item>
            <el-breadcrumb-item  v-if = "id == -1">添加</el-breadcrumb-item>
            <el-breadcrumb-item v-else = "id != -1">编辑</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form ref="form" label-width="50px" style="width: 500px">
            <el-form-item label="名称">
                <el-input placeholder="请输入名称" v-model="name"></el-input>
            </el-form-item>
            <el-form-item>
                <template scope="scope">
                    <el-button type="primary" @click="onSubmit()">保存</el-button>
                </template>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>
<script>
    export default{
        name: 'customerTypeAddOrEdit',
        data () {
            return {
                name: '',
                id: '',
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.id = this.$route.params.id;
            if (this.id !== -1 && this.rights[73]) {
                myFn.ajax('get', {id: this.id}, apiAddress.customer.customerTypeDetails, (res) => {
                    this.name = res.data.name;
                })
            }
        },
        methods: {
            onSubmit () {
                var data = {};
                if (this.id !== -1) {
                    data.id = this.id;
                } else {
                    data.id = 0;
                }
                data.name = this.name;
                myFn.ajax('post', data, apiAddress.customer.customerTypeAdd, (res) => {
                    this.$router.back(-1);
                })
            }
        }
    }
</script>
<style scoped="">
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
