<template>
<div class="PostgrestJoinPanel">

  <div id="PostgrestJoinPanel" class="quickview" :class="{ 'is-active': isVisible }">
    <div class="quickview-body">
      <div class="quickview-block p-md">
        <div class="buttons is-right header-buttons">
          <span class="button is-outlined is-rounded is-small " @click="cancel()">Cancel</span>
          <span class="button is-dark is-outlined is-rounded is-small" @click="apply()">Apply</span>
        </div>

        <aside class="menu">
          <ul class="menu-list">
            <li>
              <a class="field">
                <input class="is-checkradio" id="table" type="checkbox" name="table">
                <label for="table" class="m-l-none is-capitalized">{{base}}</label>
              </a>
            </li>
            <li>
              <ul>
                <li v-for="(join, i) in joins(base)" :key="i">
                  <a class="field">
                    <input class="is-checkradio" id="table" type="checkbox" name="table">
                    <label for="table" class="m-l-none is-capitalized">{{join.key}}</label>
                  </a>
                </li>
              </ul>
            </li>

          </ul>
        </aside>

        <PostgrestJoinMenu
          :allTables="allTables"
          :nodes="tree.nodes" 
          :depth="0"   
          :label="tree.label"
          :selected="tree.selected" 
          ></PostgrestJoinMenu>
        
      </div>
    </div>
  </div>

</div>

</template>



<script>
import PostgrestJoinMenu from './PostgrestJoinMenu'
import { mapGetters } from "vuex";

export default {
  name: 'PostgrestJoinPanel',
  props: {
    allTables: { required: true, type: Array },
    base: { required: true, type: String },
    isVisible: { required: true, type: Boolean }
  },
  components: {PostgrestJoinMenu},
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
.PostgrestJoinPanel {
  .header-buttons {
    position: absolute;
    top: 18px;
    right: 15px;
  }
 
}
</style>

