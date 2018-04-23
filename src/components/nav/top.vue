<template>
	<div class="topNav">
        <div class="topNav-logo">
            <img src="../../assets/logo.png" />
        </div>
        <div class="label" v-if="rights[87]" @click="router('/sign/list')">签到</div>
        <div class="label" v-if="rights[22]" @click="router('/department/departmentManagement')">部门管理</div>
        <a @click="signOut" class="signOut">安全退出</a>
    </div>
</template>
<script>
export default {
    name: 'topNav',
    data () {
        return {
            msg: '',
            rights: {}
        }
    },
    mounted () {
        this.rights = JSON.parse(localStorage.rights);
    },
    methods: {
        signOut: function () {
            myFn.ajax('get', {}, apiAddress.login.signOut, (res) => {
                this.$router.push({name: 'login'});
            });
        },
        router (path) {
            this.$router.push({path: path})
        }
    }
}
</script>

<style scoped>
    .topNav {
        width: 100%;
        height: 60px;
        background: #fff;
        position: absolute;
        z-index: 1;
    }
    .topNav-logo {
        width: 200px;
        height: 100%;
        text-align: center;
        display: inline-block;
        vertical-align: middle;
    }
    .topNav-logo img {
        max-width: 100%;
        max-height: 100%;
    }
    .label {
        display: inline-block;
        margin: 0 20px;
        vertical-align: middle;
        cursor: pointer;
    }
    .signOut {
        float: right;
        color: #fff;
        cursor: pointer;
        line-height: 60px;
        margin-right: 30px;
        font-size: 14px;
        color: #666666;
    }
</style>
