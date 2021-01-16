// 此目录下公共组件命名规则：前面加 gt- 标识
import Vue from "vue";
const files = require.context('./', true, /.vue$/);
files.keys().forEach(fileName => {
  const def = files(fileName).default;
  Vue.component(def.name, def);
});