<template>
  <div class="customerTypeAddOrEdit">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/project/list' }">项目管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/project/source' }">项目资源</el-breadcrumb-item>
            <el-breadcrumb-item>添加</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form ref="form" label-width="100px" style="width: 500px">
            <el-form-item label="名称">
                <el-input placeholder="请输入名称" v-model="info.resource_name"></el-input>
            </el-form-item>
            <el-form-item label="金额">
                <el-input placeholder="请输入金额" v-model="info.resource_price"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input placeholder="请输入备注" v-model="info.remark"></el-input>
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
                info: {
                    id: 0,
                    project_id: '',
                    resource_name: '',
                    resource_price: '',
                    remark: ''
                }
            }
        },
        mounted () {
            this.info.project_id = this.$route.params.id;
        },
        methods: {
            onSubmit () {
                myFn.ajax('post', this.info, apiAddress.project.resourceModify, (res) => {
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
