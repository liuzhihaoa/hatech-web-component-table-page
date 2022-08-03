<template>
  <el-switch :value="value" @change="onChange"></el-switch>
</template>

<script>
export default {
  name: 'TableStatus',
  props: {
    scope: {
      type: Object
    },
    column: {
      type: Object
    }
  },
  data(){
    return {
      value: false
    }
  },
  methods: {
    async onChange (status) {
      await this.$confirm('请确认是否切换状态?', '提示', {
        type: 'warning'
      })


      const { dispatch } = this.column.props
      const res = await this.$store.dispatch(dispatch, {
        params: {
          id: this.scope.row.id
        }
      })

      if (res && res.success) {
        this.value = status
      }
    }    
  }
}
</script>