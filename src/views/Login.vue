<template>
    <el-card>
        <h1>ABCB</h1>
        <el-form>
            <el-form label-position="left" label-width="60px" :model="loginForm">
                <el-form-item label="用户名">
                    <el-input v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="loginForm.password" type="password"></el-input>
                </el-form-item>
                <p>没有账号？
                    <el-link type="primary" @click="goRegister">注册</el-link>
                </p>
                <el-button type="primary" @click="toLogin">登录</el-button>
            </el-form>
        </el-form>
    </el-card>
</template>

<script>
import {login} from '@/api/system'
import {setJwtToken} from '@/lib/util'

export default {
    name: "Login",
    data() {
        return {
            loginForm: {
                username: "",
                password: ""
            },

        }
    },
    methods: {
        goRegister() {

        },
        toLogin() {
            login(this.loginForm.username,
                this.loginForm.password
            ).then(res => {
                setJwtToken(res.data)
                this.$router.push({path: "/home"})
            }).catch(err => {
                console.log(err)
            });
        }
    }
}
</script>

<style scoped>
.el-card {
    background-color: ivory;
    width: 350px;
    text-align: center;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>