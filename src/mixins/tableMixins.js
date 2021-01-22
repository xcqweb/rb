import paginationMixins from '@/mixins/pagination'
import expandIconMixins from '@/mixins/table-expand-icon'
export default {
  mixins: [paginationMixins,expandIconMixins],
  data() {
    return {
      //modal
      componentId: '',
      visible: false,
      title: '',
      options: {},
      //
      keyword: '',
      loading: false,
      filteredInfo1: {},
      innerLoading: false,
    }
  },
  mounted() {
    const comName = this.$options._componentTag
    console.info('组件名称：',comName)
    //不走mounted方法的组件
    const extraComponentList = ['Device-list','BindDeviceModal']
    if (!this.add && comName && !extraComponentList.includes(comName)) { //新增模型时不走此方法
      this.getTableData(); 
    }
  },
  methods: {
    reset(){
      this.filteredInfo1 = {}
      this.expandedRowKeys = []
      this.pagination.pageSize = 10
      this.pagination.current = 1
      this.getTableData();
    },
    onSearch(data){
      this.pagination.pageSize = 10
      this.pagination.current = 1
      this.getTableData(data); 
    },
    tableChange(pagination, filters, sorter){
      console.log(filters)
      this.filteredInfo1 = filters
      this.getTableData(); 
    },
  },
}