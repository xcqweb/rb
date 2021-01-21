<template>
  <div>
    <div class="pb20 clearfix">
      <p-button type="primary" @click="addDevice" class="fl" :disabled='disabledBtnAdd'>新增设备</p-button>
      <Label width='80' class="fl ml20">
        <Infinity-select
        class="w160"
        :api='$API.getModelList'
        v-model="selectModel"
        :dataKey="{value: 'id', label: 'modelName'}"
        showAll
        @change="changeSelect"
        />
      </Label>
      <div class="fr flex">
        <Search v-model.trim="keyword" @search="getTableData" :selectList='selectList' @reset="reset" />
      </div>
    </div>
    <p-table
      @change="tableChange"
      :pagination="pagination"
      :columns="columns"
      :data-source="tableData"
      :loading='loading'
      class="platform-org-table"
      :row-key="id"
    >
      <span slot="deviceName" slot-scope="item" class="viewDetail" @click="view('/device/viewDevice',item.id, 'device',path)">{{item.deviceName}}</span>
      <span slot="modelName" slot-scope="item" class="viewDetail" @click="view('/model/viewModel',item.modelId)">{{item.modelName}}</span>
      <template slot="operation" slot-scope="item">
        <a href="javascript:;" @click="view('/device/viewDevice',item.id,'device')">查看</a>
        <a class="ml6 mr6" href="javascript:;" @click="move(item)">移动</a>
        <a href="javascript:;" @click="remove(item, removeDeviceHandler)">删除</a>
      </template>
    </p-table>
    <!-- 移动设备 -->
    <component
      :is="componentId"
      v-model="visible"
      title="移动设备"
      :options='options'
      @callback='callback'
    />
  </div>
  
</template>

<script>
import tableMixins from '@/mixins/tableMixins'
import {
  deviceNetType,
  deviceStatusType,
  deviceNetTypeList,
  deviceStatusTypeList,
  netStatusClass,
  statusClass
} from '@/utils/baseData'
export default {
  mixins: [tableMixins],
  props: {
    chooseNode: Object,
    activeKey: String
  },
  data() {
    return {
      moveDeviceData: {}, //移动设备的信息
      searchName: '',
      pageLoad: false,
      ///////
      selectModel: {label: '全部模型', key: 'all'},
      filtersList1: deviceNetType,
      filtersList2: deviceStatusType,
      data: [],
      selectList: [
        {name:'设备名称',key: 'deviceName'},
        {name:'创建人',key: 'createBy'},
        {name:'创建时间',key: 'createTime'},
      ]
    }
  },
  computed: {
    disabledBtnAdd() {
      return !this.chooseNode.id
    },
    columns() {
      let {$formatDate,$arrayItemToString, filteredInfo1, filtersList1, filtersList2 } = this;
      const that = this
      return [
        {title: '设备名称',ellipsis: true,scopedSlots: { customRender: 'deviceName' }},
        {title: '所属模型',ellipsis: true,scopedSlots: { customRender: 'modelName' }},
        {
          dataIndex: 'netStatus',
          title: '网络',
          ellipsis: true,
          filterMultiple: false,
          filteredValue: filteredInfo1.netStatus || null,
          filters: $arrayItemToString(filtersList1),
          width: 120,
          customRender: status => {
            const className = netStatusClass[status]
            return <p>
              <span class={className}></span>
              <span>{deviceNetTypeList[status]}</span>
            </p>
          }
        },
        {
          dataIndex: 'status',
          title: '状态',
          ellipsis: true,
          filterMultiple: false,
          filteredValue: filteredInfo1.status || null,
          filters: $arrayItemToString(filtersList2),
          width: 120,
          customRender: status => {
            const className = statusClass[1]
            return <span class={className}>{deviceStatusTypeList[status]}</span>
          }
        },
        {dataIndex: 'createBy',title: '创建人',ellipsis: true},
        {dataIndex: 'createTime',title: '创建时间',ellipsis: true,customRender: date => $formatDate(date)},
        {title: '操作',width: 120,align: 'right',scopedSlots: { customRender: 'operation' }},
      ]
    }
  },
  watch: {
    'chooseNode.id'() {
      !(this.activeKey === 'deviceCompose') && this.getTableData()
    },
    activeKey(val) {
      this.activeKey === 'deviceList' && this.$router.push({path: '/device/deviceView',query: {from: val}})
    }
  },
  activated() {
    this.activeKey === 'deviceList' && this.getTableData()
  },
  methods: {
    reset(){
      this.filteredInfo1 = {}
      this.pagination.pageSize = 10
      this.pagination.current = 1
      this.selectModel = {label: '全部模型', key: 'all'};
      this.getTableData();
    },
    changeSelect(data) {
      this.getTableData()
    },
    //////
    addDevice() {
      const {id, locationNamePath} = this.chooseNode
      this.$router.push({
        path: '/device/addDevice',
        query: {
          type: 'device',
          from: this.activeKey,
          locationId: id,
          locationNamePath
        }
      })
    },
    getTableData({searchKey = this.selectList[0].key, keyword} = {}){
      if (!this.chooseNode.id) {
        return
      }
      const isArray = Array.isArray(keyword)
      const param = {
        keyword: isArray ? undefined : keyword,
        searchKey,
        limit: this.pagination.pageSize,
        pageNo: this.pagination.current,
        startTime: isArray ? this.$UTC(keyword[0]) : undefined,
        endTime: isArray ? this.$UTC(keyword[1]) : undefined,
        modelId: this.selectModel.key === 'all' ? undefined : this.selectModel.key,
        locationId: this.chooseNode.id,
        netStatus: this.filteredInfo1.netStatus && this.filteredInfo1.netStatus[0],
        status: this.filteredInfo1.status && this.filteredInfo1.status[0]
      }
      this.loading = true;
      this.$API.getDeviceList(param).then( res =>{
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
    //删除设备
    removeDeviceHandler({id}) {
      this.$API.delDeviceById({id}).then(() => {
        this.$message.success('操作成功！')
        if (this.tableData.length <= 1 && this.pagination.current > 1) {
          this.pagination.current --
        }
        this.getTableData()
      }).catch(() => {
        //
      })
    },
    remove(item, handler) {
      this.$confirm({
        title: '确定要删除吗？',
        content: `确定要删除设备“${item.deviceName}”吗？`,
        centered: true,
        onOk: () => {
          handler(item)
        }
      })
    },
    move({id, modelId}) {
      this.visible = true
      this.componentId = 'ModalSelectTree'
      this.moveDeviceData = {id, modelId}
    },
    //移动设备
    callback(data) {
      const params = {...this.moveDeviceData,locationId: data.id}
      this.$API.editDevice(params).then(res => {
        this.$message.success('操作成功！')
        this.getTableData()
      })
    },
    view(path, id, type) {
      this.$router.push({path,query:{id,type}})
    },
  },
}
</script>

<style lang="less" scoped>
/deep/.poros-table-column-has-filters{
  .anticon-filter{
    right: 60px !important;
  }
}
</style>