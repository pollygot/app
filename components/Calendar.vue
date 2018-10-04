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
          <a v-for="(record, i) in recordsForDate(date)" :key="'record'+i" @click="$emit('onRecordClicked', record)">
            <div class="card has-corners m-sm p-sm is-size-7">
              <div v-for="(column, j) in columns" :key="'col-td'+j" class="field" v-if="!column.hidden && record[`${column.key}`] !== null && record[`${column.key}`]">
                <div class="heading has-text-grey-light m-b-none">{{ column.label }}</div>
                <div class="value">{{ record[`${column.key}`].toString() || '&nbsp;' }}</div>
              </div>
            </div>
          </a>
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
    columns: { required: true, type: Array },
    date: { type: String, required: true },
    pivotKey: { type: String, required: false },
    records: { type: Array, required: true },
  },
  data() {
    return {
      CALENDAR_TYPES: CALENDAR_TYPES,
      calendarType: CALENDAR_TYPES.WEEK,
      selectedDate: moment(this.date)
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
    recordsForDate (date) {
      let day = moment(date)
      return this.records.filter(x => {
        let recordDate = moment(x[`${this.pivotKey}`])
        return recordDate.isSame(day, 'd')
      })
    }
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
  .card {
    overflow: hidden;
  }
}
</style>
