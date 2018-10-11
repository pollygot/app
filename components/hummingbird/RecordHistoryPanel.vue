<template>
<div class="RecordHistoryPanel">

  <div id="RecordHistoryPanel" class="quickview is-active">
    <div class="quickview-body">
      <div class="quickview-block p-md">
        <h3 class="title is-4">Activity</h3>
        <div class="buttons header-buttons">
          <span class="button is-outlined is-rounded is-small " @click="$emit('onHidePanel')">Close</span>
        </div>
        
        <div class="box p-md" v-for="(record, i) in sortedHistory" :key="i">

            <small class="heading">{{record.action}} by {{record.author}} {{niceDate(record.inserted)}}</small>
            <p v-for="(key, j) in Object.keys(record.payload)" :key="j">
              <span class="is-capitalized">{{key.replace(/_/g, ' ')}}: </span>
              <span>{{getStringValue(record.payload[`${key}`])}} </span>
            </p>
            <!-- <pre>{{record.payload}}</pre> -->
        </div>
        
      </div>
    </div>
  </div>

</div>
</template>

<script>
import moment from "moment";
export default {
  name: 'RecordHistoryPanel',
  props: {
    history: { required: true, type: Array }
  },
  data () {
    return {
    }
  },
  computed: {
    sortedHistory () {
      let h = [...this.history]
      return h.sort((a, b) => {
        if (a.inserted > b.inserted) return -1
        else if (a.inserted < b.inserted) return 1
        else return 0
      })
    }
  },
  methods: {
    getStringValue (s) {
      if (s == null) return 'null'
      else return s
    },
    niceDate (date) {
      return moment(date).fromNow()
    }
  }
}
</script>
<style lang="scss">
</style>

