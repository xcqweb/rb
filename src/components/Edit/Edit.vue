<template>
  <div class="edit">
    <template v-if="isEdit">
      <p-input class="edit_input" allow-clear v-model="keyword" placeholder="请输入" v-if="!normal" :style="{width:comWidth}" />
      <slot else></slot>
      <p-button class="ml6" type='primary' @click="submit" icon="check" />
      <p-button class="edit_close" @click="cancel" icon="close" />
    </template>
    <template v-else>
      {{time ? time(value, format) : emunList ? emunList[value] : value}}
      <slot v-if="!normal"></slot>
      <p-icon class="edit_icon" type='edit' @click="edit" />
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
    }
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