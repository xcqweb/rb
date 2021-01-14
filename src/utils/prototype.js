import Vue from "vue";
import moment from 'moment'
import 'moment/locale/zh-cn'
import API from '@/api' 
moment.locale('zh-cn')
console.log(moment().format())
// 时间
Vue.prototype.$moment = moment;
// 常用格式化时间
Vue.prototype.$formatDate = (timestamp, fmt = 'YYYY-MM-DD HH:mm:ss') => {
  return timestamp ? moment(timestamp).format(fmt): '';
};
//转成utc
Vue.prototype.$UTC = (timestamp) => {
  return timestamp ? moment(timestamp).format(): '';
};
// 图片预览
Vue.prototype.$imgUrl = function(url) {
  if (!url || /(http|https)?:\/\//.test(url.toString())) {
    return url
  }
  if (!url.startsWith('/')) {
    url = '/' + url
  }
  if (process.env.NODE_ENV === 'development') {
    return 'http://kong.poros-platform.10.74.158.71.nip.io/minio' + url
  }
  return '/minio' + url
}

Vue.prototype.uuid = function() {
  var temp_url = URL.createObjectURL(new Blob());
  var uuid = temp_url.toString(); // blob:https://xxx.com/b250d159-e1b6-4a87-9002-885d90033be3
  URL.revokeObjectURL(temp_url);
  return uuid.substr(uuid.lastIndexOf("/") + 1);
}

Vue.prototype.$API = API

Vue.prototype.$deepCopy = function(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
	var cpObj = obj instanceof Array ? [] : {};
	for (var key in obj) cpObj[key] = this.$deepCopy(obj[key]);
	return cpObj;
}

// Vue.prototype.$arrayItemToString = function(filters) {
//   for(let key in filters) {
//     if (!Array.isArray(filters[key])) {
//       filters[key] = []
//     }else{
//       filters[key] = filters[key].map( item => item + '')
//     }
//   }
//   return filters
// }

Vue.prototype.$arrayItemToString = function(array) {
  return array.map( item => {
    return {
      value: item.value + '',
      text: item.text,
    }
  })
}