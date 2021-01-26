<template>
  <page :content='modelName' @back='back' :extraRightText='extraRightText'>
    <p-tabs @change="changeType" v-model="activeTab">
      <p-tab-pane v-for="item in tabList" :key="item.key" :disabled='loading' :forceRender="item.key === 'Overview'">
        <span slot="tab">{{item.tab}}
          <p-spin v-show="comLoading(item.key)"><p-icon class="f12" slot="indicator" type="loading" spin /></p-spin>
        </span>
        <component
          class="mr20"
          :is="item.key"
          :modelId='modelId'
          :loading.sync='loading'
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
    extraRightText() {
      return `注册设备数：${this.registerDeviceNum || '0'}`
    },
    modelId() {
      return this.$route.query.id
    },
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
  },
  methods: {
    changeType(key) {
      sessionStorage.setItem('model_view_tab',key)
    },
    comLoading(tab) {
      return this.loading && this.activeTab === tab
    },
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .gt-page-content{
  padding-right: 0;
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