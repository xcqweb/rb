<template>
  <div>
    <Page-title v-if="isDevice">指令列表</Page-title>
    <div class="c_searchArea" :class="{fd:!addBtn}">
      <p-button @click="commandHandler" type="primary" v-if="addBtn">新增指令</p-button>
      <Search :selectList='selectList' v-model="keyword" v-if="search" />
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
        :data-source="tableData">
        <template slot="operation" slot-scope="record, index">
          <span class="operateBtn" @click="delClick(record,'command',index)" v-if="isDevice">发送</span>
          <template v-else>
            <span class="operateBtn" @click="commandHandler(record, 'edit')">编辑</span>
            <span class="operateBtn" @click="delClick(record, 'del', index)">删除</span>
          </template>
        </template>
        <p-table
            v-if="isShowExpand"
            slot="expandedRowRender"
            slot-scope="record"
            :columns="innerColumns"
            :data-source="record.innerData"
            :pagination="false"
            :loading='record.loading'
            row-key="id"
            style="margin:10px 0;"
            class="innerTable"
          ></p-table>
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
import CommandModal from '../modal/command'
import {commandColumns} from '../../device/deviceView/base'
export default {
  mixins: [modelMixins],
  components: {CommandModal},
  data() {
    return {
      selectList: [
        {name:'指令名称',key: 'commandName'},
        {name:'指令标识',key: 'commandMark'},
      ],
      filtersList: [],
      innerColumns: [
        {
          dataIndex: 'commandVarMark',
          title: '变量标识',
          ellipsis: true
        },
        {
          dataIndex: 'commandVarValue',
          title: '默认值',
          ellipsis: true,
          // customRender: (item) => {
          //   return <span>{['禁用', '启用'][item]}</span>;
          // },
        },
        {
          dataIndex: 'remark',
          title: '注释',
          ellipsis: true,
        },
      ],
    };
  },
  computed: {
    columns(){
      let { filteredInfo1 } = this;
      filteredInfo1 = filteredInfo1 || {};
      return [
        ...commandColumns,
        {
          title: '操作',
          align: 'right',
          width: 120,
          scopedSlots: { customRender: 'operation' },
        },
      ]
    } 
  },
  methods: {
    getTableData({searchKey = this.selectList[0].key,keyword} = {}){
      const param = {
        searchKey,
        keyword,
        limit: this.pagination.pageSize,
        pageNo: this.pagination.current,
      }
      this.loading = true;
      this.$API.getModelCommandList(param).then( res =>{
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
    commandHandler(item, type){
      this.visible = true
      this.componentId = 'CommandModal'
      this.options = {}
      if (type === 'edit') {
        this.title = '编辑指令'
        if (this.add) {
          this.options = {...item, type: 'first-edit'}
        }else{
          this.options = {...item, type: 'edit'}
        }
      }else{
        this.title = '新增指令'
        if (this.add) {
          this.options.type = 'first-add'
        }else{
          this.options.type = 'add'
        }
      }
    },
    //type command 发送指令
    delClick(row, type, index){
      const that = this;
      this.$confirm({
        centered: true,
        title: type ? '确定要发送指令吗' : '确定要删除吗？',
        icon: h => <p-icon class="exclamation" type="exclamation-circle" />,
        content: (h, params) => {
          const str = type ? `确定要向设备 "${row.name}" 发送指令 停机 吗？` : `确定删除该指令"${row.name}"吗？`;
          return h('div', {
          }, str);
        },
        onOk() {
          if (that.add) {
            that.tableData.splice(index, 1)
            that.expandedRowKeys = that.expandedRowKeys.filter( item => item !== row.commandId)
          }else{
          that.$API.delModelCommand(row.id).then( res =>{
            if ( res.code === 0 ){
              that.$message.success('删除成功');
              that.getTableData();
            }
          }).catch( e =>{
            console.log(e);
          });
          }
        },
      });
    },
    tableChange(pagination, filters, sorter){
      this.filteredInfo1 = filters
      this.getTableData(); 
      console.log(pagination, filters, sorter);
    },
    callback(res) {
      const {type, ...data} = res
      if(type === 'first-add') {
        this.tableData.push(data)
      }else if (type === 'first-edit'){
        const $index = this.tableData.findIndex( item => item.id === data.id)
        this.$set(this.tableData, $index, data)
      }
    }
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
