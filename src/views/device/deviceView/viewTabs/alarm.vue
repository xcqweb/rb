<template>
  <div>
    <div class="flex mb16">
      <Btn-tabs :tabs='tabs' @change="changeTab"></Btn-tabs>
      <Label label='报警时间' width='66' class="ml20 f1" v-show="!isCurrent">
        <p-range-picker v-model="time" @change="getTableData" show-time></p-range-picker>
      </Label>
      <p-button class="reset" @click="reset" icon="reload" />
    </div>
    <p-table
        rowKey="alarmId"
        @change="tableChange"
        @expand="expand"
        :loading="loading"
        :pagination="pagination"
        :expandIcon="customExpandIcon"
        :expandIconAsCell="false"
        :expandIconColumnIndex="0"
        :indentSize="30"
        :expandedRowKeys='expandedRowKeys'
        :columns="columns"
        :data-source="tableData">
        <p-table
            v-if="isShowExpand"
            slot="expandedRowRender"
            slot-scope="record"
            :columns="innerColumns"
            :data-source="record.innerData"
            :pagination="false"
            :loading='innerLoading'
            row-key="alarmId"
            style="margin:10px 0;"
            class="innerTable"
          >
          </p-table>
      </p-table>
  </div>
</template>

<script>
import tableMixins from '@/mixins/tableMixins'
import tableExpandMixins from '@/mixins/table-expand'
import BtnTabs from '../children/btnTabs'
import {alarmSourceTextList,alarmLevelTextList,alarmSourceList,alarmLevelList} from '@/utils/baseData'
import {mapState} from 'vuex'
import {formatDuration} from '@/utils/format'
import {isType} from '@/utils/util'
export default {
  components: {BtnTabs},
  mixins: [tableMixins,tableExpandMixins],
  props: {
    modelId: String,
    deviceMark: String, //设备标识
    modelMark: String, //模型标识
    activeTabkey: String
  },
  data() {
    return {
      tabs: [
        {title: '当前报警',symbol: 'current', extra: 0},
        {title: '历史报警',symbol: 'history', extra: 0},
      ],
      now: +new Date(), //当前时间戳
      timer: null,
      currentTab: 'current',
      time: [],
      filtersList1: alarmLevelTextList,
      filtersList2: alarmSourceTextList,
      innerColumns: [
        {title: '参数',ellipsis: true,customRender: ({paramName,paramMark}) => paramName ? `${paramName}(${paramMark})` : `(${paramMark})`},
        {dataIndex: 'formulaView',title: '监控',ellipsis: true},
        {dataIndex: 'val',title: '数值',ellipsis: true,customRender: val => isType(val, 'null') ? '' : val + ''},
      ],
    }
  },
  computed: {
    isCurrent() {
      return this.currentTab === 'current'
    },
    ...mapState({
      tenantMark: state => state.user.userInfo.tenantId
    }),
    signCommon() {
      const signCommon = {
        tenantMark: this.tenantMark,
        deviceMark: this.deviceMark,
        deviceModelMark: this.modelMark
      }
      return signCommon
    },
    columns(){
      let {$formatDate, $arrayItemToString, filteredInfo1, filtersList1, filtersList2, isCurrent, now} = this;
      const arr1 = [
        {title: '结束时间',dataIndex: 'endTs',ellipsis: true,customRender: date => $formatDate(date)}
      ]
      const arr2 = [
        {
          title: '报警等级',
          dataIndex: 'alarmLevel',
          ellipsis: true,
          filterMultiple: false,
          filteredValue: filteredInfo1.alarmLevel || [],
          filters: $arrayItemToString(filtersList1),
          width:120,
        },
        {
          title: '报警来源',
          dataIndex: 'alarmType',
          ellipsis: true,
          filterMultiple: false,
          filteredValue: filteredInfo1.alarmType || [],
          filters: $arrayItemToString(filtersList2),
          width:120,
        },
        {title: '报警信息',dataIndex: 'alarmInfo',ellipsis: true},
        {title: '报警时间',dataIndex: 'startTs',ellipsis: true,customRender: date => $formatDate(date)},
      ]
      const smtap =  a => a ? +new Date(a) : now
      const arr3 = [
        {title: '持续时间',ellipsis: true, customRender: ({startTs, endTs}) => formatDuration(smtap()  - smtap(startTs))},
      ]
      const arr4 = [
        {title: '持续时间',ellipsis: true, customRender: ({startTs, endTs}) => endTs ? formatDuration(smtap(endTs)  - smtap(startTs)) : ''},
      ]
      return isCurrent ? [...arr2,...arr3] : [...arr2,...arr1,...arr4]
    } 
  },
  watch: {
    tenantMark(val) {
      this.getTableData()
      this.getAlarmCount()
    },
    deviceMark() {
      this.getTableData()
      this.getAlarmCount()
    },
    activeTabkey(key) {
      if (key === 'alarm') {
        this.getTableData()
      }else{
        this.clearTimer()
      }
    }
  },
  mounted() {
    this.getAlarmCount()
  },
  beforeDestroy() {
    this.clearTimer()
  },
  deactivated() {
    this.clearTimer()
  },
  methods: {
    updateNowDate(init) {
      if (this.timer) {
        return
      }
      this.timer = setInterval( () => {
        this.now = +new Date()
      },1000)
    },
    clearTimer() {
      clearInterval(this.timer)
      this.timer = null
    },
    changeTab({symbol}) {
      this.currentTab = symbol
      this.getTableData()
      !this.isCurrent && this.clearTimer()
    },
    validMark() {
      if (!this.tenantMark || !this.deviceMark || !this.modelMark) {
        console.error('标识不存在！')
        return true
      } else{
        return false
      }
    },
    getAlarmCount() {
      if (this.validMark()) {
        return
      }
      this.$API.getDeviceParamAlarmList({...this.signCommon,alarmStatus: 1}).then( res => {
        this.tabs[1].extra = res.data.total
      })
    },
    getTableData(){
      if (this.validMark()) {
        return
      }
      const comParams = {
        limit: this.pagination.pageSize,
        pageNo: this.pagination.current,
        alarmLevel: this.filteredInfo1.alarmLevel && this.filteredInfo1.alarmLevel[0],
        alarmType: this.filteredInfo1.alarmType && this.filteredInfo1.alarmType[0],
        ...this.signCommon
      }
      const param = this.isCurrent ? {
        ...comParams,
        alarmStatus: 0,
      } : {
        ...comParams,
        alarmStatus: 1,
        startTs: this.$UTC(this.time[0]),
        endTs: this.$UTC(this.time[1]),
      }
      this.loading = true;
      this.$API.getDeviceParamAlarmList(param).then( res =>{
        if ( res.code === 0 ){
          this.tableData = (res.data.records || [])
          this.tableData.forEach( el => {
            this.$set(el, 'innerData', JSON.parse(el.paramList))
          });
          
          this.isCurrent && this.tableData.length && this.updateNowDate()
          this.pagination.total = res.data.total;
          this.setTotal(this.currentTab, this.pagination.total)
          this.loading = false;
        }
      }).catch( e =>{
        this.loading = false;
        console.log(e);
      });
    },
    setTotal(key, num) {
      this.tabs.forEach( el => {
        if (key === el.symbol) {
          this.$set(el, 'extra', num)
        }
      })
    },
    reset() {
      this.time = []
      this.getTableData()
    }
  }
}
</script>

<style lang="less" scoped>
.flex{
  position: relative;
  .reset{
    position: absolute;
    right: 0;
    background-color: #F0F1F3;
  }
}
</style>