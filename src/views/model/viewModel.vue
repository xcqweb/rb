<template>
  <page :content='modelName' @back='back' :extraRightText='extraRightText'>
    <p-tabs  @change="callback">
      <p-tab-pane v-for="item in tabList" :key="item.key" :tab="item.tab">
        <component
          :is="item.key"
          :modelId='modelId'
          :registerDeviceNum.sync='registerDeviceNum'
          :modelName.sync='modelName'
          search
          addBtn
          filter
        ></component>
      </p-tab-pane>
    </p-tabs>
  </page>
</template>

<script>
import Overview from './tabs/overview.vue'
import Data from './tabs/data.vue'
import Attr from './tabs/attr.vue'
import Command from './tabs/command.vue'
export default {
  name: 'viewModel',
  components: {Overview,Data,Attr,Command},
  data() {
    return {
      registerDeviceNum: 0,
      modelName: '-',
      tabList: [
        {tab: '概览',key: 'Overview'},
        {tab: '属性',key: 'Attr'},
        {tab: '数据',key: 'Data'},
        {tab: '指令',key: 'Command'},
      ]
    }
  },
  computed: {
    extraRightText() {
      return `注册设备数：${this.registerDeviceNum || '-'}`
    },
    modelId() {
      return this.$route.query.id
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    }
  }
}
</script>