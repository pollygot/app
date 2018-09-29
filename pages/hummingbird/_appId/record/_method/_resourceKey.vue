<template>
<div class="HummingbirdRecord">

  <nav class="top-level level is-mobile p-lg">
    <div class="level-left">
      <div class="level ">
        <a class="button" @click="back()">
          <span class="icon">
            <i class="fas fa-arrow-left"></i>
          </span>
        </a>
      </div>
    </div>

    <div class="animated zoomInRight level-right">
      <div class="level-item">
        <div class="dropdown is-hoverable is-right" v-show="isCreated">
          <div class="dropdown-trigger">
            <button class="button is-dark is-small is-rounded is-outlined" aria-haspopup="true">
              <span class="icon is-small "><i class="fas fa-cog" aria-hidden="true"></i></span>
            </button>
          </div>
          <div class="dropdown-menu" role="menu" v-show="isCreated">
            <div class="dropdown-content">
              <a class="dropdown-item" @click="confirmDeleteModalVisible = true">
                <p>
                  <span>Delete</span>
                  <span class="m-l-sm"><code>DEL</code></span>
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="level-item m-r-none ">
        <a class="super-button button is-medium is-primary is-rounded" @click="save()">
          <span>Save</span>
          <span class="icon">
            <i class="fas fa-fw fa-save"></i>
          </span>
        </a>
      </div>
    </div>
  </nav>

  <div class="m-lg box has-corners">
      <template v-for="field in formattedFields">

        <div class="field is-horizontal" v-if="field.type === 'enum'" :key="field.key">
          <div class="field-label is-normal">
            <label class="label">{{field.label}}</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control select is-fullwidth">
                <select v-model="field.value">
                  <option
                    v-for="(e, i) in field.enum"
                    :key="field.key + 'enum' + i"
                  >{{e}}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="field is-horizontal" v-else-if="field.type === 'integer'" :key="field.key">
          <div class="field-label is-normal">
            <label class="label is-capitalized">{{field.label}}</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control is-expanded">
                <input class="input is-fullwidth" type="number" :placeholder="field.value" v-model="field.value">
              </p>
            </div>
          </div>
        </div>

        <div class="field is-horizontal" v-else-if="field.type === 'boolean'" :key="field.key">
          <div class="field-label is-normal">
            <label class="label is-capitalized">{{field.label}}</label>
          </div>
          <div class="field-body">
            <div class="field p-t-sm">
              <input class="is-checkradio" :id="'chk'+field.key" type="checkbox" :name="'chk'+field.key"  v-model="field.value">
              <label :for="'chk'+field.key" class="m-none"></label>
            </div>
          </div>
        </div>

        <div class="field is-horizontal" v-else-if="field.type === 'timestamp'" :key="field.key">
          <div class="field-label is-normal">
            <label class="label is-capitalized">{{field.label}}</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p>
                <input class="input is-fullwidth" type="datetime-local" :placeholder="field.value" v-model="field.value">
              </p>
            </div>
          </div>
        </div>

        <div class="field is-horizontal" v-else-if="field.type === 'json'" :key="field.key">
          <div class="field-label is-normal">
            <label class="label is-capitalized">{{field.label}}</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control is-expanded">
                <textarea class="textarea is-small is-fullwidth" :placeholder="field.value" v-model="field.value" rows="10"></textarea>
              </p>
            </div>
          </div>
        </div>

        <div class="field is-horizontal" v-else-if="field.type === 'string' && field.format === 'text'" :key="field.key">
          <div class="field-label is-normal">
            <label class="label is-capitalized">{{field.label}}</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control is-expanded">
                <textarea class="textarea" :placeholder="field.value" v-model="field.value" rows="2"></textarea>
              </p>
            </div>
          </div>
        </div>

        <div class="field is-horizontal" v-else-if="field.type === 'string' && field.format === 'character varying'" :key="field.key">
          <div class="field-label is-normal">
            <label class="label is-capitalized">{{field.label}}</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control is-expanded">
                <input class="input is-fullwidth" type="text" :placeholder="field.value" v-model="field.value">
              </p>
            </div>
          </div>
        </div>

        <div class="field is-horizontal" v-else-if="field.type === 'string' && field.format === 'date'" :key="field.key">
          <div class="field-label is-normal">
            <label class="label is-capitalized">{{field.label}}</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p>
                <datepicker class="input is-fullwidth" type="date" :placeholder="field.value" v-model="field.value"></datepicker>
              </p>
            </div>
          </div>
        </div>

      </template>
  </div>

  <ModalConfirm
    :icon="'fa-times'"
    :isVisible="confirmDeleteModalVisible"
    :message="'This action is permanent'"
    :submessage="'Are you sure you want to delete this record?'"
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
import * as Helpers from '~/lib/helpers'
import Datepicker from '~/components/Datepicker.vue'
import ModalConfirm from '~/components/ModalConfirm.vue'
export default {
  async asyncData ({ app, params, query, route, store }) {
    let { appId, resourceKey } = params
    let isCreated = (params.method === 'edit') ? true : false
    const proxyUrlBase = `/api/postgrest/${appId}/${resourceKey}`
    let record = {}
    if (isCreated) {
      let { data:response } = await app.$axios.get(`${proxyUrlBase}?q=${query.q}`, {
        'headers': { 'accept': 'application/vnd.pgrst.object+json' }
      })
      record = response.data
    }
    let availableFields = app.store.getters['hummingbird/columnsForResource'](resourceKey)
    let formattedFields = availableFields
      .map(x => Helpers.calulateDisplayTypeFromSwaggerInfo(x)) // try figure out how each field should be displayed
      .map(x => (Object.assign({ value:record[`${x.key}`] }, x))) // add the current value to each field
      .map(x => Helpers.enrichSwaggerField(x)) // add useful data to each field. eg, add Date() to timestamp strings
    console.log('formattedFields', formattedFields)
    return {
      appId: appId,
      availableFields: availableFields,
      confirmDeleteModalVisible: false,
      formattedFields: formattedFields,
      isCreated: isCreated,
      pageTitle: resourceKey.replace(/_/g, ' '),
      primaryKeys: app.store.getters['hummingbird/primaryKeysForResource'](resourceKey) || [],
      proxyUrlBase: proxyUrlBase,
      record: record,
      resourceKey: resourceKey
    }
  },
  methods: {
    back () {
      let resourceKey = (this.fromRoute && this.fromRoute.params) ? this.fromRoute.params.resourceKey : null
      if (resourceKey && resourceKey === this.resourceKey) this.$router.go(-1)
      else this.$router.push({ path: `/hummingbird/${this.$route.params.appId}/list/${this.resourceKey}` })
    },
    createRecord () {
      let self = this
      let data = {} // the object to be sent to the database
      this.formattedFields
        .filter(x => x.value) // get fields that have been filled out
        .forEach(x => { data[x.key] = x.value }) // populate the object to be sent to the database
      let url = `${this.proxyUrlBase}`
      return this.$axios.post(this.proxyUrlBase, data).catch(this.handleErrorResponse)
    },
    deleteRecord: async function () {
      let selector = this.getUniqueSelector(this.record)
      let url = `${this.proxyUrlBase}?q=` + encodeURIComponent(Helpers.encrypt(selector))
      if (!selector) {
        this.$toast.error('Couldn\'t find a primary key', { duration: 4000 })
      } else if (!await this.verifyUrlReturnsUnique(url)) {
        this.$toast.error('Couldn\'t get a unique selector', { duration: 4000 })
        return null
      } else {
        let { data:deleteResponse } = await this.$axios.delete(url).catch(this.handleErrorResponse)
        if (deleteResponse) this.$router.push({ path: `/hummingbird/${this.$route.params.appId}/list/${this.resourceKey}` })
      }
    },
    getUniqueSelector (record) {
      let pkFilters = this.primaryKeys.map(x => (`${x}=eq.${record[x]}`))
      if (!pkFilters.length) return null
      else return pkFilters.join('&')
    },
    handleErrorResponse (e) {
      let { details } = e.response.data
      this.$toast.error(details, { duration: 4000 })
      return { data: null }
    },
    save: async function () {
      let { data:proxyResponse } = (this.isCreated) ? await this.updateRecord() : await this.createRecord()
      if (proxyResponse && proxyResponse.data) {
        let response = proxyResponse.data
        this.$toast.success('Saved!', { duration: 1000 })
        let q = Helpers.encrypt(this.getUniqueSelector(response))
        let path = `/hummingbird/${this.appId}/record/edit/${this.resourceKey}?q=` + encodeURIComponent(q) // there is an occasional "+" appearing when not re-encoded. Not sure why..
        this.$router.replace({path: path})
      }
    },
    // update the database. This uses PATCH so only the data that is passed will be updated
    updateRecord: async function () {
      let data = {} // the object to be sent to the database
      let selector = this.getUniqueSelector(this.record)
      let url = `${this.proxyUrlBase}?${selector}`
      if (!selector) {
        this.$toast.error('Couldn\'t find a primary key', { duration: 4000 })
        return null
      } else if (!await this.verifyUrlReturnsUnique(url)) {
        this.$toast.error('Couldn\'t get a unique selector', { duration: 4000 })
        return null
      } else {
        this.formattedFields
          .filter(x => Helpers.hasDataChanged(x)) // get only modified fields
          .forEach(x => { data[x.key] = x.value }) // populate the object to be sent to the database
        return this.$axios.patch(url, data).catch(this.handleErrorResponse)
      }
    },
    verifyUrlReturnsUnique: async function (url) {
      let { data:proxyResponse } = await this.$axios.get(url).catch(this.handleErrorResponse)
      return (proxyResponse && proxyResponse.data && proxyResponse.data.length === 1) ? true : false
    }
  },

  // View handlers
  layout: 'hummingbird',
  components: { Datepicker, ModalConfirm },
  watchQuery: ['q'],
  beforeRouteEnter (to, from, next) {
    next(vm => { vm.fromRoute = from }) // for the "back" function
  },
}
</script>

<style lang="scss">
.HummingbirdRecord {
  .container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .links {
    padding-top: 15px;
  }
}
</style>
