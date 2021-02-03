export default{
  state: {
    cancelTokenArr: []
  },
  mutations: {
    ///////////////
    pushToken (state, payload) {
      state.cancelTokenArr.push(payload)
    },
    clearToken (state) {
      state.cancelTokenArr.forEach(item => {
        item.cancelToken(`取消请求: ${item.config.url}`)
      })
      state.cancelTokenArr = []
    },
  }
}