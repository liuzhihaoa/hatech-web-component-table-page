<template>
    <el-row type="flex" justify="start" class="table_page" v-loading="loading">
        <!-- 顶部插槽 -->
        <slot name="page_top"></slot>

        <!-- 左侧树 -->
        <el-col
                v-if="page.tree && !page.tree.hide"
                :span="treeConfig.col.span || 6"
                class="table_page_tree"
                v-loading="treeLoading"
                element-loading-background="rgba(255, 255, 255, 0.1)"
        >
            <div class="table_page_tree__header">
                <div class="table_page_tree__title" :title="treeConfig.view.title">{{ treeConfig.view.title }}</div>
                <!-- 树头部按钮 -->
                <div class="table_page_tree__options">
                    <template v-for="(option, index) in treeHeaderOptions">
                        <hatech-icon
                                :key="index"
                                :class="[
                'table_page_tree__option',
                option.disabled ? 'disabled' : '',
              ]"
                                :title="option.label"
                                :iconClass="option.icon"
                                @click="onClickTreeOption(option)"
                        ></hatech-icon>
                    </template>
                </div>
            </div>
            <div class="table_page_tree__content">
                <hatech-tree
                        ref="tree"
                        :config="treeConfig"
                        :data="page.tree.data"
                        @onEvent="onTreeEvent"
                ></hatech-tree>
            </div>
        </el-col>

        <el-col
                :span="page.tree && !page.tree.hide ? 18 : 24"
                class="table_page_main"
                v-loading="tableLoading"
                element-loading-background="rgba(255, 255, 255, 0.1)"
        >
            <!-- 搜索面板 -->
            <div class="table_page_search" v-if="page.search && !searchConfig.hide">
                <hatech-form
                        :config="searchConfig"
                        :data="page.search.data"
                        @onEvent="onEvent"
                >
                    <template slot="action_buttons">
                        <div class="table_page_search__buttons">
                            <!-- 右侧按钮 -->
                            <el-button type="primary" @click="onSearch" size="small"
                            >查询
                            </el-button
                            >
                            <el-button @click="onSearchReset" size="small">清空</el-button>
                        </div>
                    </template>
                </hatech-form>
            </div>
            <div class="table_page_pagination_wrapper">
                <!-- 表格头部 -->
                <el-row
                        v-if="tableConfig.view && !tableConfig.view.hide"
                        id="toolbar"
                        type="flex"
                        justify="space-between"
                        class="table_page_toolbar"
                >
                    <el-col :span="12" class="table_page_toolbar__left">
                        <div class="table_page_toolbar__left-title" :title="tableConfig.view && tableConfig.view.title">
                            {{ tableConfig.view && tableConfig.view.title }}
                        </div>
                    </el-col>
                    <el-col :span="12" class="table_page_toolbar__right">
                        <!-- 左侧按钮 -->
                        <!-- 根据页面配置传入 -->
                        <div class="column_icon" v-for="(button, index) in tableHeaderOptions" :key="index"
                             :title="button.label">
                            <hatech-icon :iconClass="button.icon"
                                         @click="onClickHeaderButton(button)"
                            />
                        </div>

                        <!-- 显隐列按钮 -->
                        <div class="column_icon" v-if="showColumnCtrl" title="显示\隐藏列">
                            <el-popover placement="bottom" width="200" trigger="click">
                                <el-checkbox-group
                                        v-model="ctrlColumnOptions"
                                        v-loading="columnLoading"
                                        element-loading-background="transparent"
                                >
                                    <el-checkbox
                                            v-for="(column, key) in ctrlTableColumns"
                                            :key="key"
                                            :label="column.prop"
                                            :name="column.prop"
                                            @change="onColumnChange(column)"
                                    >{{ column.label }}
                                    </el-checkbox
                                    >
                                </el-checkbox-group>
                                <em
                                        class="el-icon-menu column_icon__instance"
                                        slot="reference"
                                ></em>
                            </el-popover>
                        </div>


                    </el-col>
                </el-row>

                <!-- 表格 -->
                <div
                        v-if="page.table && !page.table.hide"
                        id="table"
                        ref="table"
                        class="table_page_table"
                >
                    <hatech-table
                            :config="tableConfig"
                            :data="page.table.data"
                            @onEvent="onEvent"
                            @onTableEvent="onTableEvent"
                    ></hatech-table>
                </div>

                <!-- 分页栏 -->
                <el-row
                        v-if="page.pagination && !page.pagination.hide"
                        id="pagination"
                        ref="pagination"
                        type="flex"
                        justify="end"
                        :class="this.fullTable ? 'table_page_pagination' : ''"
                >
                    <hatech-pagination
                            :config="paginationConfig"
                            :data="page.pagination.data"
                            @onEvent="onEvent"
                    ></hatech-pagination>
                </el-row>
            </div>
        </el-col>

        <!-- 底部插槽 -->
        <slot name="page_bottom"></slot>

        <!-- 新增、编辑、删除功能表单 -->
        <hatech-form-dialog
                ref="formDialog"
                :config="formConfig"
                :data="form.data"
                @onEvent="onEvent"
        ></hatech-form-dialog>
    </el-row>
