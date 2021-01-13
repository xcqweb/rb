<template>
  <div class="model" title="模型列表">
    <div class="c_searchArea fd">
      <div class="c_right">
        <Search @search="onSearch" :selectList='selectList' v-model="keyword" @reset="reset"/>
      </div>
    </div>
    <div class="tableCon">
      <p-table
        rowKey="id"
        @change="tableChange"
        :loading="loading"
        :pagination="pagination"
        :columns="columns"
        :data-source="tableData">
        <template slot="name" slot-scope="text, record">
          <span class="viewDetail" :title="record.name">{{record.name}}</span>
        </template>
        <template slot="createTime" slot-scope="text, record">
          <span>{{$formatDate(record.createTime)}}</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <span  class="operateBtn" @click="viewClick(record)">查看报文</span>
        </template>
      </p-table>
    </div>
    <component
      :is='componentId'
      v-model="visible"
    ></component>
  </div>
</template>

<script>
import tableMixins from '@/mixins/tableMixins'
import {commandColumns} from '../base'
import ViewMsg from '../../deviceView/modal/viewMsg'
import {sendType,resultType} from '@/utils/baseData'
export default {
  mixins: [tableMixins],
  components: {ViewMsg},
  data() {
    return {
      filtersList1: sendType,
      filtersList2: resultType,
      selectList: [
        {name:'指令名称',key: 'modelName'},
        {name:'指令标识',key: 'creater'},
        {name:'发送时间',key: 'time'},
      ]
    };
  },
  computed: {
    columns(){
      let { filteredInfo1} = this;
      return [
        ...commandColumns.slice(0,3),
        {
          title: '发送对象',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '发送时间',
          dataIndex: 'systemName',
          ellipsis: true,
        },
        {
          title: '发送状态',
          ellipsis: true,
          dataIndex: 'description',
          filterMultiple: false,
          filteredValue: filteredInfo1.systemName || [],
          filters: this.$arrayItemToString(this.filtersList1),
          width: 100,
        },
        {
          title: '执行时间',
          ellipsis: true,
          dataIndex: 'createName',
        },
        {
          title: '执行结果',
          ellipsis: true,
          dataIndex: 'createName',
          filterMultiple: false,
          filteredValue: filteredInfo1.systemName || [],
          filters: this.$arrayItemToString(this.filtersList2),
          width: 100,
        },
        {
          title: '操作',
          dataIndex: 'operate',
          align: 'right',
          width: 100,
          scopedSlots: { customRender: 'operation' },
        },
      ]
    } 
  },
  methods: {
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
      this.tableData = [{id:1}]
    },
    viewClick(record){
      this.componentId = 'ViewMsg'
      this.visible = true
    },
    tableChange(pagination, filters, sorter){
      this.filteredInfo1 = filters
      this.getTableData(); 
      console.log(pagination, filters, sorter);
    },
  }
};
</script>

<style lang="less">
.model{
  margin-top: 12px;
  .routePageTitle{
    font-size: @f-big;
    line-height: 1;
    padding: 13px 20px;
    line-height:22px;
    border-bottom: 1px solid @c-bg-1;
  }
}
</style>
