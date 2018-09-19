<template>
<div class="PostgrestSortPanel">

  <div id="PostgrestSortPanel" class="quickview" :class="{ 'is-active': isVisible }">
    <div class="quickview-body">
      <div class="quickview-block p-md">

        <div class="dropdown is-hoverable m-b-md">
          <div class="dropdown-trigger">
            <button class="button" aria-haspopup="true" aria-controls="dropdown-menu4">
              <span>Sort by</span>
              <span class="icon is-small"><i class="fas fa-angle-down" aria-hidden="true"></i></span>
            </button>
          </div>
          <div class="dropdown-menu">
            <div class="dropdown-content">
              <a class="dropdown-item is-capitalized" 
                v-for="column in unsortedColumns" 
                :key="'sortable'+column.key"
                @click="newSorting.push(column)"
              >
                {{column.key.replace(/_/g, ' ')}}
              </a>
            </div>
          </div>
        </div>

        <span class="button m-l-sm is-light" @click="cancel()">Cancel</span>
        <span class="button m-l-sm is-primary is-outlined" @click="applySorting()" v-show="hasSortingChanged">Apply</span>

        <draggable v-model="newSorting">
          <div class="m-b-md" v-for="(column) in newSorting" :key="'sort'+column.key">
            <div class="draggable-item box has-corners p-sm " >
              <button class="delete is-small" @click="remove(column)"></button>
              <span class="is-capitalized">{{column.key.replace(/_/g, ' ')}}</span>
              <span class="buttons has-addons">
                <span class="button is-small is-rounded" :class="{'is-dark': column.sort !== 'desc'}" @click="sortBy(column, 'asc')">ASC</span>
                <span class="button is-small is-rounded" :class="{'is-dark': column.sort === 'desc'}" @click="sortBy(column, 'desc')">DESC</span>
              </span>
            </div>
          </div>
        </draggable>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'PostgrestSortPanel',
  props: {
    allColumns: { required: true, type: Array },
    isVisible: { required: true, type: Boolean },
    sortedColumns: { required: true, type: Array }
  },
  components: { draggable },
  data () {
    return {
      forceHasChanged: false,
      newSorting: [...this.sortedColumns]
    }
  },
  computed: {
    hasSortingChanged () {
      if (this.forceHasChanged) return true
      return JSON.stringify({ a: this.sortedColumns}) != JSON.stringify({ a: this.newSorting}) // crude but workable
    },
    unsortedColumns () {
      let sorted = this.newSorting.map(x => x.key)
      return this.allColumns.filter(x => (!sorted.includes(x.key)))
    }
  },
  methods: {
    applySorting () {
      let sortArray = this.newSorting.map(x => ({ key: x.key, sort: (x.sort) ? x.sort : 'asc' }))
      this.$emit('onSort', sortArray)
    },
    cancel () {
      this.newSorting = [...this.sortedColumns]
      this.$emit('onHidePanel')
    },
    remove (column) {
      this.newSorting = this.newSorting.filter(x => (x.key !== column.key))
    },
    sortBy (column, direction) {
      this.newSorting = [...this.newSorting].map(x => {
        if (x.key === column.key) x.sort = direction
        this.forceHasChanged = true
        return x
      })
    }
  }
}
</script>
<style lang="scss">
.PostgrestSortPanel {
 .draggable-item.box {
   position: relative;
  .delete {
    position: absolute;
    top: 0.7rem;
    right: 0.5rem;
  }
  .buttons {
    position: absolute;
    top: 0.4rem;
    right: 2.5rem;
  }
 }
}
</style>

