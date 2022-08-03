import { ObjectUtil } from "hatech-web-utils";

export default {
    data() {
        return {
            // 弹框信息
            form: {
                mode: "edit",
                api: {},
                config: {},
                data: {},
            },
        }
    },
    computed: {
        // 表单配置
        formConfig() {
            const { config } = this.form;
            return ObjectUtil.mixin(
                {
                    dialog: {
                        top: "10vh",
                        width: "800px",
                        modal: false,
                        lockScroll: true,
                        closeOnPressEscape: false,
                        closeOnClickModal: false,
                        modalAppendToBody: false,
                    },
                    footer: {
                        row: {
                            type: "flex",
                            gutter: 20,
                            justify: "end",
                        },
                        options: [
                            config.mode === "edit" && {
                                show: true,
                                name: "保存",
                                event: "onFormSubmit",
                                button: { type: "primary" },
                            },
                        ].filter(Boolean),
                    },
                    form: {
                        inline: true,
                    },
                },
                config
            );
        },
    },
    methods: {
        /**
         * 获取/设置当前表单弹窗数据
         * @param {Object} params 设置的参数 
         */
        currFormData(params) {
            if (params && typeof params === 'object') {
                this.form.data = { ...this.form.data, ...params }
            }
            return this.form.data
        },
        /**
         * 表单提交
         */
        async onFormSubmit() {
            if (!this.form.api) {
                return;
            }
            try {
                const { type, beforeRequest, afterResponse } = this.form.api;
                const form = this.$refs.formDialog.getRef("form");

                let params = await form.validate();
                let query = {};
                let config = {};
                if (beforeRequest && typeof beforeRequest === "function") {
                    const handleResult = await beforeRequest(params);
                    if (handleResult) {
                        params = handleResult.params || params;
                        query = handleResult.query;
                        config = handleResult.config;
                    }
                }

                let res = await this.$store.dispatch(type, {
                    params,
                    query,
                    config,
                });

                if (res && res.success) {
                    if (afterResponse && typeof afterResponse === "function") {
                        res = (await afterResponse(res)) || res;
                    }
                    this.$message.success(res.msg);
                    this.$refs.formDialog.close();
                    this.queryTableData();
                }
            } catch (e) {
                console.error(e);
            }
        },
        /**
         * 弹框打开
         */
        onOpenDialog() {
            if (!this.$refs.formDialog) return
            this.$nextTick(() => {
                const form = this.$refs.formDialog.getRef('form')
                if (!form) return
                form.clearValidate()
            })
        },
        /**
         * 弹框关闭前
         */
        onCloseDialog() {
            if (!this.$refs.formDialog) return
            const form = this.$refs.formDialog.getRef('form')
            if (!form) return
            form.resetFields()
        }
    },
}
