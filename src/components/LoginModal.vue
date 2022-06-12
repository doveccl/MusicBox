<script setup lang="ts">
const form = reactive({ name: '', pass: '', token: '' })
const state = reactive({ show: false, loading: false, message: '' })

async function login() {
  state.message = ''
  state.loading = true
  try {
    const { data } = await axios.get('/api/login', { params: form })
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
  form.token = localStorage.getItem('token') ?? ''
  if (!await login()) state.show = true
})
</script>

<template>
  <n-modal v-model:show="state.show" preset="card" title="登录" style="width:400px">
    <n-space vertical size="large">
      <n-input v-model:value="form.name" placeholder="用户" />
      <n-input type="password" v-model:value="form.pass" placeholder="密码" />
      <n-alert v-if="state.message" type="error" :show-icon="false">{{ state.message }}</n-alert>
      <n-button @click="login" :loading="state.loading" :disabled="!form.name || !form.pass">登录</n-button>
    </n-space>
  </n-modal>
</template>
