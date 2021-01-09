

<template>
  <p-modal
    v-model="visible"
    :title="title"
    @ok='confirm'
    :width='640'
  >
    <div class="content">
      <span class="required-doc">移动位置：</span>
      <Device-tree ref="tree" class="content_border f1" v-model="chooseNode" showLine showIcon/>
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
  watch: {
    visible(val) {
      if(!val) {
        this.chooseNode = null
        this.loading = false
      }else{
        this.$refs.tree.initTree()
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
      this.$emit('callback', {node: this.chooseNode}, 3)
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