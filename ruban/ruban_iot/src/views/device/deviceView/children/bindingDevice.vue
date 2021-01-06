<template>
  <div class="mt20">
    <div class="c_searchArea">
      <p-button @click="bind" type="primary">绑定设备</p-button>
    </div>
    <div class="tableCon">
      <p-table
        rowKey="id"
        @change="tableChange"
        :loading="loading"
        :pagination="pagination"
        :columns="columns"
        :data-source="tableData">
        <template slot="operation" slot-scope="text, record">
          <span class="operateBtn" @click="unBind(record)">解绑</span>
        </template>
      </p-table>
    </div>
    <!-- 弹窗 -->
    <component
      :is="componentId"
      v-model="visible"
      :options="options"
      @callback="callback"
      ref='modal'
    />
  </div>
</template>

<script>
import tableMixins from '@/mixins/tableMixins'
import BindDeviceModal from '../modal/bindDevice'
import {commomColumns} from '../base'
export default {
  mixins: [tableMixins],
  components: {BindDeviceModal},
  data() {
    return {};
  },
  computed: {
    columns(){
      return [
        ...commomColumns,
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
    bind() {
      this.visible = true
      this.componentId = 'BindDeviceModal'
    },
    unBind(row){
      const that = this;
      this.$confirm({
        centered: true,
        title: '确定要解绑吗？',
        icon: h => <p-icon class="exclamation" type="exclamation-circle" />,
        content: (h, params) => {
          const str = `确定要解绑设备"${row.name}"吗？`;
          return h('div', {
          }, str);
        },
        onOk() {
          // rolePermissionApi.delPermissionRole(row.id).then( res =>{
          //   if ( res.code === 0 ){
          //     that.$message.success('删除成功');
          //     that.getTableData();
          //   }
          // }).catch( e =>{
          //   console.log(e);
          // });
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    callback() {

    },
    tableChange(){
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
