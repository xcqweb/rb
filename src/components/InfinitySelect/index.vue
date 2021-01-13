<template>
<p-select
  ref="select"
  v-model="selectModelId"
  showSearch
  labelInValue
  @search='search'
  @focus='focusFun'
  @blur='blurFun'
  :open='open'
>
  <Cycle-list
    slot="dropdownRender"
    :selectId='selectId'
    :api='api'
    :keyword='keyword'
    :dataKey='dataKey'
    :showAll='showAll'
    @select="select"
  />
</p-select>
  
</template>

<script>
export default {
  name: 'InfinitySelect',
  props: {
    value: Object,
    api: Function,
    dataKey: Object, //数据转换格式
    showAll: Boolean
  },
  data() {
    return {
      keyword: '',
      open: false,
      selectModelId: {}
    }
  },
  computed: {
    selectId() {
      return this.value && this.value.key
    }
  },
  watch: {
    value: {
      handler(val) {
        this.selectModelId = val || {}
      },
      immediate: true
    },
    selectModelId(data) {
      this.$emit('input', data)
      this.$emit('change', data)
    },
  },
  methods: {
    focusFun(state) {
      this.open = true
      this.$refs.select.focus()
    },
    blurFun() {
      this.open = false
    },
    search(keyword) {
      console.log(keyword)
      this.keyword = keyword
    },
    select(data) {
      if (!data) {
        return
      }
      this.$refs.select.blur()
      this.open = false
      this.selectModelId = data
    },
  },
}
</script>

<style lang="less" scoped>
.edit{
  display: flex;
  align-items: center;
  flex: 1;
  &_input{
    margin-right: 10px;
  }
  &_icon{
    margin-left: 12px;
  }
  &_close{
    margin-left: 6px;
  }
}
  
</style>