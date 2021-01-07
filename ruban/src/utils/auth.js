import Cookie from 'js-cookie'
import {clearCacheLocation,clearSessLocal} from './util'
import router from '@/router'
const HOST_NAME = window.location.hostname;
// 获取有效期：一个自然月
const getExpires = () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

let { COOKIE_TOKEN_KEY, COOKIE_TOKENTYPE_KEY } = window._env_ || {}
COOKIE_TOKEN_KEY = COOKIE_TOKEN_KEY || 'access_token'
COOKIE_TOKENTYPE_KEY = COOKIE_TOKENTYPE_KEY || 'token_type'

export function getToken () {
  const tokenType = Cookie.get(COOKIE_TOKENTYPE_KEY, { domain: HOST_NAME })
  const accessToken = Cookie.get(COOKIE_TOKEN_KEY, { domain: HOST_NAME })
  return accessToken ? tokenType + ' ' + accessToken : ''
}
export function getTokenNew () {
  return Cookie.get(COOKIE_TOKEN_KEY, { domain: HOST_NAME })
}

export function getAccessToken () {
  return Cookie.get(COOKIE_TOKEN_KEY, { domain: HOST_NAME })
}

// token和token类型存入cookie
export function setToken (accessToken, tokenType) {
  const expires = getExpires()
  Cookie.set(COOKIE_TOKEN_KEY, accessToken, { expires, domain: HOST_NAME })
  Cookie.set(COOKIE_TOKENTYPE_KEY, tokenType, { expires, domain: HOST_NAME })
}

export function removeToken () {
  Cookie.remove(COOKIE_TOKEN_KEY, { domain: HOST_NAME })
  Cookie.remove(COOKIE_TOKENTYPE_KEY, { domain: HOST_NAME })
}

// 清除所有 cookie
/* const clearAllCookie = () => {
    let keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (let i = 0,l = keys.length; i < l; i++){
          document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString();//清除当前域名下的,例如：m.kevis.com
          document.cookie = keys[i] + '=0;path=/;domain=' + window.location.hostname + ';expires=' + new Date(0).toUTCString();//清除当前域名下的，例如 .m.kevis.com
          document.cookie = keys[i] + '=0;path=/;domain=nip.io;expires=' + new Date(0).toUTCString();//清除一级域名下的或指定的，例如 .kevis.com
          document.cookie = keys[i] + '=0;path=/;domain=xip.io;expires=' + new Date(0).toUTCString();//清除一级域名下的或指定的，例如 .kevis.com
        }
    }
} */
/**
 * 登录退出
 */
export const logout = (url='/login') => {
  removeToken()
  clearCacheLocation()
  router.replace(url).then(()=>{
    resetRouter()
    clearSessLocal(true,true)
    localStorage.setItem('loginOut', +new Date())
  })
};