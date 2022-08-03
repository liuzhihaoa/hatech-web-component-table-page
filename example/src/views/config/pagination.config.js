export default function () {
    const pagination = {}
    //pagination.hide = true
    pagination.config = {}

    pagination.data = {
        page: 1,
        limit: 10,
        total: 0
    }

    return pagination
}
