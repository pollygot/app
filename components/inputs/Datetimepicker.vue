<template>
  <div class="Datetimepicker control has-icons-left">
    <div class="columns">
      <div class="column">
        <datepicker :placeholder="dateString" :value="dateString" @onChange="(v) => dateString = v"></datepicker>
      </div>
      <div class="column">
        <timepicker :placeholder="timeString" :value="timeString" @onChange="(v) => timeString = v"></timepicker>
      </div>
    </div>
  </div>
</template>

<script>
import Datepicker from './Datepicker.vue'
import Timepicker from './Timepicker.vue'
import moment from 'moment'
export default {
  props: {
    config: { type: Object, default: () => ({}) },
    placeholder: { type: String, default: 'Pick date' },
    inputClass: { type: [Object, Array], default: function() { return {} } },
    value: { type: String, required: false }
  },
  components: { Datepicker, Timepicker },
  data () {
    let momentDate = null
    if (this.value) {
      let microseconds = this.value.indexOf('.')
      let cleansedDateString = (microseconds > 0) ? this.value.substring(0, microseconds) : this.value
      momentDate = moment(cleansedDateString)
    }
    return {
      datePart: '',
      timePart: '',
      momentDate: momentDate
    }
  },
  computed: {
    dateString: {
      get () {
        return (this.momentDate) ? this.momentDate.format('YYYY-MM-DD') : this.datePart
      },
      set (value) {
        this.datePart = value
        this.trySetDatetime(this.datePart, this.timePart)
      }
    },
    timeString: {
      get () {
        return  (this.momentDate) ? this.momentDate.format('HH:mm:ss') : this.timePart
      },
      set (value) {
        this.timePart = value
        this.trySetDatetime(this.datePart, this.timePart)
      }
    }
  },
  methods: {
    trySetDatetime (datePart, timePart) {
      if (!datePart && !datePart.length) this.momentDate = null
      else if (!timePart && !timePart.length) this.momentDate = null
      else {
        this.momentDate = moment(`${this.datePart}T${this.timePart}`)
      }
      
      if (!this.momentDate) this.$emit('onChange', null)
      else this.$emit('onChange', this.momentDate.format('YYYY-MM-DDTHH:mm:ss'))
    }
  },
}
</script>

<style lang="scss">
</style>