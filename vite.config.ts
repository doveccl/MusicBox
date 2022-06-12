import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  resolve: {
    alias: {
      webmidi: './src/webmidi.ts'
    }
  },
  plugins: [
    vue(),
    AutoImport({
      dts: 'src/imports.d.ts',
      imports: ['vue', 'pinia', {
        axios: [['default', 'axios']]
      }]
    }),
    Components({
      dts: 'src/components.d.ts',
      resolvers: [NaiveUiResolver()]
    })
  ]
})
