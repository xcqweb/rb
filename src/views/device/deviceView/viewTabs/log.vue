<template>
  <div>
    <div class="flex mb16">
      <Btn-tabs :tabs='tabs' @change="changeTab"></Btn-tabs>
      <p-range-picker v-show="!isCurrent" v-model="time" class="ml20"></p-range-picker>
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
export default {
  components: {BtnTabs},
  mixins: [tableMixins],
  props: {
    isDevice: Boolean,
    modelId: String
  },
  data() {
    return {
      tabs: [
        {title: '状态变更',symbol: 'status'},
        {title: '信息变更',symbol: 'info'},
      ],
      currentTab: 'status',
      time: [],
      filtersList1: logType,
      filtersList2: operatorType,
    }
  },
  computed: {
    isCurrent() {
      return this.currentTab === 'status'
    },
    columns(){
      let { filteredInfo1 } = this;
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
          filteredValue: filteredInfo1.systemName || [],
          filters: this.$arrayItemToString(this.filtersList1),
          width: 120
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
          filteredValue: filteredInfo1.systemName || [],
          filters: this.$arrayItemToString(this.filtersList2),
          width:120
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