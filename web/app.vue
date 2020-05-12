<template>
  <el-row type="flex" justify="center">
    <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="8">
      <el-input v-model="searchText">
        <el-dropdown split-button slot="append" @command="command" @click="search">
          <span>搜索</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="!user.name" command="login">登录</el-dropdown-item>
            <el-dropdown-item v-if="user.admin" command="admin">管理模式</el-dropdown-item>
            <el-dropdown-item v-if="user.name" command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-input>
      <el-divider></el-divider>
      <router-view></router-view>
    </el-col>
  </el-row>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      searchText: '',
      user: {
        name: '',
        admin: 0
      }
    }
  },
  created() {
    if (axios.defaults.headers.common.token = localStorage.getItem('token')) {
      axios.post('/user/login').then(({ data }) => {
        if (!data.err) { this.user = data.user }
      })
    }
    window.addEventListener('login', () => {
      this.user = JSON.parse(localStorage.getItem('user'))
    })
  },
  methods: {
    search() {
      this.$router.push(`/s/${this.searchText}`)
    },
    command(cmd) {
      if (cmd === 'login') {
        this.$router.replace('/login')
      } else if (cmd === 'admin') {
        this.$router.push('/admin')
      } else if (cmd === 'logout') {
        this.user.name = ''
        localStorage.removeItem('token')
        delete axios.defaults.headers.common.token
        this.$router.replace('/login')
      }
    }
  }
}
</script>
