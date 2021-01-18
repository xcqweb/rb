<template>
<p-select
  ref="select"
  v-model="selectModelId"
  showSearch
  labelInValue
  :allowClear='allowClear'
  @search='search'
  @dropdownVisibleChange='dropdownVisibleChange'
  placeholder='请选择'
  v-clickOutSide='hide'
>
  <Cycle-list
    slot="dropdownRender"
    :selectId='selectId'
    :selectName='selectName'
    :api='api'
    :keyword='keyword'
    :dataKey='dataKey'
    :showAll='showAll'
    @select="select"
    v-clickOutSide='hide'
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
    showAll: Boolean,
    allowClear: { //清除按钮
      type: Boolean,
      default: true
    }
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
    },
    selectName() {
      return this.value && this.value.label
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
    dropdownVisibleChange(status) {
      this.$refs.select.open = status
    },
    hide() {
      this.$refs.select.open = false
    },
    search(keyword) {
      // console.log(keyword)
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