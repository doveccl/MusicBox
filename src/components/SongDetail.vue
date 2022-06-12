<script setup lang="ts">
import { play, stop } from '../piano'
const props = defineProps<{ song: ISong }>()
const { song } = toRefs(props)
const sounds = computed(() => {
  return song.value.music
    .replace(/(\d)([#b]?)-+/g, '<span class="low">$1</span>$2')
    .replace(/(\d)([#b]?)\++/g, '<span class="high">$1</span>$2')
    .replace(/([#b])/g, '<sup>$1</sup>')
})
</script>

<template>
  <n-thing>
    <template #header>
      {{ song.priority }}. {{ song.title }} ({{ song.artist }})
    </template>
    <template v-if="song.lyric" #description>
      {{ song.lyric }}
    </template>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <pre v-if="song.music" class="music" v-html="sounds" />
    <template v-if="song.music" #footer>
      <n-space>
        <n-button type="success" size="small" @click="() => play(song.music)">
          播放
        </n-button>
        <n-button type="error" size="small" @click="stop">
          停止
        </n-button>
      </n-space>
    </template>
  </n-thing>
</template>

<style lang="stylus">
.music
  max-width 600px
  overflow-x auto
  padding-bottom 1em
  margin-bottom -1em
  .low
    text-emphasis-style dot
    text-emphasis-position under
  .high
    text-emphasis-style dot
    text-emphasis-position over
</style>
