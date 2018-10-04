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

    <div class="level-right">
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



  <div class="p-lg columns">
    <div class="column">
      <h3 class="title is-3 is-capitalized">{{Helpers.cleanseTableName(resourceKey)}}</h3>

      <div class="box has-corners">
        <template v-for="field in formattedFields">

          <!-- SELECT -->
          <div class="field" v-if="field.format === 'SELECT'" :key="field.key">
            <nav class="level m-b-sm">
              <div class="level-left">
                <label class="label is-capitalized">
                  <span>{{field.label}} </span>
                  <span class="has-text-grey-lighter" v-show="field.pk">(Primary Key) </span>
                  <span class="has-text-grey-lighter" v-show="field.fk">(Foreign Key) </span>
                </label>
              </div>
              <div class="level-right" v-show="field.fk">
                <a class="button is-small is-white">
                  <span class="is-capitalized">{{field.fk_table}}</span>
                  <span class="icon is-small"><i class="fas fa-arrow-right"></i></span>
                </a>
              </div>
            </nav>
            <div class="control is-expanded">
              <div class="control select is-fullwidth">
                <select v-model="field.modifiedValue">
                  <option v-for="(e, i) in field.enum" :key="field.key + 'enum' + i">{{e}}</option>
                </select>
              </div>
            </div>
            <p class="help">&nbsp;</p>
          </div>

          <!-- NUMBER -->
          <div class="field" v-else-if="field.format === 'NUMBER'" :key="field.key">
            <nav class="level m-b-sm">
              <div class="level-left">
                <label class="label is-capitalized">
                  <span>{{field.label}} </span>
                  <span class="has-text-grey-lighter" v-show="field.pk">(Primary Key) </span>
                  <span class="has-text-grey-lighter" v-show="field.fk">(Foreign Key) </span>
                </label>
              </div>
              <div class="level-right" v-show="field.fk">
                <a class="button is-small is-white" @click="joinTable(Object.assign({}, field, {value: field.modifiedValue}), true)">
                  <span class="is-capitalized">{{field.fk_table}}</span>
                  <span class="icon is-small"><i class="fas fa-arrow-right"></i></span>
                </a>
              </div>
            </nav>
            <div class="control is-expanded">
              <!-- <input class="input is-fullwidth" type="number" :placeholder="field.modifiedValue" v-model="field.modifiedValue"> -->
              <numeric-input 
                type="number" 
                :placeholder="field.modifiedValue" 
                :value="field.modifiedValue"
                :hasSafetyLock="field.pk"
                @onChange="v => field.modifiedValue = v">
              </numeric-input>
            </div>
            <p class="help">&nbsp;</p>
          </div>

          <!-- CHECKBOX -->
          <div class="field" v-else-if="field.format === 'CHECKBOX'" :key="field.key">
            <nav class="level m-b-sm">
              <div class="level-left">
                <label class="label is-capitalized">
                  <span>{{field.label}} </span>
                  <span class="has-text-grey-lighter" v-show="field.pk">(Primary Key) </span>
                  <span class="has-text-grey-lighter" v-show="field.fk">(Foreign Key) </span>
                </label>
              </div>
              <div class="level-right" v-show="field.fk">
                <a class="button is-small is-white">
                  <span class="is-capitalized">{{field.fk_table}}</span>
                  <span class="icon is-small"><i class="fas fa-arrow-right"></i></span>
                </a>
              </div>
            </nav>
            <div class="control is-expanded">
                <input class="is-checkradio" :id="'chk'+field.key" type="checkbox" :name="'chk'+field.key"  v-model="field.modifiedValue">
                <label :for="'chk'+field.key" class="m-none"></label>
            </div>
            <p class="help">&nbsp;</p>
          </div>

          <!-- DATETIME -->
          <div class="field" v-else-if="field.format === 'DATETIME'" :key="field.key">
            <nav class="level m-b-sm">
              <div class="level-left">
                <label class="label is-capitalized">
                  <span>{{field.label}} </span>
                  <span class="has-text-grey-lighter" v-show="field.pk">(Primary Key) </span>
                  <span class="has-text-grey-lighter" v-show="field.fk">(Foreign Key) </span>
                </label>
              </div>
              <div class="level-right" v-show="field.fk">
                <a class="button is-small is-white">
                  <span class="is-capitalized">{{field.fk_table}}</span>
                  <span class="icon is-small"><i class="fas fa-arrow-right"></i></span>
                </a>
              </div>
            </nav>
            <div class="control is-expanded">
              <datetimepicker :placeholder="field.dateString" :value="field.modifiedValue" @onChange="v => field.modifiedValue = v"></datetimepicker>
            </div>
            <p class="help">&nbsp;</p>
          </div>

          <!-- TEXTAREA -->
          <div class="field" v-else-if="field.format === 'TEXTAREA'" :key="field.key">
            <nav class="level m-b-sm">
              <div class="level-left">
                <label class="label is-capitalized">
                  <span>{{field.label}} </span>
                  <span class="has-text-grey-lighter" v-show="field.pk">(Primary Key) </span>
                  <span class="has-text-grey-lighter" v-show="field.fk">(Foreign Key) </span>
                </label>
              </div>
              <div class="level-right" v-show="field.fk">
                <a class="button is-small is-white">
                  <span class="is-capitalized">{{field.fk_table}}</span>
                  <span class="icon is-small"><i class="fas fa-arrow-right"></i></span>
                </a>
              </div>
            </nav>
            <div class="control is-expanded">
              <textarea class="textarea is-fullwidth" :placeholder="field.modifiedValue" v-model="field.modifiedValue" rows="2"></textarea>
            </div>
            <p class="help">&nbsp;</p>
          </div>
          
          <!-- TEXT -->
          <div class="field" v-else-if="field.format === 'TEXT'" :key="field.key">
            <nav class="level m-b-sm">
              <div class="level-left">
                <label class="label is-capitalized">
                  <span>{{field.label}} </span>
                  <span class="has-text-grey-lighter" v-show="field.pk">(Primary Key) </span>
                  <span class="has-text-grey-lighter" v-show="field.fk">(Foreign Key) </span>
                </label>
              </div>
              <div class="level-right" v-show="field.fk">
                <a class="button is-small is-white">
                  <span class="is-capitalized">{{field.fk_table}}</span>
                  <span class="icon is-small"><i class="fas fa-arrow-right"></i></span>
                </a>
              </div>
            </nav>
            <div class="control is-expanded">
              <input class="input is-fullwidth" type="text" :placeholder="field.modifiedValue" v-model="field.modifiedValue">
            </div>
            <p class="help">&nbsp;</p>
          </div>

          <!-- DATE -->
          <div class="field" v-else-if="field.format === 'DATE'" :key="field.key">
            <nav class="level m-b-sm">
              <div class="level-left">
                <label class="label is-capitalized">
                  <span>{{field.label}} </span>
                  <span class="has-text-grey-lighter" v-show="field.pk">(Primary Key) </span>
                  <span class="has-text-grey-lighter" v-show="field.fk">(Foreign Key) </span>
                </label>
              </div>
              <div class="level-right" v-show="field.fk">
                <a class="button is-small is-white">
                  <span class="is-capitalized">{{field.fk_table}}</span>
                  <span class="icon is-small"><i class="fas fa-arrow-right"></i></span>
                </a>
              </div>
            </nav>
            <div class="control is-expanded">
              <datepicker :placeholder="field.modifiedValue" :value="field.modifiedValue" @onChange="v => field.modifiedValue = v"></datepicker>
            </div>
            <p class="help">&nbsp;</p>
          </div>

        </template>
      </div>
    </div>

    <div class="joins column is-5" v-if="joins.length">
      <h5 class="title is-5 is-capitalized">Joins</h5>
      <nav class="breadcrumb" aria-label="breadcrumbs">
        <ul>
          <li :class="{'is-active': (i + 1) === joins.length}" v-for="(join, i) in joins" :key="i">
            <a class="is-capitalized" @click="goToJoinHistory(i + 1)">
              {{Helpers.cleanseTableName(join['fk_table'])}}
            </a>
          </li>
        </ul>
      </nav>
      <div class="box">
        <ReadOnlyCard :columns="activeJoin.columns" :record="activeJoin.data" @onShowJoin="joinTable" />
      </div>
    </div>
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
import * as Helpers             from '~/lib/helpers'
import * as PostgrestHelpers    from '~/lib/postgrestHelpers'
import Datepicker               from '~/components/inputs/Datepicker.vue'
import Datetimepicker           from '~/components/inputs/Datetimepicker.vue'
import NumericInput             from '~/components/inputs/Numeric.vue'
import Timepicker               from '~/components/inputs/Timepicker.vue'
import ModalConfirm             from '~/components/ModalConfirm.vue'
import ReadOnlyCard             from '~/components/hummingbird/ReadOnlyCard.vue'

