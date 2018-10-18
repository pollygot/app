<template>
<div class="BumbleBeeJobCard">
  <div class="box">
    <nav class="level is-mobile">
      <div class="level-left">
        <div class="level-item">Job {{job.id}} · {{jobDate}}</div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <!-- <div class="buttons is-right">
            <a class="button is-small is-dark is-outlined">asd</a>
          </div> -->
        </div>
      </div>
    </nav>
    <div class="tabs is-small">
      <ul>
        <li :class="{'is-active': tab === 'JOB'}">
          <a @click="tab = 'JOB'">Job</a>
        </li>
        <li :class="{'is-active': tab === 'DETAILS'}">
          <a @click="tab = 'DETAILS'">Details</a>
        </li>
      </ul>
    </div>
    <div v-show="tab === 'JOB'">
      <span class="heading">Payload</span>
      <pre>{{JSON.stringify(job.data.payload, null, 2)}}</pre>
      <div class="p-t-md" v-if="job.processedOn">
        <p><span class="heading">Processed</span>{{jobProcessed}}</p>
      </div>
      <div class="p-t-md" v-if="job.finishedOn">
        <p><span class="heading">Finished</span> {{jobFinished}}</p>
      </div>
    </div>
    <div v-show="tab === 'DETAILS'">
      <div class="p-b-md" v-if="job.returnvalue">
        <span class="heading">Response</span>
        <pre>{{JSON.stringify(job.returnvalue, null, 2)}}</pre>
      </div>
      <div class="p-b-md" v-if="job.failedReason">
        <span class="heading">Error</span> 
        <pre>{{job.failedReason}}</pre>
      </div>
      <div  class="p-b-md" v-if="job.stacktrace && job.stacktrace.length">
         <span class="heading">Stacktrace</span>
        <pre>{{job.stacktrace.toString()}}</pre>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'BumbleBeeJobCard',
  props: {
    job: { required: false, type: Object },
  },
  data() {
    return {
      tab: 'JOB',
    }
  },
  computed: {
    jobDate() {
      return moment(this.job.opts.timestamp).format(
        'ddd DD MMM YYYY · HH:MM:ss'
      )
    },
    jobProcessed() {
      return moment(this.job.processedOn).format('ddd DD MMM YYYY · HH:MM:ss')
    },
    jobFinished() {
      return moment(this.job.finishedOn).format('ddd DD MMM YYYY · HH:MM:ss')
    },
  },
  methods: {},
}
</script>
<style lang="scss">
.BumbleBeeJobCard {
  .box {
    overflow: hidden;
  }
}
</style>
