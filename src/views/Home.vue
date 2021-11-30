<template>
    <el-container class="home-container">
        <el-header height="120px">
            <div>
                <img src="../assets/img/red_hat.png" alt="">
                <span>橙路后台管理系统</span>
            </div>
            <el-dropdown>
                <span class="el-dropdown-link">
                    <el-avatar shape="square" :size="100"> {{ username }} </el-avatar>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="personalCenter">个人中心</el-dropdown-item>
                    <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>
        <el-container>
            <el-aside width="200">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!--侧边菜单-->
                <el-menu
                    class="el-menu-vertical"
                    background-color="#C0C4CC"
                    text-color="#303133"
                    active-text-color="#409EFF"
                    :collapse="isCollapsed"
                    router>
                    <template v-for="menu in menuList">
                        <el-submenu :index="menu.path" :key="menu.id">
                            <template slot="title">
                                <i :class="menu.icon"></i>
                                <span slot="title">{{ menu.name }}</span>
                            </template>

                            <template v-for="item in menu.children">
                                <el-menu-item :index="item.path" :key="item.id">
                                    <i :class="item.icon"></i>
                                    <span slot="title">{{ item.name }}</span>
                                </el-menu-item>
                            </template>
                        </el-submenu>
                    </template>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import {getTokenUser} from '@/lib/util'
import {getMenuTreeByUsername} from "@/api/system";

export default {
    data() {
        return {
            username: "",
            menuList: [],
            isCollapsed: false
        }
    },
    created() {
        this.getUsername();
        this.getMenuList();
    },
    methods: {
        logout() {
            window.sessionStorage.clear();
            this.$router.push({name: "Login"});
        },
        personalCenter(){
            this.$router.push({name: "PersonalCenter"});
        },
        async getUsername(){
            this.username = await getTokenUser()
        },
        async getMenuList() {
            const res = await getMenuTreeByUsername()
            this.menuList = res.data
        },
        toggleCollapse() {
            this.isCollapsed = !this.isCollapsed;
        },
    }
}
</script>

<style lang="scss">
.el-header {
    background-color: lightskyblue;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;

    > div {
        display: flex;
        align-items: center;

        span {
            margin-left: 15px;
        }
    }
}

.el-aside {
    background-color: aquamarine;
}

.el-main {
    background-color: lemonchiffon;
}

.home-container {
    height: 100%;
}

.iconfont {
    margin-right: 10px;
}

.toggle-button {
    background-color: pink;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: .2em;
    cursor: pointer;
}

.el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}
</style>
