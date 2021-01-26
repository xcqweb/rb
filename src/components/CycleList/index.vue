<template>
  <div ref="gt-recycle-list" class="gt-recycle-list" :style="{maxHeight: `${maxHeight}px`}">
    <div class="gt-recycle-list-main">
      <div class="gt-recycle-list-items" :style="{height: heights + 'px'}">
        <div
          v-for="item in visibleItems"
          class="gt-recycle-list-item"
          :style="{transform: 'translate(0,' + item.top + 'px)'}"
        >
          <div
            v-if="infinite"
            :class="{'gt-recycle-list-transition': infinite}"
            :style="{opacity: +!item.loaded}"
          >
            <slot name="tombstone"></slot>
          </div>
          <div
            :class="{'gt-recycle-list-transition': infinite}"
            :style="{opacity: item.loaded}"
          >
            <slot name="item" :data="item.data"></slot>
          </div>
        </div>

        <div class="gt-recycle-list-pool">
          <div
            class="gt-recycle-list-item gt-recycle-list-invisible"
            v-if="item && !item.isTombstone && !item.height"
            :ref="'preloads'+index"
            v-for="(item, index) in items"
          >
            <slot name="item" :data="item.data"></slot>
          </div>
          <div ref="tomb" class="gt-recycle-list-item gt-recycle-list-invisible">
            <slot name="tombstone"></slot>
          </div>
        </div>
      </div>
      <div
        v-if="!infinite && !noMore"
        class="gt-recycle-list-loading"
        :style="{visibility: loading ? 'visible' : 'hidden'}"
      >
        <slot name="spinner">
          <div class="gt-recycle-list-loading-content">
            <p-spin class="gt-recycle-list-spinner" />
          </div>
        </slot>
      </div>

      <div v-show="noMore && showNoMore" class="gt-recycle-list-noMore">
        <slot name="noMore" />
      </div>
    </div>
    <div class="gt-recycle-list-fake"></div>
  </div>
</template>

