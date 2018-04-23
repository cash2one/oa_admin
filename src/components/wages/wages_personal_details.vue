<template>
    <div class="weixin">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item >财务管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/wages/wagesMonth'}">工资管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/wages/wagesMonth/details/' + monthId}">月份详情</el-breadcrumb-item>
            <el-breadcrumb-item >个人详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form ref="form" label-width="100px">
            <el-form-item v-for="item in fieldList" :label="item.salary_field" >
                <el-input v-model="details.salary_json[item.id]"></el-input>
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
                id: '',
                monthId: '',
                fieldList: [],
                details: {}
            }
        },
        mounted () {
            this.id = this.$route.params.id;
            this.monthId = this.$route.params.month;
            this.get_date();
            this.get_fieldList();
        },
        methods: {
            get_date () {
                myFn.ajax('get', {record_id: this.id}, apiAddress.wages.PersonalDetails, (res) => {
                    this.details = res.data;
                })
            },
            get_fieldList () {
                myFn.ajax('get', {id: this.monthId}, apiAddress.wages.fieldThisList, (res) => {
                    this.fieldList = res.data.salary_rule;
                });
            },
            submitForm () {
                console.log(this.details.salary_json)
                var data = {
                    record_id: this.id,
                    salary_json: JSON.stringify(this.details.salary_json)
                }
                myFn.ajax('post', data, apiAddress.wages.PersonalEdit, (res) => {
                    // alert('修改成功')
                    this.$router.back('-1')
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