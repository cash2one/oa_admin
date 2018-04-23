<template>
    <div class="homePage">
        <el-row class="title">
            <el-col class="title-first" ><span v-html="myName"></span><span>，早上好！欢迎登录XXX管理系统</span></el-col>
        </el-row>
        <el-row class="middle-content-wrapper" v-if="rights[11] && rights[22]">
            <el-col :span="24" class="middle-content">
                <div class="middle-content-child" @click="noticeEdit">
                    <img :src = "noticeIMG" width="100" height="100">
                    <el-badge class="span-text">发公告</el-badge>
                </div>
                <!-- <div class="middle-content-child" @click="message" style="display: none;">
                    <img :src = "messageIMG">
                    <el-badge class="span-text">
                      私信(2)
                  </el-badge>
                </div> -->
                <!-- 改为后台创建用户不需要审核 -->
                <!-- <div class="middle-content-child" @click="pending">
                    <img :src = "pendingIMG" style="margin-bottom: 13px;">
                    <span>待审核</span>
                    <span v-show="this.total>0">({{total}})</span>
                    <el-badge is-dot  v-show="this.total>0">
                  </el-badge>
                </div> -->
            </el-col>
        </el-row>
        <el-row class="main-wrapper" :class="{hasNotice: !rights[11] || !rights[22]}">
            <el-col :span="11" class="notice">
                <span>公司公告</span>
                <el-button class="notice-right" v-if="rights[11]" @click="noticeList" type="text">查看更多>></el-button>
            </el-col>
            <el-col :span="11" class="notice" :push="2">
                <span>月程表</span>
                <el-button class="notice-right" type="text" v-if="rights[58]" @click="goAddMonth()"><i class="el-icon-plus"></i>添加月程</el-button>
            </el-col>
            <el-col :span="11" class="notice-content">         
                <li v-for="item in list" class="list-style-each" @click="showDetails(item.id)">
                    <span>{{item.title}}</span><span style="float: right">{{item.create_time}}</span>
                </li>
            </el-col>
            <el-col :span="11" class="notice-content" :push="2">
                <li v-for="item in monthList" class="list-style-each">
                    <span>{{item.title}}</span><span style="float: right">{{item.start}} {{item.start_time_detail}}--{{item.end_time}}</span>
                </li>
            </el-col>
        </el-row>
        <el-dialog :visible.sync="dialogVisible"  size="small" align="center" style="word-break: normal">
            <div slot="title" style="display: inline-block">
                <h2  v-text="previewList.title"></h2>
                <h4 v-text="previewList.create_time" style="font-weight:500"></h4>
            </div>
            <div style="text-align:left" v-text="previewList.content" class="content-eara"></div>
        </el-dialog>
    </div>
</template>

<script>
    import noticeIMG from '../../assets/homePage/notice.png'
    import messageIMG from '../../assets/homePage/message.png'
    import pendingIMG from '../../assets/homePage/pending.png'
    export default{
        name: 'homePage',
        data () {
            return {
                total: '',
                myName: '',
                list: [],
                uname: '',
                noticeIMG: noticeIMG,
                messageIMG: messageIMG,
                pendingIMG: pendingIMG,
                dialogVisible: false,
                previewList: {},
                monthList: [],
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.myName = localStorage.username;
            if (this.rights[19]) {
                this.ready()
            }
            if (this.rights[11]) {
                this.getdata();
            }
            if (this.rights[56]) {
                this.getMonthList();
            }
        },
        methods: {
            ready () {
                myFn.ajax('get', {}, apiAddress.homePage.pending, (res) => {
                    this.total = res.data.total;
                });
            },
            pending () {
                this.$router.push({name: 'pending'})
            },
            message () {
                this.$router.push({name: 'message'})
            },
            noticeEdit () {
                this.$router.push({name: 'noticeEdit', params: {id: 0}})
            },
            noticeList () {
                this.$router.push({name: 'noticeList'})
            },
            goAddMonth () {
                this.$router.push({name: 'monthManagemnet'})
            },
            getdata () {
                myFn.ajax('get', {}, apiAddress.homePage.noticeList, (res) => {
                    this.list = res.data.data;
                });
            },
            getMonthList () {
                myFn.ajax('get', {}, apiAddress.homePage.monthList, (res) => {
                    this.monthList = res.data;
                });
            },
            showDetails (id) {
                this.dialogVisible = true
                myFn.ajax('get', {id: id}, apiAddress.homePage.noticePreview, (res) => {
                    this.previewList = res.data
                    console.log(this.previewList)
                })
            }
        }
    }
</script>

<style>
    .homePage .el-dialog__body {
        min-height: 300px;
    }
</style>

<style scoped>
    .homePage{
        color: #666666;
    }
    .title {
        margin: 50px 0 0 52px;
        font-size: 0;
    }

    .title-first {
        color: #666666;
        line-height: 30px;
        font-size: 20px;
        margin-bottom: 4px;
    }
    .title-first span {
        vertical-align: top;
        color: #1b69fe;
    }
    .title-second {
        color: #1b69fe;
        font-size: 14px;
        line-height: 20px;
    }

    .middle-content-wrapper {
        border: 1px solid #d4d4d4;
        margin: 70px 75px 90px 52px;
        padding: 22px 0 22px 60px;
    }

    .middle-content {
        display: flex;
        flex-direction: row;
        text-align: center;
    }
    .middle-content-child{
        cursor: pointer;
        margin-right: 60px;
        flex: 0 1 100px;
    }
    .span-text {
        margin-top: 12px;
    }
    .main-wrapper {
        margin: 0 75px 23px 52px;
    }
    .hasNotice {
        margin-top: 100px;
    }
    .notice {
        margin-bottom: 10px;
        height: 23px;
        line-height: 23px;
    }

    .notice-right {
        padding: 5px;
        font-size: 12px;
        float: right;
        line-height: 17px;
        color: #666666;
    }

    .notice-content {
        overflow: hidden;
        border: 1px solid #d4d4d4;
        min-height: 200px;
    }
    .list-style-each {
        position: relative; 
        padding: 0 35px;
        list-style: none;
        line-height: 34px;
        user-select: none;
        cursor: pointer;
    }
    .list-style-each:nth-child(even){
        background: #fafafa;
    }
    .list-style-each:before{
        position: absolute;
        left: 15px;
        content: '●';
        color: #bababa;
        width: 10px;
        height: 10px;
    }
    .list-style-each:hover {
        background: #f1f1f1;
    }
    .el-dialog__body {
        min-height: 500px;
    }
</style>
