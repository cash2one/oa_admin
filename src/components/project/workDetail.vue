<template>
    <div class="workDetail">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/project/list' }">项目管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/project/workTime/' + project_id }">项目工时</el-breadcrumb-item>
            <el-breadcrumb-item >工时详情</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 占位 -->
        <div class="interval"></div>
        <!-- 表格 -->
        <el-table :data="tableData" height="auto">
            <el-table-column fixed prop="name" label="姓名" width="150"></el-table-column>
            <el-table-column v-for="(item, index) in dayNum" :label="item + ''">
                <template scope="scope">
                    <span v-for="(obj, key) in scope.row.value" v-if="index == key" v-html="obj"></span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: 'workDetail',
        data () {
            return {
                dayNum: [],
                uid: '',
                project_id: '',
                monthValue: '',
                tableData: [{value: [], name: '常规'}, {value: [], name: '加班'}, {value: [], name: '合计'}],
                workDetail: {}
            }
        },
        mounted () {
            var curDate = new Date();
            var year = curDate.getFullYear();
            var month = parseInt(curDate.getMonth(), 10) + 1;
            var temp = new Date(year, month, 0);
            var length = temp.getDate();
            for (var i = 0; i < length; i++) {
                this.dayNum.push(i + 1)
            }
            this.monthValue = year + '-' + month;
            this.uid = this.$route.params.uid;
            this.project_id = this.$route.params.project_id;
            // console.log(this.dayNum)
            this.creatArr();
        },
        methods: {
            creatArr () {
                var data = {
                    uid: this.uid,
                    project_id: this.project_id,
                    month_time: this.monthValue
                }
                myFn.ajax('get', data, apiAddress.project.workTime, res => {
                    // console.log(res);
                    this.workDetail = res.data;
                    for (var index = 0; index < this.tableData.length; index++) {
                        for (var j = 0; j < this.dayNum.length; j++) {
                            if (res.data.length > 0) {
                                for (var k = 0; k < res.data.length; k++) {
                                    if (parseInt(this.dayNum[j]) === parseInt(res.data[k].day)) {
                                        switch (parseInt(index)) {
                                            case 0:
                                                this.tableData[index].value.push(res.data[k].normal);
                                                break;
                                            case 1:
                                                this.tableData[index].value.push(res.data[k].overtime);
                                                break;
                                            case 2:
                                                this.tableData[index].value.push(res.data[k].total);
                                                break;
                                        }
                                    } else {
                                        this.tableData[index].value.push('0');
                                    }
                                }
                            } else {
                                this.tableData[index].value.push('0');
                            }
                        }
                    }
                })
            }
        }
    }
</script>

<style>
    .workDetail .el-table__body,
    .workDetail .el-table__footer,
    .workDetail .el-table__header {
        width: 100%!important;
    }
    .workDetail .el-form-item__label {
        width: 50px!important;
    }
    .workDetail .el-form-item__content {
        margin-left: 50px!important;
    }
    .workDetail .el-dialog__footer {
        text-align: left;
        padding-left: 70px;
    }
    .workDetail .el-select {
        width: 100%;
    }
    .workDetail .el-table__fixed-right {
        border-right: 1px solid #d3d4d6;
    }
</style>

<style scoped>
    .interval {
        height: 30px;
        margin: 15px 0;
    }
</style>