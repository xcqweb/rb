import Vue from "vue";
import ElementResize from 'element-resize-detector'
const eleResize = ElementResize()
import { isFunction, isPlainObject, isBoolean } from '../utils/util.js'
import {debounce} from 'lodash'

function deal(el, isVisible) {
  if (isVisible.value) {
    el.style.visibility = "visible";
  } else {
    el.style.visibility = "hidden";
  }
}

Vue.directive("visible", {
  update: function(el, isVisible) {
    deal(el, isVisible);
  },
  inserted: function(el, isVisible) {
    deal(el, isVisible);
  }
});
Vue.directive("lowercase", {
  inserted: function(el, {value}, vNode) {
    const that = vNode.context
    const instance = that.$watch(`model.${value}`, (val) => {
      if (!val) {
        instance()
      }
      that.model[value] = val && val.toLowerCase()
    })
  }
});
Vue.directive("focus", {
  inserted: function(el,{value}, vNode) {
    const that = vNode.context
    if (isBoolean(that.visible)) {
      that.$watch('visible', (val) => {
        if (val) {
          that.$nextTick( () => {
            el.focus();
            el.select();
          })
        }
      }, {immediate: true})
    }else{
      el.focus();
      el.select();
    }
  },
});
Vue.directive("clickOutSide", {
  bind: function(el, {value}) {
    let clickOutside = value;
    el.handler = function(e) {
      if (el && !el.contains(e.target)) {
        clickOutside();
      }
    };
    document.addEventListener("click", el.handler, true);
  },
  unbind: function(el) {
    document.removeEventListener("click", el.handler, true);
    el.handler = null;
  }
});
Vue.directive("resize", {
  bind(ele, { value, arg }) {
    if (isFunction(value)) {
      const options = arg && isPlainObject(arg.options) ? arg.options : {}
      eleResize.listenTo(options, ele, value)
    }
  },
  unbind(ele) {
    eleResize.uninstall(ele)
  }
})

const calcTableHeight = (ele, binding, vnode) => {
  let elTop = ele.getBoundingClientRect().top; // 表格上方高度
  let paginationHeight = 0; // 页码高度
  const paginationNode =  ele.querySelector('.poros-pagination');
  if ( paginationNode ){
    paginationHeight = paginationNode.offsetHeight + 32;
  }
  let offset = 0; // 偏移量
  if ( binding.value ){
    offset = binding.value
  }
  if ( vnode.context.tableHeight === undefined ){
    vnode.context.tableHeight = 0
  }
  const defaultHeight = 10; // 底部默认间距
  const h = window.innerHeight - elTop - offset - paginationHeight - defaultHeight;
  vnode.context.tableHeight = h - 40;
  console.log(vnode.context.tableHeight)
}

Vue.directive('tableHeight',{
  bind(ele, binding, vnode) {
    ele.resizeListener = () => {
      calcTableHeight(ele, binding, vnode)
    }
    window.addEventListener('resize', ele.resizeListener)
  },
  componentUpdated: (ele, binding, vnode) => {
    calcTableHeight(ele, binding, vnode)
  },
  unbind(ele) {
    window.removeEventListener('resize',ele.resizeListener)
  }
})
 
Vue.directive('drag',{
  bind: (el, binding) => {
    let flag = false;
    //添加蒙层 防止拖动过程中选中内容
    const dom = document.createElement('div');
    dom.style.cssText += 'width:100vw;height:100vh;position:fixed;top:0;left:0;background:transparent;';
    dom.style.display = 'none';
    el.appendChild(dom);
    el.handlerMousedown = function(e) {
        dom.style.display = 'block';
        flag = true;
    };

    el.handlerMousemove = function(e) {
        if (!flag) {
            e.preventDefault();
            return;
        }
        binding.value(e.clientX, e.clientY);
    };

    el.handlerMouseup = function(e) {
        dom.style.display = 'none';
        flag = false;
    };

    el.addEventListener('mousedown', el.handlerMousedown, false);
    el.addEventListener('mousemove', el.handlerMousemove, false);
    window.addEventListener('mouseup', el.handlerMouseup, false);
  },
  unbind: (el) => {
      el.removeEventListener('mousedown', el.handlerMousedown, false);
      window.removeEventListener('mousemove', el.handlerMousemove, false);
      el.removeEventListener('mouseup', el.handlerMouseup, false);
      el.handlerMousedown = null;
      el.handlerMousemove = null;
      el.handlerMouseup = null;
  },
})

Vue.directive('copy',{
  bind(el, {value} ) {
    el.$value = value
    el.handler = () => {
      if (!el.$value) {
        // 值为空的时候，给出提示。可根据项目UI仔细设计
        console.log('无复制内容')
        return
      }
      // 动态创建 textarea 标签
      const textarea = document.createElement('textarea')
      // 将该 textarea 设为 readonly 防止 iOS 下自动唤起键盘，同时将 textarea 移出可视区域
      textarea.readOnly = 'readonly'
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      // 将要 copy 的值赋给 textarea 标签的 value 属性
      textarea.value = el.$value
      // 将 textarea 插入到 body 中
      document.body.appendChild(textarea)
      // 选中值并复制
      textarea.select()
      const result = document.execCommand('Copy')
      Vue.prototype.$message.destroy()
      if (result) {
        Vue.prototype.$message.success('复制成功！')
      }
      document.body.removeChild(textarea)
    }
    // 绑定点击事件，就是所谓的一键 copy 啦
    el.addEventListener('click', debounce(el.handler, 5000, {leading:true}))
  },
  // 当传进来的值更新的时候触发
  componentUpdated(el, { value }) {
    el.$value = value
  },
  // 指令与元素解绑的时候，移除事件绑定
  unbind(el) {
    el.removeEventListener('click', el.handler)
  },
})

Vue.directive('debounce',{
  inserted: function (el, binding) {
    let timer
    let immediate = true
    el.addEventListener('click', () => {
      if (timer) {
        clearTimeout(timer)
      }
      if (immediate) {
        immediate = false
        binding.value()
        return
      }
      timer = setTimeout(() => {
        binding.value()
      }, 1000)
    })
  },
})

Vue.directive('draggable',{
  inserted: function (el) {
    el.style.cursor = 'move'
    el.onmousedown = function (e) {
      let disx = e.pageX - el.offsetLeft
      let disy = e.pageY - el.offsetTop
      document.onmousemove = function (e) {
        let x = e.pageX - disx
        let y = e.pageY - disy
        let maxX = document.body.clientWidth - parseInt(window.getComputedStyle(el).width)
        let maxY = document.body.clientHeight - parseInt(window.getComputedStyle(el).height)
        if (x < 0) {
          x = 0
        } else if (x > maxX) {
          x = maxX
        }

        if (y < 0) {
          y = 0
        } else if (y > maxY) {
          y = maxY
        }

        el.style.left = x + 'px'
        el.style.top = y + 'px'
      }
      document.onmouseup = function () {
        document.onmousemove = document.onmouseup = null
      }
    }
  },
})
