<template>
  <div class="customerTypeAddOrEdit">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/project/list' }">项目管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/project/list' }">项目列表</el-breadcrumb-item>
            <el-breadcrumb-item><span v-html="info.id == 0 ? '添加' : '编辑'"></span></el-breadcrumb-item>
        </el-breadcrumb>
        <el-form ref="form" label-width="100px" style="width: 700px">
            <el-form-item label="项目名称">
                <el-input placeholder="请输入名称" v-model="info.name"></el-input>
            </el-form-item>
            <el-form-item label="开始时间">
               <el-date-picker v-model="info.start_time" type="date" placeholder="选择日期" format="yyyy-MM-dd" @change="startDate"></el-date-picker>
            </el-form-item>
            <el-form-item label="预计结束时间">
                <el-date-picker v-model="info.end_time" type="date" placeholder="选择日期" format="yyyy-MM-dd" @change="endDate"></el-date-picker>
            </el-form-item>
            <el-form-item label="项目价格">
                <el-input placeholder="请输入项目价格" v-model="info.project_price"></el-input>
            </el-form-item>
            <el-form-item label="业务提成">
                <el-input placeholder="请输入业务提成" v-model="info.business_percent"></el-input>
                <span class="tips">* 0~100之间（按%提成）</span>
            </el-form-item>
            <el-form-item label="类型">
                <el-input placeholder="请输入项目类型" v-model="info.project_type"></el-input>
            </el-form-item>
            <el-form-item label="项目来源">
                <el-input placeholder="请输入项目来源" v-model="info.project_from"></el-input>
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
                    name: '',
                    start_time: '',
                    end_time: '',
                    project_price: '',
                    business_percent: '',
                    project_type: '',
                    project_from: ''
                }
            }
        },
        mounted () {
            if (this.$route.query.id) {
                this.id = this.$route.query.id;
                this.getDetail();
            }
        },
        methods: {
            getDetail () {
                myFn.ajax('get', {id: this.id}, apiAddress.project.detail, res => {
                    this.info = res.data;
                })
            },
            onSubmit () {
                myFn.ajax('post', this.info, apiAddress.project.modify, res => {
                    this.$router.back(-1);
                })
            },
            startDate (val) {
                this.info.start_time = val;
            },
            endDate (val) {
                this.info.end_time = val;
            }
        }
    }
</script>
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
    .tips {
        display: inline-block;
        margin-left: 15px;
        color: red;
    }
</style>
