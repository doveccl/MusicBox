<template>
  <div>
    <el-input v-model="search">
      <el-dropdown split-button slot="append" @command="command" @click="find">
        <span>搜索</span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="!user.name" command="login">登录</el-dropdown-item>
          <el-dropdown-item v-if="user.name" command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-input>
    <el-divider></el-divider>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      search: '',
      user: {
        name: '',
        admin: 0
      }
    }
  },
  created() {
    axios.defaults.headers.common.token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) { this.user = user }
  },
  methods: {
    find() {
      const { search } = this
      const loading = this.$loading()
      axios.get('/song', { search }).then(({ data }) => {
        
      }).finally(() => {
        loading.close()
      })
    },
    command(cmd) {
      if (cmd === 'login') {
        this.$router.replace('/login')
      } else if (cmd === 'logout') {
        this.user.name = ''
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        delete axios.defaults.headers.common.token
        this.$router.replace('/login')
      }
    }
  }
}
</script>
