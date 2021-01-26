<template>
  <div class="sendRecord">
    <div class="c_searchArea fd">
      <div class="c_right">
        <Search @search="onSearch" :selectList='selectList' v-model="keyword.keyword" @reset="reset"/>
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
        <template slot="name" slot-scope="record">
          <span class="viewDetail" :title="record">{{record}}</span>
        </template>
        <span slot="sendTime" slot-scope="sendTime">{{$formatDate(sendTime)}}</span>
        <span slot="receiveTime" slot-scope="receiveTime">{{$formatDate(receiveTime)}}</span>
        <span class="operateBtn" slot="operation" slot-scope="record" @click="viewClick(record)">查看报文</span>
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
import {commandColumns} from '@/views/base'
import ViewMsg from '../../deviceView/modal/viewMsg'
import {sendType,sendTypeList,resultType} from '@/utils/baseData'
export default {
  mixins: [tableMixins],
  components: {ViewMsg},
  data() {
    return {
      filtersList1: sendType,
      filtersList2: resultType,
      selectList: [
        {name:'指令名称',key: 'commandName'},
        {name:'指令标识',key: 'commandMark'},
        {name:'发送时间',key: 'createTime'},
      ]
    };
  },
  computed: {
    columns(){
      let { filteredInfo1} = this;
      return [
        ...commandColumns.slice(0,3),
        {title: '发送对象',dataIndex: 'name',scopedSlots: { customRender: 'name' }},
        {title: '发送时间',dataIndex: 'sendTime',ellipsis: true,scopedSlots: { customRender: 'sendTime' }},
        {
          title: '发送状态',
          ellipsis: true,
          dataIndex: 'status',
          filterMultiple: false,
          filteredValue: filteredInfo1.status || [],
          filters: this.$arrayItemToString(this.filtersList1),
          width: 120,
          customRender: data => sendTypeList[data]
        },
        {
          title: '执行时间',
          ellipsis: true,
          dataIndex: 'receiveTime',
          scopedSlots: { customRender: 'receiveTime' },
        },
        {
          title: '执行结果',
          ellipsis: true,
          dataIndex: 'resultCode',
          filterMultiple: false,
          filteredValue: filteredInfo1.resultCode || [],
          filters: this.$arrayItemToString(this.filtersList2),
          width: 120,
        },
        {title: '操作',dataIndex: 'operate',align: 'right',width: 80,scopedSlots: { customRender: 'operation' }},
      ]
    } 
  },
  mounted() {
    this.getTableData()
  },
  methods: {
    getTableData(){
      const {keyword,searchKey = this.selectList[0].key} = this.keyword.keyword
      const isArray = Array.isArray(keyword)
      const param = {
        keyword: isArray ? undefined : keyword,
        searchKey,
        limit: this.pagination.pageSize,
        pageNo: this.pagination.current,
        startTs: isArray ? this.$UTC(keyword[0]) : undefined,
        endTs: isArray ? this.$UTC(keyword[1]) : undefined,
        resultCode: this.filteredInfo1.resultCode && this.filteredInfo1.resultCode[0],
        status: this.filteredInfo1.status && this.filteredInfo1.status[0],
      }
      this.loading = true;
      this.$API.getCommandSendRecordList(param).then( res =>{
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
    viewClick(record){
      this.componentId = 'ViewMsg'
      this.visible = true
    },
    tableChange(pagination, filters, sorter){
      this.filteredInfo1 = filters
      this.getTableData(); 
    },
  }
};
</script>

<style lang="less" scoped>
.sendRecord{
  margin-top: 12px;
}
</style>
