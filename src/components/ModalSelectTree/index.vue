

<template>
  <p-modal
    v-model="visible"
    @ok='confirm'
    :width='640'
  >
    <div slot="title">{{title}} <span class="c-text-2 f12" v-if="options.subTitle">({{options.subTitle}})</span></div>
    <div class="content">
      <span class="required-doc">移动至：</span>
      <Device-tree ref="tree" class="content_border f1" v-model="chooseNode" :moveNodeId='moveNodeId' showLine showIcon/>
    </div>
  </p-modal>
</template>

<script>
import ModalMinix from '@/mixins/modal'
export default {
  name: 'ModalSelectTree',
  mixins: [ModalMinix],
  data() {
    return {
      chooseNode: null
    }
  },
  computed: {
    //移动的树节点id
    moveNodeId() {
      return this.options && this.options.id || ''
    }
  },
  watch: {
    visible(val) {
      if(!val) {
        this.chooseNode = null
        this.loading = false
      }else{
        this.$nextTick(() => {
          this.$refs.tree.initTree()
        })
      }
    }
  },
  methods: {
    confirm() {
      if (!this.chooseNode) {
        this.$message.error('请选择节点！')
        return
      }
      this.loading = true
      console.log(this.chooseNode)
      this.$emit('callback', this.chooseNode, 3)
      this.$emit('input', false)
    }
  },
}
</script>
<style lang="less" scoped>
  .content{
    position: relative;
    min-height: 36px;
    display: flex;
    &>span{
      position: absolute;
      top: 4px;
    }
    .content_border{
      margin-left: 120px;
      border: 1px solid #E5E6E9;
      border-radius: 2px;
      padding: 12px
    }
  }
</style>