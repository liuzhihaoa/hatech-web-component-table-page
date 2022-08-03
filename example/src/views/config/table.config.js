export default function () {
    const table = {}

    // table.hide = true

    table.data = Array.from(new Array(50)).map((row, index) => ({
        name: '预案' + index + index ** 2,
        version: '1.0.' + index,
        classificationName: '分类' + index,
        principal: '经理',
        editTime: this.$utils.date.current(),
        status: '正常'
    }))

    table.config = {
        full: true,
        id: 'prePlan-management-list',
        view: {
            // hide: true,
            title: '预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表预案列表',
            // 默认为true，所以可不写此配置
            showColumnCtrl: true,
            options: [
                {
                    code: 'table-header-add',
                    label: '新增',
                    icon: 'home',
                    event: 'onInsertTableAction',
                    props: {
                        type: 'primary'
                    }
                },
                {
                    code: 'table-header-import',
                    label: '导入',
                    icon: 'home',
                    event: 'onImportAction'
                },
                {
                    code: 'table-header-delete',
                    icon: 'home',
                    label: '批量删除',
                    event: 'onRemoveAction'
                }
            ],
        },
        columns: [
            {
                type: 'selection',
                show: true
            },
            {
                label: '预案名称',
                prop: 'name',
                notCtrl: true,
            },
            {
                label: '版本号',
                prop: 'version'
            },
            {
                label: '预案分类',
                prop: 'classificationName'
            },
            {
                label: '负责人',
                prop: 'principal'
            },
            {
                label: '更新时间',
                prop: 'editTime'
            },
            {
                type: 'Status',
                label: '预案状态',
                prop: 'status',
            },
            {
                type: 'action',
                label: '操作',
                prop: 'action',
                props: {
                    options: [
                        {
                            code: 'table-inner-detail',
                            label: '查看',
                            event: 'onDetailTableAction',
                            type: 'primary'
                        },
                        {
                            code: 'table-inner-edit',
                            label: '编辑',
                            event: 'onUpdateTableActoin',
                            type: 'primary'
                        },
                        {
                            code: 'table-inner-submit',
                            label: '提交',
                            event: 'onSubmitAction',
                            type: 'primary'
                        },
                        {
                            code: 'table-inner-approval',
                            label: '审批',
                            event: 'onApprovalAction',
                            type: 'primary'
                        },
                        {
                            code: 'table-inner-recall',
                            label: '撤回',
                            event: 'onRecallAction',
                            type: 'primary'
                        },
                        {
                            code: 'table-inner-publish',
                            label: '发布',
                            event: 'onPublishAction',
                            type: 'primary'
                        },
                        {
                            code: 'table-inner-modify',
                            label: '变更',
                            event: 'onModifyAction',
                            type: 'primary'
                        },
                        {
                            code: 'table-inner-stop',
                            label: '停用',
                            event: 'onStopAction',
                            type: 'primary'
                        },
                        {
                            code: 'table-inner-delete',
                            label: '删除',
                            event: 'onDeleteTableAction',
                            type: 'primary'
                        }
                    ]
                }
            }
        ]
    }
    return table
}