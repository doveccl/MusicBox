<template>
  <div>
    <el-input v-model="search" @keyup.enter.native="find" clearable>
      <el-dropdown split-button slot="append" @command="command" @click="find" trigger="click">
        <span>搜索</span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="!user.name" command="login">登录</el-dropdown-item>
          <el-dropdown-item v-if="user.name" command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-input>
    <el-divider></el-divider>
    <song v-for="song in songs" @deleted="remove" :admin="user.admin" :key="song.id" :info="song"></song>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      list: [],
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
  computed: {
    songs() {
      return this.list.sort((a, b) => a.priority - b.priority)
    }
  },
  methods: {
    find() {
      const loading = this.$loading()
      axios.get('/song', { params: {
        take: 100, search: this.search
      } }).then(({ data }) => {
        if (data.err) {
          this.$message.error(data.msg)
        } else {
          this.list = data.list
          if (data.list.length === 0) {
            this.$message.warning('无结果')
          }
        }
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
    },
    remove(id) {
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].id === id) {
          this.list.splice(i, 1)
          break
        }
      }
    }
  }
}
</script>
