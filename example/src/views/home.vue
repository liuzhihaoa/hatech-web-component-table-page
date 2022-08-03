<template>
    <div id="app">
        <hatech-table-page ref="page" :page="page" @onEvent="onEvent" @onTableEvent="onEvent"></hatech-table-page>
    </div>
</template>

<script>
	import {HatechTablePage} from '../../../src'


	import Page from './config'

	export default {
		name: 'App',
		components: {
			HatechTablePage
		},
		data() {
			return {
				page: Page.call(this)
			}
		},
		methods: {
			onEvent(args) {
				const {event, params} = args
				this[event] && this[event](params)
				console.log('on event : ', event, params)
			},
			// 回显表单中tree数据
			setCheckedKeys() {
				const [tree] = this.$refs.page.getFormRef('treeData')
				if (tree) {
					tree.setCheckedKeys(['id'])
				}
			},
			onFormDataChange() {
				// 获取当前表单数据
				const data = this.$refs.page.currFormData()
				console.log(data)
				// 设置当前表单数据
				this.$refs.page.currFormData({
					name: data.name + 123456
				})
			}
		}
	}
</script>

<style>
    #app {
        background-color: var(--color-background);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .table_page_pagination_wrapper {
        padding: 10px;
        -moz-user-select: none;
        -o-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        border: 1px solid #0f74e3;
        box-shadow: 0 8px 15px -2px #2f3a76 inset;
        border-bottom: 0;
        border-radius: 2px;
    }

    #pagination {
        padding: 10px;
        -moz-user-select: none;
        -o-user-select: none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
        border: 1px solid #0f74e3;
        box-shadow: 0 -8px 15px 2px #2f3a76 inset;
        border-top: 0;
        border-radius: 2px;
    }
</style>
