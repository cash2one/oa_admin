import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import index from '@/components/index'

import topNav from '@/components/nav/top'
import leftNav from '@/components/nav/left'

// 首页
import HomePage from '@/components/homePage/homePage'
import Pending from '@/components/homePage/pending'
import NoticeEdit from '@/components/homePage/noticeEdit'
import NoticeList from '@/components/homePage/noticeList'
import Message from '@/components/homePage/message'
import MessageEdit from '@/components/homePage/messageEdit'

// 用户列表
import UserList from '@/components/user/userList'

// 角色管理
import roleList from '@/components/role/list'
import roleAdd from '@/components/role/add'
import userList from '@/components/role/userList'
import userAdd from '@/components/role/userAdd'

// 办公物品
import goodsList from '@/components/officeGoods/goods_list'
import goodsAdd from '@/components/officeGoods/goods_add'
import applyList from '@/components/officeGoods/apply_list'
import purchasList from '@/components/officeGoods/purchas_list'
import purchasLog from '@/components/officeGoods/purchas_log'

// 行政管理
import leaveApply from '@/components/xzManagement/leaveApply'
import carApply from '@/components/xzManagement/carApply'
import goodsApply from '@/components/xzManagement/goodsApply'
import zzApply from '@/components/xzManagement/zzApply'

// 财务管理
import baoxiaoApply from '@/components/financeManagement/baoxiaoApply'
import contractApply from '@/components/financeManagement/contractApply'
import skBaobei from '@/components/financeManagement/skBaobei'
import financyApply from '@/components/financeManagement/financyApply'
import wagesMonth from '@/components/wages/wages_month'
import wagesMonthDetails from '@/components/wages/wages_month_details'
import wagesAddProject from '@/components/wages/wages_add_project'
import wagesPersonalDetails from '@/components/wages/wages_personal_details'

// 月程表
import month from '@/components/monthlySchedule/monthManagemnet'

// 部门管理
import departmentList from '@/components/departmentManagement/departmentList'
import departmentManagement from '@/components/departmentManagement/departmentManagement'

// 客户管理
import customerStatistics from '@/components/customer/customer_statistics'
import customerList from '@/components/customer/customer_list'
import customerFllow from '@/components/customer/customer_follow'
import industryList from '@/components/customer/industry_list'
import industryAddOrEdit from '@/components/customer/industry_add_or_edit'
import industryListItem from '@/components/customer/industry_list_item'
import industryListItemEdit from '@/components/customer/industry_list_item_edit'
import customerType from '@/components/customer/customer_type'
import customerTypeAddOrEdit from '@/components/customer/customer_type_add_or_edit'
import customerTag from '@/components/customer/customer_tag'
import customerTagDetails from '@/components/customer/customer_tagDetails'

// 项目管理
import projectList from '@/components/project/list'
import addProject from '@/components/project/addProject'
import workTime from '@/components/project/workTime'
import source from '@/components/project/source'
import addSource from '@/components/project/addSource'
import workDetail from '@/components/project/workDetail'
import progress from '@/components/project/progress'

// 计划表
import dayPlan from '@/components/plan/dayPlan'
import weekPlan from '@/components/plan/weekPlan'
import monthPlan from '@/components/plan/monthPlan'
import yearPlan from '@/components/plan/yearPlan'

// 考勤打卡
import attendancelog from '@/components/clockIn/attendancelog'
// 签到
import signlist from '@/components/sign/list'

// 部门考核
import assessmentStage from '@/components/departmentManagement/assessment_stage'
import assessmentMemberList from '@/components/departmentManagement/assessment_member_list'
import assessmentContentAdd from '@/components/departmentManagement/assessment_content_add'

