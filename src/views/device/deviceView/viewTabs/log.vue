<template>
  <div>
    <div class="flex mb16">
      <Btn-tabs :tabs='tabs' @change="changeTab"></Btn-tabs>
      <p-date-picker v-show="!isCurrent" v-model="time" class="ml20"></p-date-picker>
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
import paginationMixins from '@/mixins/pagination'
import expandIconMixins from '@/mixins/table-expand-icon'
import BtnTabs from '../children/btnTabs'
import {logType,operatorType} from '@/utils/baseData'
export default {
  components: {BtnTabs},
  mixins: [paginationMixins,expandIconMixins],
  props: {
    isDevice: Boolean
  },
  data() {
    return {
      tabs: [
        {title: '状态变更',symbol: 'status'},
        {title: '信息变更',symbol: 'info'},
      ],
      currentTab: 'status',
      time: '',
      loading: false,
      filtersList: logType,
      filtersList2: operatorType,
      filteredInfo1: null,
      filteredInfo2: null,
    }
  },
  computed: {
    isCurrent() {
      return this.currentTab === 'status'
    },
    isShowExpand() {
      return this.innerColumns.length
    },
    columns(){
      let { filteredInfo1,filteredInfo2 } = this;
      filteredInfo1 = filteredInfo1 || {};
      filteredInfo2 = filteredInfo2 || {};
      const arr = [
        {
          title: '设备',
          dataIndex: 'systemName2',
          ellipsis: true,
        },
      ] 
      const arr1 = [
        {
          title: '类型',
          dataIndex: 'type',
          ellipsis: true,
          filterMultiple: false,
          filteredValue: filteredInfo1.systemName || null,
          filters: this.filtersList,
          width: 100
        },
        {
          title: '变更前',
          dataIndex: 'systemName2',
          ellipsis: true,
        },
        {
          title: '变更后',
          dataIndex: 'systemName3',
          ellipsis: true,
        },
        {
          title: '变更时间',
          dataIndex: 'systemName4',
          ellipsis: true,
        }
      ]
      const arr2 = [
        {
          title: '操作人',
          dataIndex: 'name',
          ellipsis: true,
        },
        {
          title: '操作类型',
          dataIndex: 'systemName6',
          ellipsis: true,
          filterMultiple: false,
          filteredValue: filteredInfo2.systemName || null,
          filters: this.filtersList2,
          width:100
        },
        {
          title: '操作内容',
          dataIndex: 'name2',
          ellipsis: true,
        },
        {
          title: '操作时间',
          dataIndex: 'systemName',
          ellipsis: true,
        },
      ]
      return this.isCurrent ? this.isDevice ? arr1 : [...arr,...arr1] : arr2
    } 
  },
  methods: {
    changeTab({symbol}) {
      this.currentTab = symbol
    },
    reset(){
      this.time = ''
      this.filteredInfo1 = null
      this.pagination.pageSize = 10
      this.pagination.current = 1
      this.getTableData();
    },
    tableChange(pagination, filters, sorter){
      this.filteredInfo1 = filters
      this.getTableData(); 
      console.log(pagination, filters, sorter);
    },
    getTableData(){
      const param = {
        keyword: this.keyword,
        limit: this.pagination.pageSize,
        pageNo: this.pagination.current,
        systemId: this.systemId,
      }
      // this.loading = true;
      // rolePermissionApi.getPermissionRoleList(param).then( res =>{
      //   if ( res.code === 0 ){
      //     this.tableData = res.data.records || [];
      //     this.pagination.total = res.data.total;
      //   }
      //   this.loading = false;
      // }).catch( e =>{
      //   this.loading = false;
      //   console.log(e);
      // });
    },
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