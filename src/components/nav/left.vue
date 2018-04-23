<template>
  <div class="leftNav">
        <el-row class="tac">
        <el-col>
            <el-menu :default-active="$route.path || active_path" unique-opened router @open="handleOpen" @close="handleClose">
                <el-menu-item index="/index/homePage"><img class="nav-icon" src="../../assets/home.png">首页</el-menu-item>
                <el-menu-item v-if="rights[15]" index="/user/userList"><img class="nav-icon" src="../../assets/userlist.png">用户列表</el-menu-item>
                <!-- <el-menu-item index="/clockIn/attendancelog"><img class="nav-icon" src="../../assets/daka.png">考勤打卡</el-menu-item> -->
                <el-submenu index="2" v-if='rights[1] || rights[6]'>
                    <template slot="title"><img class="nav-icon" src="../../assets/role.png">管理员管理</template>
                    <el-menu-item v-if="rights[6]" index="/user/list">管理员列表</el-menu-item>
                    <el-menu-item v-if="rights[1]" index="/role/list">角色列表</el-menu-item>
                </el-submenu>
                <el-submenu index="3" v-if='rights[62] || rights[66] || rights[64] || rights[65]'>
                    <template slot="title"><img class="nav-icon" src="../../assets/goods.png">办公物品</template>
                    <el-menu-item v-if='rights[62]' index="/goods/list">物品库存</el-menu-item>
                    <el-menu-item v-if='rights[66]' index="/apply/list">物品申请</el-menu-item>
                    <el-menu-item v-if='rights[64]' index="/purchas/list">采购状态</el-menu-item>
                    <el-menu-item v-if='rights[65]' index="/purchas/log">采购记录</el-menu-item>
                </el-submenu>
                <el-submenu index="4" v-if='rights[24] || rights[27] || rights[30] || rights[32] ||  rights[87]'>
                    <template slot="title"><img class="nav-icon" src="../../assets/xzManage.png">行政管理</template>
                    <el-menu-item v-if='rights[24]' index="/xzManagement/leaveApply">请假申请</el-menu-item>
                    <el-menu-item v-if='rights[27]' index="/xzManagement/carApply">用车申请</el-menu-item>
                    <el-menu-item v-if='rights[30]' index="/xzManagement/goodsApply">物品申请记录</el-menu-item>
                    <el-menu-item v-if='rights[32]' index="/xzManagement/zzApply">转正申请</el-menu-item>
                    <el-menu-item v-if='rights[87]' index="/sign/list">人员签到</el-menu-item>
                </el-submenu>
                <el-submenu index="5" v-if='rights[38] || rights[41] || rights[44] || rights[47] ||  rights[129]'>
                    <template slot="title"><img class="nav-icon" src="../../assets/finance.png">财务管理</template>
                    <el-menu-item v-if='rights[38]' index="/financeManagement/baoxiaoApply">报销申请</el-menu-item>
                    <el-menu-item v-if='rights[41]' index="/financeManagement/contractApply">合同付款申请</el-menu-item>
                    <el-menu-item v-if='rights[44]' index="/financeManagement/skBaobei">收款报备 </el-menu-item>
                    <el-menu-item v-if='rights[47]' index="/financeManagement/financyApply">备用资金申请</el-menu-item>
                    <el-menu-item v-if='rights[129]' index="/wages/wagesMonth">工资管理</el-menu-item>
                </el-submenu>
                <el-submenu index="6" v-if="rights[57]">
                    <template slot="title"><img class="nav-icon" src="../../assets/month.png">月程表</template>
                    <el-menu-item index="/monthlySchedule/monthManagemnet">月程管理</el-menu-item>
                </el-submenu>
                <el-submenu index="7" v-if="rights[80] || rights[76] || rights[7] || rights[72] || rights[79]">
                    <template slot="title"><img class="nav-icon" src="../../assets/customer.png">客户管理</template>
                    <el-menu-item v-if="rights[80]" index="/customer/statistics">客户统计</el-menu-item>
                    <el-menu-item v-if="rights[76]" index="/customer/list">客户列表</el-menu-item>
                    <el-menu-item v-if="rights[7]" index="/customer/industry/list">行业管理</el-menu-item>
                    <el-menu-item v-if="rights[72]" index="/customer/type">客户分类</el-menu-item>
                    <el-menu-item v-if="rights[79]" index="/customer/tag">客户标签</el-menu-item>
                </el-submenu>
                <el-submenu index="8" v-if="rights[144]">
                    <template slot="title"><span class="nav-icon el-icon-menu"></span>项目管理</template>
                    <el-menu-item index="/project/list">项目列表</el-menu-item>
                </el-submenu>
                <el-submenu index="9" v-if="rights[92] || rights[93] || rights[94] || rights[95]">
                    <template slot="title"><img class="nav-icon" src="../../assets/plan.png">计划表</template>
                    <el-menu-item v-if="rights[92]" index="/plan/day">日目标</el-menu-item>
                    <el-menu-item v-if="rights[93]" index="/plan/week">周目标</el-menu-item>
                    <el-menu-item v-if="rights[94]" index="/plan/month">月目标</el-menu-item>
                    <el-menu-item v-if="rights[95]" index="/plan/year">年目标</el-menu-item>
                </el-submenu>
                <el-submenu index="10" v-if="rights[115] || rights[117]">
                    <template slot="title"><img class="nav-icon" src="../../assets/set.png">系统设置</template>
                    <el-menu-item v-if="rights[115]" index="/system/weixin">微信接口</el-menu-item>
                    <el-menu-item v-if="rights[117]" index="/system/message">短信接口</el-menu-item>
                </el-submenu>
            </el-menu>
        </el-col>
    </el-row>
  </div>
</template>

<script>
    export default {
        name: 'leftNav',
        data () {
            return {
                search: '',
                active_path: '',
                rights: {}
            }
        },
        beforeUpdate () {
            this.active_path = this.$route.fullPath;
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights)
            myFn.ajax('get', {}, apiAddress.rights.list, res => {
                console.log(res)
            })
        },
        methods: {
            handleOpen: function (key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose: function (key, keyPath) {
                console.log(key, keyPath);
            }
        }
    }
</script>

<style scoped>
    .leftNav{
        background: #fff;
    }
    .el-menu .el-input {
        width: 85%;
        margin: 10px 0 10px 20px;
    }
    .nav-icon {
        margin: 0 5px;
        width: 16px;
        vertical-align: middle;
        display: inline-block;
    }
</style>