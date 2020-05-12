<template>
  <el-card>
    <div slot="header">登录</div>
    <el-form :model="form">
      <el-form-item label="用户名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="disabled" :loading="loading" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      loading: false,
      form: {
        name: '',
        password: ''
      }
    }
  },
  computed: {
    disabled() {
      const { name, password } = this.form
      return !(name && password)
    }
  },
  methods: {
    login() {
      this.loading = true
      axios.post('/user/login', this.form).then(({ data }) => {
        if (data.err) {
          this.$message.error(data.msg)
        } else {
          const { token, user } = data
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(user))
          axios.defaults.headers.common.token = token
          window.dispatchEvent(new Event('login'))
          this.$message.success(`Welcome ${user.name}`)
          this.$router.replace('/')
        }
      }).catch(({ message }) => {
        this.$message.error(message)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
