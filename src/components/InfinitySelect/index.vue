<template>
<p-select
  ref="select"
  v-model="selectModel"
  showSearch
  labelInValue
  @search='search'
  @dropdownVisibleChange='dropdownVisibleChange'
  placeholder='请选择'
>
  <Cycle-list class="list" ref="cycle-list" :showAll='showAll' :offset='20' :size='comSize' :on-fetch="onFetch" slot="dropdownRender" v-if="flag">
    <template slot="item" slot-scope="{ data }">
      <slot :item='data'>
      <div class="list_item" :class="{active: data.value === selectModel.value}" :id="data.value" @click="handleClick(data)" style="height:36px">
        {{data.label}}
      </div>
      </slot>
    </template>
    <p-divider slot="noMore">我是有底线的</p-divider>
  </Cycle-list>
</p-select>
  
</template>

<script>
import {debounce} from 'lodash'
export default {
  name: 'InfinitySelect',
  props: {
    value: Object,
    api: Function,
    dataKey: Object, //数据转换格式
    showAll: Boolean,
    allowClear: { //清除按钮
      type: Boolean,
      default: true
    },
    size: {
      type: Number,
      default: 20
    },
    allLabel: {
      type: String,
      default: '全部模型'
    }, //全部文字 例如 全部模型 全部设备
    extraData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      keyword: '',
      flag: true, //搜索触发重新渲染
      selectModel: {},
      pageIndex: 1,
      pageTotal: 0
    }
  },
  computed: {
    selectId() {
      return this.value && this.value.key
    },
    selectName() {
      return this.value && this.value.label
    },
    comSize() {
      return this.showAll ? this.size + 1 : this.size
    }
  },
  watch: {
    value: {
      handler(val) {
        this.selectModel = val || {}
      },
      immediate: true
    },
  },
  methods: {
    onFetch() {
      return new Promise((resolve) => {
        const idsExsit = Array.isArray(this.extraData.templateIds)
        if (idsExsit && !this.extraData.templateIds.length) {
          resolve(this.showAll && this.pageIndex === 1 ? [{value: 'all', label: this.allLabel || '全部'}] : [])
          return
        }
        const params = {
          limit: this.size,
          pageNo: this.pageIndex,
          keyword: this.keyword,
          searchKey: 'modelName',
          ids: idsExsit ? this.extraData.templateIds.join(',') : undefined,
          orderByType: this.extraData.orderType ? this.extraData.orderType : undefined
        }
        //判断是否加载完成
        if (this.$refs.select.open && this.pageTotal > 0 && this.pageTotal < (this.pageIndex - 1) * this.size) {
          resolve([])
          return
        }
        this.api(params).then( res => {
          this.pageTotal = res.data.total
          const reData = this.dataKey ? (res.data.records || res.data).map( el => {
            return  {
              value: el[this.dataKey.value],
              label: el[this.dataKey.label],
            }
          }) : (res.data.records || res.data)
          resolve(this.showAll && this.pageIndex === 1 ? [{value: 'all', label: this.allLabel || '全部'},...reData] : reData)
          this.pageIndex++
        })
      })
    },
    handleClick(item) {
      this.selectModel = {
        value: item.value,
        label: item.label,
      }
      this.$emit('input', this.selectModel || {})
      this.$emit('change', this.selectModel || {})
      this.flag = false
    },
    dropdownVisibleChange(status) {
      this.$refs.select.open = status
      status && this.init()
    },
    init(keyword) {
      this.pageIndex = 1
      this.pageTotal = 0
      this.keyword = keyword
      this.flag = false
      setTimeout( () => {
        this.flag = true
      })
    },
    search: debounce(function(keyword) {
      this.$refs.select.open && this.init(keyword)
    },600)
  },
}
</script>

<style lang="less" scoped>
  .list_item{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding-left: 12px;
    &:hover{
      color: #1740DC !important;
      background-color: #F0F1F3 !important;
    }
  }
  .active{
    color: #fff !important;
    background-color: #1740DC !important;
  }
  .poros-divider{
    font-size: 12px;
    margin: 0 0 5px 0;
  }
</style>