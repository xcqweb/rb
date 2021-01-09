<template>
  <div>
    <div class="pb20 clearfix">
      <p-button type="primary" @click="addDevice">新增组合</p-button>
      <div class="fr flex">
        <search v-model.trim="searchKey" @search="getData" :selectList='selectList'  @reset="reset" />
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
  </div>
</template>

<script>
import paginationMixins from '@/mixins/pagination'
export default {
  mixins: [paginationMixins],
  components: {},
  data() {
    return {
      searchKey: '',
      loading: false,
      data: [],
      selectList: [
        {name:'组合名称',key: 'deviceName'},
        {name:'创建人',key: 'creater'},
        {name:'创建时间',key: 'createTime'},
      ]
    }
  },
  computed: {
    columns() {
      const that = this
      return [
        {
          title: '组合名称',
          ellipsis: true,
          customRender:(item) => {
            // return <a href='javascript:;' onClick={this.viewUserDetail(item)}>{item.uid}</a>
          }
        },
        {
          dataIndex: 'name',
          title: '描述',
          ellipsis: true
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
          width: 120,
          align: 'right',
          scopedSlots: { customRender: 'operation' }
        },
      ]
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    addDevice() {
      this.$router.push({
        path: '/device/addComponsition',
      })
    },
    tableChange(){
      this.getData();
    },
    getData() {
      const params = {
        dataSources: 0,
        limit: this.pagination.pageSize,
        pageNo: this.pagination.current,
        userName: this.searchKeyUser
      };
      this.tableData = [{id:1}]
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
    move() {

    },
    view(item) {
      this.$router.push({
        path: '/device/viewComponsition',
      })
    },
    reset() {
      this.searchKeyUser = ''
      this.pagination.pageSize = 10
      this.pagination.current = 1
      this.getData()
    },
  },
}
</script>

<style lang="less" scoped>
  
</style>