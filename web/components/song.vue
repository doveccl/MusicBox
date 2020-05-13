<template>
  <el-card class="song">
    <div slot="header" v-if="!edit">
      <el-row type="flex" justify="space-between" align="middle">
        <el-checkbox>
          <span>{{ form.title }}</span>
          <span>-</span>
          <span>{{ form.artist }}</span>
          <span>({{ form.priority }})</span>
        </el-checkbox>
        <el-dropdown v-if="admin" @command="command" trigger="click">
          <i class="el-icon-more"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="edit">编辑</el-dropdown-item>
            <el-dropdown-item class="red" command="delete">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-row>
    </div>
    <div v-if="!edit">
      <el-alert v-if="form.danger" title="此歌不稳" type="warning" center show-icon></el-alert>
      <div class="lyric">{{ form.lyric }}</div>
      <el-row v-if="form.music" type="flex" align="middle" class="play">
        <el-button size="mini" :type="type" :icon="icon" @click="click" circle></el-button>
        <el-col :span="22">
          <el-progress :percentage="percentage" :format="format"></el-progress>
        </el-col>
      </el-row>
      <pre v-if="form.music" class="music" v-html="sounds"></pre>
    </div>
    <div v-if="edit">
      <el-form :model="form" label-width="3em" size="small">
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
        <el-form-item>
          <el-button type="primary" @click="modify">修改</el-button>
          <el-button :type="type" @click="click">{{ playing ? '结束' : '试听' }}</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script>
import axios from 'axios'
import { play, stop } from '../piano'

export default {
  props: [ 'info', 'admin' ],
  data() {
    return {
      current: 0,
      length: 0,
      edit: false,
      form: {
        id: this.info.id,
        title: this.info.title,
        artist: this.info.artist,
        priority: this.info.priority,
        lyric: this.info.lyric,
        music: this.info.music,
        danger: this.info.danger
      }
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
      if (!this.form.music) { return '' }
      return this.form.music
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
        this.length = play(this.form.music, current => {
          if (current === this.length) {
            this.length = this.current = 0
          } else {
            this.current = current
          }
        })
      }
    },
    cancel() {
      this.edit = false
      Object.assign(this.form, this.info)
    },
    modify() {
      const loading = this.$loading()
      axios.put(`/song/${this.info.id}`, this.form).then(({ data }) => {
        if (data.err) {
          this.$message.error(data.msg)
        } else {
          this.edit = false
          Object.assign(this.info, this.form)
        }
      }).catch(({ message }) => {
        this.$message.error(message)
      }).finally(() => {
        loading.close()
      })
    },
    command(cmd) {
      if (cmd === 'edit') {
        this.edit = true
      } else if (cmd === 'delete') {
        this.$confirm(`确认删除 "${this.form.title}" 吗？`, '提示').then(() => {
          const loading = this.$loading()
          axios.delete(`/song/${this.info.id}`).then(({ data }) => {
            if (data.err) {
              this.$message.error(data.msg)
            } else {
              this.$emit('deleted', this.info.id)
            }
          }).catch(({ message }) => {
            this.$message.error(message)
          }).finally(() => {
            loading.close()
          })
        }).catch(() => {})
      }
    }
  }
}
</script>

<style>
.song {
  margin-bottom: 1em;
}
.song .el-alert {
  margin-bottom: 1em;
}
.play, .music {
  margin-top: 1em;
}
.play .el-button {
  margin-right: 1em;
}
.lyric, .music {
  font-size: 16px;
}
.red {
  color: #F56C6C !important;
}
.music {
  overflow-x: auto;
  padding-bottom: 1em;
  margin-bottom: -1em;
}
.low {
  text-emphasis-style: dot;
  text-emphasis-position: under;
  -webkit-text-emphasis-style: dot;
  -webkit-text-emphasis-position: under;
}
.high {
  text-emphasis-style: dot;
  text-emphasis-position: over;
  -webkit-text-emphasis-style: dot;
  -webkit-text-emphasis-position: over;
}
</style>
