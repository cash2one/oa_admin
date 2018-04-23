<template>
  <div class="roleAdd">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/role/list' }">角色列表</el-breadcrumb-item>
            <el-breadcrumb-item v-if="!form.id" >添加角色</el-breadcrumb-item>
            <el-breadcrumb-item v-else>编辑角色</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form ref="form" :model="form" label-width="80px" style="width: 1200px">
            <el-form-item label="角色名称">
                <el-input placeholder="请输入角色名称" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="角色权限">
                <el-collapse v-model="activeNames">
                    <el-collapse-item v-for="(item,index) in rights" :title="item.class_name + ' (' + checkedRights[index].length + ')'" :name="index + 1">
                        <el-checkbox :indeterminate="item.isIndeterminate" v-model="item.checkAll" @change="handleCheckAllChange($event, item, index)">全选</el-checkbox>
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox-group v-model="checkedRights[index]" @change="handleCheckedCitiesChange($event, item, index)">
                            <el-checkbox v-for="obj in item.class_permission" :label="obj.id" :key="obj.id">{{obj.permission_name}}</el-checkbox>
                        </el-checkbox-group>
                    </el-collapse-item>
                </el-collapse>
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
                    name: '',
                    id: ''
                },
                checkedRights: [],
                checkedDetails: [],
                rights: [],
                activeNames: ['1'],
                myRights: {}
            }
        },
        mounted () {
            this.myRights = JSON.parse(localStorage.rights);
            if (this.myRights[5]) {
                this.getlist();
            }
            if (this.$route.params.id) {
                this.form.id = this.$route.params.id;
            };
        },
        methods: {
            getlist () {
                myFn.ajax('get', {}, apiAddress.rights.list, res => {
                    for (var i = 0; i < res.data.length; i++) {
                        res.data[i].checkAll = true;
                        res.data[i].isIndeterminate = true;
                        this.checkedRights[i] = [];
                        this.checkedDetails[i] = [];
                    }
                    this.rights = res.data;
                    if (this.$route.params.id && this.myRights[2]) {
                        this.getDetails();
                    };
                })
            },
            getDetails () {
                myFn.ajax('get', {id: this.form.id}, apiAddress.rights.roleDetails, res => {
                    this.form.name = res.data.role_name;
                    for (var i = 0; i < this.rights.length; i++) {
                        for (var j = 0; j < this.rights[i].class_permission.length; j++) {
                            for (var k = 0; k < res.data.list.length; k++) {
                                if (parseInt(res.data.list[k].id) === parseInt(this.rights[i].class_permission[j].id)) {
                                    this.checkedDetails[i].push(res.data.list[k].id);
                                }
                            }
                        }
                    }
                    for (var n = 0; n < this.checkedDetails.length; n++) {
                        this.checkedRights[n] = this.checkedDetails[n]
                    }
                })
            },
            handleCheckAllChange (event, item, index) {
                // console.log(event, item, index)
                var all = []
                for (var i = 0; i < item.class_permission.length; i++) {
                    all.push(item.class_permission[i].id);
                }
                this.checkedRights[index] = event.target.checked ? all : [];
                item.isIndeterminate = false;
            },
            handleCheckedCitiesChange (value, item, index) {
                // console.log(value, item, index)
                let checkedCount = value.length;
                item.checkAll = checkedCount === item.class_permission.length;
                item.isIndeterminate = checkedCount > 0 && checkedCount < item.class_permission.length;
            },
            onSubmit () {
                var form = new FormData();
                form.append('id', this.form.id || 0)
                form.append('role_name', this.form.name)
                for (var i = 0; i < this.checkedRights.length; i++) {
                    for (var j = 0; j < this.checkedRights[i].length; j++) {
                        form.append('permission[]', this.checkedRights[i][j])
                    }
                }
                myFn.uploadImg(form, apiAddress.rights.roleModify, (res) => {
                    this.$router.back(-1);
                });
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
