<template>
  <div class="login">
    <div class="login__header">
      <Svg-icon class="login__logo" type='logo' width='180' height='42'></Svg-icon>
    </div>
    <p-form-model class="login__form" ref="form" :model="form" :rules="rules" @keyup.enter.native="submit">
      <p-form-model-item v-if="errMsg">
        <p-alert type="error" showIcon :message="errMsg" />
      </p-form-model-item>
      <p-form-model-item prop="username">
        <p-input v-model="form.username" size="large" placeholder="请输入用户名">
          <p-icon slot="prefix" type="user" />
        </p-input>
      </p-form-model-item>
      <p-form-model-item prop="password">
        <p-input v-model="form.password" :type="pwdInvisible? 'password' : 'text'" size="large" placeholder="请输入密码">
          <p-icon slot="prefix" type="lock" />
          <p-icon slot="suffix" :type="pwdInvisible ? 'eye-invisible' : 'eye'" @click="pwdInvisible = !pwdInvisible"/>
        </p-input>
      </p-form-model-item>
      <p-form-model-item>
        <p-button type="primary" size="large" style="width: 100%;" :loading="loading" @click="submit">登录</p-button>
      </p-form-model-item>
    </p-form-model>
  </div>
</template>

<script>
import { auth } from 'poros/utils'
import { timeFix } from '@/utils'
import system from '@/config/system'

const { setToken } = auth

export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      pwdInvisible: true,
      rules: {
        username: [{required: true, whitespace: true, message: '请输入用户名'}],
        password: [{required: true, whitespace: true, message: '请输入密码'}]
      },
      loading: false,
      errMsg: ''
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if(valid) {
          this.loading = true
          this.$store.dispatch('login', this.form).then(res => {
            res.code === 0 ? this.loginSuccess() : this.loginError(res.msg)
            this.loading = false
          })
        }
      })
    },
    loginError(errMsg) {
      this.errMsg = errMsg || this.errMsg
    },
    loginSuccess() {
      this.$notification.success({
        message: '欢迎',
        description: `${timeFix()}，欢迎回来`
      })
      localStorage.setItem('login', +new Date())
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  padding-top: 110px;
}
.login__header {
  height: 124px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login__logo {
  // max-height: 50px;
  margin-right: 16px;
  font-size: 80px;
  color: #1740DC;
}
.login__form {
  width: 368px;
  margin: 0 auto;
}
</style>
