<template>
  <p-collapse v-if="deviceList.length">
    <p-collapse-panel v-for="(item, index) in deviceList" :key="index" :header="item.deviceName">
      <slot :item='item'></slot>
    </p-collapse-panel>
  </p-collapse>
  <Gt-no-data emptyText='未找到与关键字相符的结果' borderColor='transparent' v-else></Gt-no-data>
</template>

<script>
export default {
  name: 'CollapseList',
  props: {
    deviceList: { //列表
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