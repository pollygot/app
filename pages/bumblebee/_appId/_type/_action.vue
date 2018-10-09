<template>
<div class="BumbleBee">

  <div class="">
    <div class="top">
      <h6 class="title is-6 is-capitalized has-text-right p-md">{{type}} - {{action.action}}</h6>
      <div class="columns is-centered p-lg">
        <div class="column is-8">

          <div class="field dropdown is-hoverable" v-if="workers.length > 1">
            <div class="dropdown-trigger">
              <button class="button" aria-haspopup="true" aria-controls="dropdown-menu4">
                <span>Change app</span>
                <span class="icon is-small"><i class="fas fa-angle-down" aria-hidden="true"></i></span>
              </button>
            </div>
            <div class="dropdown-menu" id="dropdown-menu4" role="menu">
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

          <div class="field" v-for="(param, i) in action.params" :key="'param'+i">
            <label class="label is-capitalized">{{param.param.replace(/_/g, ' ')}}</label>
            <div class="control" v-if="param.format === 'text' || param.format === 'json'">
              <textarea class="textarea" placeholder="Textarea"></textarea>
            </div>
            <div class="control" v-else>
              <input class="input" type="text" placeholder="Text input">
            </div>
          </div>
          <div class="buttons is-right">
            <button class="button">Submit</button>
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
        <div class="box">{{job}}</div>
      </div>
    </div>

  </div>

</div>
</template>

<script>
import axios from 'axios'
const JOB_TYPES = { // keep these in display order
  COMPLETED: { key: 'completed', label: 'Completed'},
  ACTIVE: { key: 'active', label: 'Active'},
  FAILED: { key: 'failed', label: 'Failed'},
  DELAYED: { key: 'delayed', label: 'Delayed'},
  WAITING: { key: 'waiting', label: 'Waiting'} 
}
export default {
  asyncData: async function ({ app, params, query, store }) {
    let { appId, type, action } = params
    let { appKkeyey } = query 
    let allApps = store.getters['bumblebee/apps']
    let defaultWorker = allApps.find(x => (x.type === type && x.isDefault)) || null
    let worker = (key) ? allApps.find(x => (x.key === key)) : defaultWorker ? defaultWorker : allApps.find(x => (x.type === type))
    let jobs = await app.$axios.$get(`/api/bumblebee/${appId}/apps/${worker.key}/jobs`)
    console.log('actions', worker.actions)
    return {
      appId: appId,
      action: worker.actions.find(x => (x.action === action)) || {},
      jobs: jobs || [],
      selectedJobType: JOB_TYPES.COMPLETED.key,
      type: type,
      worker: worker,
      workers: allApps.filter(x => (x.type === type)), // all workers of the same type

      // expose constants
      JOB_TYPES: JOB_TYPES
    }
  },
  computed: {
    visibleJobList () {
      return this.jobs[`${this.selectedJobType}`]
    }
  },
  methods: {
    jobCount (type) {
      return this.jobs[type].length
    }
  },
  
  // View handlers
  layout: 'bumblebee',
  watchQuery: ['key'],
  components: { }
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
