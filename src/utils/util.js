import store from "../store/";
import {formualList} from '@/utils/baseData'
const CryptoJS = require("crypto");
// 下载文件
export const downloadFile = url => {
  var el = document.createElement("a");
  el.download = url;
  el.style.display = "none";
  el.href = url;
  // 触发点击
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
};
// 获取根域名
export const rootDomain = () => {
  if (location.host.includes("localhost")) {
    return "localhost";
  }
  const hostArr = location.host.split(".");
  if (hostArr.length <= 2) {
    return hostArr.join(".");
  }
  return hostArr.slice(hostArr.length - 2).join(".");
};

// 判断对象是否有某一属性
export const hasOwnProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)

// 判断是否为空
export const isNullOrEmpty = val => val === '' || val === null || val === void 0

// 判断数据类型
export const getDataType = val => Object.prototype.toString.call(val).slice(8, -1).toLowerCase()

// 是否是某一类数据
export const isType = (val, type) => getDataType(val) === type

// 判断是否是Object类型的数据
export const isPlainObject = val => isType(val, 'object')

// 是否是函数
export const isFunction = val => isType(val, 'function')

// 是否是数组
export const isArray = val => isType(val, 'array')

// 是否是数字
export const isNumber = val => isType(val, 'number')

// 是否是字符串
export const isString = val => isType(val, 'string')

// 是否是Promise对象
export const isPromise = val => isPlainObject(val) && isFunction(val.then) && isFunction(val.catch)

//DES 加密 [str: 需要加密的str； key：秘钥]
export const encryptByDES = (str, key) => {
  var keyHex = new Buffer(key);
  var iv = new Buffer([1, 2, 3, 4, 5, 6, 7, 8]);
  var cipher = CryptoJS.createCipheriv("des-cbc", keyHex, iv);
  cipher.setAutoPadding(true); // default true
  var ciph = cipher.update(str, "utf8", "base64");
  ciph += cipher.final("base64");
  return ciph;
}
/* // cookie设置
export const setCookie = (cname, value, expiredays, domain = window.location.hostname) => {
  const exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = cname + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toUTCString()) + ';domain=' + domain + ';path=/;';
};
*/

export const clearCacheLocation = () => {
  store.commit('setUserInfo',{})
  store.commit('setMenuData',[])
  store.commit('setProductData', [])
  store.commit('setCurrentTenetId', '')
  store.commit('iframeRouteArr',[])
  store.commit('setTabData',{
    fullPathList: [],
    pages: [],
    activeKey: ''
  })
}

/*
* 清空session和local storage
* @p session-清空seeionStorage
* @p local-清空localStorage
*/
export const clearSessLocal = (session, local) => {
  if (session) {
    sessionStorage.clear();
  }
  if (local) {
    localStorage.clear();
  }
}
/*
** 保留两位小数
*/
export const formatnumber = (value, num) => {
  let a = '';
  let b = 0;
  let c = 0;
  let i = 0;
  a = value.toString();
  b = a.indexOf('.');
  c = a.length;
  if (num === 0) {
    if (b !== -1) {
      a = a.substring(0, b);
    }
  } else {//如果没有小数点
    if (b === -1) {
      a = a + '.';
      for (i = 1; i <= num; i++) {
        a = a + '0';
      }
    } else {//有小数点，超出位数自动截取，否则补0
      a = a.substring(0, b + num + 1);
      for (i = c; i <= b + num; i++) {
        a = a + '0';
      }
    }
  }
  return a;
}

/**
 * [通过参数名获取url中的参数值]
 * @param  {[string]} queryName [参数名]
 * @return {[string]}           [参数值]
 */
