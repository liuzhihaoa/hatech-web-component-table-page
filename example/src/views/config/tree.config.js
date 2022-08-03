/*
 * @Author: zhangming
 * @Date: 2020-12-22 10:27:03
 * @LastEditors: zhangming
 * @LastEditTime: 2020-12-31 16:55:41
 * @description: 
 */
export default function () {
    const tree = {}

    // tree.hide = true

    tree.data = [
        {
            name: '1',
            id: '1',
            children: [
                {
                    id: '1.1',
                    name: '1.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.11.1'
                },
                {
                    id: '1.2',
                    name: '1.2'
                },
                {
                    id: '1.3',
                    name: '1.3'
                },
                {
                    id: '1.4',
                    name: '1.4'
                },
            ]
        },
        {
            name: '2',
            id: '2',
            children: [
                {
                    id: '2.1',
                    name: '2.1'
                },
                {
                    id: '2.2',
                    name: '2.2'
                },
                {
                    id: '2.3',
                    name: '2.3'
                },
                {
                    id: '2.4',
                    name: '2.4'
                },
            ]
        },
        {
            name: '3',
            id: '3',
            children: [
                {
                    id: '3.1',
                    name: '3.1'
                },
                {
                    id: '3.2',
                    name: '3.2'
                },
                {
                    id: '3.3',
                    name: '3.3'
                },
                {
                    id: '3.4',
                    name: '3.4'
                },
            ]
        },
        {
            name: '4',
            id: '4',
            children: [
                {
                    id: '4.1',
                    name: '4.1'
                },
                {
                    id: '4.2',
                    name: '4.2'
                },
                {
                    id: '4.3',
                    name: '4.3'
                },
                {
                    id: '4.4',
                    name: '4.4'
                },
            ]
        },
        {
            name: '5',
            id: '5',
            children: [
                {
                    id: '5.1',
                    name: '5.1'
                },
                {
                    id: '5.2',
                    name: '5.2'
                },
                {
                    id: '5.3',
                    name: '5.3'
                },
                {
                    id: '5.4',
                    name: '5.4'
                },
            ]
        },
        {
            name: '6',
            id: '6',
            children: [
                {
                    id: '6.1',
                    name: '6.1'
                },
                {
                    id: '6.2',
                    name: '6.2'
                },
                {
                    id: '6.3',
                    name: '6.3'
                },
                {
                    id: '6.4',
                    name: '6.4'
                },
            ]
        },
    ]
    tree.config = {
        props: {
            label: 'name'
        },
        col: {
            span: 6
        },
        view: {
            title: '预案分类预案分类预案分类预案分类预案分类预案分类预案分类预案分类预案分类预案分类预案分类',
            options: [
                // 从右到左
                {
                    code: 'left-tree-header-delete',
                    label: '删除',
                    icon: 'home',
                    event: 'onDeleteTreeAction'
                },
                {
                    code: 'left-tree-header-update',
                    label: '编辑',
                    icon: 'home',
                    event: 'onUpdateTreeAction'
                },
                {
                    code: 'left-tree-header-add',
                    label: '新增',
                    icon: 'home',
                    event: 'onInsertTreeAction'
                },
            ]
        }
    }

    return tree
}