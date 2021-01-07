<template>
  <div class="bottom-autoload-wrap">
    <slot></slot>
  </div>
</template>

<script lang="ts">
export default {
  name: 'BottomAutoload',
  props: {
    // 初始化时，立即检测是否触达底部
    immediate: {
      type: Boolean,
      default: false
    },
    // 自动填充内容以保证能触达底部
    autoFill: {
      type: Boolean,
      default: true,
    },
    // 底部距离加载
    distance: {
      type: Number,
      default: 100,
    },
    // 是否全部加载完
    finished: {
      type: Boolean,
      default: false,
    },
    loadMethod: {
      type: Function,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      eventName: 'DOMMouseScroll' in document ? 'DOMMouseScroll' : 'mousewheel',
    };
  },
  watch: {
    loading(val) {
      if (!val) {
        this.fillContainer();
      }
    },
  },
  methods: {
    getElementStyle(element) {
      return element ? element.currentStyle || document.defaultView.getComputedStyle(element, '') : null;
    },
    getScrollEventTarget(element) {
      let currentNode = element;
      while (currentNode && currentNode.tagName !== 'HTML' &&
        currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
        const style = this.getElementStyle(currentNode);
        const overflowY = style ? style.overflowY : '';
        if (overflowY === 'scroll' || overflowY === 'auto') {
          return currentNode;
        }
        currentNode = currentNode.parentNode;
      }
      return window;
    },
    getScrollTop(element) {
      if (element === window) {
        return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop);
      } else {
        return element.scrollTop;
      }
    },
    getBoundingClientRect(element) {
      return element.getBoundingClientRect()
    },
    fillContainer() {
      if (!this.finished && this.autoFill) {
        this.$nextTick(() => {
          const clientRect = this.getBoundingClientRect(this.$el);
          if (this.scrollEventTarget === window) {
            this.containerFilled = clientRect.bottom >= this.getBoundingClientRect(document.documentElement).bottom;
          } else {
            this.containerFilled = clientRect.bottom >= this.getBoundingClientRect(this.scrollEventTarget).bottom;
          }
          if (!this.containerFilled) {
            this.loadMethod();
          }
        });
      }
    },
    checkBottomReached() {
      if (this.scrollEventTarget === window) {
        return document.documentElement.scrollTop || document.body.scrollTop + document.documentElement.clientHeight + this.distance >= document.body.scrollHeight;
      } else {
        return parseInt(this.getBoundingClientRect(this.$el).bottom, 10) <= parseInt(this.getBoundingClientRect(this.scrollEventTarget).bottom + this.distance, 10) + 1;
      }
    },
    onMouseWheel(event) {
      event = event || window.event;
      if ((event.wheelDelta || event.detail) < 0) {
        if (!this.loading && !this.finished && this.checkBottomReached()) {
          this.loadMethod();
        }
      }
    },
    bindEvent() {
      this.scrollEventTarget.addEventListener(this.eventName, this.onMouseWheel, false);
    },
    unbindEvent() {
      this.scrollEventTarget.removeEventListener(this.eventName, this.onMouseWheel, false);
    },
    init() {
      this.scrollEventTarget = this.getScrollEventTarget(this.$el);
      this.bindEvent();
    },
  },
  mounted() {
    this.init();
    if (this.immediate) {
      this.fillContainer();
    }
  },
  destroyed() {
    this.unbindEvent();
  },
};
</script>