<template>
  <p-layout class="home">
    <p-layout-header class="header">
      <div class="left">
        <p-sys-nav v-if="system.sysNavType == 1">
          <div class="system-nav">
            <svg-icon type="cell"/>
          </div>
        </p-sys-nav>
        <div :class="{'system-logo':true,'system-nav2': system.sysNavType == 2}">
          <Svg-icon type='logo' width='138' height='28'></Svg-icon>
        </div>
        <p-sys-nav2 v-if="system.sysNavType == 2"/>
      </div>
      <div class="right">
        <div v-for="(item, index) of customButton"
             :key="index"
             class="button"
             @click="customButtonNav(item)">
          <p-icon class="button-icon" :type="item.icon" />
          <span class="button-label">{{ item.label }}</span>
        </div>

        <div class="button" @click="helper">
          <p-icon class="button-icon" type="question-circle" />
          <span class="button-label">帮助</span>
        </div>

        <p-dropdown overlayClassName="header-dropdown">
          <div class="button" style="height: 24px;">
            <p-avatar class="button-icon" :src="avatar" :size="24" />
            <p-icon type="down" />
          </div>

          <div slot="overlay">
            <div class="user-info">
              <p-avatar class="button-icon" :src="avatar" :size="24" />
              <span class="user-name">{{ username }}</span>
            </div>

            <p-menu @click="handler">
              <p-menu-item key="goAuth">
                <a target="_self" rel="noopener noreferrer" href="/auth">
                  <p-icon type="undo" />返回门户
                </a>
              </p-menu-item>
              <p-menu-item key="updatePwd">
                <a target="_self" rel="noopener noreferrer" href="/auth/updatepwd">
                  <p-icon type="lock" />修改密码
                </a>
              </p-menu-item>
              <p-menu-item key="logout">
                <p-icon type="logout" />退出
              </p-menu-item>
            </p-menu>
          </div>
        </p-dropdown>
      </div>
    </p-layout-header>

    <div class="content-wrap">
      <p-sider-menu :collapsed="false" />
      <p-layout-content class="layout-content">
        <p-router-tabs scroll/>
      </p-layout-content>
    </div>
  </p-layout>
</template>

<script>
  import avatarDefault from '@/assets/images/avatar.jpg'
  import { isURL } from '@/utils'

  export default {
    name: 'Home',
    data () {
      return  {
        
      }
    },
    computed: {
      avatar() {
        return this.$store.state.user.avatar || avatarDefault
      },
      username() {
        return this.$store.state.user.name
      },

      systemName () {
        return this.system.name || this.getSystemName()
      },

      customButton () {
        return this.system.customButton || []
      }
    },
    methods: {
      // 获取当前系统名称
      getSystemName() {
        try {
          const { sysList } = this.$store.state.poros
          const currentSystem = sysList.find(item => item.sysCode === this.system.code)

          return currentSystem.sysName
        } catch (e) {
          return ''
        }
      },

      handler({ key }) {
        switch(key) {
          case 'logout':
            this.logout()
            break
        }
      },
      helper() {
        this.$message.warning('未定义业务跳转地址')
      },
      logout() {
        this.$confirm({
          title: '提示',
          content: '真的要注销登录吗?',
          onOk: () => {
            this.$store.dispatch('logout')
          },
          onCancel() {}
        })
      },

      // 自定义按钮点击
      customButtonNav ({ url, openNew }) {
        if (!url) {
          this.$message.warning('未定义业务跳转地址')
          return
        }

        if (isURL(url)) {
          if (openNew) {
            window.open(url, '_blank')
          } else {
            location.href = url
          }
        } else {
          if (openNew) {
            const routeUrl = this.$router.resolve({ path: url })
            window.open(routeUrl.href, '_blank')
          } else {
            this.$router.push(url)
          }
        }
      },
    },
    mounted() {
      // 获取登录用户信息
      this.$store.dispatch('requireUserInfo')
      this.$store.dispatch('requestSysUid')
    },
    watch: {
      systemName (val) {
        if (val) {
          document.title = val
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .home {
    width: 100vw;
    min-width: 1280px;
  }

  .header {
    justify-content: space-between;

    .left,
    .right {
      display: flex;
    }
    .left {
    .system-nav {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 48px;
      height: 48px;
      background: @sys-menu-bgcolor;
      cursor: pointer;
      color: @sys-cell-color;
      font-size: 20px;

      .svg-icon {
        margin-right: 0;
      }
    }
    .system-logo {
      display: flex;
      align-items: center;
      margin-left: 20px;
      white-space: nowrap;

        &.system-nav2 {
          display: flex;
          width: 200px;
          margin-left: 0;
          padding-left: 20px;
          span {
            flex: 1;
            width: 0;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      img {
        max-height: 30px;
        margin-right: 6px;
      }

      span {
        font-size: 16px;
          font-weight: bold;
        color: @sys-menu-bgcolor;
      }
    }
    }
    .right {
      align-items: center;

      .button {
        display: flex;
        align-items: center;
        margin-right: 20px;
        cursor: pointer;
        transition: color .3s;

        &:hover {
          color: @primary-color;
        }

        &-icon {
          margin-right: 5px;
          font-size: 14px;

          &.poros-avatar {
            margin-right: 4px;
          }
        }
      }
    }
  }

  .content-wrap {
    flex:1;
    height: 0; // 防止溢出
    display: flex;
    .layout-content {
      min-width: 0;
  }

  }
</style>
<style lang="less">
  .header-dropdown {
    width: 160px;
    padding-bottom: 10px;
    box-shadow: 0 2px 6px 0 rgba(4, 12, 44, 0.25);
    border-radius: 4px;
    border: 1px solid #E6E7EA;
    background-color: #fff;

    .user-info {
      display: flex;
      align-items: center;
      height: 45px;
      padding-left: 8px;
      padding-right: 8px;
      border-bottom: 1px solid #F0F1F3;

      .user-name {
        flex: 1;
        width: 0;
        margin-left: 10px;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .poros-menu {
      border-right: none;

      &-item {
        height: 30px;
        line-height: 30px;
        margin-top: 0;
        margin-bottom: 0 !important;

        &:hover {
          background: #F2F3F4;
        }
      }
    }
  }
</style>
