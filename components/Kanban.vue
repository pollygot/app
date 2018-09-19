<template>
<div class="Kanban">

  <div class="columns is-mobile">

    <div class="column is-narrow p-xs p-b-0 m-b-0" v-for="(state, i) in states" :key="i">
      <div class="lane p-sm" :class="{ 'm-r-lg': ((i+1) === states.length)}">
        <div class="title is-6 is-capitalized m-sm m-b-md has-text-centered">{{(i && state) ? state.toLowerCase() : 'Uncategorized'}}</div>

        <draggable>
          <div class="cards drag-container" >
            <div class="card box draggable-item" v-for="(card, i) in cards(state)" :key="'card'+i">
              <div v-for="(column, j) in columnKeys" :key="'col-td'+j" class="field" v-if="card[`${column}`] !== null && card[`${column}`] !== ''">
                <span class="heading has-text-grey-light">{{ column.replace(/_/g, ' ') }}</span>
                <span>{{ card[`${column}`].toString() || '&nbsp;' }}</span>
              </div>
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
  name: 'Kanban',
  props: {
    pivotKey: { required: true, type: String },
    columns: { required: true, type: Array }, 
    records: { required: true, type: Array }, // the data to be displayed
  },
  components: { draggable },
  data () {
    return {
      sidebarVisible: true,
    }
  },
  computed: {
    columnKeys () {
      return this.columns.map(x => x.key)
    },
    states () {
      let pivotColumn = this.columns.find(x => (x.key === this.pivotKey))
      if (!pivotColumn) return []
      return [''].concat(pivotColumn.enum)
    }
  },
  methods: {
    cards (state) {
      return this.records.filter(x => x[`${this.pivotKey}`] === state)
    }
  }
}
</script>
<style lang="scss">
#content {
  overflow: hidden !important;
}
.Kanban {
  .columns {
    overflow-x: auto;
    margin-left: -30px;
    margin-right: -30px;
    padding: 0 30px 0px 30px;
  }
  .lane {
    width: 240px;
    border-radius: 4px;
    .cards {
      height: calc(100vh - 230px);
      overflow-y: auto;
      .card {
        border-radius: 4px;
        padding: 8px;
        margin: 6px 1px;
      }
    }
  }
}
</style>
