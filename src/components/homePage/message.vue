<template>
  <div class="admin">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/index/homePage' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/index/homePage/message'}">私信</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
        <el-col :span="24"  class="el-select-style">
            <template>
                <span>选择状态：</span>
                <el-radio class="radio" v-model="radio" label="1">已发送</el-radio>
                <el-radio class="radio" v-model="radio" label="2">新收到({{news}})</el-radio>
                <el-button  @click="go_MessageEdit" style="float: right">新建私信</el-button>
            </template>
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="24"  class="el-form-style">
            <el-form :model="query" :inline="true" label-width="70px">
                <el-form-item label="发送时间">
                    <el-input v-model="query.time"  placeholder="请输入发送时间搜索"></el-input>
                </el-form-item>
                <el-form-item label="接收人">
                    <el-input v-model="query.settitle"  placeholder="请输入接收人名称搜索"></el-input>
                </el-form-item>
                <el-button style="margin-left:20px;" @click="searchEd()">搜索</el-button>
            </el-form>
        </el-col>
    </el-row>
    <el-row>
        <el-col>
            <template scoped>
                <el-button type="text" @click="toggleSelection(list)">全选</el-button>
                <el-button type="text" @click="delectSelection()">删除选中</el-button>
            </template>
        </el-col>
    </el-row>
    <el-table :data="list" tooltip-effect="dark" ref="selectTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="sendPerson" label="发送人" align="center" header-align="center"></el-table-column>
        <el-table-column prop="theme" label="主题" align="center" header-align="center"></el-table-column>
        <el-table-column prop="time" label="时间" align="center" header-align="center"></el-table-column>
        <el-table-column label="操作" align="center" header-align="center" width="300">
        <template scope="scope">
                <el-button size="small" type="success" @click="dialogVisible=true">预览</el-button>
                <el-button size="small" type="danger" @click="delectTable(scope.row.$index)">删除</el-button>
            </template>    
        </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogVisible"  size="small" align="left">
       <div slot="title" style="display: inline-block">
            <h2>发送人： 发送人名称</h2>
            <p>发送时间：2017-09-28</p>
        </div>
        <div class="MSGcontent">
        主题：
        <br>
        neirong
        <el-col class="MSGcontent-button">
            <el-button>回复</el-button>
        </el-col>
        </div>
    </el-dialog>
    <div class="block page">
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pre" layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</div>
</template>
<script>
    export default{
        name: 'message',
        data () {
            return {
                radio: '1',
                news: '2',
                search: '',
                serachTitle: '',
                dialogVisible: false,
                currentPage: 1,
                total: 10,
                pre: 10,
                formLabelWidth: '60px',
                // dialogFormVisible: false,
                list: [
                    {
                        sendPerson: '1111',
                        theme: '主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题',
                        time: '2017-02-05  12:00:00'
                    },
                    {
                        sendPerson: '2222',
                        theme: '主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题',
                        time: '2017-02-05  12:00:00'
                    },
                    {
                        sendPerson: '3333',
                        theme: '主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题',
                        time: '2017-02-05  12:00:00'
                    }],
                query: {
                    settime: '',
                    settitle: ''
                },
                delList: []
            }
        },
        mounted () {
            // // myFn.ajax('get', {}, apiAddress.goods.purchaselogs, (res) => {
            // //     this.list = res.data.data
            // // })
            // this.getdata(1)
        },
        methods: {
            searchEd () {
                myFn.ajax('get', { goodsname: this.search }, apiAddress.goods.purchaselogs, (res) => {
                    this.list = res.data.data;
                });
            },
            toggleSelection (rows) {
                rows.forEach(row => {
                    this.$refs.selectTable.toggleRowSelection(row)
                })
            },
            delectSelection () {
                for (var i = 0; i < this.list.length; i++) {
                    for (var j = 0; j < this.delList.length; j++) {
                        if (this.list[i] === this.delList[j]) {
                            this.list.splice(i, 1);
                        }
                    }
                }
            },
            noticeEdit () {
                this.$router.push({name: 'message'})
            },
            delectTable (index) {
                this.list.splice(index, 1)
            },
            go_MessageEdit () {
                this.$router.push({name: 'messageEdit'})
            },
            handleCurrentChange (val) {
                this.getdata(val);
            },
            handleSelectionChange (val) {
                this.delList = val;
                console.log(val)
            }
            // getdata (page) {
            //     myFn.ajax('get', {page: page}, apiAddress.goods.purchaselogs, (res) => {
            //         this.list = res.data.data;
            //         this.total = res.data.total;
            //         this.pre = res.data.per_page;
            //         this.currentPage = res.data.current_page;
            //         localStorage.list = JSON.stringify(res.data.data);
            //     });
            // }
        }
    }
</script>
<style scoped>
    .el-button-style{
        float: right;
        margin: 0px 10px 10px 0;
    }
    .el-select-style{
        padding: 17px 51px 22px 0px;
        border-bottom: 1px solid #ddd;
    }
    .el-form-style{
        text-align: right;
        min-height: 50px;
        position: relative;
        padding: 20px 51px 0 0;
    }
    .content-right{
        text-align: right;
    }
    .MSGcontent{
        display: block;
        position: relative;
        min-height: 500px;
    }
    .MSGcontent-button{
        position: absolute;
        text-align: center;
        bottom:36px;

    }
</style>
