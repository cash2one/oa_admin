    <template>
    <div class="assessment_member_list">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/department/departmentManagement' }">部门管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/department/departmentList/' + departID }">部门人员</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/assessment/stage/' + departID }">成员考核</el-breadcrumb-item>
            <el-breadcrumb-item >查看详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="tabs">
           <p>部门：<span v-html="departmentName"></span></p>
           <p>期数：<span v-html="qID"></span></p>
        </div>
        <!-- 表格信息 -->
        <el-table :data="tableData">
            <el-table-column label="序号" width="100" align="center" header-align="center">
                <template scope="scope">
                    <span v-html="scope.$index+1"></span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" align="center"></el-table-column>

            <el-table-column v-for="(item,index) in labellist" :label="item.rule_name" align="center">
                <template scope="scope">
                    <span v-for="(obj,key) in scope.row.other_score">
                        <i style="font-style:normal" v-if="item.id == key">{{obj}}</i>
                    </span>
                </template>
            </el-table-column>

            <el-table-column prop="score" label="累计分数" align="center"></el-table-column>
            <el-table-column prop="this_score" label="本期分数" align="center"></el-table-column>
            <el-table-column label="操作" width="220" align="center">
                <template scope="scope">
                    <el-button size="small" type="primary" v-if="rights[111]" @click="go_confirm(scope.$index, scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block page">
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pre" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>

        <!-- dialog弹层 -->
        <el-dialog title="编辑" :visible.sync="dialogVisible" size="tiny">
            <p>姓名：<span v-html="item_name"></span></p>
            <el-form ref="form" label-width="80px">
                <el-form-item v-for="item in form" :label="item.name">
                    <el-input v-model="item.value"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="edit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        name: 'assessment_member_list',
        data () {
            return {
                id: '',
                tableData: [],
                departID: '',
                qID: '',
                departmentName: '',
                dialogVisible: false,
                form: [],
                formID: '',
                currentIndex: '',
                labellist: [],
                currentPage: 1,
                total: 3,
                pre: 10,
                item_name: '',
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.departID = this.$route.params.id;
            this.qID = this.$route.params.qID;
            var departlist = JSON.parse(localStorage.departmentList);
            for (var i = 0; i < departlist.length; i++) {
                if (parseInt(departlist[i].id) === parseInt(this.departID)) {
                    this.departmentName = departlist[i].name;
                };
            };
            this.getList(1);
            this.getdata();
        },
        methods: {
            getList (page) {
                myFn.ajax('get', {aid: this.qID, page: page}, apiAddress.assessment.assessmentMemberList, (res) => {
                    this.tableData = res.data.data;
                    this.total = res.data.total;
                    this.pre = res.data.per_page;
                    this.currentPage = res.data.current_page;
                })
            },
            getdata () {
                myFn.ajax('get', {aid: this.qID}, apiAddress.assessment.assessmentDetails, (res) => {
                    this.labellist = res.data;
                })
            },
            handleCurrentChange (page) {
                this.getList(page);
            },
            go_confirm (index, data) {
                console.log(data)
                this.formID = data.id;
                this.currentIndex = index;
                this.form = [];
                this.dialogVisible = true;
                this.item_name = data.name
                for (var i = 0; i < this.labellist.length; i++) {
                    this.form.push({
                        name: this.labellist[i].rule_name,
                        value: data.other_score[this.labellist[i].id],
                        id: this.labellist[i].id
                    })
                };
            },
            edit () {
                var data = {};
                var score = {};
                for (var i = 0; i < this.form.length; i++) {
                    score[this.form[i].id] = parseInt(this.form[i].value);
                };
                data.id = this.formID;
                data.other_score = JSON.stringify(score);
                myFn.ajax('post', data, apiAddress.assessment.assessmentEdit, (res) => {
                    this.dialogVisible = false;
                    this.tableData[this.currentIndex].other_score = score;
                })
            }
        }
    }
</script>

<style>
    .assessment_member_list .el-dialog__body > p {
        margin-top: 0;
        margin-left: 13px;
    }
</style>
<style scoped>
    .tabs {
        margin: 30px 0 0 5px;
        padding-bottom: 15px;
    }
    .tabs> p:last-child {
        text-align: right;
        padding-right: 15px;
        margin: 5px 0;
    }
    .tabs> p:last-child span {
        cursor: pointer;
    }
</style>