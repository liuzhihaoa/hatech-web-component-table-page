/**
 * 树数据新增、查看、编辑表单弹框信息
 */
export default function () {
    const treeForm = {}

    treeForm.data = {}

    treeForm.config = {
        mode: 'edit',
        dialog: {
            title: '新增',
            width: '800px'
        },
        form: {
            rules: {
                parentId: [
                    { required: true, message: '所属分类不能为空', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '名称不能为空', trigger: 'blur' }
                ]
            }
        },
        columns: [

            {
                show: true,
                type: 'input',
                prop: 'description',
                label: '描述',
                props: {
                    type: 'textarea',
                    maxlength: 500,
                    showWordLimit: true,
                    rows: 5,
                    placeholder: '请输入描述，最长500个字'
                }
            },
            {
                show: true,
                type: 'input',
                prop: 'name',
                label: '预案分类名称',
                col: {
                    span: 24,
                },
                props: {
                    maxlength: 100,
                    showWordLimit: true,
                    placeholder: '请输入预案分类名称，最长100个字'
                }
            },
            {
                show: true,
                type: 'select',
                prop: 'parentId',
                label: '所属分类',
                props: {
                    options: [],
                    placeholder: '请选择所属分类'
                }
            },
            {
                show: true,
                type: 'input',
                prop: 'classificationCode',
                label: '预案分类编码',
                props: {
                    disabled: true,
                    maxlength: 100,
                    showWordLimit: true,
                    placeholder: '请输入预案分类编码（如1.0)'
                }
            }
        ]
    }


    return treeForm
}