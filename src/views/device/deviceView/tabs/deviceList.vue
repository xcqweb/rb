<template>
  <div>
    <div class="pb20 clearfix">
      <p-button type="primary" @click="addDevice" class="fl">新增设备</p-button>
      
      <Label width='80' class="fl ml20">
        <p-select v-model="modelId" class="w-small">
          <p-select-option :value='1'>1</p-select-option>
        </p-select>
      </Label>
      <div class="fr flex">
        <Search v-model.trim="keyword" @search="getTableData" :selectList='selectList'  @reset="reset" />
      </div>
    </div>
    <p-table
      @change="tableChange"
      :pagination="pagination"
      :columns="columns"
      :data-source="tableData"
      :loading='loading'
      class="platform-org-table"
      row-key="id"
    >
      <template slot="operation" slot-scope="item">
        <a href="javascript:;" @click="view(item)">查看</a>
        <a class="ml6 mr6" href="javascript:;" @click="move(item)">移动</a>
        <a href="javascript:;" @click="remove(item, removeDeviceHandler)">删除</a>
      </template>
    </p-table>

    <!-- 移动位置 -->
    <component
      :is="componentId"
      v-model="visible"
      title="移动节点"
      :options='options'
    />
  </div>
</template>

<script>
import tableMixins from '@/mixins/tableMixins'
import {deviceNetType,deviceStatusType,deviceNetTypeList,deviceStatusTypeList} from '@/utils/baseData'
export default {
  mixins: [tableMixins],
  data() {
    return {
      modelId: '',
      filteredInfo1: {},
      filtersList1: deviceNetType,
      filtersList2: deviceStatusType,
      data: [],
      selectList: [
        {name:'设备名称',key: 'deviceName'},
        {name:'创建人',key: 'creater'},
        {name:'创建时间',key: 'time'},
      ]
    }
  },
  computed: {
    columns() {
      let { filteredInfo1 } = this;
      const that = this
      return [
        {
          title: '设备名称',
          dataIndex: 'deviceName',
          ellipsis: true,
          // customRender:(item) => {
            // return <a href='javascript:;' onClick={this.viewUserDetail(item)}>{item.uid}</a>
          // }
        },
        {
          dataIndex: 'deviceName',
          title: '所属类型',
          ellipsis: true
        },
        {
          dataIndex: 'name',
          title: '网络',
          ellipsis: true,
          filterMultiple: false,
          filteredValue: filteredInfo1.systemName || null,
          filters: this.$arrayItemToString(this.filtersList1),
          width: 100,
          customRender:(item) => {
            const className = ['online doc','offline doc'][1]
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
          filterMultiple: false,
          filteredValue: filteredInfo1.systemName || null,
          filters: this.$arrayItemToString(this.filtersList2),
          width: 100,
          customRender:(item) => {
            const className = ['normal','run', 'fault'][1]
            return <span class={className}>{deviceStatusTypeList[1]}</span>
          }
        },
        {
          dataIndex: 'name',
          title: '创建人',
          ellipsis: true
        },
        {
          dataIndex: 'name',
          title: '创建时间',
          ellipsis: true,
          customRender(date) {
            return that.$formatDate(date)
          }
        },
        {
          title: '操作',
          width: 160,
          align: 'right',
          scopedSlots: { customRender: 'operation' }
        },
      ]
    }
  },
  methods: {
    addDevice() {
      this.$router.push({
        path: '/device/addDevice',
        query: {
          type: 'device'
        }
      })
    },
    tableChange(){
      this.getTableData();
    },
    getTableData() {
      const params = {
        dataSources: 0,
        limit: this.pagination.pageSize,
        pageNo: this.pagination.current,
        userName: this.searchKeyUser
      };
      this.tableData = [{}]
      // this.loading = true;
      // queryOrgUserListByPage(params).then( res => {
      //   this.data = res.data.porosSecStaffs.records || [];
      //   this.pagination.total = res.data.porosSecStaffs.total || 0;
      //   this.loading = false 
      //   if (!this.data.length && this.pagination.total > 0) {
      //     this.pagination.current = Math.ceil(this.pagination.total / this.pagination.pageSize);
      //     this.getData()
      //   }
      // }).catch( () => {
      //   this.loading = false 
      // });
    },
    //删除设备
    removeDeviceHandler(data) {
      const {code} = this.selectedTreeNode;
      const {uid, dataSources} = data;
      const params = {
        dataSources,
        code,
        uids: uid,
      };
      removeOrgRelativeUser(params).then(() => {
        this.$message.success('移除成功')
        this.treeOperator(this.selectedTreeNode, 1, 'del')
        if (this.data.length <= 1 && this.pagination.current > 1) {
          this.pagination.current --
        }
        this.getTableData()
      }).catch(() => {
        //
      })
    },
    remove(item, handler) {
      this.$confirm({
        title: '提示',
        content: `确定要删除“${item.name}”吗？`,
        centered: true,
        onOk: () => {
          handler(item)
        }
      })
    },
    move(item) {
      this.visible = true
      this.title = '移动节点'
      this.componentId = 'ModalSelectTree'
    },
    view(item) {
      this.$router.push({
        path: '/device/viewDevice',
        query: {
          type: 'device'
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
  
</style>