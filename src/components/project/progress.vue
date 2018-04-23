<template>
    <div class="progress">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/project/list' }">项目管理</el-breadcrumb-item>
            <el-breadcrumb-item >项目进度</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 添加人员 -->
        <div class="add">
            <el-progress :percentage="percent" :stroke-width="10"></el-progress>
            <el-button type="primary" v-if="rights[159]" @click="download"><i class="el-icon-caret-bottom el-icon--left"></i>下载模板</el-button>
            <el-button type="primary" v-if="rights[158]" @click="upload"><i class="el-icon-upload el-icon--left"></i>上传任务</el-button>
            <input type="file" id="excelFile" style="display: none;" @change="importExcel"/>
        </div>
        <!-- 表格信息 -->
        <el-table :data="tableData">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="mission_name"  label="任务名称" align="center"></el-table-column>
            <el-table-column label="预计完成" align="center">
                <template scope="scope">
                    <el-date-picker v-model="scope.row.pre_time" type="date" placeholder="选择日期" format="yyyy-MM-dd" @change="startDate(scope.row)"></el-date-picker> 
                </template>
            </el-table-column>
            <el-table-column label="实际完成" align="center">
                <template scope="scope">
                    <el-date-picker v-model="scope.row.com_time" type="date" placeholder="选择日期" format="yyyy-MM-dd" @change="endDate(scope.row)"></el-date-picker> 
                </template>
            </el-table-column>
            <el-table-column prop="status"  label="是否完成" align="center"></el-table-column>
<!--             <el-table-column label="是否完成" align="center">
                <template scope="scope">
                    <el-select v-model="scope.row.status" placeholder="请选择" @change="selectStatus(scope.row)">
                        <el-option v-for="item in status" :key="item.id" :label="item.label" :value="item.id"></el-option>
                    </el-select>
                </template>
            </el-table-column> -->
            <el-table-column label="人员" align="center">
                <template scope="scope">
                    <el-select v-model="scope.row.uid" placeholder="请选择" @change="selectUser(scope.row)">
                        <el-option v-for="item in scope.row.options" :key="item.id" :label="item.user_name" :value="item.uid"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" header-align="center" width="300">
                <template scope="scope">
                    <el-button type="danger" size="small" @click="del(scope.row.id, scope.$index)">删除</el-button>
                </template>    
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="block page">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'progress',
        data () {
            return {
                // status: [{
                //     id: 1,
                //     label: '进行中'
                // },
                // {
                //     id: 2,
                //     label: '已完成'
                // }],
                tableData: [],
                currentPage: 1,
                total: 0,
                dialogVisible: false,
                id: '',
                percent: 0,
                options: [],
                value: '',
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.id = this.$route.params.id;
            this.getData(1);
        },
        methods: {
            getData (page) {
                myFn.ajax('get', {project_id: this.id, page}, apiAddress.project.missionlist, (res) => {
                    for (var i = 0; i < res.data.data.length; i++) {
                        res.data.data[i].status = parseInt(res.data.data[i].status) === 1 ? '进行中' : '已完成';
                        res.data.data[i].com_time = res.data.data[i].com_time === 0 ? res.data.data[i].com_time = '' : res.data.data[i].com_time;
                    }
                    this.tableData = res.data.data;
                    this.total = res.data.total;
                    this.percent = parseInt(res.data.percent * 100);
                    if (this.rights[148]) {
                        this.getUserList();
                    }
                })
            },
            handleCurrentChange: function (val) {
                this.getData(val)
            },
            del (id, index) {
                this.$confirm('此操作将删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    myFn.ajax('post', {id: id}, apiAddress.project.reprogressDel, (res) => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.tableData.splice(index, 1);
                    })
                }).catch(() => {
                    // console.log('取消')
                })
            },
            download () {
                window.location.href = apiAddress.project.explode + '?project_id=' + this.id;
            },
            upload () {
                $('#excelFile').click();
            },
            importExcel () {
                var form = new FormData();
                form.append('project_id', this.id);
                form.append('project_excel', document.getElementById('excelFile').files[0]);
                myFn.uploadImg(form, apiAddress.project.implode, (res) => {
                    this.getData();
                    document.getElementById('excelFile').value = '';
                });
            },
            getUserList () {
                var obj = {id: '', uid: 0, user_name: '请选择'};
                myFn.ajax('get', {project_id: this.id}, apiAddress.project.userlist, (res) => {
                    res.data.data.unshift(obj);
                    for (var i = 0; i < this.tableData.length; i++) {
                        this.$set(this.tableData[i], 'options', res.data.data);
                    }
                })
            },
            selectUser (data) {
                myFn.ajax('post', {id: data.id, uid: data.uid}, apiAddress.project.missionModify, (res) => {
                    // console.log(res);
                })
            },
            startDate (row) {
                var data = {
                    id: row.id
                }
                if (row.pre_time === '') {
                    data.pre_time = ''
                } else {
                    data.pre_time = myFn.getTime(row.pre_time)
                }
                myFn.ajax('post', data, apiAddress.project.missionModify, (res) => {})
            },
            endDate (row) {
                var data = {
                    id: row.id
                }
                if (row.com_time === '') {
                    data.com_time = ''
                } else {
                    data.com_time = myFn.getTime(row.com_time)
                }
                myFn.ajax('post', data, apiAddress.project.missionModify, (res) => {})
            }
        }
    }
</script>

<style>
    .progress .el-progress {
        width: 700px;
        margin-top: 10px;
        float: left;
        display: inline-block;
    }
    .progress .el-select {
        margin: 10px 0;
        width: 150px;
    }
</style>
<style scoped>
    .add {
        margin-bottom: 15px;
        text-align: right;
    }
</style>