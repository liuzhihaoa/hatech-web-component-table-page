# 表格页面组件

本组件提供页面组件功能，组件内包含左侧树、右侧表格，搜索栏等功能

通过集成通用组件功能，开成整个页面组件，方便直接使用

---
## 使用说明

### 安装

```sh
  npm install hatech-web-component-table-page
```

### 初始化

```js
  // main.js
  import Vue from 'vue'
  import HatechTablePage from 'hatech-web-component-table-page'
  Vue.use(HatechTablePage)
  // or
  // xxx.vue
  import { HatechTablePage } from 'hatech-web-component-table-page'
  export default {
    components: {
      HatechTablePage
    }
  }
```

### 使用示例

```html
  <hatech-table-page :config="config" :data="data" @onEvent="onEvent"></hatech-table-page>
```
```js
  export default {
    data() {
      return {
        data: [
          ...
        ],
        config: {
          ...
        }
      }
    },
    methods: {
      onEvent(args) {
        const { event, params } = args
        this[event] && this[event](params)
      }
    }
  }
```

### 参数

| 参数名               | 类型    | 描述                                    |
| -------------------- | ------- | --------------------------------------- |
| page.noAuth          | Boolean | 是否使用鉴权,true表示对于按钮不进行鉴权 |
| page.api             | Object  | 接口配置                                |
| page.table           | Object  |                                         |
| page.table.hide      | Boolean | 是否隐藏，true表示隐藏                  |
| page.tableForm       | Object  | 表格增删改查配置                        |
| page.search          | Object  | 搜索栏配置                              |
| page.search.hide     | Boolean |                                         |
| page.tree            | Object  | 左侧树配置                              |
| page.tree.hide       | Boolean |                                         |
| page.treeForm        | Object  | 树增删改查                              |
| page.pagination      | Object  | 分页配置                                |
| page.pagination.hide | Boolean |                                         |

### 插槽

| 名称        | 说明     |
| ----------- | -------- |
| page_top    | 组件头部 |
| page_bottom | 组件底部 |

### 事件

| 名称         | 说明             |
| ------------ | ---------------- |
| onEvent      | 事件统一处理     |
| onTableEvent | 表格事件统一处理 |
| onTreeEvent  | 树事件统一处理   |

### 方法

| 方法名       | 参数                 | 作用                   |
| ------------ | -------------------- | ---------------------- |
| getRef       | getRef(ref)          | 获取组件引用           |
| currFormData | currFormData(params) | 获取、设置当前表单数据 |


### 主题变量

| 变量名                       | 值类型 | 默认值 | 说明         |
| ---------------------------- | ------ | ------ | ------------ |
| --component-background-color | 颜色   | -      | 用于组件背景 |
| --component-box-shadow       | 颜色   | -      | 组件阴影     |
| --component-border-primary   | 颜色   | -      | 用于边框颜色 |

### 依赖

| 依赖名                           | 版本   |
| -------------------------------- | ------ |
| hatech-web-component             | 0.0.8  |
| hatech-web-component-form        | 0.0.10 |
| hatech-web-component-form-dialog | 0.0.8  |
| hatech-web-component-icon        | 0.0.2  |
| hatech-web-component-pagination  | 0.0.1  |
| hatech-web-component-table       | 0.0.8  |
| hatech-web-component-tree        | 0.0.1  |

---
## 作者/维护者

| 名称 | 联系方式              | 参与部分     |
| ---- | --------------------- | ------------ |
| 吴浩 | wuhaowh@hatech.com.cn | 初始版本开发 |

