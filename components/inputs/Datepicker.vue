<template>
  <div class="control has-icons-left">
    <input class="input" :class="inputClass" type="text" :placeholder="placeholder" :value="value" data-input/>
    <span class="icon is-left"><i class="fas fa-calendar"></i></span>
  </div>
</template>

<script>
/**
 * Credit for this file goes to https://github.com/vue-bulma/datepicker
 * Much of this code is pulled directly from there. This is a stripped down version (and I want to reduce dependencies)
 */
import Flatpickr from 'flatpickr'

export default {
  props: {
    config: { type: Object, default: () => ({}) },
    placeholder: { type: String, default: 'Pick date' },
    inputClass: { type: String, default: '' },
    value: String
  },

  data () {
    return {
      datepicker: null,
      selectedDates: null
    }
  },

  mounted () {
    if (!this.datepicker) {
      this.config.onValueUpdate = this.dateUpdated
      this.datepicker = new Flatpickr(this.$el, this.config)
      this.setDate(this.value)
    }
    this.$watch('config', this.redraw)
    this.$watch('value', this.setDate)
  },

  beforeDestroy () {
    if (this.datepicker && !this.static) {
      this.datepicker.destroy()
      this.datepicker = null
    }
  },

  methods: {
    redraw (newConfig) {
      this.datepicker.config = Object.assign(this.datepicker.config, newConfig)
      this.datepicker.redraw()
      this.datepicker.jumpToDate()
    },
    setDate (newDate, oldDate) {
      newDate && this.datepicker.setDate(newDate)
    },
    dateUpdated (selectedDates, dateStr) {
      this.date = dateStr
    }
  },

  computed: {
    static () {
      return !!this.config.static
    },
    date: {
      get() {
        return this.selectedDates || this.value
      },
      set(newValue) {
        if (this.selectedDates !== newValue) {
          this.selectedDates = newValue
          this.$emit('onChange', newValue)
        }
      }
    }
  }
}
</script>

<style lang="scss">
</style>