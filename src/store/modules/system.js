import {getAllSysConfig,refreshSysConfig} from '@/api/system'

const state = {
    sysConfig:[]
}
const actions = {
    loadSysConfig({state}){
        return new Promise((resolve,reject) => {
            //没加载过才加载，已经加载过就不加载了
            //也就说只有登录，或者页面刷新时才重新加载全局配置
            if(state.sysConfig.length <= 0){
                getAllSysConfig().then(res => {
                    state.sysConfig = res.data
                })
            }
            resolve();
        })
    },
    refreshConfig({state}){
        return new Promise((resolve,reject) => {
            refreshSysConfig().then(res => {
                state.sysConfig = res.data
                resolve();
            });
        })
    }
}
const mutations = {

}
const getters = {
    getSysConfigItem: (state) => (paramKey) => {
        return state.sysConfig
            .find(item => item.paramKey === paramKey)
            .paramValue
    }
}

export default {
    state,actions,mutations,getters
}