import Component from './src/main.vue'

// 添加install方法，供Vue.use使用
Component.install = function (Vue) {
  Vue.component(Component.name, Component)
}

export default Component