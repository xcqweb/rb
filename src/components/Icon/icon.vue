<template>
  <i v-if="type && type.startsWith('icon')" :class="type" class="iconfont" @click="handleClick" />
  <a-icon v-else :type="type" v-bind="$attrs" @click="handleClick" />
</template>

<script>
export default {
  name: 'GtIcon',
  props: {
    type: String
  },
  methods: {
    handleClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>
