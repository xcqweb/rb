import DeviceTree from './index.vue'
DeviceTree.install = function (Vue) {
  Vue.component(DeviceTree.name, DeviceTree)
}
export default DeviceTree