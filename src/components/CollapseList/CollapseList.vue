<template>
  <p-collapse class="mt10">
      <p-collapse-panel v-for="(item, index) in deviceList" :key="index" :header="item.deviceName">
        <slot :item='item'></slot>
      </p-collapse-panel>
    </p-collapse>
</template>

<script>
export default {
  name: 'CollapseList',
  props: {
    deviceList: {
      type: Array,
      default: function() {
        return []
      }
    }
  }
}
</script>

<style lang="less" scoped>
  
</style>