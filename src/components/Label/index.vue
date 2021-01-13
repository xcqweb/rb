<template>
  <div class="label mr10">
    <div class="label_title" v-if="label" :class="classLabel" :style="{width: `${width}px`}">{{label + '：'}}</div>
    <slot name="label" v-else></slot>
    <div :class="width ? 'f1' : 'poros-col-11'">
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
    classLabel: {
      type: String,
      default: 'poros-col-2'
    },
    rules: Array
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