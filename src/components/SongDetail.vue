<script setup lang="ts">
const props = defineProps<{ song: ISong }>()
const { song } = toRefs(props)
</script>

<template>
  <n-thing>
    <template #header>
      {{ song.priority }}. {{ song.title }} ({{ song.artist }})
    </template>
    <template v-if="song.lyric" #description>
      {{ song.lyric }}
    </template>
  </n-thing>
</template>
