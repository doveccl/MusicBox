<script setup lang="ts">
import { load } from '../piano'
import { useNotification } from 'naive-ui'

const notification = useNotification()
onMounted(() => {
  const loading = notification.info({
    title: '音频资源加载中…',
    content: '该提示会在音频加载成功后自动消失，如果长时间未加载成功，请尝试刷新页面'
  })
  load().then(() => loading.destroy())
})
</script>
