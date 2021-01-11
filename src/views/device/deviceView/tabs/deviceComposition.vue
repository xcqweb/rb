<template>
  <div>
    <div class="pb20 clearfix">
      <p-button type="primary" @click="addDevice">新增组合</p-button>
      <div class="fr flex">
        <search v-model.trim="keyword" @search="getData" :selectList='selectList'  @reset="reset" />
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
        :loading='record.loading'
        row-key="id"
        style="margin:10px 0;"
        class="innerTable"
      >
        <span slot="deviceName" slot-scope="item" class="viewDetail">www</span>
        <span slot="deviceModel" slot-scope="item" class="viewDetail">www</span>
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
  data() {
    return {
      data: [],
      selectList: [
        {name:'组合名称',key: 'deviceName'},
        {name:'创建人',key: 'creater'},
        {name:'创建时间',key: 'createTime'},
      ],
    }
  },
  computed: {
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
          width: 100,
          customRender:(item) => {
            const className = ['normal','run', 'fault'][1]
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
          dataIndex: 'name1',
          // customRender:(item) => {
            // return <a href='javascript:;' onClick={this.viewUserDetail(item)}>{item.uid}</a>
          // }
        },
        {
          dataIndex: 'name2',
          title: '描述',
          ellipsis: true
        },
        {
          dataIndex: 'name3',
          title: '创建人',
          ellipsis: true
        },
        {
          dataIndex: 'name4',
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
      })
    },
    getTableData() {
      const params = {
        dataSources: 0,
        limit: this.pagination.pageSize,
        pageNo: this.pagination.current,
        userName: this.searchKeyUser
      };
      this.tableData = [{id:1,name1: 111,innerData: [{id:12,name:24}]}]
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
        this.getData()
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
    unbind({id,attributeName}){
      const that = this;
      this.$confirm({
        centered: true,
        title: '确定要解绑吗？',
        icon: h => <p-icon class="exclamation" type="exclamation-circle" />,
        content: (h, params) => {
          const str = `确定要与设备 "${attributeName}" 解绑吗？`;
          return h('div', str);
        },
        onOk() {
          // that.$API.delModelAttr({id}).then( res =>{
          //   if ( res.code === 0 ){
          //     that.$message.success('删除成功');
          //     if (that.tableData.length <= 1 && that.pagination.current > 1) {
          //       that.pagination.current --
          //     }
          //     that.getTableData()
          //   }
          // }).catch( e =>{
          //   console.log(e);
          // });
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
      })
    },
  },
}
</script>

<style lang="less" scoped>
  
</style>