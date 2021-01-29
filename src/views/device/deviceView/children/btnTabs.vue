<template>
  <ul class="btn-tabs">
    <li
      :class="{active: currentIndex === index}"
      v-for="(item, index) in tabs"
      :key='index'
      @click="clickHandler(index,item)"
    >{{isNullOrEmpty(item.extra) ? item.title : `${item.title}(${comExtra(item.extra)})`}}</li>
  </ul>
</template>

<script>
import {isNullOrEmpty} from '@/utils/util'
export default {
  name: 'BtnTabs',
  props: {
    tabs: Array,
  },
  data() {
    return {
      currentIndex: 0,
      isNullOrEmpty,
    }
  },
  methods: {
    clickHandler(index, item) {
      this.currentIndex = index
      this.$emit('change',item)
    },
    comExtra(extra) {
      const num = !isNaN(extra) && Number(extra) || 0
      return num > 99 ? '99+' : num
    }
  },
}
</script>

<style lang="less" scoped>
  .btn-tabs{
    display: flex;
    &>li{
      width: 88px;
      height: 30px;
      line-height: 30px;
      background: #FFFFFF;
      border-top: 1px solid #CDCED5;
      border-bottom: 1px solid #CDCED5;
      border-left: 1px solid #CDCED5;
      text-align: center;
      transition: all 0.3s;
      cursor: pointer;
      user-select: none;
    }
    &>li:first-child{
      border-radius: 2px 0 0 2px;
    }
    &>li:last-child{
      border-radius: 0 2px 2px 0;
      border-right: 1px solid #CDCED5;
    }
    &>.active{
      border-color: #1740DC;
      border-right: 1px solid #1740DC !important;
      color: #1740DC;
    }
  }
</style>