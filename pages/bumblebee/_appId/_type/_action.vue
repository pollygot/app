<template>
<div class="BumbleBee">

  <div class="">
    <div class="top">
      <div class="top-level p-t-md">
        <nav class="level is-mobile">
          <div class="level-left">
          </div>
          <div class="level-right">
            <div class="level-item dropdown is-hoverable is-right">
              <div class="dropdown-trigger">
                <button class="button">
                  <span>{{worker.name}}</span>
                  <span class="icon is-small"><i class="fas fa-angle-down" aria-hidden="true"></i></span>
                </button>
              </div>
              <div class="dropdown-menu">
                <div class="dropdown-content">
                  <nuxt-link 
                    tag="a" 
                    :to="`/bumblebee/${$route.params.appId}/${type}/${action.action}?key=${w.key}`" 
                    class="dropdown-item" 
                    :class="{'is-active': (worker.key === w.key)}" 
                    v-for="w in workers" :key="w.key">
                    {{w.name}}</nuxt-link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <div class="columns is-centered p-lg">
        <div class="column is-8">
          <!-- (e) => {payload[`${param.key}`] = e.target.value -->
          <div class="field" v-for="(param, i) in params" :key="'param'+i">
            <label class="label is-capitalized">{{param.label}}</label>
            <div class="control" v-if="param.format === 'text' || param.format === 'json'">
              <textarea class="textarea" placeholder="Textarea" v-model="param.value"></textarea>
            </div>
            <div class="control" v-else>
              <input class="input" type="text" :placeholder="param.help || param.label" v-model="param.value">
            </div>
          </div>
          <div class="buttons is-right">
            <button class="button" @click="submit()">Submit</button>
          </div>
        </div>
      </div>
      <div class="tabs is-centered">
        <ul>
          <li :class="{'is-active': selectedJobType === type.key}" v-for="type in JOB_TYPES" :key="type.key">
            <a @click="selectedJobType = type.key">
              <span class="tag m-r-sm">{{jobCount(type.key)}}</span>
              <span>{{type.label}}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="columns is-centered is-multiline m-t-lg m-b-lg">
      <div class="column is-8" v-for="job in visibleJobList" :key="job.id">
        <JobCard :job="job" />
      </div>
    </div>

  </div>

</div>
</template>

<script>
import axios from 'axios'
import JobCard from '~/components/bumblebee/JobCard.vue'

const JOB_TYPES = {
  // keep these in display order
  COMPLETED: { key: 'completed', label: 'Completed' },
  ACTIVE: { key: 'active', label: 'Active' },
  FAILED: { key: 'failed', label: 'Failed' },
  DELAYED: { key: 'delayed', label: 'Delayed' },
  WAITING: { key: 'waiting', label: 'Waiting' },
}

const getJobs = (context, appId, workerKey) => {
  return context.$axios.$get(`/api/bumblebee/${appId}/apps/${workerKey}/jobs`)
}
export default {
  asyncData: async function({ app, params, query, store }) {
    let { appId, type, action } = params
    let { key } = query
    let allApps = store.getters['bumblebee/apps']
    let defaultWorker =
      allApps.find(x => x.type === type && x.isDefault) || null
    let worker = key
      ? allApps.find(x => x.key === key)
      : defaultWorker
        ? defaultWorker
        : allApps.find(x => x.type === type)
    let jobs = await getJobs(app, appId, worker.key)
    let mutatableAction = worker.actions.find(x => x.action === action) || {}
    let mutatableParams = mutatableAction.params.map(x => ({ ...x }))
    return {
      appId: appId,
      action: { ...mutatableAction },
      jobs: jobs || [],
      interval: null,
      payload: {},
      params: mutatableParams,
      selectedJobType: JOB_TYPES.COMPLETED.key,
      type: type,
      worker: worker,
      workers: allApps.filter(x => x.type === type), // all workers of the same type

      // expose constants
      JOB_TYPES: JOB_TYPES,
    }
  },
  mounted() {
    this.interval = setInterval(this.refreshJobs, 10000)
  },
  computed: {
    visibleJobList() {
      return this.jobs[`${this.selectedJobType}`]
    },
  },
  methods: {
    jobCount(type) {
      return this.jobs[type].length
    },
    refreshJobs: async function() {
      this.jobs = await getJobs(this, this.appId, this.worker.key)
    },
    submit: async function() {
      let params = this.params
      let data = {
        appKey: this.worker.key,
        action: this.action.action,
        payload: {},
      }
      params.forEach(p => {
        data.payload[`${p.param}`] = p.value
      })
      let response = await this.$axios
        .post(`/api/bumblebee/${this.appId}/jobs`, data)
        .catch(e => {
          console.log(e)
        })
      this.refreshJobs()
    },
  },

  // View handlers
  layout: 'bumblebee',
  watchQuery: ['key'],
  components: { JobCard },
  beforeDestroy() {
    clearInterval(this.interval)
    this.interval = null
  },
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
