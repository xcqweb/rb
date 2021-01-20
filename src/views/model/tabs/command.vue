<template>
  <div class="command">
    <Page-title v-if="isDevice">指令列表</Page-title>
    <div class="c_searchArea" :class="{fd:!addBtn}">
      <p-button @click="commandHandler" type="primary" v-if="addBtn">新增指令</p-button>
      <Search :selectList='selectList' v-model="keyword" @search='onSearch' @reset="reset" v-if="search" />
    </div>
    <div class="tableCon">
      <p-table
        rowKey="id"
        @change="tableChange"
        @expand="expand"
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
          v-model="belongModel"
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
      belongModel: {},
      selectList: [
        {name:'指令名称',key: 'commandName'},
        {name:'指令标识',key: 'commandMark'},
      ],
      filtersList: [],
      innerColumns: [
        {dataIndex: 'commandVarMark',title: '变量标识',ellipsis: true},
        {dataIndex: 'commandVarValue',title: '默认值',ellipsis: true},
        {dataIndex: 'remark',title: '注释',ellipsis: true},
      ],
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
  mounted() {
    this.getTableData()
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
    getTableData({searchKey = this.selectList[0].key,keyword} = {}){
      if (!this.modelId) {
        console.error('模型id不存在！')
        return
      }
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
          this.expandhandler(this.expandedRowKeys[0])
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
          const str = type === 'command' ? `确定要向设备 "${that.deviceName}" 发送指令 停机 吗？` : `确定删除指令"${row.commandName}"吗？`;
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
    callback(res) {
      const {type, ...data} = res
      if(type === 'first-add') {
        this.tableData.push(data)
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
      console.log(selectedKeys)
      if (!selectedKeys) {
        clearFilters()
        // this.belongModel = {}
      }
      setSelectedKeys(this.belongModel && this.belongModel.key)
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
