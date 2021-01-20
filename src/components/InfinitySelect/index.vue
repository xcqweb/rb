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
  <Cycle-list class="list" ref="cycle-list" :offset='50' :size='size' :on-fetch="onFetch" slot="dropdownRender" style="maxHeight:260px" v-if="flag">
    <template slot="item" slot-scope="{ data }">
      <slot :item='data'>
      <div class="list_item" :class="{active: data.value === selectModel.value}" :id="data.value" @click="handleClick(data)" style="height:36px">
        {{data.label}}
      </div>
      </slot>
    </template>
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
        const params = {
          limit: this.size,
          pageNo: this.pageIndex,
          keyword: this.keyword,
          searchKey: 'modelName'
        }
        //判断是否加载完成
        if (this.$refs.select.open && this.pageTotal > 0 && this.pageTotal < (this.pageIndex - 1) * this.size) {
          return
        }
        this.api(params).then( res => {
          this.pageIndex++
          this.pageTotal = res.data.total
          const reData = this.dataKey ? (res.data.records || res.data).map( el => {
            return  {
              value: el[this.dataKey.value],
              label: el[this.dataKey.label],
            }
          }) : (res.data.records || res.data)
          resolve(this.showAll ? [{value: 'all', label: this.selectModel.label || '全部'},...reData] : reData)
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
</style>