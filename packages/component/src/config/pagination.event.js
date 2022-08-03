export default {
    computed: {
        // 分布配置
        paginationConfig() {
            return {
                small: false,
                background: true,
                pagerCount: 5,
                layout: "total, sizes, prev, pager, next, jumper",
                pageSizes: [10, 20, 50, 100, 200],
                ...(this.page.pagination && this.page.pagination.config),
            };
        },
    },
    methods: {
        /**
         * 分布信息变化
         */
        onPaginationChange({ page, limit } = {}) {
            this.page.pagination.data = {
                ...this.page.pagination.data,
                page,
                limit,
            };
            this.queryTableData();
        },
    },
}