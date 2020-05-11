<template>
  <el-container>
    <el-header>
      <el-menu mode="horizontal">
        <el-menu-item>
          <el-input v-model="searchText" size="small" >
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-menu-item>
        <el-submenu index="user-menu">
          <template slot="title">{{ user.name || '游客' }}</template>
          <el-menu-item v-if="!user.name" @click="login">登录</el-menu-item>
          <el-menu-item v-if="user.name" @click="logout">退出</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-header>
    <router-view></router-view>
  </el-container>
</template>

<script>
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
  methods: {
    search() {
      console.log(this.searchText)
    },
    login() {
      this.$router.push('/login')
    },
    logout() {
      this.user.name = ''
    }
  }
}
</script>

<style scoped>
.el-menu-item .el-input {
  width: 50vw;
  max-width: 300px;
}
@media screen and (max-width: 600px) {
  .el-input-group__append button {
    padding: 12px;
  }
}
</style>
