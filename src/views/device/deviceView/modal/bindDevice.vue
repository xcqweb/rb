<template>
  <p-modal
    v-model="visible"
    :width="732"
    :confirm-loading="loading"
    :mask-closable="false"
    title="绑定设备"
    centered
    @cancel="cancel"
    @ok="confirm"
  >
    <!-- 虚拟列表分页加载列表回收 -->
    <Infinity-select
      style="width:160px"
      :api='$API.getModelList'
      :extraData="{orderType: 1}"
      v-model="belongModel"
      showAll
      :dataKey="{value: 'id', label: 'modelName'}"
    />
  <p-table
    class="mt10"
    rowKey="id"
    :scroll="{y: 'calc(100vh - 370px)'}"
    :row-selection="comSelection"
    @change="tableChange"
    :loading="loadingTable"
    :pagination="pagination"
    :columns="columns"
    :data-source="tableData">
    <p slot="netStatus" slot-scope="status">
      <span :class="netStatusClass[status]"></span>
      <span>{{deviceNetTypeList[status]}}</span>
    </p>
    <span slot="status" slot-scope="status" :class="statusClass[status]">{{deviceStatusTypeList[status]}}</span>
  </p-table>
  </p-modal>
</template>

<script>
import tableMixins from '@/mixins/tableMixins'
import modalMixins from '@/mixins/modal'
import {commomColumns} from '@/views/base'
import {
  deviceNetTypeList,
  deviceStatusTypeList,
  netStatusClass,
  statusClass
  } from '@/utils/baseData'
export default {
  mixins: [modalMixins,tableMixins],
  props: {
    selectedDevceIds: Array, //已选中的设备id
    overview: Boolean
  },
  data() {
    return {
      loadingTable: false,
      belongModel: {label: '全部模型', value: 'all'},
      selectedRowKeys: [],
      deviceNetTypeList,
      deviceStatusTypeList,
      netStatusClass,
      statusClass
    }
  },
  computed: {
    //禁用已选中的设备
    comSelection() {
      return { 
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        getCheckboxProps: record => ({
          props: {
            disabled: this.selectedDevceIds.includes(record.id), // Column configuration not to be checked
          },
        }),
        }
    },
    columns(){
      return commomColumns
    },
    selectDeviceList() {
      return this.tableData.filter( item => this.selectedRowKeys.includes(item.id))
    }
  },
  watch: {
    belongModel(val) {
      this.getTableData()
    },
    visible(val) {
      if (val) {
        this.getTableData()
        this.selectedRowKeys = this.selectedDevceIds
      }else{
        this.cancel()
      }
    }
  },
  methods: {
    cancel() {
      this.selectedRowKeys = []
      this.belongModel = {label: '全部模型', value: 'all'}
      this.pagination.pageSize = 10
      this.pagination.current = 1
    },
    confirm() {
      this.selectedRowKeys = this.selectedRowKeys.filter( id => !this.selectedDevceIds.includes(id))
      if (!this.selectedRowKeys.length) {
        this.$message.error('请选择设备！')
        return
      }
      if (this.selectDeviceList.length + this.selectedDevceIds.length) {
        this.$message.error('最多支持绑定20个设备！')
        return
      }
      this.$emit('callback', this.selectDeviceList, this.selectedRowKeys)
      this.visible = false
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    getTableData(){
      const param = {
        keyword: this.keyword,
        limit: this.pagination.pageSize,
        pageNo: this.pagination.current,
        modelId: this.belongModel.value === 'all' ? '' : this.belongModel.value
      }
      this.loadingTable = true;
      this.$API.getDeviceList(param).then( res =>{
        if ( res.code === 0 ){
          this.selectedRowKeys = []
          this.tableData = res.data.records || [];
          this.pagination.total = res.data.total;
        }
        this.loadingTable = false;
      }).catch( e =>{
        this.loadingTable = false;
        console.log(e);
      });
    },
    tableChange(){
      this.getTableData(); 
    },
  },
}
</script>