export const GetQueryValue = ( queryName ) => {
    var query = decodeURI(window.location.search.substring(1));
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == queryName) { return pair[1]; }
    }
    return null;
}
/*
* 监听localStorage/sessionStorage 当同一个页面 打开两个相同的
* e对象 key : 设置或删除或修改的键。调用clear()时，则为null。
* oldValue: 改变之前的旧值。如果是新增元素，则为null。
* newValue: 改变之后的新值。如果是删除元素，则为null
* url: 触发这个改变事件的页面的URL
* 主要用到 key 和 newValue [key === vuex || null] 和 newValue 满足条件都去跳转到homePage
*/
export const storageEvent = (e) => {
  // const urlWin = window.location.href;
  const flag = e.key === 'vuex' || e.key === null;
  if (!flag) {return}
  const newValue = e.newValue ? (e.key === 'vuex' ? JSON.parse(e.newValue) : '') : '';
  const oldValue = e.oldValue ? (e.key === 'vuex' ? JSON.parse(e.oldValue) : '') : '';
  
  // const homeFlag = urlWin.includes('/homePage')
  // 登陆状态
  if (flag && newValue && !oldValue && newValue.cache.userInfo.uid) {
    if (window.addEventListener) {
      window.removeEventListener("storage", storageEvent);
    } else {
      window.removeEventListener("onstorage", storageEvent);
    }
    location.reload();
  }
  // 注销状态
  if (flag && newValue && !newValue.cache.userInfo.uid) {
    if (window.addEventListener) {
      window.removeEventListener("storage", storageEvent);
    } else {
      window.removeEventListener("onstorage", storageEvent);
    }
    location.reload();
  }
}

export const funDownload = (url, fileName) => {
  var x = new XMLHttpRequest();
  x.open("GET", url, true);
  x.responseType = 'blob';
  x.onload = function () {
    var url = window.URL.createObjectURL(x.response)
    var a = document.createElement('a');
    a.href = url
    a.download = fileName;
    a.click()
  }
  x.send();
}

/**重复提示输入标红
 * config = {
 *  list: Array [{key: valu}], 要做重复判断的数据, 
 *  tip: String, 重复时提示信息, //非必传
 *  ref: Object, 列表dom,
 *  target: String // input class,
 *  key: String, 需要验证的数据字段
 * }
 */
export function validateRepeat(config) {
  try {
    const snList = config.list.map( (key) => {
        return key[config.key];
    });
    const repeatSnList = [...new Set(snList)];
    const repeatIndex = [];
    for (const [index, item] of snList.entries()) {
      if (item && snList.indexOf(item) !== index) {
        repeatIndex.push(index);
      }
    }
    const snListDom = Array.from(config.ref.querySelectorAll(`${config.target ? config.target : 'input' }`));
    for (let [index, item] of snListDom.entries()) {
      item.style.border = '1px solid #dcdee2';
      for (const key of repeatIndex) {
        if (key === index + (config.fix || 0)) {
          item.style.border = '1px solid #E9614C';
          break;
        }
      } 
    }
    config.that.$message.destroy();
    if (repeatIndex.length && snList.length > repeatSnList.length) {
      config.that.$message.error(config.tip || '名称重复');
      return true;
    }
  }catch{
    console.error('error');
  }
}

export function analysisFormula(formula) {
  let re = {}
  formualList.forEach( item => {
    const items = formula.split(item.text) 
    if (items.length > 1) {
      const str = items[1]
      re = {
        ...item,
        limit: item.value,
      }
      if (str.includes('~')) {
        const arr = str.split('~')
        re.firstVal = arr[0]
        re.secondVal = arr[1]
      }else{
        re.firstVal = items[1]
      }
    }
  })
  return re
}

export const throttle = function(func, delay, immediate = true) {            
　　var prev = Date.now();          
　　return function() {                
　　　　var context = this;                
　　　　var args = arguments;                
　　　　var now = Date.now();
        if (immediate) {
        immediate = false
        func.apply(context, args); 
        }                
　　　　if (now - prev >= delay) {                    
　　　　　　func.apply(context, args);                    
　　　　　　prev = Date.now();                
　　　　}            
　　}        
}

export const debounce = function(fn, delay,immediate = true) {
  let timer
  return function () {
    let context = this
    let args = arguments
    clearTimeout(timer)
    if (immediate) {
      immediate = false
      fn.apply(context, args)
      return
    }
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
}