import Vue from 'vue'
import App from './App.vue'
import Poros from 'poros'
import PorosUI from 'poros/ui'
import 'poros/ui/style'
import router from './router'
import store from './store'
import system from './config/system'
import './utils/http'
import SvgIcon from '@/components/svg-icon'
import '@/components'
import '@/assets/less/index.less'
import "@/assets/iconfont/iconfont.css";
import "@/assets/font/index.css";
import '@/utils/prototype'
import '@/directives'
import reg from '@/utils/pattern'

//多页签退出登录同步
(function() {
  window.addEventListener('storage', function(event) {
    const isDev = process.env.NODE_ENV === 'development'
    if (event.key === 'loginOut') {
      if(isDev) {
        router.replace('/login')
      } else {
        window.location.reload()
      }
    }else if (event.key === 'login') {
      if(isDev) {
        router.replace('/')
      } else {
        window.location.reload()
      }
    }
  });
})();

/*** 判断mac系统(含iphone手机) ***/
const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
const bodyEle = document.querySelector('body')
bodyEle.style.fontFamily = isMac ? 'inherit' : 'ruban'
Vue.config.productionTip = false
// 开发环境 允许使用 Vue开发者工具
if (process.env.NODE_ENV === 'development') {
  Vue.config.devtools = true
}
Vue.use(SvgIcon)
Vue.use(Poros, {
  system,
  store
})
Vue.use(PorosUI)
Vue.mixin({
  data() {
    return{
      reg,
      system
    }
  }
})
console.table({'版本号': VERSION,'版本时间': BUILD_TIME})
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
