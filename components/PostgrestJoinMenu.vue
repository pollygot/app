<template>
  <div class="PostgrestJoinMenu">
    
        <div class="label-wrapper" @click="toggleTable">
          <div :style="indent" class="button">
            <span class="nice-checkbox" :class="{'is-active': selected }"></span>
            <span>{{label}}</span>
          </div>
        </div>

        <PostgrestJoinMenu
          :allTables="allTables"
          v-for="(node, i) in nodes" 
          :key="i"
          :nodes="node.nodes"
          :selected="node.selected" 
          :label="node.label"
          :depth="depth + 1"   
        >
        </PostgrestJoinMenu>
      </div>

</template>

<script>
// Recursive component
export default {
  name: 'PostgrestJoinMenu',
  props: [ 'allTables', 'nodes', 'label', 'depth', 'selected' ],
  data() {
    return {
      showChildren: false
    }
  },
  computed: {
    labelClasses() {
      return { 'has-children': this.nodes }
    },
    indent() {
      return { 
        transform: `translate(${this.depth * 30}px)`,
        width: `calc(100% - ${this.depth * 30}px)`
      }
    }
  },
  methods: {
    toggleTable() {
      console.log('allTables', this.allTables)
      let payload = {
        resourceKey: this.label,
        depth: this.depth
      }
      this.$store.commit('hummingbird/selectForeignTable', payload)
      console.log('this', this.label)
    }
  }
}
</script>

<style lang="scss">
.PostgrestJoinMenu {
  .label-wrapper {
    
    .button {
      justify-content: left;
      padding: 20px 10px;
      margin: 8px 0px;
      text-transform: uppercase;
      font-size: 0.9rem;
      border-radius: 5px;
      border: 1px solid rgba(0,0,0,0);
      border: 1px solid rgba(0,0,0,0.1);

      &:hover {
        box-shadow: 0px 0px 10px 2px rgba(0,0,0,0.04);
      }

    }
  }
}
</style>