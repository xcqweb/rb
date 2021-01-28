<template>
  <page :content='deviceName' @back='back'>
    <p-tabs v-model="activeTab" @change="changeType">
      <p-tab-pane key="view" forceRender :disabled='tabDisabled'>
        <span slot="tab">概览
          <p-spin v-show="comLoading('view')"><p-icon class="f12" slot="indicator" type="loading" spin /></p-spin>
        </span>
        <Overview
          class="mr20"
          v-model="deviceList"
          :isDevice='isDevice'
          :modelId.sync='modelId'
          :deviceName.sync='deviceName'
          :deviceMark.sync='deviceMark'
          :modelMark.sync='modelMark'
          :composeDeviceMark='composeDeviceMark'
          :loadingDetail.sync='loadingDetail'
          :label='comLabel'
        />
      </p-tab-pane>
      <p-tab-pane key="data" :disabled='tabDisabled'>
        <span slot="tab">数据
          <p-spin v-show="comLoading('data')"><p-icon class="f12" slot="indicator" type="loading" spin /></p-spin>
        </span>
        <!-- 设备数据 -->
        <Data
          class="mr20"
          search
          isDevice
          :activeTabkey='activeTab'
          :deviceId='comDeviceId'
          :modelMark='modelMark'
          :deviceMark='deviceMark'
          v-if="isDevice"
        />
        <!-- 组合数据 -->
        <Collapse-list class="mr20" :deviceList='deviceList' v-else>
          <Data
            slot-scope='{item}'
            search 
            componsition 
            isDevice 
            :activeTabkey='activeTab' 
            :deviceId='item.deviceId' 
            :modelMark='item.modelMark' 
            :deviceMark='item.deviceMark' 
          />
        </Collapse-list>
      </p-tab-pane>
      <p-tab-pane key="command" :disabled='tabDisabled'>
        <span slot="tab">指令
          <p-spin v-show="comLoading('command')"><p-icon class="f12" slot="indicator" type="loading" spin /></p-spin>
        </span>
        <!-- 设备指令 -->
        <Command 
          class="mr20"
          search 
          isDevice 
          filter 
          :deviceId='comDeviceId' 
          :deviceName='deviceName' 
          :modelId='modelId' 
          v-if="isDevice" 
        />
        <!-- 组合指令 -->
        <Collapse-list class="mr20" :deviceList='deviceList' v-else>
          <Command 
            slot-scope='{item}' 
            search 
            filter 
            componsition 
            isDevice 
            :modelId='item.modelId' 
            :deviceName='item.deviceName' 
          />
        </Collapse-list>
        <!-- 发送记录 -->
        <Send-record class="mr20" />
      </p-tab-pane>
      <p-tab-pane key="alarm" v-if="isDevice" :disabled='tabDisabled'>
        <span slot="tab">报警
          <p-spin v-show="comLoading('alarm')"><p-icon class="f12" slot="indicator" type="loading" spin /></p-spin>
        </span>
        <Alarm 
          class="mr20"
          :deviceId='comDeviceId' 
          :modelMark='modelMark' 
          :deviceMark='deviceMark' 
        />
      </p-tab-pane>
      <p-tab-pane key="log" :disabled='tabDisabled'>
        <span slot="tab">日志
          <p-spin v-show="comLoading('log')"><p-icon class="f12" slot="indicator" type="loading" spin /></p-spin>
        </span>
        <Log 
          class="mr20"
          :isDevice='isDevice' 
          :deviceIdProps='comDeviceId' 
          :modelMarkProps='modelMark' 
          :deviceMarkProps='deviceMark'
          :composeDeviceMark='composeDeviceMark'
          v-if="isDevice"
        />
        <Log class="mr20" :activeTab='activeTab' :deviceList='deviceList' v-else/>
      </p-tab-pane>
    </p-tabs>
  </page>
</template>

<script>

import Overview from './viewTabs/overview'
import Data from '../../model/tabs/data'
import Command from '../../model/tabs/command'
import Alarm from './viewTabs/alarm'
import Log from './viewTabs/log'
import SendRecord from '../../model/children/sendRecord'
export default {
  name: 'viewDevice',
  components: {
    Overview,
    Data,
    Command,
    SendRecord,
    Alarm,
    Log
  },
  data() {
    return{
      activeTab: 'view',
      modelId: '',
      deviceName: '-',
      modelMark: '',
      deviceMark: '',
      composeDeviceMark: '',
      deviceList: [], //设备列表
      loadingDetail: false
    }
  },
  watch: {
    comType(val) {
      this.activeTab = 'view'
    }
  },
  computed: {
    tabDisabled() {
      return this.loadingDetail
    },
    comType() {
      const {type} = this.$route.query
      return type
    },
    comLabel() {
      return this.comType === 'device' ? '设备' : '组合'
    },
    isDevice() {
      return this.comType === 'device'
    },
    comDeviceId() {
      return this.$route.query.id
    },
    comDeviceName() {
      return this.$route.query.deviceName
    }
  },
  created() {
    const cacheTab = sessionStorage.getItem('device_view_tab')
    const cacheDeviceId = sessionStorage.getItem('device_view_id')
    if (cacheDeviceId && this.comDeviceId !== cacheDeviceId) {
      this.activeTab = 'view'
      sessionStorage.setItem('device_view_tab','view')
      sessionStorage.setItem('device_view_id',this.comDeviceId)
    }else{
      sessionStorage.setItem('device_view_id',this.comDeviceId)
      cacheTab ? (this.activeTab = cacheTab) : (this.activeTab = 'view')
    }
    this.comDeviceName && (this.deviceName = this.comDeviceName)
  },
  methods: {
    changeType(key) {
      sessionStorage.setItem('device_view_tab',key)
    },
    back() {
      this.$router.go(-1)
    },
    comLoading(tab) {
      return this.tabDisabled && this.activeTab === tab
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
      height: calc(100vh - 226px);
      overflow: auto;
    }
  }
}
/deep/.poros-table-pagination{
  margin-bottom: 2px;
}
</style>