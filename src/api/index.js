import model from './modules/model'
import device from './modules/device'
import dic from './modules/dic'

//接口统一挂载到原型方法上 调用方式 this.$API.getModelList(params).then( res => ......)
export default {
  ...model,
  ...device,
  ...dic
}