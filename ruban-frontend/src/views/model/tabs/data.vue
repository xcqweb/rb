<template>
  <div class="data">
    <div class="c_searchArea" :class="{'fd':!addBtn}">
      <p-button @click="paramHandler" type="primary" v-if="addBtn">添加参数</p-button>
      <Search :selectList='selectList' @search='onSearch' v-model="keyword" v-if="search" />
    </div>
    <div class="tableCon">
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
        :customRow='customRow'
        :data-source="tableData"
        >
        <template slot="operation" slot-scope="record">
          <span class="operateBtn" @click="paramHandler(record, 'edit')">编辑</span>
          <span class="operateBtn" @click="monitorHandler(record, 'add')">监控</span>
          <span class="operateBtn" @click="delHandler(record, 'param')">删除</span>
        </template>
        <p-table
            v-if="isShowExpand && record.innerData.length"
            slot="expandedRowRender"
            slot-scope="record"
            :columns="innerColumns"
            :data-source="record.innerData"
            :pagination="false"
            :loading='record.loading'
            row-key="id"
            style="margin:10px 0;"
            class="innerTable"
          >
          <template slot="switch" slot-scope="record1">
            <p-switch @click.native="switchClick(record1)">启用</p-switch>
          </template>
          <template slot="alarmOperator" slot-scope="record1">
            <span class="operateBtn" @click="monitorHandler(record1, 'edit',record)" v-show="!record1.status">编辑</span>
            <span class="operateBtn" @click="delHandler(record, 'monitor',record1)" v-show="!record1.status">删除</span>
          </template>
          </p-table>
      </p-table>
    </div>
    <!-- 弹窗 -->
    <component
      :is="componentId"
      v-model="visible"
      :options="options"
      :title="title"
      @callback="callback"
      ref='modal'
    />
  </div>
</template>

