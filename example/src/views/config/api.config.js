export default function () {
    const api = {}

    api.hide = false

    // 查询树形数据
    api.fetchTreeData = {
        // 是否启动的时候就加载，如未设置，默认为true，
        init: true,
        type: 'plan_edit/FetchClassifiesTree',
        beforeRequest: () => ({
            params: {
                status: '',
                keyWord: ''
            }
        })
    }

    // 查看树数据
    // 对应事件onDetailTreeAction
    api.detailTree = {
        // type: 'plan_edit/ViewClassify'
    }

    // 新增树数据
    // 对应事件onInsertTreeAction
    api.insertTree = {
        type: 'plan_edit/InsertPrePlanClassify'
    }

    // 更新树数据
    // 对应事件onUpdateTreeAction
    api.updateTree = {
        type: 'plan_edit/UpdatePrePlanClassify'
    }

    // 删除树数据
    // 对应事件onDeleteTreeAction
    api.deleteTree = {
        type: 'plan_edit/DeletePrePlanClassify'
    }

    // 查询表格数据
    api.fetchTableData = {
        type: 'plan_edit/FetchPlans',
        // beforeRequest: ({ params }) => {
        //     return { query: params }
        // }
    }

    // 查询表格数据
    api.detailTable = {
        type: 'plan_edit/FetchPlan'
    }

    // 新增表格数据
    // 对应事件onInsertTableAction
    api.insertTable = {
        type: 'plan_edit/InsertPlan'
    }

    // 更新表格数据
    // 对应事件onUpdateTableAction
    // api.updateTable = {
    //     type: 'plan_edit/UpdatePlan'
    // }

    // 删除表格数据
    // 对应事件onDeleteTableAction
    api.deleteTable = {
        type: 'plan_edit/DeletePlan'
    }

    // 显隐列查询、更新接口，TablePage组件默认为app/FetchCtrlColumns
    // api.FetchCtrlColumns = {
    //     type: 'app/FetchCtrlColumns'
    // }

    return api
}
