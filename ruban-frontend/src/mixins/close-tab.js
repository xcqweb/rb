// 在 deactivated 钩子中关闭当前 页签
export default {
  activated () {
    // 获取当前 tab 的关闭按钮 dom
    this.__tabClose = document.querySelector('.poros-router-tabs > .poros-tabs .poros-tabs-tab-active .poros-tabs-close-x')
  },
  deactivated () {
    // 触发 关闭按钮的 click event
    this.__tabClose && this.__tabClose.click()

    delete this.__tabClose
  }
}