<template>
<p-tooltip placement="top" :title="title">
  <p-icon class="cursor-pointer icon" v-copy='value' type="copy" />
</p-tooltip>
</template>

<script>
export default {
  name: 'Copy',
  props: {
    value: [String,Number],
    title: {
      type: [String,Number],
      default: '复制'
    }
  },
}
</script>

<style lang="less" scoped>
  .icon{
    margin-left: 12px;
    &:hover{
      color: #697b8c;
      transform: scale(1.2);
    }
  }
</style>
