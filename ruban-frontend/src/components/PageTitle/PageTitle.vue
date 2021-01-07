<template>
  <div class="gt-page-title">
    <slot/>
  </div>
</template>
<script>
export default {
  name: 'PageTitle',
  props: {
  },
}
</script>
<style lang="less">
.gt-page-title {
  font-size: @f-medium;
  line-height: @f-medium-line-height;
  position: relative;
  padding-left: 13px;
  // margin: 20px;
  &:before{
    position: absolute;
    width: 3px;
    height: 16px;
    background-color: @c-primary;
    content: '';
    left: 0;
    top: 3px;
  }
}
</style>