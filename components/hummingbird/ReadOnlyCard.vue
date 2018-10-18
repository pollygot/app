<template>
<div class="HummingbirdReadOnlyCard">

  <div v-for="(column, j) in columns" :key="'col-td'+j" class="field" v-if="record[`${column.key}`] !== null && record[`${column.key}`]">
    <nav class="level m-b-sm">
      <div class="level-left"><span class="heading has-text-grey-light m-b-none">{{ column.label }}</span></div>
      <div class="level-right" v-show="column.fk">
        <a class="button is-small is-white" @click="joinTable(column, record)">
          <span class="is-capitalized">{{column.fk_table}}</span>
          <span class="icon is-small"><i class="fas fa-arrow-right"></i></span>
        </a>
      </div>
    </nav>
    <div class="value">{{ record[`${column.key}`].toString() || '&nbsp;' }}</div>
  </div>

</div>
</template>

<script>
export default {
  name: 'HummingbirdReadOnlyCard',
  props: {
    columns: { required: true, type: Array },
    record: { required: true, type: Object },
  },
  methods: {
    joinTable(column) {
      console.log('this.columns', this.columns)
      let field = { ...column, value: this.record[`${column.key}`] }
      this.$emit('onShowJoin', field)
    },
  },
}
</script>
<style lang="scss">
</style>
