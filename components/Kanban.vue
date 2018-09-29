<template>
<div class="Kanban">

  <div class="columns is-mobile">

    <div class="column is-narrow p-xs p-b-0 m-b-0" v-for="(stateName, i) in stateNames" :key="'col'+i">
      <div class="lane" :class="{ 'm-r-lg': ((i+1) === stateNames.length)}" :key="'lane'+i">
        <div class="title is-6 is-capitalized m-sm has-text-centered">{{stateName.toLowerCase()}}</div>

          <draggable :ref="stateName + '_element'" class="cards drag-container" v-model="states['' + stateName]" :options="{group:{ name:'states'}}" @add="stateChanged">
            <a class="card box draggable-item" v-for="(card, i) in states['' + stateName]" :key="'card'+stateName+i" >
              <div v-for="(column, j) in columns" :key="'col-td'+j" class="field" v-if="card[`${column.key}`] !== null && card[`${column.key}`] !== '' && column.key !== pivotKey">
                <span class="heading has-text-grey-light m-b-none">{{ column.label }}</span>
                <div class="value">{{ card[`${column.key}`].toString() || '&nbsp;' }}</div>
              </div>
            </a>
          </draggable>
          <a class="button m-t-xs footer-button">Load more</a>
      </div>
    </div>
      
  </div>

</div>
</template>

<script>
import draggable from 'vuedraggable'
import PerfectScrollbar from 'perfect-scrollbar'
export default {
  name: 'Kanban',
  props: {
    pivotKey: { required: true, type: String },
    columns: { required: true, type: Array }, 
    records: { required: true, type: Array }, // the data to be displayed
  },
  created () {
    let pivotColumn = this.columns.find(x => (x.key === this.pivotKey))
    if (!pivotColumn) this.states = []
    else {
      // this.stateNames = [''].concat(pivotColumn.enum) // we may need to add an "UNCATEGORIZED" colum - tbd
      this.stateNames = [].concat(pivotColumn.enum)
      let states = {}
      this.stateNames.forEach(name => {
        this.$set(this.states, name, this.records.filter(x => x[`${this.pivotKey}`] === name)) // use $set to preserve Vue reactivity
      })
    }
  },
  data () {
    return {
      states: {},
      stateNames: []
    }
  },
  computed: {
    columnKeys () {
      return this.columns.map(x => x.key)
    }
  },
  methods: {
    stateChanged (v) {
      console.log('v', v)
    }
  },

  // View handlers
  components: { draggable },
  mounted () {
    this.scrollbars = []
    this.stateNames.forEach(s => {
      let vueEl = this.$refs[`${s}_element`]
      let nativeEl = vueEl[0].$el
      if (nativeEl) this.scrollbars.push(new PerfectScrollbar(nativeEl, { maxScrollbarLength: 200, wheelPropagation: true }))
    })
  },
  beforeDestroy () {
    this.scrollbars.forEach(x => { x.destroy() })
    this.scrollbars = null
  },
}
</script>
<style lang="scss">
#content {
  overflow: hidden !important;
}
.Kanban {
  .columns {
    overflow-x: auto;
    padding: 5px 20px;
  }
  .lane {
    width: 240px;
    border-radius: 5px;
    border: 1px solid rgba($color: #000, $alpha: 0.1);
    display: flex;
    flex-direction: column;
    background: #fff;
    .cards {
      position: relative;
      flex: 1 1 auto;
      height: calc(100vh - 220px);
      overflow-x: hidden;
      overflow-y: auto;
      margin: 4px;
      padding: 4px;
      .card {
        border-radius: 4px;
        margin-bottom: 8px;
        overflow: hidden;
        box-shadow: 0 0 2px 1px rgba($color: #000, $alpha: 0.09);
        &:hover {
          box-shadow: 0 0 2px 2px rgba($color: #000, $alpha: 0.15);
        }
        .value {
          white-space: nowrap; 
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .footer-button {
      border: 0px;
    }
  }
}
</style>
