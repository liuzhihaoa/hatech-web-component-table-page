export default {
    data() {
        return {
            treeLoading: false,
            selectedTreeNode: undefined,
            isClick: false
        }
    },
    computed: {
        // 树配置
        treeConfig() {
            if (
                !this.page.tree ||
                !this.page.tree.config ||
                this.page.tree.hide
            ) return {}

            const { props = {} } = this.page.tree.config
            return this.$utils.object.mixin({
                expandOnClickNode: false,
                nodeKey: "id",
                indent: 8,
                defaultExpandAll: true,
                highlightCurrent: true,
                tree: {},
                view: {},
                col: {},
                renderContent: function (h, { data } = {}) {
                    const nodeEle = h('div', {
                        attrs: {
                            title: data[props.label || 'label']
                        },
                        style: {
                            'white-space': 'nowrap',
                            'overflow': 'hidden',
                            'text-overflow': 'ellipsis'
                        }
                    }, [
                        data[props.label || 'label']
                    ])
                    return nodeEle
                },
            }, this.page.tree && this.page.tree.config);
        },
        // 树头部按钮配置
        treeHeaderOptions() {
            if (
                !this.page.tree ||
                !this.page.tree.config ||
                !this.page.tree.config.view ||
                !this.page.tree.config.view.options
            ) {
                return [];
            }

            const options = this.page.tree.config.view.options;

            if (
                this.page.noAuth ||
                !this.$route ||
                !this.$route.params
            ) {
                return options
            }

            const { auths = [] } = this.$route.params;

            if (!this.page.onAuth) {
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
            }

            return options
        },
    },
    mounted() {
        // 数据初始化
        if (this.page.api && this.page.api.fetchTreeData && ![false, null].includes(this.page.api.fetchTreeData.init)) {
            this.queryTreeData();
        }
    },
    methods: {
        /**
         * 树事件
         */
        onTreeEvent(args = {}) {
            const { event, params } = args
            const func = this[event]
            if (func && typeof func === 'function') {
                func(params)
            }

            this.$emit('onEvent', args)
        },
        /**
         * 查询树形数据
         */
        async queryTreeData() {
            const { fetchTreeData } = this.page.api;
            if (!fetchTreeData || fetchTreeData.hide) return;

            const {
                type,
                beforeRequest,
                afterResponse,
            } = fetchTreeData;

            let params = {};
            let config = {};
            let query = {}
            if (beforeRequest && typeof beforeRequest === "function") {
                const handleResult = (await beforeRequest({ params, config, query }));
                if (typeof handleResult === 'boolean' && handleResult === false) return

                if (handleResult) {
                    params = handleResult.params || params
                    config = handleResult.config || config
                    query = handleResult.query || query
                }
            }

            this.treeLoading = true;
            try {
                let response = await this.$store.dispatch(type, {
                    params,
                    config,
                    query
                });
                if (response && response.success) {
                    if (afterResponse && typeof afterResponse === "function") {
                        response = (await afterResponse(response)) || response;
                    }
                    this.page.tree.data = response.data;
                    console.log(this.page.tree.data, 'this.page.tree.data')
                }
                this.treeLoading = false;
            } catch (e) {
                console.error("Tree page query tree data error : ", e);
                this.treeLoading = false;
            }
        },
        /**
        * 查看树数据
        */
        async onDetailTreeAction() {
            if (!this.page.treeForm) {
                return
            }
            let data = { ...this.selectedTreeNode }
            if (this.page.api && this.page.api.detailTree && this.page.api.detailTree.beforeShow && typeof this.page.api.detailTree.beforeShow === 'function') {
                const handleResult = await this.page.api.detailTree.beforeShow({ config, data })
                config = handleResult.config || config
                data = handleResult.data || data
            }
            this.form.config = config
            this.form.data = data

            this.$refs.formDialog.show()

            if (!this.page.api || !this.page.api.detailTree || !this.page.api.detailTree.type) {
                return
            }

            this.form.config.loading = true

            const { type, beforeRequest, afterResponse } = this.page.api.detailTree

            let params = {
                id: this.selectedTreeNode.id
            }
            let query = {};
            let requestConfig = {};
            if (beforeRequest && typeof beforeRequest === 'function') {
                const handleResult = await beforeRequest({
                    params,
                    query,
                    config: requestConfig,
                    node: this.selectedTreeNode
                });
                if (typeof handleResult === 'boolean' && handleResult === false) return

                if (handleResult) {
                    params = handleResult.params || params;
                    query = handleResult.query;
                    requestConfig = handleResult.config;
                }
            }

            let res = await this.$store.dispatch(type, { params, query, config: requestConfig })
            if (res && res.success) {
                res = afterResponse(res, this.selectedTreeNode) || res
                this.page.form.data = res.data
            }

            this.form.config.loading = false
        },
        /**
         * 新增树数据
         */
        async onInsertTreeAction() {
            if (!this.page.treeForm || !this.page.api.insertTree) {
                return
            }
            const { beforeShow } = this.page.api.insertTree

            this.form.api = this.page.api.insertTree

            let data = {}
            let config = { ...this.page.treeForm.config }
            if (beforeShow && typeof beforeShow === 'function') {
                const handleResult = await beforeShow({ data, config })
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
         * 更新树数据
         */
        async onUpdateTreeAction() {
            if (!this.page.treeForm || !this.page.api || !this.page.api.insertTree) {
                return
            }

            if (this.isClick) {
                return
            }
            this.debounceBy()

            if (!this.selectedTreeNode) {
                const tip = this.page.api.insertTree.noSelectTip || '请选择节点树'
                return this.$message.warning(tip)
            }

            this.form.api = this.page.api.updateTree

            const { beforeShow } = this.page.api.updateTree

            let data = { ...this.selectedTreeNode }
            let config = { ...this.page.treeForm.config }
            if (beforeShow && typeof beforeShow === 'function') {
                const handleResult = await beforeShow({ data, config })
                if (typeof handleResult === 'boolean' && handleResult === false) return

                if (handleResult) {
                    data = handleResult.data || data
                    config = handleResult.config || config
                }
            }
            this.form.data = data
            this.form.config = config
            this.$refs.formDialog.show()

            if (!this.page.api.detailTree || !this.page.api.detailTree.type) {
                return
            }

            this.form.config.loading = true

            const { type, beforeRequest, afterResponse } = this.page.api.detailTree

            let params = {
                id: this.selectedTreeNode.id
            }
            let query = {};
            let requestConfig = {};
            if (beforeRequest && typeof beforeRequest === 'function') {
                const handleResult = await beforeRequest({
                    params,
                    query,
                    config: requestConfig,
                    node: this.selectedTreeNode
                });
                if (typeof handleResult === 'boolean' && handleResult === false) return

                if (handleResult) {
                    params = handleResult.params || params;
                    query = handleResult.query;
                    requestConfig = handleResult.config;
                }
            }

            let res = await this.$store.dispatch(type, { params, query, config: requestConfig })
            if (res && res.success) {
                res = afterResponse(res, this.selectedTreeNode) || res
                this.page.form.data = res.data
            }

            this.form.config.loading = false
        },
        /**
         * 删除树数据
         */
        async onDeleteTreeAction() {
            if (!this.page.api.deleteTree) {
                return
            }

            if (this.isClick) {
                return
            }
            this.debounceBy()

            if (!this.selectedTreeNode) {
                const tip = this.page.api.insertTree.noSelectTip || '请选择节点树'
                return this.$message.warning(tip)
            }
            try {
                await this.$confirm('请确认是否删除？', '温馨提示', {
                    closeOnClickModal: false,
                    type: 'warning'
                })

                const { type, beforeRequest, afterResponse } = this.page.api.deleteTree

                let params = {
                    id: this.selectedTreeNode.id
                }
                let query = {};
                let config = {};
                if (beforeRequest && typeof beforeRequest === 'function') {
                    const handleResult = await beforeRequest({
                        params,
                        query,
                        config,
                        node: this.selectedTreeNode
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
                        afterResponse(res, this.selectedTreeNode)
                    }
                    this.queryTreeData()
                }
            } catch (e) {
                console.error(e)
            }
        },
        /**
         * 点击树形头部图标
         */
        onClickTreeOption(option) {
            const { disabled, event } = option;
            if (disabled || !event) return;
            const func = this[event];
            if (func && typeof func === "function") {
                func(option);
            }
            this.$emit("onEvent", { event, params: option });
        },
        /**
         * 点击节点
         */
        ['node-click'](node) {
            this.selectedTreeNode = node
        },
        /**
         * 点击事件防抖，默认每隔1秒点一次
         * */
        debounceBy(time = 1000) {
            this.isClick = true
            setTimeout(() => {
                this.isClick = false
            }, time)
        }
    }
}
