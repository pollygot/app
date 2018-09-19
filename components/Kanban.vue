<template>
<div class="Kanban">

  <div class="columns is-mobile">
    <div class="column is-narrow p-xs" v-for="(state, i) in states" :key="i">
      <div class="lane p-sm" :class="{ 'm-r-lg': ((i+1) === states.length)}">
        <div class="title is-6 is-capitalized m-sm m-b-md" v-if="!i">Uncategorized</div>
        <div class="title is-6 is-capitalized m-sm m-b-md" v-if="i">{{state.toLowerCase()}}</div>
        <div class="cards">
          <div class="box p-sm" v-for="(card, i) in cards(state)" :key="'card'+i">
            {{card}}
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
</template>

<script>
export default {
  name: 'Kanban',
  props: {
    pivotKey: { required: true, type: String },
    columns: { required: true, type: Array }, 
    records: { required: true, type: Array }, // the data to be displayed
  },
  data () {
    return {
      sidebarVisible: true,
    }
  },
  computed: {
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
    background: #dedede;
    .cards {
      height: calc(100vh - 270px);
      overflow-y: auto;
    }
  }
}
</style>
