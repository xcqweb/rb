<template>
  <div>
    <div class="mt20">
      <Label label='设备认证'><p-switch v-model="confirm" @change="changeSwitch" /></Label>
      <Label label='设备密钥' v-show="confirm">wwwww</Label>
    </div>
    <p-collapse class="mt10" v-show="protocolList.length">
      <p-collapse-panel v-for="(item,index) in protocolList" :key="index" :header="item.title">
        <div class="flex">
          <Label width='80' label='服务地址'>{{item.address}}</Label>
          <Label width='80' label='端口号'>{{item.port}}</Label>
        </div>
        <p-divider />
        <Label label='数据上报'>{{item.dataUploadTopic}}</Label>
        <p-divider />
        <Label label='属性上报'>{{item.attrUploadTopic}}</Label>
        <p-divider />
        <Label label='指令下发'>{{item.commandTopic}}</Label>
      </p-collapse-panel>
    </p-collapse>
  </div>
</template>

<script>
const titleMap = {
  'httpDto': 'HTTP协议',
  'mqttDto': 'MQTT协议'
}
export default {
  props: {
    deviceId: String,
    value: [String, Number, Boolean]
  },
  data() {
    return {
      confirm: false,
      protocolList: []
    }
  },
  watch: {
    value: {
      handler(val) {
        this.confirm = !!val
      },
      immediate: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    changeSwitch(state) {
      this.$emit('input', state)
      this.$emit('change', state)
    },
    init() {
      if (!this.deviceId) {
        return
      }
      this.$API.getDeviceProtocolById({id: this.deviceId}).then( res => {
        console.log(res.data)
        const reData = res.data
        const keys = Object.keys(reData)
        this.protocolList = keys.filter(item => Object.keys(reData[item]).length).map( key => {
          const temp = reData[key]
          temp.title = titleMap[key]
          return temp
        })
      })
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
  /deep/.poros-collapse-content{
    .poros-collapse-content-box{
      padding: 6px 16px;
    }
  }
  .poros-divider-horizontal{
    margin: 4px 0;
  }
</style>