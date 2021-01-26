import Vue from 'vue'
import VueRouter from 'vue-router'
import nprogress from 'nprogress' // progress bar
import { auth } from 'poros/utils'
import store from '../store'
import Home from '@/layouts/Home.vue'
import system from '../config/system'
import { firstUpperCase, getViewComponent, getLayoutComponent, isIframeOpen } from '@/utils'
import defaultRoutes from '@/router/defaultRoutes'
// 解决 router.push 相同路由时报错问题
const originRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function () {
  return originRouterPush.call(this, ...arguments).catch(() => {})
}

const { getToken } = auth

nprogress.configure({ showSpinner: false }) // nprogress Configuration

Vue.use(VueRouter)
const Unauthorized = () => import(/* webpackChunkName: "unauthorized" */ '@/layouts/Unauthorized.vue')
const defaultRoute = [{
  path: '/',
  name: 'home',
  component: Home,
  children: [
    ...defaultRoutes
  ]
}];
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      {
        path: '',
        name: 'overview',
        component: () => import(/* webpackChunkName: "overview" */ '@/views/overview')
      },
    ]
  },
  {
    path: '/',
    component: Unauthorized,
    children: [
      {
        path: 'login',
        name: 'Login',
        meta: { auth: false },
        component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
      }
    ]
  },
  {
    path: '/404',
    name: '404',
    meta: { auth: false },
    component: () => import(/* webpackChunkName: "404" */ '@/views/404.vue')
  }
]

const isDev = process.env.NODE_ENV === 'development'


const router = new VueRouter({
  mode: 'history',
  base: isDev ? '/' : system.baseUrl,
  routes
})

router.beforeEach(async function(to, from, next) {
  store.commit('clearToken')
  nprogress.start()
  if(to.meta.hasOwnProperty('auth') && !to.meta.auth) {
    next()
    return false
  }
  if(getToken()) {
    if(!store.state.poros.menus) {
      await store.dispatch('requestMenus')
      router.addRoutes([
        ...createRouteByMenus(),
        ...defaultRoute,
        { path: '*', redirect: '/404' }
      ])
      next({ ...to, replace: true })
    } else {
      next()
    }
  } else {
    if(isDev) next('/login')
    else location.href = `/auth/login?fromUrl=${location.href}`
  }
})

router.afterEach(() => {
  nprogress.done()
})

/** 根据url获取组件名称 */
function getComponentName(url) {
  return typeof url === 'string' ? url.split('/').map(firstUpperCase).join('') : ''
}

// iframe组件
const IframePage = () => import('@/views/iframePage')

/** 根据menus创建动态路由 */
export function createRouteByMenus() {
  const newRoutes = []
  store.state.poros.menus = store.state.poros.menus.filter( item => !item.hidden)
  let { menus } = store.state.poros
  if(!Array.isArray(menus) || menus.length === 0) {
    return newRoutes
  }
  const routesMap = new Map()
  let queues = [].concat(menus), item = null
  while(item = queues.shift()) {
    if(item.children && item.children.length) {
      queues = queues.concat(item.children)
    }
    if(item.url && (item.target === 'render' || item.target === 'iframe')) {
      let component = null
      const newRoute = {
        path: item.url,
        meta: {
          title: item.name,
          auth: true,
          keepAlive: item.keepAlive,
          newTabOpen: item.newTabOpen,
          componentName: ''
        }
      }
      if(item.target === 'render') {
        newRoute.name = getComponentName(item.url)
        component = getViewComponent(item.componentPath)
      } else {
        newRoute.path = `/iframe/${item.id}`
        newRoute.meta.url = item.url
        component = IframePage
      }
      newRoute.component = component
      newRoute.meta.componentName = component.name
      if(isIframeOpen) {
        newRoutes.push(newRoute)
      } else {
        const layout = component.layout || 'Home'
        if(routesMap.get(layout)) {
          routesMap.get(layout).children.push(component)
        } else {
          const layoutComponent = getLayoutComponent(layout)
          if(layoutComponent) {
            const layoutRoute = { path: '', component: layoutComponent, children: [newRoute] }
            routesMap.set(component.layout, layoutRoute)
            newRoutes.push(layoutRoute)
          }else {
            newRoutes.push(newRoute)
          }
        }
      }
    }
  }
  return newRoutes
}

export default router
