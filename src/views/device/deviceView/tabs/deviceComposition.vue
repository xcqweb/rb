<template>
  <div>
    <div class="pb20 clearfix">
      <p-button type="primary" @click="addDevice" :disabled='disabledBtnAdd'>新增组合</p-button>
      <div class="fr flex">
        <search v-model.trim="keyword" @search="getTableData" :selectList='selectList' @reset="reset" />
      </div>
    </div>
    <p-table
      @change="tableChange"
      @expand="expand"
      :pagination="pagination"
      :columns="columns"
      :data-source="tableData"
      :loading='loading'
      :expandIcon="customExpandIcon"
      :expandIconAsCell="false"
      :expandIconColumnIndex="0"
      :indentSize="30"
      :expandedRowKeys='expandedRowKeys'
      row-key="id"
    >
      <span slot="composeName" slot-scope="item" class="viewDetail" @click="view(item)">{{item.name}}</span>
      <template slot="operation" slot-scope="item">
        <a href="javascript:;" @click="view(item)">查看</a>
        <a class="ml6 mr6" href="javascript:;" @click="move(item)">移动</a>
        <a href="javascript:;" @click="remove(item, removeDeviceHandler)">删除</a>
      </template>
      <p-table
        v-if="isShowExpand"
        slot="expandedRowRender"
        slot-scope="record"
        :columns="innerColumns"
        :data-source="record.innerData"
        :pagination="false"
        :loading='innerLoading'
        row-key="refId"
        style="margin:10px 0;"
        class="innerTable"
      >
        <span slot="deviceName" slot-scope="item" class="viewDetail" @click="viewDevice(item)">{{item.deviceName}}</span>
        <span slot="deviceModel" slot-scope="item" class="viewDetail" @click="viewModel(item)">{{item.modelName}}</span>
        <p slot="netStatus" slot-scope="status">
          <span :class="netStatusClass[status]"></span>
          <span>{{deviceNetTypeList[status]}}</span>
        </p>
        <span slot="status" slot-scope="status" :class="statusClass[status]">{{deviceStatusTypeList[status]}}</span>
        <a href="javascript:;" slot="operation" slot-scope="item" @click="unbind(item)">解绑</a>
      </p-table>
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
import tableExpandMixins from '@/mixins/table-expand'
import {deviceNetType,deviceStatusType,deviceNetTypeList,deviceStatusTypeList,netStatusClass,statusClass} from '@/utils/baseData'
import {commomColumns} from '@/views/base'
export default {
  mixins: [tableMixins,tableExpandMixins],
  components: {},
  props: {
    chooseNode: Object,
    activeKey: String
  },
  data() {
    return {
      moveDeviceId: '', //移动的设备id
      selectList: [
        {name:'组合名称',key: 'name'},
        {name:'创建人',key: 'createBy'},
        {name:'创建时间',key: 'createTime'},
      ],
      deviceNetTypeList,
      deviceStatusTypeList,
      netStatusClass,
      statusClass
    }
  },
  computed: {
    disabledBtnAdd() {
      return !this.chooseNode.id
    },
    innerColumns(){
      return [
        {title: '设备名称',ellipsis: true,scopedSlots: { customRender: 'deviceName' }},
        {title: '所属类型',ellipsis: true,scopedSlots: { customRender: 'deviceModel' }},
        ...commomColumns.slice(2),
        {title: '操作',width: 120,align: 'right',scopedSlots: { customRender: 'operation' }},
      ]
    },
    columns() {
      return [
        {title: '组合名称',ellipsis: true,scopedSlots: { customRender: 'composeName' }},
        {dataIndex: 'remark',title: '描述',ellipsis: true},
        {dataIndex: 'createBy',title: '创建人',ellipsis: true},
        {
          dataIndex: 'createTime',
          title: '创建时间',
          ellipsis: true,
          customRender: (date) => this.$formatDate(date)
        },
        {title: '操作',width: 120,align: 'right',scopedSlots: { customRender: 'operation' }},
      ]
    }
  },
  watch: {
    'chooseNode.id'() {
      !(this.chooseNode.init || this.activeKey === 'deviceList') && this.getTableData()
    },
    activeKey(val) {
      this.activeKey === 'deviceCompose' && this.getTableData()
    }
  },
  methods: {
    addDevice() {
      this.$router.push({
        path: '/device/addComponsition',
        query: {
          locationId: this.chooseNode.id,
          locationNamePath: this.chooseNode.locationNamePath
        }
      })
    },
    expandhandler(id) {
      if (!id) {
        return
      }
      this.innerLoading = true
      this.$API.getCompositionDeviceInfo({id}).then( res => {
        this.tableData.forEach( item => {
          if (item.id === id) {
            this.$set(item, 'innerData',res.data)
          }
        })
        this.innerLoading = false
      }).catch( () => {
        this.innerLoading = false
      })
    },
    getTableData({searchKey = this.selectList[0].key, keyword} = {}) {
      const isArray = Array.isArray(keyword)
      const params = {
        keyword: isArray ? undefined : keyword,
        searchKey,
        limit: this.pagination.pageSize,
        pageNo: this.pagination.current,
        startCreateTime: isArray ? this.$UTC(keyword[0]) : undefined,
        endCreateTime: isArray ? this.$UTC(keyword[1]) : undefined,
        locationId: this.chooseNode.id,
      }
      this.loading = true;
      this.$API.getCompositionDeviceList(params).then( res => {
        this.tableData = res.data.records || [];
        this.pagination.total = res.data.total || 0;
        this.loading = false 
      }).catch( () => {
        this.loading = false 
      });
    },
    //删除设备
    removeDeviceHandler({id}) {
      this.$API.delCompositionById({id}).then(() => {
        this.$message.success('删除成功！')
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
        title: '提示确定要删除吗？',
        content: `确定要删除组合“${item.name}”吗？`,
        centered: true,
        onOk: () => {
          handler(item)
        }
      })
    },
    unbind({refId,deviceName}){
      const that = this;
      this.$confirm({
        centered: true,
        title: '确定要解绑吗？',
        icon: h => <p-icon class="exclamation" type="exclamation-circle" />,
        content: (h, params) => {
          const str = `确定要与设备 "${deviceName}" 解绑吗？`;
          return h('div', str);
        },
        onOk() {
          that.$API.compositionUnBindDevice({id: refId}).then( res =>{
            if ( res.code === 0 ){
              that.$message.success('操作成功！');
              that.expandhandler(that.expandedRowKeys[0])
            }
          }).catch( e =>{
            console.log(e);
          });
        },
      });
    },
    move(item) {
      this.visible = true
      this.componentId = 'ModalSelectTree'
      this.moveDeviceId = item.id
    },
    //移动设备
    callback(data) {
      const params = {
        id: this.moveDeviceId,
        locationId: data.locationId,
        oldLocationId: this.chooseNode.id,
      }
      this.$API.compositionMoveDevice(params).then( res => {
        this.$message.success('操作成功！')
        this.getTableData()
      })
    },
    view(item) {
      this.$router.push({
        path: '/device/viewComponsition',
        query: {
          id: item.id
        }
      })
    },
    viewDevice(item) {
      this.$router.push({
        path: '/device/viewDevice',
        query: {
          id: item.id
        }
      })
    },
    viewModel(item) {
      this.$router.push({
        path: '/model/viewModel',
        query: {
          id: item.modelId
        }
      })
    }
  },
}
</script>

<style lang="less" scoped>
  
</style>