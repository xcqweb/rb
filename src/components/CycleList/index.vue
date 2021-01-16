<template>
  <div class="infinity" :style="comStyle">
    <div class="template">
      <li ref="message" class="infinity-item"></li>
      <li ref="tombstone" class="infinity-item tombstone"></li>
    </div>
    <div ref="chat" class="infinity-timeline">
      <ul @click="clickItem" ref="chat_ul" v-show="!noData"></ul>
      <Gt-no-data borderColor='transparent' v-if="noData"></Gt-no-data>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import {isNullOrEmpty} from '@/utils/util'
  export default {
    name: 'CycleList',
    props: {
      api: Function,
      keyword: String,
      selectId: String,
      selectName: String,
      pageNo: {
        type: Number,
        default: 20
      },
      dataKey: Object,
      showAll: Boolean
    },
    data() {
      return {
        nextItem: 1,
        targetId: '',
        targetName: '',
        loadAll: false,
        noData: false,
        total: 0
      }
    },
    computed: {
      comStyle() {
        return {
          height: this.noData ? '136px' : '266px'
        }
      }
    },
    watch: {
      keyword() {
        this.$nextTick(() => {
          this.noData = false
          this.nextItem = 1
          const dom = this.$refs.chat_ul
          for (let i = dom.childNodes.length - 1; i >= 0; i--) {
            const chnode = dom.childNodes[i];
            dom.removeChild(chnode);  
          }
          this.init()
        })
      },
      selectId: {
        handler(val) {
          this.targetId = val
          if (!val) {
            this.transformActive()
          }
        },
        immediate: true
      },
      total(val) {
        val < 7 ? this.scroll.disable() : this.scroll.enable()
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.createInfinityScroll()
      })
    },
    methods: {
      init() {
        this.scroll.scrollTo(0,0)
        this.scroll.refresh()
        this.scroll.destroy()
        this.scroll = null
        this.createInfinityScroll()
      },
      clickItem(e) {
        this.targetId = e.target.dataset.id
        if (!this.targetId) {
          return
        }
        const txt = e.target.innerHTML
        this.transformActive()
        if (this.targetId) {
          this.$emit('select', {key: this.targetId,label: txt})
        }
      },
      transformActive() {
        const uls = this.$refs.chat_ul ? [...this.$refs.chat_ul.children] : []
        uls.forEach( item => {
          item.classList.remove('active')
          if (item.dataset.id === this.targetId) {
            this.targetName = item.innerHTML
            item.classList.add('active')
          }
        })
      },
      createInfinityScroll() {
        this.scroll = new BScroll(this.$refs.chat, {
          mouseWheel:true,
          scrollY: true,
          scrollX: false,
          bounce: false,
          click: true,
          momentum: false,
          scrollbar: true,
          infinity: {
            render: (item, div) => {
              const cloneNodes = this.$refs.message.cloneNode(true)
              div = div || cloneNodes
              div.dataset.id = item.value || ''
              div.innerHTML = item.label || ''
              if (item.self) {
                div.classList.add('infinity-from-me')
              } else {
                div.classList.remove('infinity-from-me')
              }
              
              if (item.disabled) {
                div.classList.add('disabled')
              }else{
                div.classList.remove('disabled')
              }
              return div
            },
            createTombstone: () => {
              return this.$refs.tombstone.cloneNode(true)
            },
            fetch: (count) => {
              if (this.loadAll || isNullOrEmpty(this.total) || (this.total > 0 && this.total < this.nextItem * this.pageNo)) {
                return
              }
              const params = {
                limit: this.pageNo,
                pageNo: this.nextItem,
                keyword: this.keyword,
                searchKey: 'modelName'
              }
              return new Promise((resolve, reject) => {
                this.api(params).then( res => {
                  let reData = (res.data.records || res.data).map( item => {
                    if (this.dataKey) {
                      return {
                        value: item[this.dataKey.value],
                        label: item[this.dataKey.label],
                      }
                    }else{
                      return item
                    }
                  })
                  if (this.showAll) {
                    reData = [{value: 'all',label: this.selectName || '全部'},...reData]
                  }
                  if (reData.length === 1 && reData[0].value === 'all') {
                    resolve(false)
                    if(this.nextItem === 1) {
                      this.noData = true
                    }
                    return
                  }
                  const len = reData.length
                  if (len && len < 7) {
                    for (let i = 0; i < 7 - len; i++) {
                      reData.push({disabled: true})
                    }
                  }
                  this.noData = false
                  this.total = res.data.total
                  if (res.data.total < (this.nextItem - 1) * this.pageNo) {
                    this.loadAll = true
                    resolve(false) //结束加载
                  }else{
                    this.nextItem++
                    resolve(reData)
                    this.$nextTick( () => { //选中初始值
                      this.transformActive()
                    })
                  }
                })
              })
            }
          }
        })
        // console.log(this.scroll)
        this.scroll.scrollTo(0,0)
        this.scroll.refresh()
        this.scroll.on('scrollStart', (p) => {
          this.transformActive()
        })
        this.scroll.on('scrollEnd', (p) => {
          this.transformActive()
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .infinity{
    width: 100%;
    background: #fff;
    .template{
      display: none;
    }
  }

  .infinity-timeline{
    position: relative;
    height: 100%;
    border: 1px solid #ccc;
    overflow: hidden;
    will-change: transform;
    background-color: #fff;
    ul{
      position: relative;
      backface-visibility: hidden;
      transform-style: flat;
    }
  }
.com{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  left: 0;
  padding: 10px 0 10px 10px;
  width: 100%;
  height: 38px;
  line-height: 38px;
  contain: layout;
  will-change: transform;
  list-style: none;
}
  .infinity-item{
    .com();
    background-color: #fff;
    cursor: pointer;
    &:hover{
      color: #fff !important;
      background-color: #1740DC !important;
    }
  }
  .active{
    color: #fff !important;
    background-color: #1740DC !important;
  }
  .disabled{
    .com();
    cursor: inherit;
    &:hover{
      color: #fff !important;
      background-color: #fff !important;
    }
  }
  .poros-empty{
    background: #fff;
  }
</style>