<template>
  <page :content='deviceName' @back='back'>
    <p-tabs v-model="activeTab" @change="changeType">
      <p-tab-pane key="view" forceRender>
        <span slot="tab">概览</span>
        <Overview
          class="mr20"
          v-model="deviceList"
          :loadingDetail.sync='loadingDetail'
          :deviceName.sync='deviceName'
          :isDevice='isDevice'
          :label='comLabel'
        />
      </p-tab-pane>
      <p-tab-pane key="data">
        <span slot="tab">数据</span>
        <!-- 设备数据 -->
        <Data
          class="mr20"
          search
          isDevice
          :activeTabkey='activeTab'
          :deviceId='comDeviceId'
          :modelMark='modelMark'
          :deviceMark='deviceMark'
          :tenantMark='tenantMark'
          v-if="isDevice"
        />
        <!-- 组合数据 -->
        <Collapse-list :deviceList='deviceList' :loading='loadingDetail' v-else>
          <Data
            slot-scope='{item}'
            search 
            componsition 
            isDevice 
            :activeTabkey='activeTab' 
            :deviceId='item.deviceId' 
            :modelMark='item.modelMark' 
            :deviceMark='item.deviceMark'
            :tenantMark='tenantMark'
          />
        </Collapse-list>
      </p-tab-pane>
      <p-tab-pane key="command">
        <span slot="tab">指令</span>
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
        <Collapse-list :deviceList='deviceList' :loading='loadingDetail' v-else>
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
      <p-tab-pane key="alarm" v-if="isDevice">
        <span slot="tab">报警</span>
        <Alarm 
          class="mr20"
          :deviceId='comDeviceId' 
          :modelMark='modelMark' 
          :deviceMark='deviceMark'
          :tenantMark='tenantMark'
          :activeTabkey='activeTab' 
        />
      </p-tab-pane>
      <p-tab-pane key="log">
        <span slot="tab">日志</span>
        <Log 
          class="mr20"
          :isDevice='isDevice' 
          :deviceIdProps='comDeviceId' 
          :modelMarkProps='modelMark' 
          :deviceMarkProps='deviceMark'
          :tenantMark='tenantMark'
          :activeTabkey='activeTab'
          :deviceList='deviceList'
          :composeDeviceMark='composeDeviceMark'
        />
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
      deviceList: [], //设备列表
      loadingDetail: false,
      deviceName: '-',
    }
  },
  watch: {
    comType(val) {
      this.activeTab = 'view'
    }
  },
  computed: {
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
    deviceMark() {
      return this.$route.query.deviceMark
    },
    modelMark() {
      return this.$route.query.modelMark
    },
    deviceMark() {
      return this.$route.query.deviceMark
    },
    tenantMark() {
      return this.$route.query.tenantId
    },
    modelId() {
      return this.$route.query.modelId
    },
    composeDeviceMark() {
      return this.$route.query.mark
    },
    comFrom() {
      return this.$route.query.from
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
      this.comFrom ? this.$router.push(this.comFrom) : this.$router.push('/device/deviceView')
    },
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