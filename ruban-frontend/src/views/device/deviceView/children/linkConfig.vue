<template>
  <div>
    <div class="mt20">
      <Label label='设备认证'><p-switch v-model="confirm" /></Label>
      <Label label='设备密钥' v-show="confirm">wwwww</Label>
    </div>
    <p-collapse class="mt10">
      <p-collapse-panel key="1" header="MQTT协议">
        MQTT协议
      </p-collapse-panel>
      <p-collapse-panel key="2" header="HTTP协议">
        HTTP协议
      </p-collapse-panel>
    </p-collapse>
  </div>
</template>

<script>
export default {
  data() {
    return {
      confirm: false,
    }
  }
}
</script>

<style lang="less" scoped>
  .flex{
    &>.label{
      width: 100%;
    }
  }
</style>