// 系统设置
import weixin from '@/components/system/weixin'
import message from '@/components/system/message'
Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'login',
            component: login
        },
        {
            path: '*',
            redirect: '/index/home'
        },
        {
            path: '/index',
            name: 'index',
            component: index,
            redirect: '/index/homePage',
            children: [
                {
                    path: '/index/homePage',
                    name: 'homePage',
                    components: {
                        default: HomePage,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/index/homePage/noticeEdit/:id',
                    name: 'noticeEdit',
                    components: {
                        default: NoticeEdit,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/index/homePage/pending',
                    name: 'pending',
                    components: {
                        default: Pending,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/index/homePage/noticeList',
                    name: 'noticeList',
                    components: {
                        default: NoticeList,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/index/homePage/message',
                    name: 'message',
                    components: {
                        default: Message,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/index/homePage/messageEdit',
                    name: 'messageEdit',
                    components: {
                        default: MessageEdit,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/user/userList',
                    name: 'UserList',
                    components: {
                        default: UserList,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/user/userAdd/:id',
                    name: 'userAdd',
                    components: {
                        default: userAdd,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/role/list',
                    name: 'roleList',
                    components: {
                        default: roleList,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/role/add/:id',
                    name: 'roleAdd',
                    components: {
                        default: roleAdd,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/user/list',
                    name: 'userList',
                    components: {
                        default: userList,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/goods/list',
                    name: 'goodsList',
                    components: {
                        default: goodsList,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/goods/add',
                    name: 'goodsAdd',
                    components: {
                        default: goodsAdd,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/apply/list',
                    name: 'applyList',
                    components: {
                        default: applyList,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/purchas/list',
                    name: 'purchasList',
                    components: {
                        default: purchasList,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/purchas/log',
                    name: 'purchasLog',
                    components: {
                        default: purchasLog,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                // 行政管理
                {
                    path: '/xzManagement/leaveApply',
                    name: 'leaveApply',
                    components: {
                        default: leaveApply,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/xzManagement/carApply',
                    name: 'carApply',
                    components: {
                        default: carApply,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/xzManagement/goodsApply',
                    name: 'goodsApply',
                    components: {
                        default: goodsApply,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/xzManagement/zzApply',
                    name: 'zzApply',
                    components: {
                        default: zzApply,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                // 财务管理
                {
                    path: '/financeManagement/baoxiaoApply',
                    name: 'baoxiaoApply',
                    components: {
                        default: baoxiaoApply,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/financeManagement/contractApply',
                    name: 'contractApply',
                    components: {
                        default: contractApply,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/financeManagement/skBaobei',
                    name: 'skBaobei',
                    components: {
                        default: skBaobei,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/financeManagement/financyApply',
                    name: 'financyApply',
                    components: {
                        default: financyApply,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/wages/wagesMonth',
                    name: 'wagesMonth',
                    components: {
                        default: wagesMonth,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/wages/wagesMonth/details/:id',
                    name: 'wagesMonthDetails',
                    components: {
                        default: wagesMonthDetails,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/wages/wagesMonth/AddProject',
                    name: 'wagesAddProject',
                    components: {
                        default: wagesAddProject,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/wages/PersonalDetails/:month/:id',
                    name: 'wagesPersonalDetails',
                    components: {
                        default: wagesPersonalDetails,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                // 月程管理
                {
                    path: '/monthlySchedule/monthManagemnet',
                    name: 'monthManagemnet',
                    components: {
                        default: month,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                // 行政管理
                {
                    path: '/department/departmentList/:id',
                    name: 'departmentList',
                    components: {
                        default: departmentList,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/department/departmentManagement',
                    name: 'departmentManagement',
                    components: {
                        default: departmentManagement,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                // 客户管理
                {
                    path: '/customer/statistics',
                    name: 'customerStatistics',
                    components: {
                        default: customerStatistics,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/customer/list',
                    name: 'customerList',
                    components: {
                        default: customerList,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/customer/fllow/:id',
                    name: 'customerFllow',
                    components: {
                        default: customerFllow,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/customer/industry/list',
                    name: 'industryList',
                    components: {
                        default: industryList,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/customer/industry/AddOrEdit/:id',
                    name: 'industryAddOrEdit',
                    components: {
                        default: industryAddOrEdit,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/customer/industry/list/item/:id',
                    name: 'industryListItem',
                    components: {
                        default: industryListItem,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/customer/industry/list/item/edit/:id/:pid',
                    name: 'industryListItemEdit',
                    components: {
                        default: industryListItemEdit,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/customer/type',
                    name: 'customerType',
                    components: {
                        default: customerType,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/customer/type/AddOrEdit/:id',
                    name: 'customerTypeAddOrEdit',
                    components: {
                        default: customerTypeAddOrEdit,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/customer/tag',
                    name: 'customerTag',
                    components: {
                        default: customerTag,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/customer/tag/details/:id',
                    name: 'customerTagDetails',
                    components: {
                        default: customerTagDetails,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/project/list',
                    name: 'projectList',
                    components: {
                        default: projectList,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/project/add',
                    name: 'addProject',
                    components: {
                        default: addProject,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/project/workTime/:id',
                    name: 'workTime',
                    components: {
                        default: workTime,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/project/source/:id',
                    name: 'source',
                    components: {
                        default: source,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/project/addSource/:id',
                    name: 'addSource',
                    components: {
                        default: addSource,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/project/workDetail/:uid/:project_id',
                    name: 'workDetail',
                    components: {
                        default: workDetail,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/project/progress/:id',
                    name: 'progress',
                    components: {
                        default: progress,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/plan/day',
                    name: 'dayPlan',
                    components: {
                        default: dayPlan,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/plan/week',
                    name: 'weekPlan',
                    components: {
                        default: weekPlan,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/plan/month',
                    name: 'monthPlan',
                    components: {
                        default: monthPlan,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/plan/year',
                    name: 'yearPlan',
                    components: {
                        default: yearPlan,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/clockIn/attendancelog',
                    name: 'attendancelog',
                    components: {
                        default: attendancelog,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/sign/list',
                    name: 'signlist',
                    components: {
                        default: signlist,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/assessment/stage/:id',
                    name: 'assessmentStage',
                    components: {
                        default: assessmentStage,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/assessment/member/list/:id/:qID',
                    name: 'assessmentMemberList',
                    components: {
                        default: assessmentMemberList,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/assessment/content/add/:id',
                    name: 'assessmentContentAdd',
                    components: {
                        default: assessmentContentAdd,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/system/weixin',
                    name: 'weixin',
                    components: {
                        default: weixin,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                },
                {
                    path: '/system/message',
                    name: 'message',
                    components: {
                        default: message,
                        topNav: topNav,
                        leftNav: leftNav
                    }
                }
            ]
        }
    ]
})
