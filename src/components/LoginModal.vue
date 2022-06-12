<script setup lang="ts">
const params = reactive({ name: '', pass: '', token: '' })
const state = reactive({ show: false, loading: false, message: '' })

async function login() {
  state.message = ''
  state.loading = true
  try {
    const { data } = await axios.get('/api/login', { params })
    if (data.error) throw new Error(data.error)
    axios.defaults.headers.common.token = data.token
    localStorage.setItem('token', data.token)
    state.show = false
  } catch (e) {
    state.message = `${e}`
  } finally {
    state.loading = false
  }
  return !state.message
}

onBeforeMount(async () => {
  params.token = localStorage.getItem('token') ?? ''
  if (!await login()) state.show = true
})
</script>

<template>
  <n-modal v-model:show="state.show" preset="card" title="登录" style="width:400px">
    <n-space vertical size="large">
      <n-input v-model:value="params.name" placeholder="用户" />
      <n-input v-model:value="params.pass" type="password" placeholder="密码" />
      <n-alert v-if="state.message" type="error" :show-icon="false">
        {{ state.message }}
      </n-alert>
      <n-button :loading="state.loading" :disabled="!params.name || !params.pass" @click="login">
        登录
      </n-button>
    </n-space>
  </n-modal>
</template>
