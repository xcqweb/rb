<template>
  <div>
    <div class="flex mb16">
      <Btn-tabs :tabs='tabs' @change="changeTab" extra='10'></Btn-tabs>
      <Label label='记录时间' class="ml20 f1" v-show="!isCurrent">
        <p-range-picker v-model="time"></p-range-picker>
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
import {alarmSource,alarmLevel} from '@/utils/baseData'
export default {
  components: {BtnTabs},
  mixins: [tableMixins,tableExpandMixins],
  props: {
    modelId: String
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
        {
          dataIndex: 'tplType',
          title: '参数',
          ellipsis: true
        },
        {
          dataIndex: 'tplType',
          title: '监控',
          ellipsis: true
        },
        {
          dataIndex: 'tplType',
          title: '数值',
          ellipsis: true
        },
      ],
    }
  },
  computed: {
    isCurrent() {
      return this.currentTab === 'current'
    },
    columns(){
      let { filteredInfo1 } = this;
      const arr1 = [
        {
          title: '结束时间',
          dataIndex: 'systemName',
          ellipsis: true,
        }
      ]
      const arr2 = [
        {
          title: '报警等级',
          dataIndex: 'name',
          ellipsis: true,
          filterMultiple: false,
          filteredValue: filteredInfo1.systemName || [],
          filters: this.$arrayItemToString(this.filtersList1),
          width:120
        },
        {
          title: '报警来源',
          dataIndex: 'systemName',
          ellipsis: true,
          filterMultiple: false,
          filteredValue: filteredInfo1.systemName || [],
          filters: this.$arrayItemToString(this.filtersList2),
          width:120
        },
        {
          title: '报警信息',
          dataIndex: 'name',
          ellipsis: true,
        },
        {
          title: '报警时间',
          dataIndex: 'systemName',
          ellipsis: true,
        },
      ]
      const arr3 = [
        {
          title: '持续时间',
          dataIndex: 'systemName',
          ellipsis: true,
        },
      ]
      return this.isCurrent ? [...arr2,...arr3] : [...arr2,...arr1,...arr3]
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