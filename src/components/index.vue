<template>
    <div class="index">
        <router-view name="topNav"></router-view>
        <div class="main">
            <div class="contentBg"></div>
            <router-view name="leftNav" class="leftNav"></router-view>
            <router-view class="content"></router-view>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'index',
        data () {
            return {
                msg: 'Welcome to Your Vue.js App'
            }
        }
    }
</script>
<style scoped>
    .index {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
    }
    .main {
        min-height: 100%;
        padding-top: 70px;
        box-sizing: border-box;
        position: relative;
    }
    .main .leftNav {
        width: 200px;
        background: #fff;
        position: absolute;
        top: 0;
        bottom: 0px;
    }

    .main .content {
        background: #fff;
        padding: 10px 30px 30px;
        margin-left: 210px;
        margin-right: 10px;
        overflow: hidden;
    }
    .contentBg {
        background: #fff;
        position: absolute;
        top: 70px;
        bottom: 0px;
        left: 210px;
        right: 10px;
        z-index: -1;
    }
</style>