<script>
const warn = function (msg, componentName) {
  if (process.env.NODE_ENV !== 'production') {
    const component = componentName ? `<${componentName}> ` : ''
    console.error(`[warn]: ${component}${msg}`)
  }
}
const isUndef = function(o) {
  const toString = Object.prototype.toString
  return toString.call(o) === `[object undefined]`
}

  const COMPONENT_NAME = 'CycleList'
  const PROMISE_ERROR = 'requires a Promise polyfill in this browser.'
  const EVENT_SCROLL = 'scroll'
  const EVENT_RESIZE = 'resize'

  export default {
    name: COMPONENT_NAME,
    data() {
      return {
        items: [],
        heights: 0,
        startIndex: 0,
        loadings: [],
        noMore: false
      }
    },
    props: {
      infinite: {
        type: Boolean,
        default: false
      },
      size: {
        type: Number,
        default: 20
      },
      offset: { //距离底部多少加载
        type: Number,
        default: 100
      },
      onFetch: {
        type: Function,
        required: true
      },
      maxHeight: { //滚动容器最大高度
        type: Number,
        default: 252
      }
    },
    computed: {
      visibleItems() {
        return this.items.slice(Math.max(0, this.startIndex - this.size), Math.min(this.items.length, this.startIndex + this.size))
      },
      tombHeight() {
        return this.infinite ? this.$refs.tomb && this.$refs.tomb.offsetHeight : 0
      },
      loading() {
        return this.loadings.length
      },
      showNoMore() {
        console.log(this.$refs['gt-recycle-list'] && this.$refs['gt-recycle-list'].clientHeight)
        return this.items.length / 7
      }
    },
    created() {
      this.list = []
      this.promiseStack = []
    },
    mounted() {
      this.checkPromiseCompatibility()
      this.$el.addEventListener(EVENT_SCROLL, this._onScroll)
      window.addEventListener(EVENT_RESIZE, this._onResize)
      this.load()
    },
    beforeDestroy() {
      this.$el.removeEventListener(EVENT_SCROLL, this._onScroll)
      window.removeEventListener(EVENT_RESIZE, this._onResize)
    },
    methods: {
      checkPromiseCompatibility() {
        if (isUndef(window.Promise)) {
          warn(PROMISE_ERROR)
        }
      },
      load() {
        if (this.infinite) {
          const items = this.items
          const start = items.length
          items.length += this.size
          const end = items.length
          this.loadItems(start, end)
          this.getItems()
        } else if (!this.loading) {
          this.getItems()
        }
      },
      getItems() {
        const index = this.promiseStack.length
        const promiseFetch = this.onFetch()
        this.loadings.push('pending')
        this.promiseStack.push(promiseFetch)
        promiseFetch.then((res) => {
          this.loadings.pop()
          if (!res) {
            this.stopScroll(index)
          } else {
            this.setList(index, res)
            this.loadItemsByIndex(index)
            if (res.length < this.size) {
              this.stopScroll(index)
            }
          }
        })
      },
      removeUnusedTombs(copy, index) {
        let cursor
        let size = this.size
        let start = index * size
        let end = (index + 1) * size
        for (cursor = start; cursor < end; cursor++) {
          if (copy[cursor] && copy[cursor].isTombstone) break
        }
        this.items = copy.slice(0, cursor)
      },
      stopScroll(index) {
        this.noMore = true
        this.removeUnusedTombs(this.items.slice(0), index)
        this.updateItemTop()
        this.updateStartIndex()
      },
      setList(index, res) {
        const list = this.list
        const baseIndex = index * this.size
        for (let i = 0; i < res.length; i++) {
          list[baseIndex + i] = res[i]
        }
      },
      loadItemsByIndex(index) {
        const size = this.size
        const start = index * size
        const end = (index + 1) * size
        this.loadItems(start, end)
      },
      loadItems(start, end) {
        const items = this.items
        let promiseTasks = []
        let item
        for (let i = start; i < end; i++) {
          item = items[i]
          if (item && item.loaded) {
            continue
          }
          this.setItem(i, this.list[i])
          promiseTasks.push(this.$nextTick().then(() => {
            this.updateItemHeight(i)
          }))
        }
        window.Promise.all(promiseTasks).then(() => {
          this.updateItemTop()
          this.updateStartIndex()
        })
      },
      setItem(index, data) {
        this.$set(this.items, index, {
          data: data || {},
          height: 0,
          top: -1000,
          isTombstone: !data,
          loaded: data ? 1 : 0
        })
      },
      updateItemHeight(index) {
        let cur = this.items[index]
        let dom = this.$refs['preloads' + index]
        if (dom && dom[0]) {
          cur.height = dom[0].offsetHeight
        } else if (cur) {
          cur.height = this.tombHeight
        }
      },
      updateItemTop() {
        let heights = 0
        const items = this.items
        let pre
        let current
        for (let i = 0; i < items.length; i++) {
          pre = items[i - 1]
          current = items[i]
          if (!items[i]) {
            heights += 0
          } else {
            current.top = pre ? pre.top + pre.height : 0
            heights += current.height
          }
        }
        this.heights = heights
      },
      updateStartIndex() {
        let top = this.$el.scrollTop
        let item
        const items = this.items
        for (let i = 0; i < items.length; i++) {
          item = items[i]
          if (!item || item.top > top) {
            this.startIndex = Math.max(0, i - 1)
            break
          }
        }
      },
      reset () {
        const map = [
          {
            key: 'items',
            value: []
          },
          {
            key: 'heights',
            value: 0
          },
          {
            key: 'startIndex',
            value: 0
          },
          {
            key: 'loadings',
            value: []
          },
          {
            key: 'noMore',
            value: false
          },
          {
            key: 'list',
            value: []
          },
          {
            key: 'promiseStack',
            value: []
          }
        ]
        map.forEach(({ key, value }) => {
          this[key] = value
        })
        this.$el.scrollTop = 0
        this.load()
      },
      _onScroll() {
        if (!this.noMore && this.$el.scrollTop + this.$el.offsetHeight > this.heights - this.offset) {
          this.load()
        }
        this.updateStartIndex()
      },
      _onResize() {
        const items = this.items
        items.forEach((item) => {
          item.loaded = false
        })
        this.loadItems(0, items.length)
      }
    },
  }
</script>

<style lang="less" scoped>
  .gt-recycle-list{
    position: relative;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .gt-recycle-list-main{
    min-height: 100%;
  }
    
  .gt-recycle-list-fake{
    height: 1px;
  }

  .gt-recycle-list-invisible{
    top: -1000px;
    visibility: hidden;
  }

  .gt-recycle-list-item{
    width: 100%;
    position: absolute;
    box-sizing: border-box;
  }
    
  .gt-recycle-list-transition{
    position: absolute;
    opacity: 0;
    transition-property: opacity;
    transition-duration: 500ms;

  }
    
  .gt-recycle-list-loading{
    overflow: hidden;
  }
    
  .gt-recycle-list-loading-content{
    text-align: center;
  }
  .gt-recycle-list-noMore{
    overflow: hidden;
  }
  .gt-recycle-list-spinner{
    margin: 10px auto;
    display: flex;
    justify-content: center;
  }
    
</style>
