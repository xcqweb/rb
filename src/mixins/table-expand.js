export default {
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
        return <a class='expand-icon' style="margin-right:8px" onClick={() => {
          props.onExpand(props.record)
        }}><span class="iconfont iconic_jiantou"></span></a>
      }  
      return <a class='expand-icon' style="margin-right:10px" onClick={() => {
        props.onExpand(props.record)
      }}><span class="iconfont iconjiantouxiangyouxiayitiao"></span></a>
    },
    expand(expanded, record) {
      const id = record.id || record.alarmId
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
  },
}