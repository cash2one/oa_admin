// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App'
import router from './router'
// import axios from 'axios'

import './css/public_reset.css'
import './css/public_main.css'

import './js/zepto.js'
Vue.use(ElementUI)
// main JS
import {myFn} from './js/main.js'
import {apiAddress} from './js/apiAddress.js'
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/title';

window.myFn = myFn;
window.apiAddress = apiAddress;

Vue.config.productionTip = false

/* eslint-disable no-new */
window.vm = new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})

