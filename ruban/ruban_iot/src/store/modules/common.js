export default{
  state: {
    sliderBarWidth: 200,
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
  }
}