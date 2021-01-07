import tableMixins from '@/mixins/tableMixins'
export default {
  mixins: [tableMixins],
  props: {
    search: Boolean, //搜索框
    addBtn: Boolean, //添加按钮
    isDevice: Boolean, //是否是设备下使用 否则为模型下
    list: Object, //父组件数据
    add: Boolean, //是否是在新增页面使用
    filter: Boolean, //是否显示表格头部筛选
    modelId: String,
    value: Array, //table数据
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
      if (props.expanded) {
        return <a class='expand-icon' style={{marginRight:8}} onClick={() => {
          props.onExpand(props.record)
        }}><span class="iconfont iconic_jiantou"></span></a>
      }  
      return <a class='expand-icon' style={{marginRight:'10px'}} onClick={() => {
        props.onExpand(props.record)
      }}><span class="iconfont iconjiantouxiangzuoshangyitiao"></span></a>
    },
    expand(expanded, record) {
      const id = record.id
      if(this.expandedRowKeys.includes(id) && !expanded){
        this.expandedRowKeys = this.expandedRowKeys.filter( item => item !== id)
      } else {
        this.expandedRowKeys.push(id)
      }
    },
  },
}