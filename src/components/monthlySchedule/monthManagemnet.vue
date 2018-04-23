<template>
    <div class="monthManagemnet">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/monthlySchedule/monthManagemnet' }">行政管理</el-breadcrumb-item>
            <el-breadcrumb-item >月程表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
            <el-col>
                <full-calendar :events="fcEvents" lang="zh" @dayClick="dayClick" @eventClick="eventClick" @changeMonth="changeMonth">
                    <slot></slot>
                </full-calendar>
            </el-col>
        </el-row>
        <!-- dialog弹出层 -->
        <el-dialog :visible.sync="dialogVisible" align="center" size="tiny" :title="isEdit?'修改事件':'添加事件'" >
            <div class="dialogContent">
                <el-form ref="form" :model="click_details" label-width="80px">
                    <div class="tips" v-if="isEdit" v-html="'当前修改 '+click_details.start+' 的事件'"></div>
                    <div class="tips" v-if="!isEdit" v-html="'当前添加 '+today+' 的事件'"></div>
                    <el-form-item label="时间">
                        <template>
                            <el-time-select placeholder="起始时间" v-model="click_details.start_time"
                                :picker-options="{
                                    start: '08:30',
                                    step: '00:15',
                                    end: '18:30'
                                }">
                            </el-time-select>
                            <el-time-select placeholder="结束时间" v-model="click_details.end_time"
                                :picker-options="{
                                    start: '08:30',
                                    step: '00:15',
                                    end: '18:30',
                                }">
                            </el-time-select>
                        </template>
                    </el-form-item>
                    <el-form-item label="事件">
                        <el-input v-model="click_details.title"></el-input>
                    </el-form-item>
                    <div class="tips">
                        <span>已添加</span>
                        <span style="display:inline-block;margin-left:15px;" v-if="!eventslist.length">暂无数据</span>
                    </div>
                    <div class="events-group">
                        <div class="tips event-wrapper" v-for="(item,index) in eventslist">
                            <div>
                                <el-tooltip class="item" effect="dark" content="点击删除该事件" placement="right">
                                    <span class="el-icon-delete2" v-if="rights[59]" @click="eventsDel(index,item.id)"></span>
                                </el-tooltip>
                            </div>
                            &nbsp;
                            <div class="event-time" v-html="item.start_time"></div>
                            <div class="event-time">--</div>
                            <div class="event-time" v-html="item.end_time"></div>
                            <div class="event-title" v-html="item.title"></div>
                        </div>
                    </div>
                </el-form>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button  v-if="isEdit && rights[58]" @click="eventsEdit(click_details.id)">确定</el-button>
                <el-button  v-if="!isEdit && rights[58]" @click="eventsAdd()">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import fullCalendar from 'vue-fullcalendar'
    
    export default {
        name: 'monthManagemnet',
        data () {
            return {
                dialogVisible: false,
                fcEvents: [],
                isEdit: true,
                click_details: {
                    id: '',
                    title: '',
                    start: '',
                    start_time: '',
                    end_time: ''
                },
                // 当天事件列表
                eventslist: [],
                // 当天添加事件
                addData: {},
                today: '',
                rights: {}
            }
        },
        mounted () {
            this.rights = JSON.parse(localStorage.rights)
        },
        methods: {
            getData: function (month) {
                myFn.ajax('get', {month: month}, apiAddress.calendar.calendar, (res) => {
                    this.fcEvents = this.fcEvents.concat(res.data);
                })
            },
            changeMonth: function (start, end, current) {
                this.fcEvents = [];
                this.getData(current);
            },
            dayClick: function (day) {
                var handleDay = '';
                this.dialogVisible = true;
                this.isEdit = false;
                handleDay = myFn.getTime(day);
                this.today = handleDay;
                // 清空数据
                this.click_details = {};
                if (!this.rights[60]) return;
                myFn.ajax('get', {day: handleDay}, apiAddress.calendar.dayEventList, (res) => {
                    this.eventslist = res.data;
                })
            },
            // 添加事件
            eventsAdd: function () {
                var data = {
                    start: this.today,
                    title: this.click_details.title,
                    start_time: this.click_details.start_time,
                    end_time: this.click_details.end_time,
                    day: this.today
                }
                myFn.ajax('post', data, apiAddress.calendar.eventAdd, (res) => {
                    alert('添加成功');
                    data.id = res.data.id;
                    this.fcEvents.push(data);
                    data = {};
                    this.dialogVisible = false;
                })
            },
            eventClick: function (event) {
                this.dialogVisible = true;
                this.isEdit = true;
                this.click_details = event;
                myFn.ajax('get', {day: event.start}, apiAddress.calendar.dayEventList, (res) => {
                    this.eventslist = res.data;
                })
            },
            eventsEdit: function (id) {
                myFn.ajax('post', this.click_details, apiAddress.calendar.eventAdd, (res) => {
                    alert('修改成功');
                    this.dialogVisible = false;
                })
            },
            eventsDel: function (index, id) {
                myFn.ajax('get', {id: id}, apiAddress.calendar.eventDel, (res) => {
                    for (var i = 0; i < this.fcEvents.length; i++) {
                        if (this.fcEvents[i].id === id) {
                            this.fcEvents.splice(i, 1);
                        };
                    };
                    this.eventslist.splice(index, 1);
                })
            }
        },
        components: {
            fullCalendar
        }
    }
</script>

<style>
    .day-number{
        text-align: left;
    }
    .el-date-editor.el-input {
        width: 49%;
    }
</style>

<style scoped>
    .comp-full-calendar{
        max-width: 85%;
    }
    .fc-body{
        position: relative;
        display: inline-block;
    }
    .tips {
        padding-bottom: 20px;
        text-align: left;
    }
    .events-group .event-wrapper {
        padding-bottom: 10px;
    }
    .events-group .event-wrapper > div {
        display: inline-block;
    }
    .event-title {
        margin-left: 10px;
    }
</style>