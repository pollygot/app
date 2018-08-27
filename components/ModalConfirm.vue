<template>
<div id="ModalConfirm" >

  <transition name="fade">
  <div class="modal" v-bind:class="{ 'is-active': isVisible }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head has-text-centered">
        <p class="modal-card-title"></p>
        <button class="delete" aria-label="close" @click="$emit('onCancel')"></button>
      </header>
      <section class="modal-card-body has-text-centered">
        <transition name="shake">
          <p v-show="isVisible" class="animated headShake is-size-5 has-text-weight-semibold">{{message}}</p>
        </transition>
        <p class="">{{submessage}}</p>
        <!-- Content ... -->
      </section>
      <footer class="modal-card-foot">
        <div class="buttons">
          <button class="button is-rounded is-outlined" :class="secondaryButtonClass" @click="$emit('onSecondaryClick')">
            {{secondaryButtonText}}
          </button>
          <button class="super-button button is-medium is-rounded" :class="primaryButtonClass" @click="$emit('onPrimaryClick')">
            <span>{{primaryButtonText}}</span>
            <span class="icon">
              <i class="fas fa-fw" :class="icon"></i>
            </span>
          </button>
        </div>
      </footer>
    </div>
  </div>
  </transition>

</div>
</template>

<script>
export default {
  name: 'ModalConfirm',
  props: {
    confirmText: { required: false, type: String },
    icon: { required: false, type: String, default: 'fa-arrow-right' },
    isVisible: { required: true, type: Boolean },
    message: { required: true, type: String },
    primaryButtonClass: { required: false, type: String, default: 'is-primary' },
    primaryButtonText: { required: false, type: String, default: 'Confirm' },
    secondaryButtonClass: { required: false, type: String, default: 'is-dark' },
    secondaryButtonText: { required: false, type: String, default: 'Cancel' },
    submessage: { required: true, type: String }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.modal-card-head, .modal-card-foot {
  background: #fff;
  border: none;
}
.modal-card-foot {
  justify-content: flex-end;
  // .button {
  //   text-transform: uppercase;
  //   font-weight: bolder;
  //   font-size: 0.9rem;
  // }
}
</style>
