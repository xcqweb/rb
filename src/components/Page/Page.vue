<template>
  <div class="gt-page-wrap">
    <div class="gt-page">
      <div v-if="content" class="gt-page-header">
        <p-page-header
          :title="title"
          :class="{backTitle: $listeners.back}"
          style="height:48px;"
          v-on="pageHeaderListeners"
        >
          <template v-if="$listeners.back" slot="backIcon">
            <slot name="backIcon">
              <p-icon type="arrow-left" />
              <span v-if="backText" class="f14">&nbsp;{{ backText }}</span>
            </slot>
          </template>
          <template slot="extra">
            <slot name="extra" />
          </template>
        </p-page-header>
        <div class="gt-page-header-middle ellipsis" v-if="content || $slots.content">
          <slot name="content">
            <span :title="content">{{ content }}</span>
          </slot>
        </div>
        <div v-if="extraRightText" class="gt-page-header-extra-right ellipsis">{{extraRightText}}</div>
      </div>
      <div class="gt-page-content" v-resize="onResize" @scroll="onScroll">
        <slot :width="width" :height="height" />
      </div>
    </div>
    <div class="gt-page-footer" v-if="$slots.footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page',
  props: {
    title: {
      type: String,
      default: ' '
    },
    content: String,
    backText: {
      type: String,
      default: '返回列表'
    },
    extraRightText: String
  },
  data() {
    return {
      width: 0,
      height: 0
    }
  },
  computed: {
    pageHeaderListeners() {
      const { back } = this.$listeners
      if (back) {
        return {
          back
        }
      }

      return {}
    }
  },
  methods: {
    onScroll() {

    },
    onResize(ele) {
      let width = 0
      let height = 0
      if (ele.getBoundingClientRect) {
        const style = ele.getBoundingClientRect()
        width = style.width
        height = style.height
      } else if (window.getComputedStyle) {
        const style = window.getComputedStyle(ele)
        width = style.getPropertyValue('width')
        height = style.getPropertyValue('height')
      }
      if (!isNaN(parseInt(width))) {
        width = parseInt(width)
      }
      if (!isNaN(parseInt(height))) {
        height = parseInt(height)
      }
      this.width = width
      this.height = height
    }
  }
}
</script>

<style lang="less">
.flex-column() {
  display: flex;
  flex-direction: column;
}
.gt-page-wrap{
  background: #F7F7F8;
}
.gt-page {
  .flex-column();
  flex: 1;
  background-color: @c-white;
  overflow: hidden;
  margin: 10px;
  border: 1px solid #E5E6E9;
  border-radius: 2px;
  &-wrap {
    .flex-column();
    height: 100%;
  }
  .poros-page-header-back{
    margin: 0;
    margin-right: 6px;
  }
  .poros-page-header-heading{
    display: flex;
    height:100%;
    align-items: center;
  }
  .poros-page-header-heading-title{
    line-height: 1.5;
    color: @c-text;
    flex: 1;
  }
  .backTitle .poros-page-header-heading-title{
    font-size: @f-medium;
  }
  .gt-page-header-middle{
    color: @c-text;
    font-size: @f-big;
    width: calc(100% - 250px);
    font-family: 'ruban-bold';
  }
  .gt-page-header-extra-right{
    color: @c-text;
    font-size: @f-small;
    width: 180px;
    position: absolute;
    right: 0;
    top: 15px;
  }
  &-header {
    position: relative;
    border-bottom: 1px solid @c-bg-1;

    &-middle {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }
  }

  &-content {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 16px 20px;
  }

  &-footer {
    border-top: 1px solid @c-bg-1;
    background-color: @c-white;
    padding: 10px 20px;
    button + button {
      margin-left: 10px;
    }
  }
}
</style>