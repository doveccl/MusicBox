<template>
  <div class="container">
    <el-row class="header" type="flex" justify="center">
      <el-col :span="24">
        <el-input v-model="search" @keyup.enter.native="find" clearable>
          <el-dropdown split-button slot="append" @command="command" @click="find" trigger="click">
            <span>搜索</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="!user.name" command="login">登录</el-dropdown-item>
              <el-dropdown-item v-if="user.name" command="switch">切换空格显示</el-dropdown-item>
              <el-dropdown-item v-if="user.admin" command="add">添加歌曲</el-dropdown-item>
              <el-dropdown-item v-if="user.name" command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-input>
      </el-col>
    </el-row>
    <transition-group name="flip-list" tag="div">
      <song v-for="song in songs" @deleted="remove" :admin="user.admin" :space="space" :key="song.id" :info="song"></song>
    </transition-group>
    <el-dialog title="添加歌曲" :width="width" :visible.sync="dialog">
      <el-form :model="form" label-width="3em">
        <el-form-item label="歌名">
          <el-input v-model="form.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="歌手">
          <el-input v-model="form.artist" clearable></el-input>
        </el-form-item>
        <el-form-item label="歌词">
          <el-input v-model="form.lyric" type="textarea" autosize></el-input>
        </el-form-item>
        <el-form-item label="简谱">
          <el-input v-model="form.music" type="textarea" autosize></el-input>
        </el-form-item>
        <el-form-item label="序号">
          <el-input-number v-model="form.priority" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item label="不稳">
          <el-switch v-model="form.danger"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" :disabled="!form.title || !form.artist || !form.lyric" @click="add">确定</el-button>
        <el-button @click="dialog=false">取消</el-button>
      </div>
    </el-dialog>
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
      },
      width: '95%',
      space: localStorage.getItem('space'),
      dialog: false,
      form: {
        title: '',
        artist: '',
        priority: 0,
        lyric: '',
        music: '',
        danger: false
      }
    }
  },
  created() {
    axios.defaults.headers.common.token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) { this.user = user }
    window.addEventListener('resize', this.update)
    this.update()
  },
  computed: {
    songs() {
      return this.list.sort((a, b) => {
        // DO NOT USE ===
        return a.check == b.check ?
          a.priority - b.priority :
          Number(a.check) - Number(b.check)
      })
    }
  },
  methods: {
    find() {
      const loading = this.$loading()
      this.search = this.search.trim()
      axios.get('/song', { params: {
        take: 100, search: this.search
      } }).then(({ data }) => {
        if (data.err) {
          this.$message({
            showClose: true,
            message: data.msg,
            type: 'error',
            offset: 64
          })
        } else {
          this.list = data.list.map(song => {
            song.check = false
            return song
          })
          if (data.list.length === 0) {
            this.$message({
              showClose: true,
              message: '无结果',
              type: 'warning',
              offset: 64
            })
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
      } else if (cmd === 'add') {
        this.dialog = true
      } else if (cmd === 'switch') {
        this.space = !this.space
        if (this.space) {
          localStorage.setItem('space', 1)
        } else {
          localStorage.removeItem('space')
        }
      }
    },
    update() {
      const { clientWidth } = document.body
      if (clientWidth >= 1200) {
        this.width = '50%'
      } else if (clientWidth >= 900) {
        this.width = '65%'
      } else if (clientWidth >= 600) {
        this.width = '80%'
      } else {
        this.width = '95%'
      }
    },
    add() {
      const loading = this.$loading()
      axios.post('/song', this.form).then(({ data }) => {
        if (data.err) {
          this.$message({
            showClose: true,
            message: data.msg,
            type: 'error',
            offset: 64
          })
        } else {
          this.dialog = false
          this.list.push(data.song)
          this.$message({
            showClose: true,
            message: '添加成功',
            type: 'success',
            offset: 64
          })
        }
      }).catch(({ message }) => {
          this.$message({
            showClose: true,
            message: message,
            type: 'error',
            offset: 64
          })
      }).finally(() => {
        loading.close()
      })
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

<style>
.container {
  padding: 8px;
  padding-top: 64px;
}
.header {
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  position: fixed;
  background: #fff;
  box-shadow: grey 0 0 5px;
}
.header .el-col {
  padding: 8px;
}
.flip-list-move {
  transition: transform 1s;
}
</style>
