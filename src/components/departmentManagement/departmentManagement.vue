<template>
    <div class="departmentManegement">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/index/homePage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item >部门管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 表格 -->
        <div class="DnameListGroup">
            <div class="DnameListGroupChild" v-for="(item,index) in list" :key="index" >
                <div class="DnameListGroupContent" @click="godetails(item.id)">
                    <img src="../../assets/group.png">
                    <p v-html="item.name"></p>
                </div>
                <el-col align="center" style="margin-top:9px">
                   <el-button type="text" size="mini" v-if="rights[52]" @click="listDel(index, item.id)">删除</el-button>
                   <el-button type="text" size="mini" v-if="rights[23] && rights[51]" @click="dialogEdit(item.name, item.id)">编辑</el-button>
               </el-col>
            </div>
            <div class="depratAdd" v-if="rights[50]" @click="dialogAdd">
                <span class="el-icon-plus"></span>
                <p>新建部门</p>
            </div>
        </div>
        <!-- dialog弹出层 -->
        <el-dialog :title="isAdd?'新建部门':'编辑部门'" :visible.sync="dialogVisible" size="tiny">
            <el-form ref="form" label-width="100px">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="部门名称：">
                            <el-input v-model="sendData.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="职位列表：">
                            <el-tag :key="index" v-for="(tag,index) in positionList" :closable="rights[55]" @close="handleClose(index,tag.id)" v-if="!isAdd">{{tag.name}}</el-tag>
                            <el-tag :key="index" v-for="(tag,index) in newArr" :closable="rights[55]" @close="handleClose(index)" v-if="isAdd">{{tag}}</el-tag>
                            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini"
                            @blur="handleInputConfirm"></el-input>
                            <el-button class="button-new-tag" size="small" v-if="rights[54] && !inputVisible" @click="showInput">+ 添加职位</el-button>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="">
                            <el-button @click="dialogVisible = false">取消</el-button>
                            <el-button type="primary" @click="isAdd?Add():Edit()">确定</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="del_dialog" size="tiny">
            <span>是否删除记录？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="del_dialog = false">取 消</el-button>
                <el-button type="primary" @click="delete_item">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'departmentManegement',
        data () {
            return {
                list: [],
                sendData: {
                    id: 0,
                    name: ''
                },
                positionList: [],
                newArr: [],
                isAdd: false,
                dialogVisible: false,
                inputVisible: false,
                inputValue: '',
                // 删除提示
                del_dialog: false,
                del_item: {
                    index: '',
                    id: ''
                },
                rights: {}
            };
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.getDate();
        },
        methods: {
            getDate: function () {
                myFn.ajax('get', {}, apiAddress.depart.departList, (res) => {
                    this.list = res.data;
                })
            },
            godetails: function (id) {
                if (!this.rights[53]) return;
                this.$router.push({name: 'departmentList', params: {id: id}});
            },
            delete_item () {
                myFn.ajax('get', {id: this.del_item.id}, apiAddress.depart.departDelect, (res) => {
                    this.list.splice(this.del_item.index, 1);
                    this.del_dialog = false;
                })
            },
            listDel: function (index, id) {
                this.del_item.id = id;
                this.del_item.index = index;
                this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delete_item();
                })
                this.positionList = '';
            },
            dialogEdit: function (name, id) {
                this.isAdd = false;
                this.sendData.id = id;
                this.dialogVisible = true;
                this.sendData.name = name;
                myFn.ajax('get', {id: id}, apiAddress.user.pname, (res) => {
                    this.positionList = res.data;
                })
            },
            Edit: function () {
                myFn.ajax('post', this.sendData, apiAddress.depart.departEdit, (res) => {
                    for (var i = 0; i < this.list.length; i++) {
                        if (this.list[i].id === this.sendData.id) {
                            this.list[i].name = this.sendData.name;
                        };
                    };
                    if (res.code === 200) {
                        this.$notify({
                            title: '成功编辑部门',
                            type: 'success'
                        });
                    }
                    this.dialogVisible = false;
                });
            },
            dialogAdd: function () {
                this.dialogVisible = true;
                this.isAdd = true;
                this.sendData.id = '';
                this.sendData.name = '';
                this.positionList = '';
            },
            Add: function () {
                myFn.ajax('post', {name: this.sendData.name, pname: this.newArr}, apiAddress.depart.departAdd, (res) => {
                    this.list.push({id: res.data.id, name: res.data.name})
                    if (res.code === 200) {
                        this.$notify({
                            title: '成功添加部门',
                            type: 'success'
                        });
                    }
                });
                this.dialogVisible = false;
            },
            handleClose: function (index, id) {
                if (this.isAdd) {
                    this.newArr.splice(index, 1);
                } else {
                    myFn.ajax('get', {id: id}, apiAddress.depart.deletePosition, (res) => {
                        this.positionList.splice(index, 1)
                        if (res.code === 200) {
                            this.$notify({
                                title: '成功删除职位',
                                type: 'success'
                            });
                        }
                    })
                }
            },

            showInput: function () {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleInputConfirm: function () {
                if (!this.inputValue) {
                    this.inputVisible = false;
                    return false;
                };
                if (this.isAdd) {
                    this.newArr.push(this.inputValue);
                } else {
                    myFn.ajax('post', {id: this.sendData.id, name: this.inputValue}, apiAddress.depart.departAddPos, (res) => {
                        this.positionList.push({id: res.data.poid, name: res.data.name});
                    })
                }
                this.inputVisible = false;
                this.inputValue = '';
            }
        }
    }
</script>

<style>
    .departmentManegement .el-input--mini .el-input__inner {
        height: 35px;
    }
</style>

<style scoped>
    .DnameListGroup{
        display: flex;
        flex-flow: row wrap;
        align-content: flex-start;
        width: 100%;
        height: 100%;
    }
    .DnameListGroupChild{
        position: relative;
        box-sizing: border-box;
        background-color: white;
        flex: 0 0 200px;
        height: 190px;
        margin-right: 41px;
        margin-bottom: 32px;
    }
    .DnameListGroupContent{
        padding: 30px;
        text-align: center;
        cursor: pointer;
        box-sizing: border-box;
        background-color: white;
        max-width: 200px;
        flex: 0 0 200px;
        height: 160px;
        border:1px solid #ddd;
    }
    .DnameListGroupContent img {
        width: 45px;
        height: 45px;
        margin: 0 auto;
    }
    .DnameListGroupContent p {
        font-size: 15px;
        text-align: center;
    }
    .depratAdd{
        width: 200px;
        height: 155px;
        cursor: pointer;
        margin-left: -5px;
        text-align: center;
        vertical-align: top;
        display: inline-block;
        border:1px solid #ddd;
    }
    .depratAdd span {
        font-size: 24px;
        margin-top: 45px;
        display: inline-block;
    }
</style>