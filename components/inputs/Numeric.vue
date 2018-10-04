<template>
<div class="NumericInput">
  <div class="field " :class="[(hasSafetyLock) ? 'has-addons' : '']">
    <div class="control has-icons-left is-expanded">
      <input 
        type="number" 
        class="input" 
        :class="(inputClass) ? inputClass : ''" 
        :placeholder="placeholder" 
        :value="value"
        :disabled="isLocked"
        @change="onChange($event.target.value)" 
        data-input />
      <span class="icon is-left"><i class="fas" :class="(iconClass) ? iconClass : 'fa-hashtag'" ></i></span>
    </div>
    <div class="control" v-if="hasSafetyLock">
      <a class="button is-light" v-if="isLocked" @click="toggleLock()"><i class="fas fa-lock"></i></a>
      <a class="button" v-if="!isLocked" @click="toggleLock()"><i class="fas fa-unlock"></i></a>
    </div>
  </div>
</div>

</template>

<script>
export default {
  name: 'NumericInput',
  props: {
    inputClass: { required: false, type: String },
    iconClass: { required: false, type: String },
    placeholder: { required: false },
    value: { required: false },
    hasSafetyLock: { required: false, type: Boolean }
  },
  data() {
    return {
      isLocked: this.hasSafetyLock
    }
  },
  methods: {
    onChange (value) {
      this.$emit('onChange', value)
    },
    toggleLock () {
      this.isLocked = !this.isLocked
    }
  }
}
</script>
<style lang="scss">
</style>

