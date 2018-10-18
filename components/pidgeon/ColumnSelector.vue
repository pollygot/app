<template>
<div class="PidgeonColumnSelector">

  <nav class="breadcrumb" aria-label="breadcrumbs">
    <ul v-show="breadcrumbs.length > 1">
      <li v-for="(breadcrumb, i) in breadcrumbs" :key="breadcrumb" :class="{'is-active': (i === breadcrumbs.length - 1)}">
        <a class="is-capitalized">{{breadcrumb.replace(/_/g, ' ')}}</a>
      </li>
    </ul>
  </nav>

  <div class="field" v-for="column in columns(currentTable)" :key="column.key" >

    <div class="control is-expanded">
      <div class="field has-addons">
        <p class="control">
          <a class="button is-small" @click="addColumn(currentTable, column.key)">
            <span class="icon is-small" v-show="isColumnSelected(currentTable, column.key)" ><i class="fas fa-check"></i></span>
            <span>{{column.key}}</span>
          </a>
        </p>
        <p class="control is-expanded">
          <input class="input is-small is-fullwidth" type="text" :placeholder="`Add custom label for ${column.key}?`" v-model="column.label">
        </p>
        <p class="control " v-if="column.isForeignKey">
          <a class="button is-small" @click="showTable(column.isForeignKey.table)">
            <span>{{column.isForeignKey.table}}</span>
            <span class="icon has-text-dark"><i class="fas fa-arrow-right"></i></span>
          </a>
        </p>
      </div>
    </div>

  </div>

</div>
</template>


<script>
import { mapGetters } from 'vuex'
export default {
  name: 'PidgeonColumnSelector',
  props: {
    baseTable: { required: true, type: String },
    selectString: { required: true, type: String },
  },
  data() {
    return {
      breadcrumbs: [this.baseTable],
      currentTable: this.baseTable,
      tableString: this.selectString.replace('select='),
    }
  },
  computed: {
    ...mapGetters({
      columnsForResource: 'pidgeon/columnsForResource',
    }),
  },
  methods: {
    addColumn(table, columnName) {
      this.$emit('onUpdated', 'id')
    },
    isColumnSelected(table, columnName) {
      let selected = this.tableString.split(',')
      return selected.some(x => x === columnName)
    },
    showTable(resourceKey) {
      console.log('resourceKey', resourceKey)
      this.breadcrumbs.push(resourceKey)
    },
    columns(resourceKey) {
      return this.columnsForResource(resourceKey)
    },
  },
}
</script>

<style lang="scss">
</style>
