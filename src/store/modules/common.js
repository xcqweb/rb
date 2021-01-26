export default{
  state: {
    sliderBarWidth: 200,
    cancelTokenArr: []
  },
  mutations: {
    setBarInstance(state, instance) {
      state.sliderBarWidth = instance.clientWidth
      const observer = new MutationObserver(function() {
        state.sliderBarWidth = instance.clientWidth
      });
      observer.observe(instance, {
        attributes: true,
        childList: true,
        subtree: true
      });
    },
    ///////////////
    pushToken (state, payload) {
      state.cancelTokenArr.push(payload.cancelToken)
    },
    clearToken (state) {
      state.cancelTokenArr.forEach(item => {
        item('取消请求')
      })
      state.cancelTokenArr = []
    },
  }
}