</template>

<script>
	import {HatechIcon} from "hatech-web-component-icon";
	import {HatechTree} from "hatech-web-component-tree";
	import {HatechForm} from "hatech-web-component-form";
	import {HatechFormDialog} from "hatech-web-component-form-dialog";
	import {HatechTable} from "hatech-web-component-table";
	import {HatechPagination} from "hatech-web-component-pagination";
	import methods from "./config/method";

	export default {
		name: 'hatech-table-page',
		mixins: [...methods],
		components: {
			HatechIcon,
			HatechTree,
			HatechForm,
			HatechFormDialog,
			HatechTable,
			HatechPagination,
		},
		props: {
			page: {
				type: Object,
				default: () => ({
					// 无鉴权,将不验证鉴权
					noAuth: false,
					search: {},
					table: {},
				}),
			},
		},
		data() {
			return {
				loading: false,
			};
		},
		methods: {
			/**
			 * 事件处理
			 */
			onEvent({event, params, ...args} = {}) {
				const func = this[event];
				console.log(event)
				if (func && typeof func === "function") {
					func(params);
				}

				this.$emit("onEvent", {
					event,
					params,
					...args,
				});
			},
			// 获取当前选择数据
			getSelectedRows() {
				return this.selectedRows;
			},
			/**
			 * 获取引用
			 */
			getRef(ref) {
				return this.$refs[ref];
			},
			/**
			 * 获取树引用
			 */
			getTree() {
				return this.$refs.tree.$refs.tree;
			},
			/**
			 * 获取表格引用
			 */
			getTable() {
				return this.$refs.table.tableInstance;
			},
			/**
			 * 获取表单中组件引用
			 */
			getFormRef(name) {
				const form = this.$refs.formDialog.getRef('form')
				if (form && form.$refs) return form.$refs[name]
				return
			}
		},
	};
</script>

<style lang="scss" scoped>
    .table_page {
        position: relative;
        height: 100%;
        overflow: hidden;

        .table_page_tree {
            margin-right: 20px;
            background: var(--component-background-color);
            box-shadow: var(--component-box-shadow);
            border: var(--component-border-primary);

            .table_page_tree__header {
                padding: 10px 20px;
                display: flex;
                justify-content: space-between;
                border-bottom: var(--component-border-primary);

                .table_page_tree__title {
                    flex: 1;
                    color: var(--color-text-primary);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .table_page_tree__options {
                    overflow: hidden;
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: right;
                    flex-direction: row-reverse;

                    .table_page_tree__option {
                        display: flex;
                        cursor: pointer;
                        min-width: 30px;

                        &.disabled {
                            cursor: not-allowed;
                        }
                    }
                }
            }

            .table_page_tree__content {
                height: calc(100% - 82px);
                padding: 20px;

                .el-tree {
                    height: 100%;
                    overflow: auto;
                }
            }
        }

        .table_page_main {
            position: relative;

            .table_page_search {
                margin: 10px 0;

                .table_page_search__buttons {
                    padding-left: 20px;
                }
            }

            .table_page_toolbar {
                // margin: 10px 0;
                .column_icon {
                    color: var(--color-text-primary);
                    cursor: pointer;
                    margin-right: 10px;
                    width: 30px;
                    height: 30px;
                    display: inline-block;
                    text-align: center;

                    span {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                    }

                    /deep/ .column_icon__instance {
                        font-size: 1.3em;
                        transform: translate(0, 0.15em);
                    }
                }

                .table_page_toolbar__left {
                    .table_page_toolbar__left-title {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        color: var(--color-text-primary);
                        line-height: 30px;
                    }
                }

                .table_page_toolbar__right {
                    text-align: right;
                }
            }

            .table_page_table {
                // margin-top: 10px;
                border-top: var(--component-border-primary);
                overflow: auto;

                /deep/ .el-table--border {
                    border: none;

                    th {
                        border-right: none;
                    }

                    td {
                        border-right: none;
                    }
                }
            }

            .table_page_pagination {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                padding: 10px 0;
            }
        }
    }

    /deep/ .el-dialog {
        .el-dialog__body {
            max-height: 60vh;
            overflow: auto;
        }
    }
</style>
