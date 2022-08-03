import { ObjectUtil } from "hatech-web-utils";

export default {
    computed: {
        // 搜索栏配置
        searchConfig() {
            if (!this.page.search.config) {
                this.page.search.config = {}
            }
            this.page.search.config.columns = [
                ...this.page.search.config.columns,
                {
                    show: true,
                    type: 'slot',
                    prop: 'action_buttons',
                    label: '',
                    col: {
                        span: 4
                    },
                }
            ]

            return ObjectUtil.mixin(this.page.search && this.page.search.config, {
                mode: 'edit',
                form: {
                    size: "small",
                },
            });
        },
    },
    methods: {

        /**
         * 搜索
         */
        async onSearch() {
            this.$emit("onEvent", { event: "onSearch" });
            this.queryTableData();
        },
        /**
         * 清空搜索
         */
        onSearchReset() {
            if (this.page.search) {
                this.page.search.data = {};
            }
            this.$emit("onEvent", { event: "onSearchReset" });
        },
    },
}