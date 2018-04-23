<template>
    <div class="attendancelog">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item >签到</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索 -->
        <el-form ref="form" :model="search" label-width="90px">
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-form-item label="姓名：">
                        <el-input v-model="search.name" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-button type="primary" icon="search" @click="query()">搜索</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>        
        <!-- 表格信息 -->
        <el-table :data="attendancelog.list">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="name"  label="姓名" align="center"></el-table-column>
            <el-table-column prop="create_time" label="签到时间" align="center"></el-table-column>
            <el-table-column prop="addr" label="签到地点" align="center"></el-table-column>
            <el-table-column prop="clname" label="拜访人" align="center"></el-table-column>
            <el-table-column label="照片" align="center">
                <template scope="scope">
                    <img v-for="item in scope.row.image" :src="'/public' + item" width="100" height="100">
                </template>
            </el-table-column>
            <el-table-column label="备注" align="center">
                <template scope="scope">
                    <span class="click-text" v-if="rights[91]" @click="open_remark_details(scope.row)">查看</span>
                </template>
            </el-table-column>
        </el-table>
        <!-- dialog弹出层 -->
        <el-dialog title="备注" :visible.sync="dialogVisible" size="small">
            <textarea class="remarks" cols="30" rows="10" v-html="remarks" readonly></textarea>
        </el-dialog>
        <!-- 分页 -->
        <div class="block page">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'attendancelog',
        data () {
            return {
                search: {
                    name: '',
                    page: ''
                },
                currentPage: 1,
                total: 0,
                dialogVisible: false,
                remarks: '',
                attendancelog: {
                    list: []
                },
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.getData(1);
        },
        methods: {
            getData (page) {
                this.search.page = page;
                myFn.ajax('get', this.search, apiAddress.sign.list, (res) => {
                    this.attendancelog.list = res.data.data;
                    this.total = res.data.total;
                })
            },
            handleCurrentChange: function (val) {
                this.getData(val)
            },
            query () {
                this.getData();
            },
            open_remark_details (data) {
                myFn.ajax('get', {id: data.id}, apiAddress.sign.remarks, (res) => {
                    this.remarks = res.data.remark;
                })
                this.dialogVisible = true;
            }
        }
    }
</script>
<style scoped>
    .downloadEx {
        float: right;
    }
    .click-text {
        width: 35px;
        color: #20a0ff;
        cursor: pointer;
        display: inline-block;
        border-bottom: 1px #20a0ff solid;
        line-height: 18px;
    }
    .detailsMon {
        color: #20a0ff;
        text-align: center;
        font-size: 15px;
    }
    .detailsMon span {
        margin: 0px 20px;
        cursor: pointer;
    }
    .remarks {
        width: 100%;
        resize: none;
        border: 0;
        padding: 5px;
        outline: none;
        font-size: 16px;
        box-sizing: border-box;
        color: #343434;
    }
</style>