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
        :pagination="false"
        :columns="columns"
        :data-source="tableData">
        <p slot="netStatus" slot-scope="status">
          <span :class="netStatusClass[status]"></span>
          <span>{{deviceNetTypeList[status]}}</span>
        </p>
        <span slot="status" slot-scope="status" :class="statusClass[status]">{{deviceStatusTypeList[status]}}</span>
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
      overview
      :selectedDevceIds='selectedDevceIds'
      ref='modal'
    />
  </div>
</template>

<script>
import tableMixins from '@/mixins/tableMixins'
import BindDeviceModal from '../modal/bindDevice'
import {commomColumns} from '../base'
import {
  deviceNetTypeList,
  deviceStatusTypeList,
  netStatusClass,
  statusClass
  } from '@/utils/baseData'
export default {
  mixins: [tableMixins],
  components: {BindDeviceModal},
  props: {
    deviceId: String,
    overview: Boolean,
    value: Array
  },
  data() {
    return {
      checkedList: [],
      deviceNetTypeList,
      deviceStatusTypeList,
      netStatusClass,
      statusClass
    };
  },
  computed: {
    selectedDevceIds() {
      return this.tableData.map( item => item.deviceId)
    },
    columns(){
      return [
        ...commomColumns,
        {
          title: '操作',
          dataIndex: 'operate',
          align: 'right',
          width: 80,
          scopedSlots: { customRender: 'operation' },
        },
      ]
    } 
  },
  methods: {
    getTableData(){
      this.loading = true;
      this.$API.getCompositionDeviceInfo({id: this.deviceId}).then( res => {
        if ( res.code === 0 ){
          this.tableData = res.data || [];
          this.$emit('input', this.tableData)
        }
        this.loading = false;
      }).catch( e =>{
        this.loading = false;
        console.log(e);
      });
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
          const str = `确定要解绑设备"${row.deviceName}"吗？`;
          return h('div', {
          }, str);
        },
        onOk() {
          that.$API.compositionUnBindDevice({id: row.refId}).then( res =>{
            if ( res.code === 0 ){
              that.$message.success('操作成功！');
              that.getTableData();
            }
          }).catch( e =>{
            console.log(e);
          });
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    callback(dataList,checkedList) {
      if (this.overview) {
        const params = {
          deviceCombinationId: this.deviceId,
          deviceIdList: checkedList,
        }
        this.$API.compositionBindDevice(params).then( res => {
          this.$message.success('操作成功！');
          this.getTableData();
        })
      }else{
        this.tableData.push(...dataList)
        this.checkedList = checkedList
      }
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