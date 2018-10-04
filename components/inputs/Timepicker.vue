<template>
<div class="TimePicker">
  <div class="control has-icons-left">
    <input class="input" type="input" :class="(inputClass) ? inputClass : ''" :placeholder="placeholder">
    <span class="icon is-left"><i class="fas fa-clock"></i></span>
  </div>
</div>

</template>

<script>
export default {
  name: 'TimePicker',
  props: {
    inputClass: { required: false, type: String },
    placeholder: { required: false, type: String },
    value: { required: false, type: String }
  },
  data() {
    return {}
  },
  methods: {
  }
}
</script>
<style lang="scss">
</style>

