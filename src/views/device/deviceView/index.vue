<template>
  <page title="设备视图">
    <div class="platform-org">
      <!--左侧系统-->
      <div class="left-tree fl pb20">
        <div class="dragLine" :style="{left: `${comWidth - 12}px`}">
          <p-icon type="pause" style="color: #040C2C" v-drag="dragBack" />
        </div>
        <div class="platform-org-left" ref="drag" :style="{width: `${comWidth}px`}">
          <div class="tree-content">
            <Device-tree v-model="chooseNode" showLine showIcon showOperator checkRoot />
          </div>
        </div>
      </div>
      <!--右侧菜单-->
      <div class="platform-org-right pl20">
        <p-tabs v-model="activeKey" @change="changeTab">
          <p-tab-pane key="deviceList" tab="设备列表">
            <Device-list :chooseNode='chooseNode' :activeKey='activeKey' />
          </p-tab-pane>
          <p-tab-pane key="deviceCompose" tab="设备组合">
            <Device-composition :chooseNode='chooseNode' :activeKey='activeKey' />
          </p-tab-pane>
        </p-tabs>
      </div>
    </div>
  </page>
</template>

<script>
import DeviceList from './tabs/deviceList'
import DeviceComposition from './tabs/deviceComposition'
export default {
  name: 'deviceView',
  components: {DeviceList,DeviceComposition},
  data() {
    return {
      comWidth: 200,
      watchInstance: null,
      chooseNode: {},
      activeKey: 'deviceList'
    }
  },
  beforeDestroy() {
    this.destroyWatchIntance();
  },
  mounted() {
    this.setTab()
    // 左侧菜单收起时如果拖动宽度大于800 则重置为最大800
    this.watchInstance = this.$watch('this.$store.state.common.sliderBarWidth ', (val) => {
      if (val && this.comWidth > 800) {
        this.comWidth = 800
      }
    });
  },
  activated() {
    this.setTab()
  },
  methods: {
    changeTab(tab) {
      sessionStorage.setItem('device_view_tab',tab)
    },
    setTab() {
      const tab = sessionStorage.device_view_tab
      tab && (this.activeKey = tab)
      sessionStorage.setItem('device_view_tab',this.activeKey)
    },
    viewUserDetail(item) {
      const that = this;
      return function() {
        that.$router.push({
          path: '/tenant/userManage/basicInfo',
          query: {uid: item.uid}
        })
      }
    },
    callback(data, type, addUserCount) {
      if (addUserCount >= 0) {
        this.pagination.current = 1;
        this.getData();
      }
    },
    destroyWatchIntance() {
      if (this.watchInstance) {
        this.watchInstance();
        this.watchInstance = null;
      }
    },
    //拖动
    dragBack(x) {
      const dom = this.$refs.drag;
      const originWidth = dom.offsetWidth;
      const originLeft = dom.offsetLeft;
      const fix = this.$store.state.common.sliderBarWidth + 26
      const fixWidth = 800;
      const calc = x - originLeft - fix;
      if (calc >= 150 && calc <= fixWidth) {
        this.comWidth = calc;
      }
      if (calc <= 150) {
        this.comWidth = 150;
        dom.style.overflowX = "hidden";
      }
      if (originWidth >= fixWidth) {
        dom.style.overflowX = "auto";
      }
    },
  }
}
</script>

<style lang="less" scoped>
.platform-org {
  height: 100%;
  overflow: hidden;
  .left-tree{
    height: 100%;
    position: relative;
    .dragLine {
      display: flex;
      align-items: center;
      position: absolute;
      width: 5px;
      height: 100%;
      background: transparent;
      top: -12px;
      left: 190px;
      z-index: 100;
      .anticon{
        color: rgba(4, 12, 44, 0.25) !important;
        cursor: e-resize;
      }
    }
  }
  .tree-content{
    min-width: 150px;
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;
  }
  &-left,
  &-right {
    overflow-x: hidden;
    overflow-y: auto;
  }

  &-left {
    height: 100%;
    border: 1px solid @c-bg-2;
  }

  &-right {
    height: 100%;
    margin-left: 160px;
  }
}

</style>