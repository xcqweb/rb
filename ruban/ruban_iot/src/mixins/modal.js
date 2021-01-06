export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: String,
    options: Object,
    text: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      visible: false,
      loading: false,
    }
  },
  watch: {
    value(val) {
      this.visible = val
    },
    visible(val) {
      if (val !== this.value) {
        this.$emit('input', val)
      }
    }
  },
  mounted() {
    this.visible = this.value
  }
}