export default {
  data() {
    return {
      tableData: [],
      params: {
        limit: 10,
        pageNo: 1
      },
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showTotal: total => `共 ${total} 条数据`,
        showSizeChanger: true,
        showQuickJumper: true,
        showLessItems: true,
        pageSizeOptions: ['10', '20', '30', '50', '100'],
        onChange: page => {
          this.params.pageNo = page
          this.pagination.current = page
        },
        onShowSizeChange: (current, pageSize) => {
          this.params.limit = pageSize
          this.pagination.pageSize = pageSize
          this.pagination.current = 1
        }
      }
    }
  }
}