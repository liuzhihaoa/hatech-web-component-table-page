/**
 * 表格数据新增、查看、编辑表单弹框信息
 */
export default function () {
  const tableForm = {}

  tableForm.data = {}

  tableForm.config = {
    mode: 'edit',
    dialog: {
      title: '新增',
      width: '800px'
    },
    form: {
      rules: {
        name: [
          { required: true, message: '预案名称不能为空', trigger: 'blur' }
        ]
      }
    },
    columns: [
      {
        show: true,
        type: 'input',
        prop: 'name',
        label: '预案名称',
        col: {
          span: 24,
        },
        props: {
          maxlength: 100,
          showWordLimit: true,
          placeholder: '请输入预案名称，最长100个字'
        }
      },
      {
        show: true,
        type: 'input',
        prop: 'description',
        label: '预案描述',
        props: {
          maxlength: 500,
          showWordLimit: true,
          rows: 5,
          placeholder: '请输入预案描述，最长500个字'
        }
      },
      {
        show: true,
        type: 'select',
        prop: 'classificationId',
        label: '所属分类',
        props: {
          options: [],
          placeholder: '请选择所属分类'
        }
      },
      {
        show: true,
        type: 'tree',
        prop: 'treeData',
        label: '树',
        props: {
          ref: 'tree'
        }
      },
      {
        show: true,
        type: 'input',
        prop: 'version',
        label: '版本号',
        props: {
          placeholder: '请输入版本号（如1.0)'
        }
      },
      {
        show: true,
        type: 'select',
        prop: 'approvalId',
        label: '审批流程',
        props: {
          options: [],
          placeholder: '请选择审批流程'
        }
      },
      {
        show: true,
        type: 'select',
        prop: 'templateId',
        label: '预案模版',
        props: {
          options: [],
          placeholder: '请选择预案模版'
        }
      },
    ]
  }
  tableForm.form = {
    addDialog: {
      title: '新增预案',
      buttons: [
        { type: 'primary', event: 'onConfirm', show: true, name: '保存', mode: 'edit' }
      ]
    },
    addWriterDialog: {
      title: '新增编写人',
      buttons: [
        { type: 'primary', event: 'groupAddUserSure', show: true, name: '保存', mode: 'edit' }
      ]
    },
    publishDialog: {
      title: '预案发布',
      buttons: [
        { type: 'primary', event: 'releaseSubmit', show: true, name: '确定', mode: 'edit' }
      ]
    },
    approvalDialog: {
      title: '预案审批',
      buttons: [
        { type: 'danger', event: 'approvalReject', show: true, name: '驳回', mode: 'edit' },
        { type: 'primary', event: 'approvalPass', show: true, name: '通过', mode: 'edit' }
      ]
    },
    editNodeMode: 'edit',
    editNodeDialog: {
      title: '',
      labelWidth: '110px',
      buttons: [
        { type: 'primary', event: 'editNodeSubmit', show: true, name: '保存', mode: 'edit' }
      ]
    },
    editNodeForm: {
      data: {
        classificationName: '',
        parentId: '1',
        description: '',
        classificationCode: ''
      },
      items: [
        {
          label: '预案分类名称',
          type: 'input',
          prop: 'classificationName',
          value: '',
          show: true,
          span: 24,
          props: {
            maxlength: 100,
            showWordLimit: true,
            placeholder: '请输入预案分类名称，最长100个字'
          }
        },
        {
          label: '描述',
          type: 'textarea',
          prop: 'description',
          value: '',
          show: true,
          span: 24,
          props: {
            maxlength: 500,
            showWordLimit: true,
            rows: 5,
            placeholder: '请输入描述，最长500个字'
          }
        },
        {
          label: '所属分类',
          type: 'cascader',
          prop: 'parentId',
          value: '',
          show: true,
          span: 24,
          props: {
            loading: false,
            options: [],
            props: {
              multiple: false,
              emitPath: false,
              checkStrictly: true,
              label: 'classificationName',
              children: 'children',
              value: 'id'
            },
            placeholder: '请选择所属分类',
            event: 'changeNode'
          }
        },
        {
          label: '预案分类编码',
          type: 'input',
          prop: 'classificationCode',
          value: '',
          show: true,
          span: 24,
          props: {
            disabled: true,
            maxlength: 100,
            showWordLimit: true,
            placeholder: '请输入预案分类编码，最长100个字'
          }
        }
      ],
      rules: {
        classificationName: [
          { required: true, message: '预案分类名称不能为空', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '所属分类不能为空', trigger: 'blur' }
        ],
        description: {
          required: false,
          trigger: 'change',
          message: null
        }
      }
    },
    changeDialog: {
      title: '变更预案',
      buttons: [
        { type: 'primary', event: 'onToEditAction', show: true, name: '进入编辑', mode: 'edit' }
      ]
    }
  }
  tableForm.addForm = {
    data: {
      name: '',
      description: '',
      approvalId: '',
      writers: [],
      version: '',
      classificationId: '',
      templateId: ''
    },
    options: [],
    rules: {
      name: [
        { required: true, message: '预案名称不能为空', trigger: 'blur' }
      ],
      classificationId: [
        {
          required: true,
          trigger: 'change',
          validator: (rule, value, callback) => {
            if (!value) { return callback(new Error('所属分类不能为空')) }
            if (['0', '1', '-1'].includes(value)) {
              return callback(new Error('根节点无法新增'))
            } else {
              callback()
            }
          }
        }
      ],
      description: [
        {
          required: false,
          trigger: 'change',
          message: null
        }
      ],
      version: [
        { required: true, message: '版本号不能为空', trigger: 'change' },
      ]
    },
    planProps: {
      multiple: false,
      emitPath: false,
      checkStrictly: true,
      label: 'classificationName',
      children: 'children',
      value: 'id'
    }
  }
  return tableForm
}