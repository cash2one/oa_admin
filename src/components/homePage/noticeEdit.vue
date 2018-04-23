<template>
  <div class="admin">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index/homePage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/index/homePage/noticeList' }">公告列表</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/index/homePage/noticeEdit' }">发布公告</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form ref="form" :model="form" label-position="top">
            <el-form-item label="发布部门">
                <!-- <el-select  v-model="form.did">
                    <el-option label="所有" value="0" ></el-option>
                    <el-option v-for="item in dnameList" :label="item.name" :key="item.id" :value="item.id"></el-option>
                 </el-select> -->
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="item in dnameList" :label="item.name" :key="item.id"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="公告标题">
                <el-input placeholder="单行输入" v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="公告内容">
                <el-input type="textarea" v-model="form.content" placeholder="单行输入" :rows="10"></el-input>
            </el-form-item>
            <el-form-item align="left" label="">
                <template scope="scope">
                    <el-button type="primary" @click="onSubmit()" size="large">提交</el-button>
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
                isIndeterminate: true,
                checkAll: false,
                checkList: [],
                departName: [],
                form: {
                    id: '',
                    name: '',
                    title: '',
                    content: ''
                },
                dnameList: [],
                dnameSelect: [],
                list: [],
                labelPosition: 'left'
            }
        },
        mounted () {
            this.form.id = this.$route.params.id;
            if (parseInt(this.form.id) !== 0) this.EditList();
            this.dname()
        },
        methods: {
            onSubmit () {
                var form = new FormData()
                for (var i = 0; i < this.checkList.length; i++) {
                    for (var j = 0; j < this.dnameList.length; j++) {
                        if (this.checkList[i] === this.dnameList[j].name) {
                            // 部门id
                            form.append('did[]', this.dnameList[j].id);
                        };
                    };
                };
                form.append('id', this.form.id)
                form.append('title', this.form.title)
                form.append('content', this.form.content)

                myFn.uploadImg(form, apiAddress.homePage.noticeAdd, (res) => {
                    this.$router.back(-1)
                    this.$notify({
                        title: '提交成功',
                        type: 'success'
                    });
                })
            },
            // 编辑详情
            EditList () {
                myFn.ajax('get', {id: this.form.id}, apiAddress.homePage.noticePreview, (res) => {
                    this.form = res.data;
                    for (var i = 0; i < res.data.notice_users.length; i++) {
                        for (var j = 0; j < this.dnameList.length; j++) {
                            if (res.data.notice_users[i].did === this.dnameList[j].id) {
                                this.checkList.push(this.dnameList[j].name)
                            };
                        };
                    };
                    console.log(this.dnameList)
                })
            },
            // 部门列表
            dname () {
                myFn.ajax('get', {}, apiAddress.depart.departList, (res) => {
                    this.dnameList = res.data;
                    for (var i = 0; i < res.data.length; i++) {
                        this.departName.push(res.data[i].name);
                    };
                })
            },
            handleCheckAllChange () {
                if (this.checkAll) {
                    this.checkList = this.departName;
                } else {
                    this.checkList = [];
                }
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange (value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.departName.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.departName.length;
            }
        }
    }
</script>
<style scoped="">
    .el-form{
        margin-top: 50px;
    }
    .el-select {
        width: 100%;
    }
</style>
