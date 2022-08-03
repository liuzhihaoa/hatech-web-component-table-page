
/**
 * api配置选项
 */
class ApiOption {
    init = false
    type = ''
    beforeRequest = () => {}
    afterResponse = () => {}
}

/**
 * 
 */
class ApiEntity {
    hide = false
    fetchTreeData = undefined
    detailTree = undefined
    inertTree = undefined
    updateTree = undefined
    deleteTree = undefined
    fetchTableData = undefined
    detailTable = undefined
    insertTable = undefined
    updateTable = undefined
    deleteTable = undefined
}

export default ApiEntity