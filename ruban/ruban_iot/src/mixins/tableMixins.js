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
      filteredInfo1: {}
    }
  },
  mounted() {
    if (!this.add) {
      this.getTableData(); 
    }
  },
  methods: {
    reset(){
      this.filteredInfo1 = {}
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