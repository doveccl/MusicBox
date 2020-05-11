<template>
  <el-main>
    <el-form :model="form">
      <el-form-item label="用户名">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<script>
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
  methods: {
    login() {
      console.log('TODO login')
    }
  }
}
</script>
