<template>
  <div class="edit">
    <template v-if="isEdit">
      <p-input class="edit_input" allow-clear v-model="keyword" placeholder="请输入" v-if="!normal" :style="{width:comWidth}" />
      <slot else></slot>
      <p-button class="ml6" type='primary' @click="submit" :disabled='error' icon="check" />
      <p-button class="edit_close" @click="cancel" icon="close" />
    </template>
    <template v-else>
      {{comVal}}
      <slot v-if="!normal"></slot>
      <p-tooltip placement="top" title="编辑">
        <p-icon class="edit_icon" type='edit' @click="edit" />
      </p-tooltip>
    </template>
  </div>
</template>

<script>
export default {
  name: 'Edit',
  props: {
    value: [String,Number],
    width: [String,Number],

    normal: Boolean, //通过卡槽
    time: Function, //时间转换方法
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    emunList: Array,
    error: Boolean, //是否输入报错 报错禁止提交
    fix: String, //字符后面是否带其他参数值 例如：单位
  },
  data() {
    return {
      keyword: '',
      oldVal: '',
      isEdit: false,
      rateModel: '1',
    }
  },
  computed: {
    comWidth() {
      return this.width ? `${this.width}px` : '100%'
    },
    comVal() {
      const emunVal = this.emunList ? this.emunList[this.value] : this.value
      const timeVal = (this.time ? this.time(this.value, this.format) : emunVal) || ''
      return this.fix ? (timeVal ? `${timeVal}(${this.fix})` : '') : timeVal
    }
  },
  watch: {
    value: {
      handler(val,oldVal) {
        this.keyword = val
        if (this.normal) {
          this.oldVal = this.value
        }
      },
      immediate: true,      
    },
  },
  created() {
    if (this.normal) {
      this.oldVal = this.value
    }
  },
  methods: {
    edit() {
      this.keyword = this.value
      this.isEdit = true
    },
    submit() {
      if (this.normal) {
        this.oldVal = this.keyword
      }
      this.$emit('input', this.keyword)
      this.$emit('change', this.keyword)
      this.$emit('submit', this.keyword)
      this.isEdit = false
    },
    cancel() {
      if (this.normal) {
        this.$emit('input', this.oldVal)
        this.$emit('change', this.oldVal)
      }
      this.$emit('cancel')
      this.isEdit = false
    },
  },
}
</script>

<style lang="less" scoped>
.edit{
  display: flex;
  align-items: center;
  flex: 1;
  height: 32px;
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