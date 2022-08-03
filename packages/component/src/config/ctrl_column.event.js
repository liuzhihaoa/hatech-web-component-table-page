export default {
    data() {
        return {
            columnLoading: false,
            ctrlColumnOptions: [],
        }
    },
    computed: {
        // 是否显示显隐列控制
        showColumnCtrl() {
            if (
                !this.page.table ||
                !this.page.table.config ||
                !this.page.table.config.view
            )
                return true;
            const { showColumnCtrl } = this.page.table.config.view;
            if (showColumnCtrl === false || showColumnCtrl === null) return false;
            return true;
        },
        // 受控表格列表
        ctrlTableColumns() {
            if (
                !this.page.table ||
                !this.page.table.config ||
                !this.page.table.config.columns
            ) {
                return [];
            }
            const { columns } = this.page.table.config;

            this.ctrlColumnOptions = [];
            return columns.filter((column) => {
                if (["index", "selection", "action"].includes(column.type)) {
                    return false;
                }
                if (column.notCtrl) return false

                if (column.show !== false && column.show !== null) {
                    this.ctrlColumnOptions.push(column.prop);
                }
                return true;
            });
        },
    },
    mounted() {
        // 显隐列控制
        if (this.showColumnCtrl) {
            this.queryCtrlColumns();
        }
    },
    methods: {
        /**
     * 查询用户表格显隐数据
     */
        async queryCtrlColumns() {
            if (
                !this.page.table ||
                !this.page.table.config ||
                !this.page.table.config.id
            ) {
                return;
            }
            const { id } = this.page.table.config;

            let service = "app/FetchCtrlColumns";
            if (
                this.page.api &&
                this.page.api.fetchCtrlColumns &&
                this.page.api.fetchCtrlColumns.type
            ) {
                service = this.page.api.fetchCtrlColumns.type;
            }

            this.columnLoading = true;
            const response = await this.$store.dispatch(service, {
                params: {
                    name: id,
                },
            });
            if (response && response.success) {
                let ctrlColumns;
                try {
                    const { content } = response.data;
                    ctrlColumns = JSON.parse(content);
                } catch (e) {
                    console.warn(`解析显隐列${id}状态失败`);
                }

                if (ctrlColumns && ctrlColumns.length) {
                    const { columns } = this.page.table.config;
                    const newestColumns = columns.map((column) => {
                        const newestColumn = { ...column };
                        const remoteColumn = ctrlColumns.find(
                            (cc) => cc.prop === column.prop
                        );
                        if (remoteColumn) {
                            newestColumn.show =
                                remoteColumn.show === undefined || remoteColumn.show === null
                                    ? true
                                    : remoteColumn.show;
                            newestColumn.width = remoteColumn.width;
                        }
                        return newestColumn;
                    });
                    this.page.table.config.columns = newestColumns;
                }
            }

            this.columnLoading = false;
        },
        /**
         * 显隐列选择变化
         */
        async onColumnChange(value) {
            this.columnLoading = true;
            const newestColumns = this.ctrlTableColumns.map((c) => {
                c.show = c.show === undefined || c.show === true ? true : false
                return {
                    prop: c.prop,
                    show: c.prop === value.prop ? !c.show : c.show,
                    width: c.width
                }
            });
            const response = await this.$store.dispatch("app/UpdateCtrlColumn", {
                params: {
                    name: this.page.table.config.id,
                    content: JSON.stringify(newestColumns),
                },
            });
            if (response && response.success) {
                const { columns } = this.page.table.config;
                this.page.table.config.columns = columns.map((c) => {
                    const newestColumn = newestColumns.find(
                        (item) => item.prop === c.prop
                    );
                    if (!newestColumn) return c;
                    return {
                        ...c,
                        ...newestColumn,
                    };
                });
            }

            this.columnLoading = false;
        },
    }
}