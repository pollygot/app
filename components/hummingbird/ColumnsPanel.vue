<template>
<div class="HummingbirdColumnsPanel">

  <div id="HummingbirdColumnsPanel" class="quickview is-active">
    <div class="quickview-body">
      <div class="quickview-block p-md">
        <div class="buttons is-right header-buttons">
          <span class="button is-outlined is-rounded is-small " @click="cancel()">Cancel</span>
          <span class="button is-dark is-outlined is-rounded is-small" @click="apply()">Apply</span>
        </div>


        <draggable v-model="newColumns" :options="{handle:'.handle'}">
          <div class="drag-container m-b-md" v-for="(column) in newColumns" :key="'col'+column.key">
            <div class="draggable-item box has-corners p-sm ">
              <a class="nice-checkbox" :class="{'is-active': !column.hidden }" @click="toggleColumnVisibility(column)"></a>
              <span class="is-capitalized">{{column.label}}</span>
              <button class="handle button is-small is-white"><span class="icon is-small"><i class="fas fa-arrows-alt"></i></span></button>
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
  name: 'HummingbirdColumnsPanel',
  props: {
    columns: { required: true, type: Array }
  },
  components: { draggable },
  data() {
    return {
      newColumns: this.columns.map(x => ({...x}))
    }
  },
  methods: {
    apply () {
      this.$emit('onApply', this.newColumns)
    },
    cancel () {
      this.$emit('onHidePanel')
    },
    toggleColumnVisibility (column) {
      let updated = this.newColumns.map(c => {
        if (c.key === column.key) c.hidden = !c.hidden
        return c
      })
      this.$set(this, 'newColumns', updated)
    }
  }
}
</script>
<style lang="scss">
.HummingbirdColumnsPanel {
  .box {
    display: flex;
    position: relative;
    .handle {
      position: absolute;
      top: 0.3rem;
      right: 0.3rem;
    }
  }
}
</style>

