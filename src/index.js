import HatechTablePage from '../packages/component'

// 当组件包含多个子组件时，使用Vue.use都需要注入，可都填写在Components中
const components = [
  HatechTablePage
]

// 方便直接注入Vue
const install = function (Vue) {
  components.forEach(component => {
    if (component && component.name) {
      Vue.component(component.name, component)
    }
  })
}

// 版本号，与package.json中的版本保持一致
const version = require('../package.json').version

export default {
  version,
  install,
  HatechTablePage
}

export { HatechTablePage }