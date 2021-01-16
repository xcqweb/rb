<template>
  <div class="mt16">
    <Page-title class="mt10">发送记录</Page-title>
    <Command-send-record />
  </div>
</template>

<script>
import CommandSendRecord from '@/views/device/deviceView/children/commandSendRecord'
export default {
  components: {CommandSendRecord},
}
</script>