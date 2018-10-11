<template>
<div class="HummingbirdJoinPanel">

  <div id="HummingbirdJoinPanel" class="quickview is-active">
    <div class="quickview-body">
      <div class="quickview-block p-md">
        <div class="buttons is-right header-buttons">
          <span class="button is-outlined is-rounded is-small " @click="cancel()">Cancel</span>
          <span class="button is-dark is-outlined is-rounded is-small" @click="apply()">Apply</span>
        </div>

        <JoinMenu
          :allTables="allTables"
          :nodes="tree.nodes" 
          :depth="0"   
          :label="tree.key"
          :selected="tree.selected" 
          ></JoinMenu>
        
      </div>
    </div>
  </div>

</div>

</template>



<script>
import JoinMenu from './JoinMenu'
import { mapGetters } from "vuex";

export default {
  name: 'HummingbirdJoinPanel',
  props: {
    allTables: { required: true, type: Array },
    base: { required: true, type: String },
    isVisible: { required: true, type: Boolean }
  },
  components: {JoinMenu},
  computed: {
    ...mapGetters({
      tree: ['hummingbird/joinTree']
    })
  },
  methods: {
    applySorting () {
      this.$emit('onApply')
    },
    cancel () {
      this.$emit('onHidePanel')
    },
    joins (resourceKey) { // find all the tables which join to this resource
      return this.allTables.filter(x => {
        return x.properties.some(column => (column.fk && column.fk_table === resourceKey))
      })
    }
  }
}
</script>
<style lang="scss">
</style>

