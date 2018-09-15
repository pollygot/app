<template>
<div class="Quokka">


  <div class="section has-text-centered" v-show="!jobState">
    <h2 class="title is-4">Quokka</h2>
    <p>Manage your Kue</p>
  </div>
  <div class="section has-text-centered" v-if="jobState && !list.length">
      <h2 class="title is-4">No {{jobState}} jobs.</h2>
  </div>
  <div class="columns is-gapless" v-if="jobState && list.length">

    <div class="column is-4 left-column">
      <div class="list-menu">
        <a class="list-menu-item" v-for="(job) in list" :key="job.type + job.id" @click="displayJob(job)" :class="{ 'is-active': isActiveJob(job) }">
          <div class="center">
            <p class="list-item">{{job.type}}</p>
            <p class="list-item caption">
              <span class="p-r-xs">Job ID: {{job.id}}</span> ·
              <span class="p-xs">{{timeAgo(job.created_at)}}</span>
            </p>
          </div>
          <div class="right">
            <span class="icon"><i class="fas fa-chevron-right"></i></span>
          </div>
        </a>
        <infinite-loading @infinite="infiniteHandler" spinner="waveDots" v-if="list.length"></infinite-loading>
      </div>
    </div>

    <div class="column is-8 right-column">
      <div class="m-lg has-text-centered" v-show="!job.id">
        Select a job to view the details.
      </div>
      <div class="m-lg" v-show="job.id">
        <h3 class="title is-3">Job {{job.id}}</h3>
        <h3 class="subtitle">{{job.type}}</h3>
        <div class="box">
          <div class="field is-horizontal">
            <div class="field-label"><label class="label">State</label></div>
            <div class="field-body"><div class="field is-capitalized">{{job.state}}</div></div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label"><label class="label">Created</label></div>
            <div class="field-body"><div class="field is-capitalized">{{timeAgo(job.created_at)}}</div></div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label"><label class="label">Duration</label></div>
            <div class="field-body"><div class="field is-capitalized">{{secondsToString(job.duration)}}</div></div>
          </div>
          <div class="buttons is-right">
            <a class="button" @click="() => { confirmDeleteModalVisible = true }">Delete</a>
            <a class="button is-primary is-outlined">Retry</a>
          </div>
        </div>
        <h5 class="title is-5 m-t-xl">Data</h5>
        <div class="box">
          <pre class="">{{job.data}}</pre>
        </div>
        <!-- <h5 class="title is-5 m-t-xl">Logs</h5>
        <div class="box">
          <pre class="">{{job.data}}</pre>
        </div> -->
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
import { mapGetters } from 'vuex'
export default {
  layout: 'quokka',
  components: { InfiniteLoading, ModalConfirm },

  // Initialise defaults and empty state for page
  async asyncData ({ app, params, query, store }) {
    let { appId, state } = params
    return {
      confirmDeleteModalVisible: false,
      job: {},
      jobState: state,
      limit: DEFAULT_LIMIT,
      list: [],
      offset: 0,
      pollyAppId: appId
    }
  },

  // initialise component
  mounted: async function () {
    let stats = await this.getStats()
    let jobs = await this.getJobs(this.jobState, this.limit, this.offset)
    this.totalActive = stats.activeCount
    this.totalComplete = stats.completeCount
    this.totalDelayed = stats.delayedCount
    this.totalFailed = stats.failedCount
    this.totalInactive = stats.inactiveCount
    this.list = this.list.concat(jobs)
  },

  methods: {
    displayJob (job) {
      this.job = job
    },
    deleteRecord () {
      console.log('@TODO')
    },
    getStats: async function () {
      return this.$axios.$get(`/api/kue/${this.pollyAppId}/stats`)
    },
    getJobs: async function (jobState, limit, offset) {
      console.log('jobState', jobState)
      return this.$axios.$get(`/api/kue/${this.pollyAppId}/jobs?state=${jobState}&limit=${limit}&offset=${offset}`)
    },
    isActiveJob (job) {
      return job.id === this.job.id
    },
    infiniteHandler ($state) {
      setTimeout(async () => {
        this.offset = this.offset + this.limit // paginate
        let jobs = await this.getJobs(this.jobState, this.limit, this.offset)
        this.list = this.list.concat(jobs)
        if (jobs.length < this.limit) $state.complete()
        else $state.loaded()
      }, 1000);
    },
    secondsToString (seconds) {
      return moment.duration(seconds, 'seconds').humanize()
    },
    timeAgo (datetime) {
      return moment.unix(datetime/1000).fromNow()
    }
  }

}
</script>

<style lang="scss">
.Quokka {
  min-height: 100vh;
  overflow: hidden;
  .columns {
    min-height: 100vh;
    overflow: hidden;
  }

  .left-column {
    height: 100vh;
    background: #fff;
    border-right: 1px solid #dedede;
    overflow-y: auto;
  }
  .right-column {
    height: 100vh;
    overflow-y: auto;
  }
}
</style>
