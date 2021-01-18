
const files = require.context('./modules', false, /.js$/);
let keys = {}
files.keys().forEach(fileName => {
  const def = files(fileName).default;
  keys = {...keys,...def}
});
//接口统一挂载到原型方法上 调用方式 this.$API.getModelList(params).then( res => ......)
export default keys