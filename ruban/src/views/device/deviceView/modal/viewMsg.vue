<template>
  <p-modal
    v-model="visible"
    :width="560"
    :mask-closable="false"
    title="查看报文"
    centered
    @ok="confirm"
  >
  <Label label='发送报文' width='80'>
    <p-textarea :rows="4"></p-textarea>
  </Label>
  <Label class="mt20" label='返回报文' width='80'>
    <p-textarea :rows="4"></p-textarea>
  </Label>
  </p-modal>
</template>

<script>
import modalMixins from '@/mixins/modal'
export default {
  mixins: [modalMixins],
  data() {
    return {
      
    }
  },
  methods: {
    confirm() {
      this.$emit('input', false)
    },
  },
}
</script>

<style lang="less" scoped>
  
</style>