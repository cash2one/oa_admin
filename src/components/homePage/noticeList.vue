<template>
    <div class="admin">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index/homePage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/index/homePage/noticeList'}">公告列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="search"  label-width="90px">
            <el-row :gutter="20">
                <el-col :span="5">
                    <el-form-item label="发布时间：">
                        <el-date-picker
                        v-model="start_time"
                        type="datetime"
                        placeholder="选择开始日期时间">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="5">
                <el-form-item label="结束时间：">
                    <el-date-picker
                    v-model="end_time"
                    type="datetime"
                    placeholder="选择结束日期时间">
                </el-date-picker>
            </el-form-item>
        </el-col>
        <el-col :span="5">
            <el-form-item label="公告标题：">
                <el-input v-model="search.title"  placeholder="请输入公告标题搜索"></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="5">
            <el-form-item label="">
                <el-button type="primary" icon="search" @click="searchEd()">搜索</el-button>
            </el-form-item>
        </el-col>
    </el-row>
</el-form>
<el-row>
    <el-col>
        <el-button type="text" @click="toggleSelection(list)">全选</el-button>
        <el-button type="text" @click="delectSelection(list)">删除选中</el-button>
        <el-button class="el-button-style" type="primary" v-if="rights[14] && rights[22]" @click="go_Edit(0)">发公告</el-button>
    </el-col>
</el-row>
<el-table :data="list" tooltip-effect="dark" ref="selectTable" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column prop="dname" label="部门" align="center" header-align="center"></el-table-column>
    <el-table-column prop="title" label="公告标题" align="center" header-align="center"></el-table-column>
    <el-table-column prop="create_time" label="发布时间" align="center" header-align="center"></el-table-column>
    <el-table-column label="操作" align="center" header-align="center" width="300">
        <template scope="scope">
            <el-button type="success" size="small" v-if="rights[13]" @click="noticePreview(scope.row.id)">预览</el-button>
            <el-button type="primary" size="small" v-if="rights[12]" @click="go_Edit(scope.row.id)" :list="list">编辑</el-button>
            <el-button type="danger" size="small" v-if="rights[14]" @click="showDeldialog(scope.row.id, scope.$index)">删除</el-button>
        </template>    
    </el-table-column>
</el-table>
<el-dialog :visible.sync="dialogVisible"  size="small" align="center" style="word-break: normal">
    <div slot="title" style="display: inline-block">
        <h2  v-text="previewList.title"></h2>
        <h4 v-text="previewList.create_time" style="font-weight:500"></h4>
    </div>
    <div style="text-align:left" v-text="previewList.content" class="content-eara"></div>
</el-dialog>
<el-dialog title="提示" :visible.sync="dialogVisible2" size="tiny">
    <span>是否删除该条数据</span>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="handleDel()">确 定</el-button>
    </span>
</el-dialog>
<div class="block page">
    <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pre" layout="total, prev, pager, next, jumper" :total="total">
    </el-pagination>
</div>
</div>
</template>
<script>
    export default{
        name: 'noticeList',
        data () {
            return {
                dialogVisible: false,
                dialogVisible2: false,
                currentPage: 1,
                total: 10,
                pre: 10,
                formLabelWidth: '60px',
                // dialogFormVisible: false,
                list: [],
                previewList: [],
                search: {
                    start_time: '',
                    end_time: '',
                    title: ''
                },
                start_time: '',
                end_time: '',
                delList: [],
                delInfo: {},
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.getdata(1)
        },
        methods: {
            /*
            搜索
            */
            searchEd () {
                if (this.end_time) {
                    this.search.end_time = myFn.getTime(this.end_time);
                }
                if (this.start_time) {
                    this.search.start_time = myFn.getTime(this.start_time);
                }
                this.getdata(1);
            },
            /*
            全选
            */
            toggleSelection (rows) {
                rows.forEach(row => {
                    this.$refs.selectTable.toggleRowSelection(row)
                })
            },
            /*
            删除选中
            */
            delectSelection (list) {
                for (var i = 0; i < this.delList.length; i++) {
                    myFn.ajax('post', {id: this.delList[i].id}, apiAddress.homePage.noticeDelect, (res) => {
                        this.list.splice(list.index, 1)
                    })
                }
            },
            /*
            公告预览
            */
            noticePreview (id) {
                this.dialogVisible = true
                myFn.ajax('get', {id: id}, apiAddress.homePage.noticePreview, (res) => {
                    this.previewList = res.data
                    console.log(this.previewList)
                })
            },
            /*
            公告编辑/添加
            */
            go_Edit (id) {
                var params = {};
                if (id !== undefined) {
                    params.id = id;
                }
                this.$router.push({name: 'noticeEdit', params: params})
                console.log(id)
            },
            /*
            公告删除
            */
            delectTable (index, id) {
                myFn.ajax('post', {id: id}, apiAddress.homePage.noticeDelect, (res) => {
                    this.list.splice(index, 1)
                })
            },
            handleCurrentChange (val) {
                this.getdata(val);
            },
            /*
            多选获取行数据
            */
            handleSelectionChange (val) {
                this.delList = val;
                console.log(this.delList)
            },
            /*
            接口数据
            */
            getdata (page) {
                this.search.page = page;
                myFn.ajax('get', this.search, apiAddress.homePage.noticeList, (res) => {
                    this.list = res.data.data;
                    console.log(this.list)
                    this.total = res.data.total;
                    this.pre = res.data.per_page;
                    this.currentPage = res.data.current_page;
                    localStorage.list = JSON.stringify(res.data.data);
                });
            },
            showDeldialog (id, index) {
                this.dialogVisible2 = true;
                this.delInfo.id = id;
                this.delInfo.index = index;
            },
            handleDel () {
                myFn.ajax('post', {id: this.delInfo.id}, apiAddress.homePage.noticeDelect, (res) => {
                    this.list.splice(this.delInfo.index, 1)
                    this.dialogVisible2 = false;
                })
            }
        }
    }
</script>
<style>
    .admin .content-eara {
        min-height: 500px;
        text-indent: 28px;
        line-height: 1.5;
    }
</style>
<style scoped>
    .el-button-style{
        float: right;
        margin: 0 0 10px 0;
    }
    .el-dialog__body {
        min-height: 500px;
    }
</style>
