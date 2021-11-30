import axios from 'axios'
import {getJwtToken} from "@/lib/util";

class HttpRequest {
    //构造函数
    constructor (baseUrl) {
        this.baseUrl = baseUrl
    }
    //针对axios实例的默认配置
    initConfig () {
        const config = {
            baseURL: this.baseUrl,
            headers: {
                //
            }
        }
        return config
    }
    //创建并返回axios实例，options参数为创建实例时传递的个性化参数
    request (options) {
        const instance = axios.create()

        instance.interceptors.response.use(
            response => {

                const res = response.data
                if (!res.flag){
                    throw res
                }else {
                    return res
                }
            },
            // 这里处理异常响应结果
            // error.response = 后端的AjaxResponse
            error => {
                if (error && error.response) {
                    switch (error.response.status) {
                        case 400:
                            error.message = error.response.data.message;
                            break;
                        case 401:
                            error.message = '未授权，请重新登录';
                            break;
                        case 403:
                            error.message = '访问权限不足，拒绝访问！';
                            break;
                        case 404:
                            error.message = '请求错误,未找到该资源';
                            break;
                        case 405:
                            error.message = '请求方法未允许';
                            break;
                        case 408:
                            error.message = '请求超时';
                            break;
                        case 500:
                            error.message = error.response.data.message;
                            break;
                        case 501:
                            error.message = '网络未实现';
                            break;
                        case 502:
                            error.message = '网络错误';
                            break;
                        case 503:
                            error.message = '服务不可用';
                            break;
                        case 504:
                            error.message = '网络超时';
                            break;
                        case 505:
                            error.message = 'http版本不支持该请求';
                            break;
                        default:
                            error.message = `未知错误${error.response.data.message}`;
                    }
                } else {
                    error.message = "连接到服务器失败";
                }
                this.$message.error(error.message);
                return Promise.reject(error);
            }
        )

        // request拦截器
        instance.interceptors.request.use(
            config => {
                //认证请求不需要携带令牌
                if (config.url !== "/authenticate") {
                    // 让每个请求携带token
                    config.headers['JWTHeaderName'] = getJwtToken();
                }
                return config;
            }
        )

        //将默认配置与个性化配置整合。
        //如果二者发生冲突，个性化配置options，覆盖初始化默认配置initConfig()
        options = Object.assign(this.initConfig(), options)
        //在这里可以为axios实例instance设置拦截器
        return instance(options)
    }
}
export default HttpRequest