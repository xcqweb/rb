/***
 * api入口，引入其他功能模块，做导出
 */
import Vue from 'vue';
import axios from 'axios'
import { getToken } from '@/utils/auth'
import { logout } from '@/utils/auth'
// 创建 axios 实例
const instance = axios.create({
  timeout: 6000 // 请求超时时间
})
axios.defaults.baseURL = ''
const err = (error) => {
  if (error.response) {
    Vue.prototype.$message.destroy();
    const data = error.response.data
    if (data.status === 403) {
      Vue.prototype.$message.error(data.message);
    }
    if (data.status === 401) {
      logout();
    } else { // 404 No message available
      Vue.prototype.$message.error(data.msg || data.message || '服务端异常，请联系技术支持')
    }
  }
  return Promise.reject(error)
}

instance.interceptors.request.use(config => {
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
        Vue.prototype.$message.destroy();
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