<script>
import modelMixins from './modelMixins'
import DataModal from '../modal/param'
import Monitor from '../modal/monitor'
import {paramType, paramTypeList,alarmLevelList,formualMap,useOption} from '@/utils/baseData'
export default {
  mixins: [modelMixins],
  components: {DataModal,Monitor},
  data() {
    return {
      selectList: [
        {name:'参数名称',key: 'paramName'},
        {name:'参数标识',key: 'paramMark'},
      ],
      filtersList: paramType,
      innerColumns: [
        {
          dataIndex: 'alarmLevel',
          title: '报警等级',
          ellipsis: true,
          customRender(data) {
            return alarmLevelList[data]
          }
        },
        {
          title: '报警阈值',
          ellipsis: true,
          customRender({limit, firstVal,secondVal}) {
            const isBetween = limit === '<>' || limit === '><'
            return formualMap[limit] + (isBetween ? `${firstVal} ~ ${secondVal}` : firstVal)
          }
        },
        {
          dataIndex: 'alarmInfo',
          title: '报警信息',
          ellipsis: true
        },
        {
          title: '是否启用',
          ellipsis: true,
          scopedSlots: { customRender: 'switch' },
        },
        {
          title: '操作',
          ellipsis: true,
          scopedSlots: { customRender: 'alarmOperator' },
        },
      ],
    };
  },
  computed: {
    columns(){
      let { filteredInfo1 } = this;
      return this.isDevice ? [
        {
          title: '参数标识',
          dataIndex: 'paramMark',
          ellipsis: true,
        },
        {
          title: '参数名称',
          dataIndex: 'paramName',
          ellipsis: true,
        },
        {
          title: '最新上报数据',
          dataIndex: 'name',
          ellipsis: true,
        },
        {
          title: '最近上报时间',
          dataIndex: 'systemName',
          ellipsis: true,
        },
      ] :[
        {
          title: '参数标识',
          dataIndex: 'paramMark',
          ellipsis: true,
        },
        {
          title: '参数名称',
          dataIndex: 'paramName',
          ellipsis: true,
        },
        {
          title: '参数类型',
          ellipsis: true,
          dataIndex: 'paramType',
          filterMultiple: false,
          filteredValue: filteredInfo1.paramType || [],
          filters: this.filter && this.filtersList,
          width: 120,
          customRender: function(data) {
            return paramTypeList[data]
          }
        },
        {
          title: '计算精度',
          ellipsis: true,
          dataIndex: 'precision',
          width: 100,
        },
        {
          title: '单位',
          ellipsis: true,
          dataIndex: 'unit',
          width: 100,
        },
        {
          title: '用途',
          ellipsis: true,
          dataIndex: 'used',
          width: 100,
          customRender(data) {
            return useOption[data]
          }
        },
        {
          title: '操作',
          align: 'right',
          width: 160,
          scopedSlots: { customRender: 'operation' },
        },
      ]
    } 
  },
  methods: {
    customRow(record, index) {
      const isExpand = !record.innerData || !record.innerData.length
      return{
        attrs: {class: isExpand ? 'noExpand' : ''}
      }
    },
    getTableData({searchKey = this.selectList[0].key,keyword} = {}){
      const param = {
        searchKey,
        keyword,
        limit: this.pagination.pageSize,
        pageNo: this.pagination.current,
        paramType: this.filteredInfo1.paramType && this.filteredInfo1.paramType[0]
      }
      this.loading = true;
      this.$API.getModelParamsList(param).then( res =>{
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
    paramHandler(item, type){
      this.visible = true
      this.componentId = 'DataModal'
      this.options = {}
      if (type === 'edit') {
        this.title = '编辑参数'
        if (this.add) {
          this.options = {...item, type: 'first-edit'}
        }else{
          this.options = {...item, type: 'edit'}
        }
      }else{
        this.title = '添加参数'
        if (this.add) {
          this.options.type = 'first-add'
        }else{
          this.options.type = 'add'
        }
      }
    },
    monitorHandler(item,type,pItem) {
      this.visible = true
      this.componentId = 'Monitor'
      this.options = {}
      if (type === 'edit') {
        this.title = '编辑监控'
        if (this.add) {
          this.options = {...item, type: 'first-edit'}
          this.options.paramId = pItem.id
        }else{
          this.options = {...item, type: 'edit'}
          this.options.paramId = pItem.id
        }
      }else{
        this.title = '添加监控'
        if (this.add) {
          this.options.type = 'first-add'
          this.options.paramId = item.id
        }else{
          this.options.type = 'add'
          this.options.paramId = item.id
        }
      }
      
    },
    //type monitor 删除监控 param 删除参数
    delHandler(pRow, type, row){
      const that = this;
      this.$confirm({
        centered: true,
        title: '确定要删除吗？',
        icon: h => <p-icon class="exclamation" type="exclamation-circle" />,
        content: (h, params) => {
          const str = `确定删除该参数"${row.name}"吗？`;
          return h('div', {
          }, str);
        },
        onOk() {
          if (that.add) {
            if (type === 'param') {
              const $index = that.tableData.findIndex(item => item.id === row.id)
              that.tableData.splice($index, 1)
              that.$message.success('删除成功');
              that.expandedRowKeys = that.expandedRowKeys.filter( item => item !== row.id)
            }else{
              const index = that.tableData.findIndex(item => item.id === pRow.id)
              const $index = that.tableData[index].innerData.findIndex(item => item.id === row.id)
              that.tableData[index].innerData.splice($index, 1)
              that.$message.success('删除成功');
              console.log(that.tableData)
            }
          }else{
            if (type === 'param') {
              that.$API.delModelParams({id: row.id}).then( res =>{
                if ( res.code === 0 ){
                  that.$message.success('删除成功');
                  that.getTableData();
                }
              }).catch( e =>{
                console.log(e);
              });
            }else{

            }
          }
        },
      });
    },
    switchClick(item) {
      console.log(item)
      this.$set(item, 'status', !item.status)
      return
    },
    tableChange(pagination, filters, sorter){
      this.filteredInfo1 = filters
      this.getTableData(); 
      console.log(pagination, filters, sorter);
    },
    callback(res) {
      const {type,modal, ...data} = res
      if (modal === 'param') { //参数
        if(type === 'first-add') {
          data.innerData = []
          this.tableData.push(data)
          this.$emit('input', this.tableData)
        }else if (type === 'first-edit'){
          const $index = this.tableData.findIndex( item => item.id === data.id)
          const innerData = this.tableData[$index].innerData || []
          this.$set(this.tableData, $index, {...data,innerData})
          this.$emit('input', this.tableData)
        }else if(type === 'add'){

        }else{

        }
      }else{ //监控
        if(type === 'first-add') {
          this.tableData.forEach( item => {
            if (data.paramId === item.id) {
              item.innerData.push(data)
            }
          })
          this.$emit('input', this.tableData)
        }else if (type === 'first-edit'){
          this.tableData.forEach( item => {
            if (data.paramId === item.id) { //monitorId
              const $index = item.innerData.findIndex( el => el.id === data.id)
              item.innerData.splice($index, 1, data)
            }
          })
          this.$emit('input', this.tableData)
        }else if(type === 'add'){

        }else{

        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.data{
  /deep/.tableCon{
    .noExpand {
      .expand-icon{
        visibility: hidden;
      }
      & ~ .poros-table-expanded-row{
        display: none;
      }
    }
  }
  
}
</style>
