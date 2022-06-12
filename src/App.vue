<script setup lang="ts">
const params = reactive({ search: '' })
const state = reactive({ loading: false, message: '' })
const list = ref<ISong[]>([])

async function search() {
  state.message = ''
  state.loading = true
  try {
    const { data } = await axios.get('/api/song', { params })
    list.value = data.sort((a: ISong, b: ISong) => a.priority - b.priority)
  } catch (e) {
    state.message = `${e}`
  } finally {
    state.loading = false
  }
}
</script>

<template>
  <login-modal />
  <n-grid cols="1 m:4 l:3" responsive="screen">
    <n-gi span="1 m:2 l:1" offset="0 m:1">
      <n-space>
        <n-input v-model:value="params.search" placeholder="歌手/歌名" @keypress.enter="search" />
        <n-button :loading="state.loading" type="primary" @click="search">
          搜索
        </n-button>
      </n-space>
      <n-list>
        <template v-if="state.message || !list.length" #header>
          <n-alert v-if="list.length" type="error" :show-icon="false">
            {{ state.message }}
          </n-alert>
          <n-alert v-else type="warning" :show-icon="false">
            暂无结果
          </n-alert>
        </template>
        <n-list-item v-for="s in list" :key="s.id">
          <song-detail :song="s" />
        </n-list-item>
      </n-list>
    </n-gi>
  </n-grid>
</template>

<style lang="stylus">
#app
  padding 10px
</style>
