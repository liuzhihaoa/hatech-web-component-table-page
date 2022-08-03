import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import Utils from 'hatech-web-utils'
import Vuex from 'vuex'
import ThemeLoader from 'hatech-web-theme-loader'
import ThemeDarkBlue from 'hatech-web-theme-darkblue'
import VueRouter from 'vue-router';
import './assets/icons'
import TableStatus from './views/components/TableStatus'
Vue.component(TableStatus.name, TableStatus)

Vue.use(Element)
Vue.config.productionTip = false

Vue.use(Utils)
Vue.use(Vuex)
Vue.use(VueRouter)

// 加载主题
Vue.use(ThemeLoader, {
  defaultTheme: ThemeDarkBlue,
  themes: [
    ThemeDarkBlue
  ]
})

const store = new Vuex.Store()


import Home from './views/home'

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: '首页',
      component: Home
    }
  ]
})

router.beforeEach((to, form, next) => {
  next()
})

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
