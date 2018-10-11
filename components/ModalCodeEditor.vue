<template>
<div id="ModalCodeEditor">

  <transition name="fade">
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head has-text-centered">
        <div class="buttons is-right">
          <button class="button is-rounded is-outlined is-dark" @click="$emit('onCancel')">
            Cancel
          </button>
          <button class="button is-rounded is-outlined is-dark" @click="revert()">
            <span>Revert</span>
            <span class="icon"><i class="fas fa-undo"></i></span>
          </button>
          <button class="super-button button is-medium is-rounded" :class="[ isValid ? 'is-dark' : 'is-danger']" @click="confirm()">
            <span>OK</span>
            <span class="icon"><i class="fas fa-fw fa-check"></i></span>
          </button>
        </div>
      </header>
      <section class="modal-card-body">
        <p class="help is-danger has-text-right p-b-sm"><span v-show="!isValid">There is an error in your syntax.</span>&nbsp;</p>
        <textarea class="textarea has-text-mono" rows="25" v-model="modifiedCode"></textarea>
      </section>
    </div>
  </div>
  </transition>

</div>
</template>

<script>
import * as Helpers from '~/lib/common/helpers'
export default {
  name: 'ModalCodeEditor',
  props: {
    code: { required: true, type: String },
    type: { required: true, type: String }, // only "JSON" for now
  },
  data () {
    return {
      modifiedCode: this.code
    }
  },
  computed: {
    isValid () { 
      return Helpers.isValidJsonObject(this.modifiedCode)
    }
  },
  methods: {
    confirm () {
      if (this.isValid) this.$emit('onConfirm', this.modifiedCode)
    },
    revert () {
      this.modifiedCode = this.code
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.modal-card-head, .modal-card-foot {
  background: #fff;
  border: none;
}
.modal-card-head {
  justify-content: flex-end;
}
</style>
