<template>
  <el-card>
    <div slot="header">
      <el-row type="flex" justify="space-between" align="middle">
        <el-checkbox>{{ info.title }} - {{ info.artist }}</el-checkbox>
        <el-dropdown v-if="!admin">
          <i class="el-icon-more"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>编辑</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
    </div>
    <div class="lyric">{{ info.lyric }}</div>
    <el-row v-if="info.music" type="flex" align="middle" class="play">
      <el-button size="mini" :type="type" :icon="icon" @click="click" circle></el-button>
      <el-col :span="22">
        <el-progress :percentage="percentage" :format="format"></el-progress>
      </el-col>
    </el-row>
    <pre v-if="info.music" class="music" v-html="sounds"></pre>
  </el-card>
</template>

<style>
.play, .music {
  margin-top: 1em;
}
.play .el-button {
  margin-right: 1em;
}
.lyric, .music {
  font-size: 16px;
}
.music {
  overflow-x: scroll;
  padding-bottom: 1em;
  margin-bottom: -1em;
}
.low {
  -webkit-text-emphasis-style: dot;
  -webkit-text-emphasis-position: under;
}
.high {
  -webkit-text-emphasis-style: dot;
  -webkit-text-emphasis-position: over;
}
</style>

<script>
import { play, stop } from '../piano'

export default {
  props: [ 'info', 'admin' ],
  data() {
    return {
      current: 0,
      length: 0
    }
  },
  computed: {
    icon() {
      return `el-icon-${this.playing ? 'close' : 'caret-right'}`
    },
    type() {
      return this.playing ? 'danger' : 'success'
    },
    playing() {
      return this.current !== this.length
    },
    percentage() {
      return (100 * this.current / this.length) || 0
    },
    sounds() {
      if (!this.info.music) { return '' }
      return this.info.music
        .replace(/(\d)([#b]?)\-+/g, '<span class="low">$1</span>$2')
        .replace(/(\d)([#b]?)\++/g, '<span class="high">$1</span>$2')
        .replace(/([#b])/g, '<sup>$1</sup>')
    }
  },
  methods: {
    format(p) {
      const ms = p * this.length / 100
      const m = String(Math.floor(ms / 1000 / 60))
      const s = String(Math.floor(ms / 1000) % 60)
      return m.padStart(2, '0') + ':' + s.padStart(2, 0)
    },
    click() {
      if (this.playing) {
        stop()
        this.length = this.current = 0
      } else {
        this.length = play(this.info.music, current => {
          if (current === this.length) {
            this.length = this.current = 0
          } else {
            this.current = current
          }
        })
      }
    }
  }
}
</script>
