import { isArray, hasOwnProperty } from '@/utils/util'
import paginationMixins from './pagination'

export default {
  mixins: [paginationMixins],
  data() {
    return {
      // 自定义列最大显示个数
      maxColumns: 8,
      // 自定义选中的列
      selectedColumns: [],
      // 可以filter的列
      tableFilter: null,
      // 可以排序的列
      tableSorter: null
    }
  },
  computed: {
    columns() {
      if (this.tableColumns) {
        return this.tableColumns.filter(item => {
          const key = item.dataIndex || item.key
          if (this.tableFilter && hasOwnProperty(this.tableFilter, key)) {
            item.filteredValue = this.tableFilter[key] || null
          }
          if (this.tableSorter && hasOwnProperty(this.tableSorter, key)) {
            item.sortOrder = this.tableSorter[key] || false
          }
          return this.selectedColumns.includes(key)
        })
      }

      return []
    }
  },
  created() {
    this.initTableData()
  },
  methods: {
    initTableData() {
      if (this.tableColumns) {
        const tableFilter = {}
        const tableSorter = {}
        const customColumns = []
        const selectedColumns = []
        const keys = []
        this.tableColumns.forEach(item => {
          const key = item.dataIndex || item.key
          if (hasOwnProperty(item, 'filters')) {
            tableFilter[key] = null
            item.filteredValue = null
          }
          if (hasOwnProperty(item, 'sorter')) {
            tableSorter[key] = false
            item.sortOrder = false
          }
          customColumns.push({
            label: item.title,
            value: key,
            disabled: item.customed === false
          })
          if (item.customed === false) {
            selectedColumns.push(key)
          } else {
            keys.push(key)
          }
        })
        const len = selectedColumns.length
        if (len < this.maxColumns) {
          selectedColumns.push(...keys.splice(0, this.maxColumns - len))
        }
        this.selectedColumns = selectedColumns
        this.customColumns = customColumns
        this.$_tableFilter = tableFilter
        this.$_tableSorter = tableSorter
        this.initTableParams()
      }
    },
    initTableParams() {
      this.tableFilter = Object.assign({}, this.$_tableFilter || {})
      this.tableSorter = Object.assign({}, this.$_tableSorter || {})
    },
    resetTable() {
      this.initTableParams()
      if (this.params) {
        for (let key in this.params) {
          switch (key) {
            case 'limit':
              this.params.limit = 10
              this.pagination.pageSize = 10
              break
            case 'pageNo':
              this.resetPageNo()
              break
            default:
              this.params[key] = isArray(this.params[key]) ? [] : null
          }
        }
      }
      if (this.getTableData) {
        this.getTableData()
      }
    },
    resetPageNo() {
      this.params.pageNo = 1
      this.pagination.current = 1
    },
    onTableChange(pagination, filters, sorter) {
      this.params.pageNo = pagination.current
      this.pagination.current = pagination.current
      this.params.limit = pagination.pageSize
      if (this.tableFilter && JSON.stringify(this.tableFilter) !== JSON.stringify(filters)) {
        for (let key in this.tableFilter) {
          this.tableFilter[key] = filters[key] || null
          if (hasOwnProperty(this.params, key)) {
            this.params[key] = isArray(this.params[key]) ? filters[key] : filters[key][0]
          }
          this.resetPageNo()
        }
      }
      if (this.tableSorter && sorter && sorter.columnKey) {
        if (this.tableSorter[sorter.columnKey] !== sorter.order) {
          this.tableSorter[sorter.columnKey] = sorter.order
          this.resetPageNo()
        }
      }
      if (this.getTableData) {
        this.getTableData()
      }
    }
  }
}