const TOAST_ERROR_DURATION = 4000

export default {
  async asyncData ({ app, params, query, route, store }) {
    let { appId, resourceKey } = params
    let isCreated = (params.method === 'edit') ? true : false
    let record = {}
    if (isCreated) {
      let { data:response } = await PostgrestHelpers.getRecord(app, appId, resourceKey, query.q)
      record = response.data
    }
    let availableFields = app.store.getters['hummingbird/columnsForResource'](resourceKey)
    let formattedFields = availableFields.map(x => ({...x, value: record[`${x.key}`], modifiedValue: record[`${x.key}`] })) // add the current value to each field
    return {
      appId: appId,
      availableFields: availableFields,
      confirmDeleteModalVisible: false,
      formattedFields: formattedFields,
      joins: [], // the user can page through foreign keys
      isCreated: isCreated,
      pageTitle: resourceKey.replace(/_/g, ' '),
      primaryKeys: app.store.getters['hummingbird/primaryKeysForResource'](resourceKey) || [],
      proxyUrlBase: `/api/postgrest/${appId}/${resourceKey}`,
      record: record,
      resourceKey: resourceKey
    }
  },
  computed: {
    Helpers: { // expose all Helpers to the page
      get() { return Helpers }
    },
    activeJoin () {
      return this.joins[(this.joins.length - 1)]
    }
  },
  methods: {
    back () {
      let resourceKey = (this.fromRoute && this.fromRoute.params) ? this.fromRoute.params.resourceKey : null
      if (resourceKey && resourceKey === this.resourceKey) this.$router.go(-1)
      else this.$router.push({ path: `/hummingbird/${this.$route.params.appId}/list/${this.resourceKey}` })
    },
    createRecord () {
      let data = {} // the object to be sent to the database
      this.formattedFields
        .filter(x => x.modifiedValue) // get fields that have been filled out
        .forEach(x => { data[x.key] = x.modifiedValue }) // populate the object to be sent to the database
      let url = `${this.proxyUrlBase}`
      console.log('this.formattedFields', this.formattedFields)
      return PostgrestHelpers.createRecord(this, this.appId, this.resourceKey, data).catch(this.handleErrorResponse)
    },
    deleteRecord: async function () {
      let selector = Helpers.encrypt(PostgrestHelpers.getUniqueSelector(this.primaryKeys, this.record))
      if (!selector) {
        this.$toast.error('Couldn\'t find a primary key', { duration: TOAST_ERROR_DURATION })
        return null
      } else if (!await PostgrestHelpers.verifySelectorReturnsUnique(this, this.appId, this.resourceKey, selector)) {
        this.$toast.error('Couldn\'t get a unique selector. This would cause multiple deletions to the database.', { duration: TOAST_ERROR_DURATION })
        return null
      } else {
        let { data:deleteResponse } = await PostgrestHelpers.deleteRecord(this, this.appId, this.resourceKey, selector).catch(this.handleErrorResponse)
        if (deleteResponse) this.$router.push({ path: `/hummingbird/${this.$route.params.appId}/list/${this.resourceKey}` })
      }
    },
    handleErrorResponse (e) {
      let { message } = e.response.data
      this.$toast.error(`Error: ${message}`, { duration: TOAST_ERROR_DURATION })
      return { data: null }
    },
    goToJoinHistory (index) {
      this.joins = this.joins.slice(0, index)
    },
    joinTable: async function (fieldInfo, resetArray) {
      let joins = resetArray ? [] : this.joins
      let field = {...fieldInfo}
      console.log('field', field)
      let selector = `${field['fk_col']}=eq.${field.value}`
      console.log('selector', selector)
      let q = Helpers.encrypt(selector)
      let { data:response } = await PostgrestHelpers.getRecord(this, this.appId, field['fk_table'], q)
      let availableFields = this.$store.getters['hummingbird/columnsForResource'](field['fk_table'])
      field.columns = availableFields
      field.data = response.data
      joins.push(field)
      this.joins = joins
    },
    save: async function () {
      let { data:proxyResponse } = (this.isCreated) ? await this.updateRecord() : await this.createRecord()
      if (proxyResponse && proxyResponse.data) {
        let response = proxyResponse.data
        this.$toast.success('Saved!', { duration: 1000 })
        let q = Helpers.encrypt(PostgrestHelpers.getUniqueSelector(this.primaryKeys, response))
        let path = `/hummingbird/${this.appId}/record/edit/${this.resourceKey}?q=` + encodeURIComponent(q) // there is an occasional "+" appearing when not re-encoded. Not sure why..
        this.$router.replace({path: path})
      }
    },
    // update the database. This uses PATCH so only the data that is passed will be updated
    updateRecord: async function () {
      let selector = Helpers.encrypt(PostgrestHelpers.getUniqueSelector(this.primaryKeys, this.record))
      if (!selector) {
        this.$toast.error('Couldn\'t find a primary key', { duration: TOAST_ERROR_DURATION })
        return null
      } else if (!await PostgrestHelpers.verifySelectorReturnsUnique(this, this.appId, this.resourceKey, selector)) {
        this.$toast.error('Couldn\'t get a unique selector. This would cause multiple updates to the database.', { duration: TOAST_ERROR_DURATION })
        return null
      } else {
        let data = {} // the object to be sent to the database
        this.formattedFields
          .filter(x => PostgrestHelpers.hasDataChanged(x)) // get only modified fields
          .forEach(x => { data[x.key] = x.modifiedValue }) // populate the object to be sent to the database
        return PostgrestHelpers.updateRecord(this, this.appId, this.resourceKey, selector, data).catch(this.handleErrorResponse)
      }
    },
  },

  // View handlers
  layout: 'hummingbird',
  components: { Datepicker, Datetimepicker, Timepicker, ModalConfirm, NumericInput, ReadOnlyCard },
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

  .joins {
    .box {
      overflow: hidden;
    }
  }
}
</style>
