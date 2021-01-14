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
    if (!this.add) { //新增模型时不走此方法
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
  },
}