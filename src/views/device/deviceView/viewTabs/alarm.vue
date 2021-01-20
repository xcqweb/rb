<template>
  <div>
    <div class="flex mb16">
      <Btn-tabs :tabs='tabs' @change="changeTab" extra='10'></Btn-tabs>
      <Label label='报警时间' class="ml20 f1" v-show="!isCurrent">
        <p-range-picker v-model="time" @change="getTableData" show-time></p-range-picker>
      </Label>
      <p-button class="reset" @click="reset" icon="reload" />
    </div>
    <p-table
        rowKey="id"
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
            :loading='record.loading'
            :class="{noExpand: !record.innerData || !record.innerData.length}"
            row-key="id"
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
import {alarmSource,alarmLevel,alarmSourceList,alarmLevelList} from '@/utils/baseData'
import {mapState} from 'vuex'
export default {
  components: {BtnTabs},
  mixins: [tableMixins,tableExpandMixins],
  props: {
    modelId: String,
    deviceMark: String, //设备标识
    modelMark: String, //模型标识
  },
  data() {
    return {
      tabs: [
        {title: '当前报警',symbol: 'current'},
        {title: '历史报警',symbol: 'history'},
      ],
      currentTab: 'current',
      time: [],
      filtersList1: alarmLevel,
      filtersList2: alarmSource,
      innerColumns: [
        {dataIndex: 'tplType',title: '参数',ellipsis: true},
        {dataIndex: 'tplType',title: '监控',ellipsis: true},
        {dataIndex: 'tplType',title: '数值',ellipsis: true},
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
    columns(){
      let {$formatDate, $arrayItemToString, filteredInfo1, filtersList1, filtersList2, isCurrent} = this;
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
          customRender: data => alarmLevelList[data]
        },
        {
          title: '报警来源',
          dataIndex: 'alarmType',
          ellipsis: true,
          filterMultiple: false,
          filteredValue: filteredInfo1.alarmType || [],
          filters: $arrayItemToString(filtersList2),
          width:120,
          customRender: data => alarmSourceList[data]
        },
        {title: '报警信息',dataIndex: 'alarmInfo',ellipsis: true},
        {title: '报警时间',dataIndex: 'startTs',ellipsis: true,customRender: date => $formatDate(date)},
      ]
      const arr3 = [
        {title: '持续时间',ellipsis: true},
      ]
      return isCurrent ? [...arr2,...arr3] : [...arr2,...arr1,...arr3]
    } 
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    changeTab({symbol}) {
      this.currentTab = symbol
      this.getTableData()
    },
    getTableData(){
      const comParams = {
        limit: this.pagination.pageSize,
        pageNo: this.pagination.current,
        alarmLevel: this.filteredInfo1.alarmLevel && this.filteredInfo1.alarmLevel[0],
        alarmType: this.filteredInfo1.alarmType && this.filteredInfo1.alarmType[0],
        tenantMark: this.tenantMark,
        deviceMark: this.deviceMark,
        deviceModelMark: this.modelMark
      }
      const param = this.isCurren ? {
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
          this.tableData = res.data.records || [];
          this.pagination.total = res.data.total;
        }
        this.loading = false;
      }).catch( e =>{
        this.loading = false;
        console.log(e);
      });
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