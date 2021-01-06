<template>
  <p-config-provider :locale="zhCN">
    <div id="app">
      <router-view />
    </div>
  </p-config-provider>
</template>

<script>
  import zhCN from 'poros/ui/lib/locale-provider/zh_CN'

  export default {
    name: 'App',
    data () {
      return {
        zhCN
      }
    },
  }
</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
