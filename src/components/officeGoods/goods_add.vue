<template>
  <div class="admin">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/goods/list' }">办公物品</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/goods/list' }">物品库存</el-breadcrumb-item>
            <el-breadcrumb-item>物品采购</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form ref="form" :model="form" label-width="50px" style="width: 500px">
            <el-form-item label="名称">
                <el-select  v-model="form.region">
                   <el-option label="新增" value="0"></el-option>
                   <el-option v-for="item in list" :label="item.name" :key="item.id" :value="item.id"></el-option>
                 </el-select>
                <el-input v-show="form.region == 0" placeholder="电脑" v-model="form.name" ></el-input>
            </el-form-item>
            <el-form-item label="数量">
                <el-input placeholder="请输入采购数量" v-model="form.num"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="form.remark" placeholder="多行输入"></el-input>
            </el-form-item>
            <el-form-item>
                <template scope="scope">
                    <el-button type="primary" @click="onSubmit()">采购</el-button>
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
                list: []
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights)
            if (localStorage.list) {
                this.list = JSON.parse(localStorage.list);
            };
            if (this.$route.params.id) {
                this.form.region = this.$route.params.id;
            };
            console.log(this.$route.params.id)
        },
        methods: {
            onSubmit () {
                var self = this;
                var data = {
                    gid: self.form.region,
                    goodsname: self.form.name,
                    num: self.form.num,
                    remark: self.form.remark
                }
                $.ajax({
                    url: '/public' + apiAddress.goods.purchase,
                    type: 'post',
                    data: data,
                    cache: true,
                    timeout: 30000,
                    dataType: 'json',
                    success: function (res, textStatus, XMLHttpRequest) {
                        alert('添加成功')
                        self.$router.push({path: '/purchas/list'})
                    },
                    error: function (res) {
                        alert(res.msg)
                        self.$router.push({name: 'goodsList'})
                    }
                });
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
