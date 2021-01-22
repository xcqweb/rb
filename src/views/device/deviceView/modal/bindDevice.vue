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
    selectedDevceIds: Array,
    overview: Boolean
  },
  data() {
    return {
      loadingTable: false,
      belongModel: {label: '全部模型', key: 'all'},
      selectedRowKeys: [],
      deviceNetTypeList,
      deviceStatusTypeList,
      netStatusClass,
      statusClass
    }
  },
  computed: {
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
    },
    confirm() {
      this.selectedRowKeys = this.selectedRowKeys.filter( id => !this.selectedDevceIds.includes(id))
      if (!this.selectedRowKeys.length) {
        this.$message.error('请选择设备！')
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
        modelId: this.belongModel.key === 'all' ? '' : this.belongModel.key
      }
      this.loadingTable = true;
      this.$API.getDeviceList(param).then( res =>{
        if ( res.code === 0 ){
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

<style lang="less" scoped>
  
</style>