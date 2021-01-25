<template>
  <div class="label mr10">
    <div class="label_title" :title="label" v-if="label" :class="classLabel" :style="{width: `${width}px`}">{{label + '：'}}</div>
    <slot class="label_title" name="label" v-else></slot>
    <div :class="width ? 'f1' : 'poros-col-11'" class="tl">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Label',
  props: {
    label: String,
    width: {
      type: [String,Number],
    },
    classLabel: { //定义label 左边宽度 传入class
      type: String,
      default: 'poros-col-3'
    },
  },
}
</script>

<style lang="less" scoped>
  .label{
    display: flex;
    align-items: flex-start;
    line-height: 32px;
  }
</style>