<template>
<div class="Calendar">

  <div class="week-container" v-if="calendarType === CALENDAR_TYPES.WEEK">
    <div class="week columns is-mobile box p-none " >
    
      <div class="column" v-for="(date, i) in currentWeek" :key="i">
        <div class="header">
          <h6 class="title is-6 m-b-none">{{date.format('ddd')}}</h6>
          <h2 class="title is-1">{{date.format('DD')}}</h2>
        </div>
        <div>

        </div>
      </div>
    </div>
  </div>

</div>
</template>

<script>
const CALENDAR_TYPES = { WEEK: 'week' }
import moment from 'moment'
export default {
  name: 'Calendar',
  props: {
  },
  data() {
    return {
      CALENDAR_TYPES: CALENDAR_TYPES,
      calendarType: CALENDAR_TYPES.WEEK,
      selectedDate: moment()
    }
  },
  computed: {
    currentWeek () {
      let dates = []
      for (let index = 0; index < 7; index++) {
        var date = this.selectedDate.clone().startOf('isoWeek').add(index, 'days')
        dates.push(date)
      }
      return dates
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
.Calendar {
  .week-container {
    margin: 30px 30px 0 30px;
    .week {
      min-height: calc(100vh - 160px);
      .column {
        border-right: 1px solid rgba(0,0,0,0.1);
        padding: 0;
        &:last-child {
          border-right: none;
        }
        .header {
          padding: 10px 15px;
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }
      }
    }
  }
}
</style>
