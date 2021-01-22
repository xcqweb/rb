import tableMixins from '@/mixins/tableMixins'
import tableMixinsInner from '@/mixins/paginationInner'
export default {
  mixins: [tableMixins,tableMixinsInner],
  props: {
    search: Boolean, //搜索框
    addBtn: Boolean, //添加按钮
    isDevice: Boolean, //是否是设备(组合和设备)下使用 否则为模型下
    componsition: Boolean, //组合中使用
    list: Object, //父组件数据
    add: Boolean, //是否是在新增模型页面使用
    filter: Boolean, //是否显示表格头部筛选
    modelId: String, //模型id
    deviceId: String, //设备id
    value: Array, //table数据（新增模型时降数据传递至父组件）
  },
  data() {
    return {
      expandedRowKeys: [],
    }
  },
  computed: {
    isShowExpand() {
      return this.innerColumns.length
    },
  },
  methods: {
    customExpandIcon(props) {
      if (!this.isShowExpand) {
        return null
      }
      const isExpand = !this.add || props.record.innerData && props.record.innerData.length
      if (props.expanded) {
        return <a class='expand-icon' style={{marginRight:8}} onClick={() => {
          props.onExpand(props.record)
        }}><span class={isExpand ? "iconfont iconic_jiantou" : ''}></span></a>
      }  
      return <a class='expand-icon' style={{marginRight:'10px'}} onClick={() => {
        props.onExpand(props.record)
      }}><span class={isExpand ? "iconfont iconjiantouxiangzuoshangyitiao" : ''}></span></a>
    },
    expand(expanded, record) {
      const id = record.id || record.modelParamId
      // if(this.expandedRowKeys.includes(id) && !expanded){
      //   this.expandedRowKeys = this.expandedRowKeys.filter( item => item !== id)
      // } else {
      //   this.expandedRowKeys.push(id)
      // }
      this.expandedRowKeys = expanded ? [id] : []
      if (this.expandhandler && !this.add && expanded) { //新增模型时不走此方法
        this.expandhandler(id)
      }
    },
    tableChange(pagination, filters, sorter){
      this.filteredInfo1 = filters
      this.getTableData(); 
    },
  },
}