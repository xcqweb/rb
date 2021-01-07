export default {
  methods: {
    expandIcon({ expandable, expanded, needIndentSpaced, onExpand }) {
      if (expandable) {
        const classes = {
          'custom-expand-icon': expandable,
          'custom-expand-icon-expanded': expanded,
          'custom-expand-icon-collapsed': !expanded
        }
        return <span class={classes} onClick={() => onExpand()}><p-icon type="right" /></span>
      }
      if (needIndentSpaced) {
        return <span class="custom-expand-icon custom-expand-icon-spaced"><p-icon type="right" /></span>
      }

      return null
    }
  }
}