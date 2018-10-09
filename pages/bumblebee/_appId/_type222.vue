<template>
<div class="BumbleBee">



  <div class="" v-show="!jobType">
    <div class="top">
      <div class="p-xl has-text-centered">
        <h2 class="title is-2">BumbleBee</h2>
        <p>Offload long running tasks.</p>
      </div>
    </div>
  </div>
  <div class="" v-if="jobType">
    <div class="top">
      <h6 class="title is-6 is-capitalized has-text-right p-md">{{jobType}} - Send message</h6>
      <div class="columns is-centered p-lg">
        <div class="column is-8">

          <MailgunSendMessage />

        </div>
      </div>
      <div class="tabs is-centered">
        <ul>
          <li class="is-active"><a>Completed</a></li>
          <li><a>Queued</a></li>
          <li><a>Failed</a></li>
        </ul>
      </div>
    </div>

  </div>
  <ModalConfirm
    :icon="'fa-times'"
    :isVisible="confirmDeleteModalVisible"
    :message="'This action is permanent'"
    :submessage="'Are you sure you want to delete this job?'"
    :primaryButtonClass="'is-dark'"
    :primaryButtonText="'Cancel'"
    :secondaryButtonClass="'is-danger'"
    :secondaryButtonText="'Delete'"
    @onCancel="() => { confirmDeleteModalVisible = false }"
    @onPrimaryClick="() => { confirmDeleteModalVisible = false }"
    @onSecondaryClick="() => {
      confirmDeleteModalVisible = false;
      deleteRecord();
    }"
  />

</div>
</template>

<script>
const DEFAULT_LIMIT = 20
import axios from 'axios'
import moment from 'moment'
import InfiniteLoading from 'vue-infinite-loading/src/components/InfiniteLoading.vue'
import ModalConfirm from '~/components/ModalConfirm.vue'
import MailgunSendMessage from '~/components/bumblebee/MailgunSendMessage.vue'
import { mapGetters } from 'vuex'
export default {
  layout: 'bumblebee',
  components: { InfiniteLoading, ModalConfirm, MailgunSendMessage },

  // Initialise defaults and empty state for page
  async asyncData ({ app, params, query, store }) {
    let { appId, type } = params
    return {
      confirmDeleteModalVisible: false,
      job: {},
      jobType: type,
      limit: DEFAULT_LIMIT,
      list: [],
      offset: 0,
      pollyAppId: appId
    }
  },

  // initialise component
  mounted: async function () {
  },

  methods: {
  }

}
</script>

<style lang="scss">
.BumbleBee {
  .top {
    background: #fff;
    border-bottom: 1px solid #dedede;
  }
}
</style>
