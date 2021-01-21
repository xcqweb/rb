<template>
  <page :content='deviceName' @back='$router.go(-1)'>
    <p-tabs v-model="activeKey">
      <p-tab-pane key="view" tab="概览">
        <Overview
          v-model="deviceList"
          :isDevice='isDevice'
          :modelId.sync='modelId'
          :deviceName.sync='deviceName'
          :deviceMark.sync='deviceMark'
          :modelMark.sync='modelMark'
          :label='comLabel'
        />
      </p-tab-pane>
      <p-tab-pane key="data" tab="数据">
        <!-- 设备数据 -->
        <Data search isDevice :deviceId='comDeviceId' :modelMark='modelMark' :deviceMark='deviceMark' v-if="isDevice" />
        <!-- 组合数据 -->
        <Collapse-list :deviceList='deviceList' v-else>
          <Data slot-scope='{item}' search componsition isDevice :deviceId='item.deviceId' :modelMark='item.modelMark' :deviceMark='item.deviceMark' />
        </Collapse-list>
      </p-tab-pane>
      <p-tab-pane key="command" tab="指令">
        <!-- 设备指令 -->
        <Command search isDevice :deviceId='comDeviceId' :deviceName='deviceName' :modelId='modelId' v-if="isDevice" />
        <!-- 组合指令 -->
        <Collapse-list :deviceList='deviceList' v-else>
          <Command slot-scope='{item}' search componsition isDevice :modelId='item.modelId' :deviceName='item.deviceName' />
        </Collapse-list>
        <!-- 发送记录 -->
        <Send-record />
      </p-tab-pane>
      <p-tab-pane key="alarm" tab="报警" v-if="isDevice">
        <Alarm :deviceId='comDeviceId' :modelMark='modelMark' :deviceMark='deviceMark' />
      </p-tab-pane>
      <p-tab-pane key="log" tab="日志">
        <Log :isDevice='isDevice' :deviceId='comDeviceId' :modelMark='modelMark' :deviceMark='deviceMark' v-if="isDevice"/>
        <Collapse-list :deviceList='deviceList' v-else>
          <Log slot-scope='{item}' :deviceId='item.deviceId' :modelMark='item.modelMark' :deviceMark='item.deviceMark'/>
        </Collapse-list>
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
      activeKey: 'view',
      modelId: '',
      deviceName: '-',
      modelMark: '',
      deviceMark: '',
      deviceList: [], //设备列表
    }
  },
  watch: {
    comType(val) {
      this.activeKey = 'view'
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
    }
  },
}
</script>