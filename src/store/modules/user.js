import { api } from 'poros/utils'
import router from '@/router'

const { getUserInfo, login, logout } = api

export default {
  state: {
    userInfo: {},
    uid: '',
    name: '',
    avatar: ''
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    setUserId(state, uid) {
      state.uid = uid
    },
    setUserName(state, name) {
      state.name = name
    },
    setUserAvatar(state, avatar) {
      state.avatar = avatar
    }
  },
  actions: {
    requireUserInfo({ commit }) {
      getUserInfo().then(res => {
        if(res.code === 0) {
          commit('setUserInfo', res.data)
          commit('setUserId', res.data.uid)
          commit('setUserName', res.data.name)
          commit('setUserAvatar', res.data.headUrl)
        }
      })
    },
    login({}, params) {
      let { username, password } = params
      username = username.trim()
      password = password.trim()
      return login({ username, password }).then(res => {
        if(res.code === 0) {
          router.push('/').catch(() => {})
        }
        return res
      })
    },
    logout() {
      return logout().finally(() => {
        const isDev = process.env.NODE_ENV === 'development'
        if(isDev) {
          router.push('/login')
          localStorage.setItem('loginOut', +new Date())
        } else {
          window.location.reload()
        }
      })
    }
  }
}