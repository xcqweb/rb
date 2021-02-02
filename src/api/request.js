/***
 * api入口，引入其他功能模块，做导出
 */
import Vue from 'vue';
import axios from 'axios'
import { getToken } from '@/utils/auth'
import { logout } from '@/utils/auth'
import store from '../store'
// 创建 axios 实例
const instance = axios.create({
  timeout: 6000 // 请求超时时间
})
axios.defaults.baseURL = ''
const err = (error) => {
  if (error.response) {
    const data = error.response.data
    if (data.status === 403) {
      Vue.prototype.$message.error(data.message);
    }
    if (data.status === 401) {
      logout();
    } else {
      Vue.prototype.$message.error(data.msg || data.message || '服务端异常，请联系技术支持')
    }
  }
  return Promise.reject(error)
}
const CancelToken = axios.CancelToken
instance.interceptors.request.use(config => {
  //get请求统一加上时间戳 解决ie缓存问题
  if (config.method === 'get') {
    if (config.params) {
        if (!config.params.t) {
          config.params.t = +new Date();
        }
    }else{
      config.params  = { t: +new Date() };
    }
  }
  config.cancelToken = new CancelToken((cancel)=>{//此处设置，便于在切换路由时候，请求还未完成，就取消请求
    store.commit('pushToken', {
        cancelToken: cancel,
        config,
    });
  });
  const token = getToken()
  if (token) {
    config.headers['Authorization'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

/*
* 406 登录接口 多租户
*/
instance.interceptors.response.use((response) => {
  const data = response.data || {};
  const code = (data.code || data.code === 0) ? data.code : 9999;
  // data['app-id'] 获取版本id
  if (code !== 0 && code !== 406 && !data['app-id']) {
    switch (code) {
      case 401:
        logout()
        break;
      default:
        Vue.prototype.$message.error(data.msg || '服务端异常，请联系技术支持')
    }
  }
  if (data.code === 0 || data.code === 406) {
    return data
  }else{
    return Promise.reject();
  }
}, err)
export default instance;
