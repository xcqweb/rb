<template>
  <page :content='comTitle' @back='back'>
    <p-tabs v-model="activeKey">
      <p-tab-pane key="view" tab="概览">
        <Overview
          v-model="deviceList"
          :isDevice='isDevice'
          :type='comType'
          :modelId.sync='modelId'
          :label='comLabel'
        />
      </p-tab-pane>
      <p-tab-pane key="data" tab="数据">
        <Data search isDevice :deviceId='comDeviceId' v-if="isDevice" />
        <Collapse-list v-else :deviceList='deviceList'>
          <tempalte slot-scope='{item}'>
            <Data search :list='item' />
          </tempalte>
      </Collapse-list>
      </p-tab-pane>
      <p-tab-pane key="command" tab="指令">
        <Command search isDevice :deviceId='comDeviceId' :modelId='modelId' v-if="isDevice" />
        <Collapse-list v-else :deviceList='deviceList'>
          <tempalte slot-scope='{item}'>
            <Command search :list='item' />
          </tempalte>
        </Collapse-list>
        <Send-record />
      </p-tab-pane>
      <p-tab-pane key="alarm" tab="报警" v-if="isDevice">
        <Alarm :deviceId='comDeviceId' />
      </p-tab-pane>
      <p-tab-pane key="log" tab="日志">
        <Log :isDevice='isDevice' :deviceId='comDeviceId'/>
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
      deviceList: []
    }
  },
  watch: {
    comType(val) {
      this.activeKey = 'view'
    }
  },
  computed: {
    comTitle() {
      return `查看${this.comLabel}`
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
    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    }
  },
}
</script>

<style lang="less" scoped>
  
</style>