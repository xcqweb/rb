import cycleList from './index.vue'
cycleList.install = function (Vue) {
  Vue.component(cycleList.name, cycleList)
}
export default cycleList