<template>
  <div :class="{status: isCurrent}">
    <div class="flex mb16">
      <Btn-tabs :tabs='tabs' @change="changeTab"></Btn-tabs>
      <Label label='记录时间' width='60' class="ml20 f1" v-show="!isCurrent">
        <p-range-picker @change="getTableData" v-show="!isCurrent" v-model="time" show-time class="ml20"></p-range-picker>
      </Label>
      <p-select class="w160 ml20" v-model="deviceIdData" @change="changeDevice" v-show="isCurrent && !isDevice">
        <p-select-option v-for="item in deviceList" :key="item.deviceId" :value='item.deviceId'>{{item.deviceName}}</p-select-option>
      </p-select>
      <p-button class="reset" @click="reset" icon="reload" />
    </div>
    <p-table
        rowKey="ts"
        @change="tableChange"
        :locale="{filterReset: '清除'}"
        :loading="loading"
        :pagination="pagination"
        :columns="columns"
        :data-source="tableData">
      </p-table>
  </div>
</template>

<script>
import tableMixins from '@/mixins/tableMixins'
import BtnTabs from '../children/btnTabs'
import {logType,operatorType} from '@/utils/baseData'
import { mapState } from 'vuex'
export default {
  components: {BtnTabs},
  mixins: [tableMixins],
  props: {
    isDevice: Boolean,
    deviceIdProps: String,
    deviceMarkProps: String,
    modelMarkProps: String,
    composeDeviceMark: String,
    activeTabkey: String,
    tenantMark: String, //租户标识
    deviceList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      deviceIdData: '',
      deviceMarkData: '',
      modelMarkData: '',
      tabs: [
        {title: '状态变更',symbol: 'status'},
        {title: '信息变更',symbol: 'info'},
      ],
      currentTab: 'status',
      time: [],
      filteredInfo2: {},
      filtersList1: logType,
      filtersList2: operatorType,
    }
  },
  computed: {
    isCurrent() {
      return this.currentTab === 'status'
    },
    comChangeType() {
      return this.isCurrent ? (this.filteredInfo1.changeType && this.filteredInfo1.changeType[0]) : 
      (this.filteredInfo2.changeType && this.filteredInfo2.changeType[0])
    },
    columns(){
      let {$formatDate, $arrayItemToString, filteredInfo1,filteredInfo2, filtersList1, filtersList2, isCurrent} = this;
      const arr1 = [
        {
          title: '类型',
          dataIndex: 'changeType',
          ellipsis: true,
          filterMultiple: false,
          filteredValue: filteredInfo1.changeType || [],
          filters: $arrayItemToString(filtersList1),
          width: 120,
        },
        {title: '变更前',dataIndex: 'statusBefore',ellipsis: true},
        {title: '变更后',dataIndex: 'statusAfter',ellipsis: true},
        {title: '变更时间',dataIndex: 'ts',ellipsis: true,customRender: date => $formatDate(date)}
      ]
      const arr2 = [
        {title: '操作人',dataIndex: 'operaUser',ellipsis: true},
        {
          title: '操作类型',
          dataIndex: 'changeType',
          ellipsis: true,
          filterMultiple: false,
          filteredValue: filteredInfo2.changeType || [],
          filters: $arrayItemToString(filtersList2),
          width:120,
        },
        {title: '操作内容',dataIndex: 'changeInfo',ellipsis: true},
        {title: '操作时间',dataIndex: 'ts',ellipsis: true,customRender: date => $formatDate(date)},
      ]
      return isCurrent ? arr1 : arr2
    } 
  },
  watch: {
    deviceList: {
      handler(val) {
        this.setSelectInit(this.deviceList)
      },
      immediate: true
    },
    activeTabkey(key) {
      if (key === 'log') {
        this.getTableData()
      }
    },
  },
  methods: {
    changeDevice(deviceId) {
      const findItem = this.deviceList.find( el => el.deviceId === deviceId)
      if (findItem) {
        const {deviceId, deviceMark, modelMark} = findItem
        this.deviceIdData = deviceId
        this.deviceMarkData = deviceMark
        this.modelMarkData = modelMark
        this.getTableData()
      }
    },
    setSelectInit(data) {
      if (data[0]) {
        const {deviceId, deviceMark, modelMark} = data[0]
        this.deviceIdData = deviceId
        this.deviceMarkData = deviceMark
        this.modelMarkData = modelMark
      }else{
        this.deviceIdData = ''
        this.deviceMarkData = ''
        this.modelMarkData = ''
      }
      this.getTableData()
    },
    changeTab({symbol}) {
      this.currentTab = symbol
      this.getTableData()
    },
    getTableData(){
      const {deviceMarkData, modelMarkData} = this
      const {deviceMarkProps, modelMarkProps} = this
      const deviceMark = this.isDevice ? deviceMarkProps : this.isCurrent ? deviceMarkData : this.composeDeviceMark
      const modelMark = this.isDevice ? modelMarkProps : this.isCurrent ? modelMarkData : this.tenantMark
      if (!this.tenantMark || !deviceMark || !modelMark) {
        console.error('标识不存在！')
        return
      }
      const comParams = {
        limit: this.pagination.pageSize,
        pageNo: this.pagination.current,
        changeType: this.comChangeType,
        tenantMark: this.tenantMark,
        deviceMark,
        deviceModelMark: modelMark
      }
      const param = this.isCurrent ? {
        ...comParams,
      } : {
        ...comParams,
        startTs: this.$UTC(this.time[0]),
        endTs: this.$UTC(this.time[1]),
      }
      this.loading = true;
      const fun = this.$API[this.isCurrent ? 'getDeviceLogStateList' : 'getDeviceLogInfoList']
      fun(param).then( res =>{
        if ( res.code === 0 ){
          this.tableData = res.data.records || [];
          this.pagination.total = res.data.total;
        }
        this.loading = false;
      }).catch( e =>{
        this.loading = false;
        console.log(e);
      });
    },
    tableChange(pagination, filters, sorter){
      if (this.isCurrent) {
        this.filteredInfo1 = filters
      }else{
        this.filteredInfo2 = filters
      }
      this.getTableData(); 
    },
    reset() {
      this.time = []
      this.setSelectInit(this.deviceList)
      this.filteredInfo1 = {}
      this.filteredInfo2 = {}
      this.getTableData()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .flex{
  position: relative;
  padding-top: 2px;
  .reset{
    position: absolute;
    right: 0;
    background-color: #F0F1F3;
  }
}

.status{
  /deep/.poros-table-column-has-filters{
    .anticon-filter{
      right: 60px !important;
    }
  }
}

</style>