<template>
  <p-config-provider :locale="zhCN">
    <div id="app" :class="{ 'iframe-open': isIframeOpen }">
      <router-view />
    </div>
  </p-config-provider>
</template>

<script>
  import zhCN from 'poros/ui/lib/locale-provider/zh_CN'
  import { isIframeOpen } from '@/utils'

  export default {
    name: 'App',
    data () {
      return {
        zhCN,
        isIframeOpen
      }
    },
    created() {
      this.$store.commit('getAlarmLevelList')
    }
  }
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  display: flex;

  &.iframe-open {
    padding: 20px 16px 0;
  }
}
</style>
