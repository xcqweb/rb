<template>
  <page content='马达' @back='back' :extraRightText='extraRightText'>
    <p-tabs  @change="callback">
      <p-tab-pane key="view" tab="概览">
        <Overview :modelId='modelId'/>
      </p-tab-pane>
      <p-tab-pane key="attr" tab="属性">
        <Attr search addBtn filter :modelId='modelId' />
      </p-tab-pane>
      <p-tab-pane key="data" tab="数据">
        <Data search addBtn filter :modelId='modelId' />
      </p-tab-pane>
      <p-tab-pane key="command" tab="指令">
        <Command search addBtn filter :modelId='modelId' />
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
  components: {
    Overview,
    Data,
    Attr,
    Command
  },
  data() {
    return {
      
    }
  },
  computed: {
    extraRightText() {
      return '注册设备数：10'
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