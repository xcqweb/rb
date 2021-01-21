<template>
  <div :class="{status: isCurrent}">
    <div class="flex mb16">
      <Btn-tabs :tabs='tabs' @change="changeTab"></Btn-tabs>
      <Label label='记录时间' width='60' class="ml20 f1" v-show="!isCurrent">
        <p-range-picker @change="getTableData" v-show="!isCurrent" v-model="time" show-time class="ml20"></p-range-picker>
      </Label>
      <p-button class="reset" @click="reset" icon="reload" />
    </div>
    <p-table
        rowKey="id"
        @change="tableChange"
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
    modelId: String,
    deviceMark: String, //设备标识
    modelMark: String, //模型标识
  },
  data() {
    return {
      tabs: [
        {title: '状态变更',symbol: 'status'},
        {title: '信息变更',symbol: 'info'},
      ],
      currentTab: 'status',
      time: [],
      filteredInfo2: {},
      filtersList1: logType,
      filtersList2: operatorType,
      cacheFilter: {}
    }
  },
  computed: {
    isCurrent() {
      return this.currentTab === 'status'
    },
    ...mapState({
      tenantMark: state => state.user.userInfo.tenantId
    }),
    comChangeType() {
      return this.isCurrent ? (this.filteredInfo1.changeType && this.filteredInfo1.changeType[0]) : 
      (this.filteredInfo2.changeType && this.filteredInfo2.changeType[0])
    },
    columns(){
      let {$formatDate, $arrayItemToString, filteredInfo1,filteredInfo2, filtersList1, filtersList2, isCurrent} = this;
      const arr = [
        {title: '设备',dataIndex: 'deviceName',ellipsis: true},
      ] 
      const arr1 = [
        {
          title: '类型',
          dataIndex: 'changeType',
          ellipsis: true,
          filterMultiple: false,
          filteredValue: filteredInfo1.changeType || [],
          filters: $arrayItemToString(filtersList1),
          width: 120,
          // customRender: data => logTypeList[data]
        },
        {title: '变更前',dataIndex: 'infoBefore',ellipsis: true},
        {title: '变更后',dataIndex: 'infoAfter',ellipsis: true},
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
          // customRender: data => operatorTypeList[data]
        },
        {title: '操作内容',dataIndex: 'changeInfo',ellipsis: true},
        {title: '操作时间',dataIndex: 'ts',ellipsis: true,customRender: date => $formatDate(date)},
      ]
      return isCurrent ? this.isDevice ? arr1 : [...arr,...arr1] : arr2
    } 
  },
  watch: {
    filteredInfo1(val) {
      this.cacheFilter[this.currentTab] = val.changeType
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
      console.log(this.cacheFilter)
      if (!this.tenantMark || !this.deviceMark || !this.modelMark) {
        console.error('标识不存在！')
        return
      }
      const comParams = {
        limit: this.pagination.pageSize,
        pageNo: this.pagination.current,
        changeType: this.comChangeType,
        tenantMark: this.tenantMark,
        deviceMark: this.deviceMark,
        deviceModelMark: this.modelMark
      }
      const param = this.isCurren ? {
        ...comParams,
      } : {
        ...comParams,
        startTime: this.$UTC(this.time[0]),
        endTime: this.$UTC(this.time[1]),
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
      this.filteredInfo1 = {}
      this.filteredInfo2 = {}
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

.status{
  /deep/.poros-table-column-has-filters{
    .anticon-filter{
      right: 60px !important;
    }
  }
}

</style>