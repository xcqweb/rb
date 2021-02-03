<template>
  <div>
    <div class="mt20">
      <slot></slot>
    </div>
    <!--  :defaultActiveKey='[0]' -->
    <p-collapse class="mt20 mr20" :defaultActiveKey='[0]' v-show="protocolList.length">
      <p-collapse-panel v-for="(item,index) in protocolList" :key="index" :header="item.title">
        <div class="flex">
          <Label width='100' label='服务地址'>{{item.address}}<Copy :value='item.address' /></Label>
          <Label width='80' label='端口号' v-if="item.port" >{{item.port}}<Copy :value='item.port'/></Label>
        </div>
        <p-divider />
        <Label width='100' label='数据上报Topic'>{{preFix(item)}}{{item.dataUploadTopic}}<Copy :value='copyValue(item,item.dataUploadTopic)' /></Label>
        <p-divider />
        <Label width='100' label='属性上报Topic'>{{preFix(item)}}{{item.attrUploadTopic}}<Copy :value='copyValue(item,item.attrUploadTopic)' /></Label>
        <p-divider />
        <Label width='100' label='指令下发Topic'>{{preFix(item)}}{{item.commandTopic}}<Copy :value='copyValue(item,item.commandTopic)' /></Label>
      </p-collapse-panel>
    </p-collapse>
  </div>
</template>

<script>
//协议枚举
const titleMap = {
  'httpDto': 'HTTP协议',
  'mqttDto': 'MQTT协议'
}
const titleMapVlaue = {
  'httpDto': 1,
  'mqttDto': 2
}
export default {
  props: {
    deviceId: String,
  },
  data() {
    return {
      protocolList: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    preFix({type,address}) {
      return type === 1 ? (address +'/') : ''
    },
    copyValue({type,address},val) {
      return type === 1 ? (address + '/' + val) : val
    },
    init() {
      if (!this.deviceId) {
        return
      }
      this.$API.getDeviceProtocolById({id: this.deviceId}).then( res => {
        const reData = res.data
        const keys = Object.keys(reData)
        this.protocolList = keys.filter(item => Object.keys(reData[item]).length).map( key => {
          const temp = reData[key]
          temp.title = titleMap[key]
          temp.type = titleMapVlaue[key]
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