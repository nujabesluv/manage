import Vue from 'vue'
import VueRouter from 'vue-router'
import {refreshToken} from '@/api/system'
import {setJwtToken} from '@/lib/util'
import store from '@/store/index'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Login',
        component: () => import('../views/Login')
    },
    {
        path: '/home',
        component: () => import('../views/Home'),
        redirect: '/welcome',
        children:[
            {
                path: '/welcome',
                name: 'Welcome',
                component: () => import('../views/Welcome')
            },
            {
                path: 'sysUser',
                name: 'SysUser',
                component: () => import('../views/SysUser')
            },
            {
                path: 'sysRole',
                name: 'SysRole',
                component: () => import('../views/SysRole')
            },
            {
                path: 'personalCenter',
                name: 'PersonalCenter',
                component: () => import('../views/PersonalCenter')
            },
            {
                path: 'sysOrg',
                name: 'SysOrg',
                component: () => import('../views/SysOrg')
            },
            {
                path: 'sysMenu',
                name: 'SysMenu',
                component: () => import('../views/SysMenu')
            },
            {
                path: 'sysApi',
                name: 'SysApi',
                component: () => import('../views/SysApi')
            },
            {
                path: 'sysConfig',
                name: 'SysConfig',
                component: () => import('../views/SysConfig')
            },
        ]
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to,from,next) => {
    if(to.name !== 'Login'){
        refreshToken().then(res => {
            //没有获得新的token==null，
            // 表示旧的token已经失效，需要重新登录
            if(res.data == null){
                next({name: 'Login'}) //去登录界面
                setJwtToken('') //清空token
            }else{//否则去你想去的界面，并把新的token保存起来
                //把全局配置加载完成再去你想去的页面
                store.dispatch('loadSysConfig').then(_ => {
                    next()
                })
                setJwtToken(res.data)
            }
        })
    }else{//每次去到登录页面都刷新一下，清除token
        next()
        setJwtToken('') //清空token
    }
})

export default router
