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
  <!-- <Label label='所属模型' width='80'> -->
    <p-select class="w160" v-model="belongModel">
      <p-select-option value='1'>weew</p-select-option>
    </p-select>
  <!-- </Label> -->
  <p-table
    class="mt10"
    rowKey="id"
    :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
    @change="tableChange"
    :loading="loadingTable"
    :pagination="pagination"
    :columns="columns"
    :data-source="tableData">
  </p-table>
  </p-modal>
</template>

<script>
import paginationMixins from '@/mixins/pagination'
import modalMixins from '@/mixins/modal'
import {commomColumns} from '../base'
export default {
  mixins: [modalMixins,paginationMixins],
  data() {
    return {
      loading: false,
      loadingTable: false,
      belongModel: '',
      selectedRowKeys: [],
    }
  },
    computed: {
    columns(){
      return commomColumns
    } 
  },
  methods: {
    cancel() {
      
    },
    confirm() {

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
    tableChange(){
      this.getTableData(); 
    },
  },
}
</script>

<style lang="less" scoped>
  
</style>