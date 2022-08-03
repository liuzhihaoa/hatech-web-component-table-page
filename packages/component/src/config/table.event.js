export default {
	data() {
		return {
			// 表格高度
			tableHeight: "auto",
			// 多选已选中项
			selectedRows: [],
			tableLoading: false,
		}
	},
	computed: {
		// 表格配置
		tableConfig() {
			if (!this.page.table || !this.page.table.config) {
				console.warn('TablePage Table 配置未传递！')
				return {
					columns: []
				}
			}
			const {columns} = this.page.table.config;

			if (!this.page.noAuth) {
				let auths = []
				if (this.$route && this.$route.params) {
					auths = this.$route.params.auths || []
				}
				// 对于操作列做权限判断
				const actionIndex = columns.findIndex(
					(column) => column.type === "action"
				);
				if (~actionIndex) {
					const actionColumn = columns[actionIndex];
					if (actionColumn && actionColumn.props && actionColumn.props.options) {
						actionColumn.props.options = actionColumn.props.options.filter(
							(option) => {
								if (!option.code) return true;
								if (option.show === false || option.show === null) return false;
								// 在权限列表中
								if (
									~auths.findIndex(
										(auth) => `${auth.type}-${auth.code}` === option.code
									)
								) {
									return true;
								}
								return false;
							}
						);
						columns[actionIndex] = actionColumn;
					}
				}
			}

			return this.$utils.object.mixin(
				{
					table: {
						height: this.tableHeight,
						tooltipEffect: "light",
						stripe: true,
						border: true,
						resizeable: true,
						size: "small",
					},
					columns,
				},
				this.page.table && this.page.table.config
			);
		},
		// 表格头部按钮
		tableHeaderOptions() {
			if (
				!this.page.table ||
				!this.page.table.config ||
				!this.page.table.config.view ||
				!this.page.table.config.view.options ||
				!this.$route ||
				!this.$route.params
			) {
				return [];
			}

			const options = this.page.table.config.view.options;

			if (
				this.page.noAuth ||
				!this.$route ||
				!this.$route.params
			) {
				return options
			}

			const {auths = []} = this.$route.params;

			const newestOptions = options.filter((option) => {
				if (option.show === false || option.show === null) return false;
				if (
					~auths.findIndex(
						(auth) => `${auth.type}-${auth.code}` === option.code
					)
				) {
					return true;
				}
				return false;
			});
			return newestOptions;
		},
		// 是否表格撑满页面
		fullTable() {
			return !(
				this.page.table &&
				this.page.table.config &&
				[false, null].includes(this.page.table.config.full)
			);
		},
	},
	mounted() {
		// 数据初始化
		if (this.page.api && this.page.api.fetchTableData && ![false, null].includes(this.page.api.fetchTableData.init)) {
			this.queryTableData();
		}

		if (this.fullTable) {
			// 页面变化监听
			window.addEventListener("resize", this.computeTableHeight);
			this.$nextTick(() => setTimeout(this.computeTableHeight));
		}
	},
	beforeDestroy() {
		if (this.fullTable) {
			window.removeEventListener("resize", this.computeTableHeight);
		}
	},
	methods: {
		/**
		 * 表格事件
		 */
		onTableEvent(args) {
			const {event, params} = args;
			const func = this[event];
			if (func && typeof func === "function") {
				func(params);
			}
			this.$emit("onTableEvent", args);
		},
		/**
		 * 查询数据
		 */
		async queryTableData(args) {
			const {fetchTableData} = this.page.api;
			if (!fetchTableData || fetchTableData.hide) return;

			const {type, beforeRequest, afterResponse} = fetchTableData;

			let page
			let limit
			if (this.page.pagination && this.page.pagination.data) {
				page = this.page.pagination.data.page
				limit = this.page.pagination.data.limit
			}
			const searchData = this.page.search && this.page.search.data;

			// 请求参数处理
			let params = {
				page,
				limit,
				...searchData,
				...args
			};
			let config = {}
			let query = {}
			if (beforeRequest && typeof beforeRequest === "function") {
				const handleResult = await beforeRequest({params, config, query});
				if (typeof handleResult === 'boolean' && handleResult === false) return
				if (handleResult) {
					params = handleResult.params || params
					config = handleResult.config || config
					query = handleResult.query || query
				}
			}
			this.tableLoading = true;
			try {
				console.log(params, config, query)
				let response = await this.$store.dispatch(type, {
					params, query, config
				});

				if (response && response.success) {
					response =
						afterResponse && typeof afterResponse === "function"
							? (await afterResponse(response)) || response
							: response;
					this.page.table.data = response.data;
					this.page.pagination.data = {
						...this.page.pagination.data,
						total: response.count
					}
				}
				this.tableLoading = false;
			} catch (e) {
				console.error("table page fetch data error : ", e);
				this.tableLoading = false;
			}
		},
		/**
		 * 查看表格行数据详情
		 */
		async onDetailTableAction({scope}) {
			if (!this.page.tableForm) {
				return
			}

			let config = {
				...this.page.tableForm.config,
				mode: 'show'
			}
			let data = {...scope.row}
			if (this.page.api && this.page.api.detailTable && this.page.api.detailTable.beforeShow && typeof this.page.api.detailTable.beforeShow === 'function') {
				const handleResult = await this.page.api.detailTable.beforeShow({config, data})
				config = handleResult.config || config
				data = handleResult.data || data
			}
			this.form.config = config
			this.form.data = data

			this.$refs.formDialog.show()

			if (!this.page.api || !this.page.api.detailTable || !this.page.api.detailTable.type) {
				return
			}

			this.form.config.loading = true

			const {type, beforeRequest, afterResponse} = this.page.api.detailTable

			let params = {
				id: scope.row.id
			}
			let query = {};
			let requestConfig = {};
			if (beforeRequest && typeof beforeRequest === 'function') {
				const handleResult = await beforeRequest({
					params,
					query,
					config: requestConfig,
					row: scope.row,
					index: scope.$index
				});
				if (typeof handleResult === 'boolean' && handleResult === false) return

				if (handleResult) {
					params = handleResult.params || params;
					query = handleResult.query;
					requestConfig = handleResult.config;
				}
			}

			let res = await this.$store.dispatch(type, {params, query, config: requestConfig})
			if (res && res.success) {
				res = afterResponse(res, scope.row) || res
				this.page.form.data = res.data
			}

			this.form.config.loading = false
		},
		/**
		 * 新增表格数据
		 */
		async onInsertTableAction() {
			if (!this.page.tableForm || !this.page.api.insertTable) {
				return
			}
			const {beforeShow} = this.page.api.insertTable

			this.form.api = this.page.api.insertTable

			let data = {}
			let config = {...this.page.tableForm.config}
			if (beforeShow && typeof beforeShow === 'function') {
				const handleResult = await beforeShow({data, config})
				if (typeof handleResult === 'boolean' && handleResult === false) return

				if (handleResult) {
					data = handleResult.data || data
					config = handleResult.config || config
				}
			}
			this.form.config = config
			this.form.data = data
			this.$refs.formDialog.show()
		},
		/**
		 * 更新表格数据
		 */
		async onUpdateTableAction({scope}) {
			if (!this.page.tableForm || !this.page.api || !this.page.api.updateTable) {
				return
			}
			this.form.api = this.page.api.updateTable

			const {beforeShow} = this.page.api.updateTable

			let data = {...scope.row}
			let config = {...this.page.tableForm.config}
			if (beforeShow && typeof beforeShow === 'function') {
				const handleResult = await beforeShow({data, config})
				if (typeof handleResult === 'boolean' && handleResult === false) return

				if (handleResult) {
					data = handleResult.data || data
					config = handleResult.config || config
				}
			}
			this.form.data = data
			this.form.config = config
			this.$refs.formDialog.show()

			if (!this.page.api.detailTable || !this.page.api.detailTable.type) {
				return
			}

			this.form.config.loading = true

			const {type, beforeRequest, afterResponse} = this.page.api.detailTable

			let params = {
				id: scope.row.id
			}
			let query = {};
			let requestConfig = {};
			if (beforeRequest && typeof beforeRequest === 'function') {
				const handleResult = await beforeRequest({
					params,
					query,
					config: requestConfig,
					row: scope.row,
					index: scope.$index
				});
				if (typeof handleResult === 'boolean' && handleResult === false) return

				if (handleResult) {
					params = handleResult.params || params;
					query = handleResult.query;
					requestConfig = handleResult.config;
				}
			}

			let res = await this.$store.dispatch(type, {params, query, config: requestConfig})
			if (res && res.success) {
				res = afterResponse(res, scope.row) || res
				this.page.form.data = res.data
			}

			this.form.config.loading = false
		},
		/**
		 * 删除表格数据
		 */
		async onDeleteTableAction({scope} = {}) {
			if (!this.page.api.deleteTable) {
				return
			}
			try {
				await this.$confirm('请确认是否删除？', '温馨提示', {
					closeOnClickModal: false,
					type: 'warning'
				})

				const {type, beforeRequest, afterResponse} = this.page.api.deleteTable

				let params = {
					id: scope.row.id
				}
				let query = {};
				let config = {};
				if (beforeRequest && typeof beforeRequest === 'function') {
					const handleResult = await beforeRequest({
						params,
						query,
						config,
						row: scope.row,
						index: scope.$index
					});
					if (typeof handleResult === 'boolean' && handleResult === false) return

					if (handleResult) {
						params = handleResult.params || params;
						query = handleResult.query;
						config = handleResult.config;
					}
				}

				const res = await this.$store.dispatch(type, {
					params, query, config
				})

				if (res && res.success) {
					this.$message.success(res.msg)
					if (afterResponse && typeof afterResponse === 'function') {
						afterResponse(res, scope.row)
					}
					this.page.pagination.data.page = 1;
					this.queryTableData()
				}
			} catch (e) {
				console.error(e)
			}
		},
		/**
		 * 点击头部事件，根据event触发事件
		 */
		onClickHeaderButton(args) {
			const {event} = args;
			if (!event) return;

			const func = this[event];
			if (func && typeof func === "function") {
				func(args);
			}

			this.$emit("onEvent", {
				event,
				params: args,
			});
		},
		/**
		 * 计算表格高度
		 */
		computeTableHeight() {
			const pagination = this.$refs.pagination;
			const table = this.$refs.table;
			if (!table) return
			let bottomElementY
			let tableHeight
			if (pagination) {
				let headH = 0
				const tableHead = table.getElementsByClassName('el-table__header')
				if (tableHead.length > 0) {
					headH = tableHead[0].offsetHeight
				}
				let paginationEl = pagination.$el || pagination
				let paginationH = paginationEl.offsetHeight || 52
				bottomElementY = table.getBoundingClientRect().y + paginationH + 10
				tableHeight = window.innerHeight - bottomElementY
				if (tableHeight > paginationEl.getBoundingClientRect().y) {
					tableHeight = tableHeight - headH
				}
				//bottomElementY = pagination.getBoundingClientRect().y
			} else {
				bottomElementY = window.innerHeight
				tableHeight = bottomElementY - table.getBoundingClientRect().y
			}
			this.tableHeight = tableHeight;
			table.style.height = `${tableHeight}px`;
		},
		/**
		 * 表格多选项变化
		 * @param {*} params
		 */
		['selection-change'](params) {
			this.selectedRows = params
		}
	}
}
