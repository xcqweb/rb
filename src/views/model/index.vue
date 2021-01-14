<template>
  <page class="model" title="模型列表">
    <div class="c_searchArea">
      <p-button @click="addModel" type="primary">新增模型</p-button>
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
        <template slot="modelName" slot-scope="record">
          <span class="viewDetail" :title="record.modelName" @click="viewDetailClick(record)">{{record.modelName}}</span>
        </template>
        <template slot="operation" slot-scope="record">
          <span  class="operateBtn" @click="viewClick(record)">查看</span>
          <span  class="operateBtn" @click="delClick(record)">删除</span>
        </template>
      </p-table>
    </div>
  </page>
</template>

<script>
import tableMixins from '@/mixins/tableMixins'
import {judgeType, judgeTypeList} from '@/utils/baseData'
export default {
  mixins: [tableMixins],
  data() {
    return {
      filtersList: judgeType,
      selectList: [
        {name:'模型名称',key: 'modelName'},
        {name:'创建人',key: 'createBy'},
        {name:'创建时间',key: 'time',},
      ]
    };
  },
  computed: {
    columns(){
      let { filteredInfo1 } = this;
      const that = this
      return [
        {
          title: '模型名称',
          scopedSlots: { customRender: 'modelName' },
        },
        // {
        //   title: '上报频率',
        //   dataIndex: 'rate',
        //   ellipsis: true,
        // },
        {
          title: '异常判断',
          ellipsis: true,
          dataIndex: 'ruleType',
          filterMultiple: false,
          filteredValue: filteredInfo1.ruleType || null,
          filters: this.$arrayItemToString(this.filtersList),
          width: 100,
          customRender: function(data) {
            return judgeTypeList[data]
          }
        },
        {
          title: '注册设备数',
          ellipsis: true,
          dataIndex: 'registerDeviceNum',
          width: 100,
        },
        {
          title: '描述',
          ellipsis: true,
          dataIndex: 'remark',
        },
        {
          title: '创建人',
          ellipsis: true,
          dataIndex: 'createBy',
          width: 136,
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 180,
          customRender(date) {
            return that.$formatDate(date)
          }
          
        },
        {
          title: '操作',
          align: 'right',
          width: 90,
          scopedSlots: { customRender: 'operation' },
        },
      ]
    } 
  },
  methods: {
    getTableData({searchKey = this.selectList[0].key, keyword} = {}){
      const isArray = Array.isArray(keyword)
      const param = {
        keyword: isArray ? undefined : keyword,
        searchKey: isArray ? undefined : searchKey,
        limit: this.pagination.pageSize,
        pageNo: this.pagination.current,
        startTime: isArray ? this.$UTC(keyword[0]) : undefined,
        endTime: isArray ? this.$UTC(keyword[1]) : undefined,
        ruleType: this.filteredInfo1.ruleType && this.filteredInfo1.ruleType[0]
      }
      this.loading = true;
      this.$API.getModelList(param).then( res =>{
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
    addModel(){
      this.$router.push({
        path : '/model/addModel',
      }); 
    },
    viewDetailClick({id}){
      this.$router.push({
        path : '/model/viewModel',
        query: {id}
      }); 
    },
    viewClick({id}){
      this.$router.push({
        path : '/model/viewModel',
        query: {id},
      }); 
    },
    delClick({modelName, id}){
      const that = this;
      this.$confirm({
        centered: true,
        title: '确定要删除吗？',
        icon: h => <p-icon class="exclamation" type="exclamation-circle" />,
        content: (h, params) => {
          const str = `确定删除该模型"${modelName}"吗？`;
          return h('div', {
          }, str);
        },
        onOk() {
          that.$API.delModel({id}).then( res =>{
            if ( res.code === 0 ){
              that.$message.success('删除成功');
              if (that.tableData.length <= 1 && that.pagination.current > 1) {
                that.pagination.current --
              }
              that.getTableData()
            }
          }).catch( e =>{
            console.log(e);
          });
        },
      });
    },
    tableChange(pagination, filters, sorter){
      this.filteredInfo1 = filters
      this.getTableData(); 
    },
  }
};
</script>

<style lang="less">
.model{
  .routePageTitle{
    font-size: @f-big;
    line-height: 1;
    padding: 13px 20px;
    line-height:22px;
    border-bottom: 1px solid @c-bg-1;
  }
}
</style>