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
        row-key="id"
        style="margin:10px 0;"
        class="innerTable"
      >
        <span slot="deviceName" slot-scope="item" class="viewDetail" @click="viewDevice(item)">{{item.deviceName}}</span>
        <span slot="deviceModel" slot-scope="item" class="viewDetail" @click="viewModel(item)">{{item.modelName}}</span>
        <a href="javascript:;" slot="operation" slot-scope="item" @click="unbind(item)">解绑</a>
      </p-table>
    </p-table>
    <!-- 移动设备 -->
    <component
      :is="componentId"
      v-model="visible"
      title="移动设备"
      :options='options'
    />
  </div>
</template>

<script>
import tableMixins from '@/mixins/tableMixins'
import tableExpandMixins from '@/mixins/table-expand'
import {deviceNetType,deviceStatusType,deviceNetTypeList,deviceStatusTypeList} from '@/utils/baseData'
export default {
  mixins: [tableMixins,tableExpandMixins],
  components: {},
  props: {
    chooseNode: Object
  },
  data() {
    return {
      selectList: [
        {name:'组合名称',key: 'name'},
        {name:'创建人',key: 'createBy'},
        {name:'创建时间',key: 'time'},
      ],
    }
  },
  computed: {
    disabledBtnAdd() {
      return !this.chooseNode.id
    },
    innerColumns(){
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
          scopedSlots: { customRender: 'deviceModel' }
        },
        {
          dataIndex: 'name',
          title: '网络',
          ellipsis: true,
          width: 100,
          customRender:(item) => {
            const className = ['online','offline', 'noActive'][1]
            return <p>
              <span class={className}></span>
              <span>{deviceNetTypeList[1]}</span>
            </p>
          }
        },
        {
          dataIndex: 'name',
          title: '状态',
          ellipsis: true,
          width: 100,
          customRender:(item) => {
            const className = ['normal','offline_text'][1]
            return <span class={className}>{deviceStatusTypeList[1]}</span>
          }
        },
        {
          title: '操作',
          width: 120,
          align: 'right',
          scopedSlots: { customRender: 'operation' }
        },
      ]
    },
    columns() {
      const that = this
      return [
        {
          title: '组合名称',
          ellipsis: true,
          scopedSlots: { customRender: 'composeName' }
        },
        {
          dataIndex: 'remark',
          title: '描述',
          ellipsis: true
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
        searchKey: isArray ? undefined : searchKey,
        limit: this.pagination.pageSize,
        pageNo: this.pagination.current,
        startCreateTime: isArray ? this.formatDate(keyword[0]) : undefined,
        endCreateTime: isArray ? this.formatDate(keyword[1]) : undefined,
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
    move() {
      this.visible = true
      this.componentId = 'ModalSelectTree'
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