<template>
  <div>
    <div class="pb20 clearfix">
      <p-button type="primary" @click="addDevice" class="fl" :disabled='disabledBtnAdd'>新增设备</p-button>
      <Label width='80' class="fl ml20" label='所属模型'>
        <!-- <p-select ref="select" v-model="selectModelId" class="w-small">
        </p-select> -->
      <Infinity-select
      class="w160"
      :api='$API.getModelList'
      v-model="selectModelId"
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
      moveDeviceData: {},
      searchName: '',
      pageLoad: false,
      ///////
      selectModelId: {label: '全部', key: 'all'},
      filtersList1: deviceNetType,
      filtersList2: deviceStatusType,
      data: [],
      selectList: [
        {name:'设备名称',key: 'deviceName'},
        {name:'创建人',key: 'createBy'},
        {name:'创建时间',key: 'time'},
      ]
    }
  },
  computed: {
    disabledBtnAdd() {
      return !this.chooseNode.id
    },
    columns() {
      let { filteredInfo1 } = this;
      const that = this
      return [
        {
          title: '设备名称',
          ellipsis: true,
          scopedSlots: { customRender: 'deviceName' }
        },
        {
          title: '所属类型',
          ellipsis: true,
          scopedSlots: { customRender: 'modelName' }
        },
        {
          dataIndex: 'netStatus',
          title: '网络',
          ellipsis: true,
          filterMultiple: false,
          filteredValue: filteredInfo1.netStatus || null,
          filters: this.$arrayItemToString(this.filtersList1),
          width: 90,
          customRender:(status) => {
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
          filteredValue: filteredInfo1.netStatus || null,
          filters: this.$arrayItemToString(this.filtersList2),
          width: 90,
          customRender:(status) => {
            const className = statusClass[status]
            return <span class={className}>{deviceStatusTypeList[status]}</span>
          }
        },
        {
          dataIndex: 'createBy',
          title: '创建人',
          ellipsis: true
        },
        {
          dataIndex: 'createTime',
          title: '创建时间',
          ellipsis: true,
          customRender(date) {
            return that.$formatDate(date)
          }
        },
        {
          title: '操作',
          width: 120,
          align: 'right',
          scopedSlots: { customRender: 'operation' }
        },
      ]
    }
  },
  watch: {
    'chooseNode.id'() {
      if (this.chooseNode.init || this.activeKey === 'deviceCompose') {
        return
      }
      this.getTableData()
    }
  },
  methods: {
    changeSelect(data) {
      this.getTableData()
    },
    //////
    addDevice() {
      this.$router.push({
        path: '/device/addDevice',
        query: {
          type: 'device',
          locationId: this.chooseNode.id,
          locationNamePath: this.chooseNode.locationNamePath
        }
      })
    },
    getTableData({searchKey = this.selectList[0].key, keyword} = {}){
      const isArray = Array.isArray(keyword)
      const param = {
        keyword: isArray ? undefined : keyword,
        searchKey: isArray ? undefined : searchKey,
        limit: this.pagination.pageSize,
        pageNo: this.pagination.current,
        startTime: isArray ? this.formatDate(keyword[0]) : undefined,
        endTime: isArray ? this.formatDate(keyword[1]) : undefined,
        modelId: this.selectModelId.key === 'all' ? undefined : this.selectModelId.key,
        locationId: this.chooseNode.id,
        // ruleType: this.filteredInfo1.ruleType && this.filteredInfo1.ruleType[0]
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
    move(item) {
      this.visible = true
      this.componentId = 'ModalSelectTree'
      this.moveDeviceData = {
        id: item.id,
        modelId: item.modelId
      }
    },
    //移动设备
    callback(data) {
      const params = {
        ...this.moveDeviceData,
        locationId: data.id,
      }
      this.$API.editDevice(params).then(res => {
        this.$message.success('操作成功！')
        this.getTableData()
      })
    },
    view(path, id, type) {
      this.$router.push({
        path,
        query:{
          id,
          type,
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
  
</style>