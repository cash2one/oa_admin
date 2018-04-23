<template>
    <div class="customerStatistics">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item >客户管理</el-breadcrumb-item>
            <el-breadcrumb-item >客户统计</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="myEcharts">
            <div class="search">
                <div class="block">
                    <span class="demonstration">客户量</span>
                    <el-date-picker v-model="timeVal" type="month" placeholder="选择月" width="200"></el-date-picker>
                    <el-select class="industryListSelect" v-model="industryListSelect" placeholder="行业筛选">
                        <el-option-group v-for="group in industryList" :key="group.id" :label="group.name">
                            <el-option v-for="item in group.list" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-option-group>
                  </el-select>
                </div>
            </div>
            <div class='peopleNum'>
                <span>总客户{{client.all_client}}人</span>
                <span>新增加{{client.select_add}}人</span>
                <span>流失{{client.select_del}}人</span>
            </div>
            <div class="echarts">
                <IEcharts :option="bar" :loading="loading" @ready="getData" @click="onClick"></IEcharts>
            </div>
        </div>
    </div>
</template>
<script>
    import IEcharts from 'vue-echarts-v3/src/full.js';
    export default {
        name: 'customerStatistics',
        props: {},
        data: () => ({
            timeVal: new Date(),
            industryListSelect: '',
            industryList: [],
            client: {
                all_client: 0,
                select_del: 0,
                select_add: 0
            },
            loading: false,
            bar: {
                tooltip: {},
                xAxis: {
                    data: ['一周', '二周', '三周', '四周']
                },
                yAxis: {},
                series: [{
                    name: '总客户',
                    type: 'line',
                    data: []
                }]
            },
            rights: {}
        }),
        watch: {
            industryListSelect: function (newVal, oldVal) {
                this.getData();
            },
            timeVal: function (newVal, oldVal) {
                this.getData();
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights);
            this.getData();
            if (this.rights[7]) {
                this.get_industryList();
            }
        },
        methods: {
            getData () {
                var data = {
                    month: this.timeVal.toLocaleDateString(),
                    trade_id: this.industryListSelect
                }
                myFn.ajax('get', data, apiAddress.customer.customerStatistics, (res) => {
                    this.client.all_client = res.data.all_client;
                    this.client.select_del = res.data.select_del;
                    this.client.select_add = res.data.select_add;
                    var setData = [res.data.seven, res.data.fourteen, res.data.fourteen, res.data.twentyEight]
                    this.bar.series[0].data = setData;
                });
            },
            onReady (instance) {
                console.log(instance);
            },
            onClick (event, instance, echarts) {
                console.log(arguments);
            },
            get_industryList () {
                myFn.ajax('get', {}, apiAddress.customer.industryList, (res) => {
                    this.industryList = res.data;
                });
            }
        },
        components: {
            IEcharts
        }
    };
</script>

<style scoped>
    .search {
        margin-top: 20px;
        padding-left: 20px;
    }
    .demonstration {
        margin-right: 15px;
    }
    .echarts {
        width: 700px;
        height: 500px;
    }
    .myEcharts {
        margin-top: 20px;
        border: 1px #ccc solid;
        display: inline-block;
    }
    .industryListSelect {
        float: right;
        margin-right: 30px;
        width: 150px;
    }
    .peopleNum {
        margin-left: 20px;
        margin-top: 30px;
    }
    .peopleNum span {
        margin-right: 30px;
        letter-spacing: 1px;
    }
</style>