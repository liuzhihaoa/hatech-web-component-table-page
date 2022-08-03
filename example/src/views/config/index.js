import Table from './table.config'
import Search from './search.config'
import Pagination from './pagination.config'
import Tree from './tree.config'
import Api from './api.config'
import TreeForm from './tree_form.config'
import TableForm from './table_form.config'

export default function () {
    const page = {}

    page.noAuth = true
    // 搜索
    page.search = Search.call(this)
    // 表格
    page.table = Table.call(this)
    // 表格数据表单
    page.tableForm = TableForm.call(this)
    // 分页
    page.pagination = Pagination.call(this)
    // 树
    page.tree = Tree.call(this)
    // 树表单
    page.treeForm = TreeForm.call(this)
    // 接口配置
    page.api = Api.call(this)

    return page

}