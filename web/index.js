import Vue from 'vue'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'

import App from './app'
import Home from './pages/home'
import Login from './pages/login'
import Song from './components/song'

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.component('song', Song)

const app = document.createElement('div')
document.body.appendChild(app)

new Vue({
  el: app,
  render: h => h(App),
  router: new VueRouter({
    mode: 'history',
    routes: [
      { path: '/', component: Home },
      { path: '/login', component: Login },
      { path: '*', redirect: '/' }
    ]
  })
})
