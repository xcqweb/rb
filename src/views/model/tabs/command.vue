<template>
  <div class="command">
    <Page-title v-if="isDevice">指令列表</Page-title>
    <div class="c_searchArea" :class="{fd:!addBtn}">
      <p-button @click="commandHandler" type="primary" v-if="addBtn">新增指令</p-button>
      <Search :selectList='selectList' v-model="keyword.keyword" @search='onSearch' @reset="reset" v-if="search" />
    </div>
    <div class="tableCon">
      <p-table
        rowKey="id"
        @change="tableChange"
        @expand="expand"
        :locale="{filterReset: '清除'}"
        :loading="loading"
        :pagination="add ? false : pagination"
        :expandIcon="customExpandIcon"
        :expandIconAsCell="false"
        :expandIconColumnIndex="0"
        :indentSize="30"
        :expandedRowKeys='expandedRowKeys'
        :columns="columns"
        :data-source="tableData">
        <Infinity-select
          :slot="filter ? 'filterDropdown' : ''"
          slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters }"
          style="width:160px"
          :api='$API.getModelCommandTemplateSelect'
          showAll
          :extraData='{templateIds}'
          v-model="belongModel"
          allLabel='全部'
          @change="changeCommandModel(setSelectedKeys, selectedKeys, confirm, clearFilters)"
          :dataKey="{value: 'id', label: 'commandName'}"
        />
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
            :loading='innerLoading'
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
      :validFun='validFun'
      ref='modal'
    />
  </div>
</template>

<script>
import modelMixins from './modelMixins'
import CommandModal from '../modal/command'
import {commandColumns} from '@/views/base'
export default {
  mixins: [modelMixins],
  components: {CommandModal},
  props: {
    deviceName: String
  },
  data() {
    return {
      clearFilters: null,
      templateIds: [],
      belongModel: {value: 'all',label: '全部'},
      selectList: Object.freeze([
        {name:'指令名称',key: 'commandName'},
        {name:'指令标识',key: 'commandMark'},
      ]),
      filtersList: [],
      innerColumns: Object.freeze([
        {dataIndex: 'commandVarMark',title: '变量标识',ellipsis: true},
        {dataIndex: 'commandVarValue',title: '默认值',ellipsis: true},
        {dataIndex: 'remark',title: '注释',ellipsis: true},
      ]),
    };
  },
  computed: {
    columns(){
      let { filteredInfo1 } = this;
      return [
        ...commandColumns,
        {title: '操作',align: 'right',width: 120,scopedSlots: { customRender: 'operation' }},
      ]
    } 
  },
  methods: {
    expandhandler(modelCommandId) {
      if (!modelCommandId) {
        console.error('指令id不存在！')
        return
      }
      const params = {...this.paramsInner,modelCommandId}
      this.innerLoading = true
      this.$API.getModelCommandVarList(params).then( res => {
        this.tableData.forEach( item => {
          if (item.id === modelCommandId) {
            this.$set(item, 'innerData',res.data.records)
          }
        })
        this.innerLoading = false
      }).catch(() => {
        this.innerLoading = false
      })
    },
    // 获取模型指令模板id列表
    getModelCommandTempIdList() {
      this.$API.getModelCommandTempIdList({id: this.modelId}).then(res => {
        this.templateIds = res.data
      })
    },
    getTableData(){
      const {keyword,searchKey = this.selectList[0].key} = this.keyword.keyword
      if (!this.modelId) {
        console.error('模型id不存在！')
        return
      }
      this.getModelCommandTempIdList();
      const param = {
        modelId: this.modelId,
        searchKey,
        keyword,
        limit: this.pagination.pageSize,
        pageNo: this.pagination.current,
        commandTemplateId: this.filteredInfo1.commandTemplateName,
      }
      this.loading = true;
      this.$API.getModelCommandList(param).then( res =>{
        if ( res.code === 0 ){
          this.tableData = res.data.records || [];
          this.tableData.forEach( item => {
            this.$set(item, 'innerData', [])
          })
          this.expandedRowKeys[0] && this.expandhandler(this.expandedRowKeys[0])
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
      this.options.modelId = this.$route.query.id
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
        title: type === 'command' ? '确定要发送指令吗' : '确定要删除吗？',
        icon: h => <p-icon class="exclamation" type="exclamation-circle" />,
        content: (h, params) => {
          const str = type === 'command' ? `确定要向设备 "${that.deviceName}" 发送指令 停机 吗？` : `确定要删除指令"${row.commandName}"吗？`;
          return h('div', str);
        },
        onOk() {
          if (type === 'del') { //删除指令
            if (that.add) {
              that.tableData.splice(index, 1)
              that.expandedRowKeys = that.expandedRowKeys.filter( item => item !== row.id)
              that.$message.success('删除成功');
            }else{
              that.$API.delModelCommand({id: row.id}).then( res =>{
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
            }
          }else{//发送指令

          }
        },
      });
    },
    validFun(mark,id) {
      const findItem = id ? this.tableData.filter( item => item.id !== id).find( el => mark === el.commandMark) : this.tableData.find( el => mark === el.commandMark)
      return findItem
    },
    callback(res) {
      const {type, ...data} = res
      if(type === 'first-add') {
        this.tableData.unshift(data)
        this.$emit('input', this.tableData)
      }else if (type === 'first-edit'){
        const $index = this.tableData.findIndex( item => item.id === data.id)
        this.$set(this.tableData, $index, data)
        this.$emit('input', this.tableData)
      }else{
        this.getTableData();
      }
    },
    changeCommandModel(setSelectedKeys, selectedKeys, confirm, clearFilters) {
      this.clearFilters = clearFilters
      if (!selectedKeys) {
        clearFilters()
      }
      setSelectedKeys(this.belongModel && this.belongModel.value)
      confirm()
    }
  }
};
</script>

<style lang="less" scoped>
.command{
  /deep/.poros-table-column-has-filters{
    .anticon-filter{
      right: 156px !important;
    }
  }
}
</style>
