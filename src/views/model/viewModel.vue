<template>
  <page :content='modelName' @back='back'>
    <div slot="extraRightText">
      <p v-if="loading">注册设备数：<p-spin><p-icon class="f12" slot="indicator" type="loading" spin /></p-spin></p>
      <p v-else>{{`注册设备数：${registerDeviceNum}`}}</p>
    </div>
    <p-tabs @change="changeType" v-model="activeTab">
      <p-tab-pane v-for="item in tabList" :key="item.key" :tab='item.tab' :forceRender="item.key === 'Overview'">
        <component
          class="mr20"
          :is="item.key"
          :modelId='modelId'
          :registerDeviceNum.sync='registerDeviceNum'
          :loading.sync='loading'
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
      activeTab: 'Overview',
      loading: false,
      tabList: [
        {tab: '概览',key: 'Overview'},
        {tab: '属性',key: 'Attr'},
        {tab: '数据',key: 'Data'},
        {tab: '指令',key: 'Command'},
      ]
    }
  },
  computed: {
    modelId() {
      return this.$route.query.id
    },
    modelName() {
      return this.$route.query.modelName
    },
    comFrom() {
      return this.$route.query.from
    }
  },
  created() {
    const cacheTab = sessionStorage.getItem('model_view_tab')
    const cacheModelId = sessionStorage.getItem('model_view_id')
    if (cacheModelId && this.modelId !== cacheModelId) {
      this.activeTab = 'Overview'
      sessionStorage.setItem('model_view_tab','Overview')
      sessionStorage.setItem('model_view_id',this.modelId)
    }else{
      sessionStorage.setItem('model_view_id',this.modelId)
      cacheTab ? (this.activeTab = cacheTab) : (this.activeTab = 'Overview')
    }
    this.comModelName && (this.modelName = this.comModelName)
  },
  methods: {
    changeType(key) {
      sessionStorage.setItem('model_view_tab',key)
    },
    back() {
      this.comFrom ? this.$router.push(this.comFrom) : this.$router.push('/model') 
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .gt-page-content{
  padding-right: 0;
  overflow: hidden;
}
/deep/ .poros-tabs{
  &>.poros-tabs-content{
    &>.poros-tabs-tabpane{
      height: calc(100vh - 228px);
      overflow: auto;
    }
  }
}
/deep/.poros-table-pagination{
  margin-bottom: 2px;
}
</style>