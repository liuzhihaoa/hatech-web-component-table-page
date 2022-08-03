export default function () {
    const search = {}
    search.data = {
    }
    search.config = {
        form: {
            inline: true
        },
        row: {
            type: 'flex',
        },
        columns: [
            {
                show: true,
                type: 'input',
                label: '预案名称',
                labelWidth: '100px',
                prop: 'name',
                col: {
                    span: 4,
                },
                props: {
                    placeholder: '请输入预案名称'
                }
            },
            {
                show: true,
                type: 'select',
                label: '预案状态',
                prop: 'status',
                labelWidth: '100px',
                col: {
                    span: 4,
                },
                props: {
                    placeholder: '请选择预案状态'
                }
            },
            {
                show: true,
                type: 'select',
                label: '负责人',
                prop: 'userId',
                labelWidth: '100px',
                col: {
                    span: 4,
                },
                props: {
                    placeholder: '请选择负责人',
                    options: [
                        {
                            label: '123123123123123123123123123121213123'
                        }
                    ]
                }
            },
            {
                show: true,
                type: 'date',
                label: '时间区间',
                prop: 'times',
                labelWidth: '100px',
                col: {
                    span: 8,
                },
                props: {
                    type: 'daterange',
                    format: 'yyyy-MM-dd',
                    startPlaceholder: '开始时间',
                    endPlaceholder: '结束时间'
                }
            },
        ]
    }

    return search
}