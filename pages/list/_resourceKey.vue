<template>
<div>
  <NavBar>
    {{ pageTitle }}
  </NavBar>

  <div class="main">
    
    <nav class="level is-mobile">
      <div class="level-left"></div>

      <div class="level-right">
        <p class="m-r-none level-item">
          <router-link tag="a"
            class="super-button button is-medium is-primary is-rounded"
            :to="'/new/' + resourceKey">
            <span>New</span>
            <span class="icon">
              <i class="fas fa-fw fa-arrow-right"></i>
            </span>
          </router-link>
        </p>
      </div>
    </nav>

    <div class="table-box box p-none">
      <table class="table is-responsive is-fullwidth is-hoverable is-small" >
        <thead>
          <tr>
            <th width="20" class="p-r-none">
              <div class="field">
                <input class="is-checkradio is-small" id="exampleCheckbox" type="checkbox" name="exampleCheckbox">
                <label for="exampleCheckbox" class="p-r-none"></label>
              </div>
            </th>
            <th v-for="(column, i) in columns" :key="'col-h'+i">
              <a class="sort-down">{{column}}</a>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in records" :key="'record-'+index">
            <td class="p-r-none">
              <div class="field">
                <input class="is-checkradio is-small" id="exampleCheckbox" type="checkbox" name="exampleCheckbox">
                <label for="exampleCheckbox" class="p-r-none"></label>
              </div>
            </td>
            <td v-for="(column, i) in columns" :key="'col-td'+i" @click="gridRecordClicked(record)" >
              <span>
                {{
                  record[`${column}`] ||
                  (record[`${column}`] !== null)
                    ? record[`${column}`].toString()
                    : '&nbsp;'
                }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section p-b-none">
      <Pagination
        :currentRangeStart="postgrestParams.offset || 0"
        :currentRangeEnd="currentRangeEnd"
        :paginationSize="postgrestParams.limit || currentRangeEnd"
        :totalRecords="totalRecords"
        @onNewRangeStart="paginate"
      />
    </div>

  </div>

</div>
</template>

<script>
const DEFAULT_OFFSET = 0
const DEFAULT_PAGINATION_SIZE = 20
import NavBar from '~/components/NavBar.vue'
import Pagination from '~/components/Pagination.vue'
import { encrypt, decrypt, getRangeDataFromPostgrestHeaders } from '~/lib/helpers'
export default {
  components: {  NavBar, Pagination },
  watchQuery: ['q'],
  async asyncData ({ app, params, query }) {
    let postgrestUrl = `${process.env.POSTGREST_URL}/${params.resourceKey}`
    let postgrestQueryString = (query.q) ? decrypt(query.q) : `select=*&limit=${DEFAULT_PAGINATION_SIZE}`
    let fullUrl = `${postgrestUrl}?${postgrestQueryString}`
    let { data:records, headers } = await app.$axios.get(fullUrl, {
      'headers': { 'Range-Unit': 'items', 'Prefer': 'count=exact' }
    })
    let rangeData = getRangeDataFromPostgrestHeaders(headers)
    return {
      DEFAULT_OFFSET: DEFAULT_OFFSET,
      DEFAULT_PAGINATION_SIZE: DEFAULT_PAGINATION_SIZE,
      currentRangeEnd: rangeData.rangeEnd,
      pageTitle: params.resourceKey.replace(/_/g, ' '),
      postgrestQueryString: postgrestQueryString,
      records: records,
      resourceKey: params.resourceKey,
      totalRecords: rangeData.totalRecords,
    }
  },
  computed: {
    // returns the name of every field in the first record
    columns: function () {
      return Object.keys(this.records[0] || [])
    },
    //
    postgrestParams: function () {
      let result = {}
      this.postgrestQueryString.split('&').forEach(part => {
        let item = part.split('=')
        result[item[0]] = decodeURIComponent(item[1])
      })
      if (result.limit) result.limit = parseInt(result.limit)
      if (result.offset) result.offset = parseInt(result.offset)
      return result
    },
  },
  methods: {
    gridRecordClicked: function (record) {
      try {
        let primaryKeys = this.$store.getters['resources/primaryKeysForResource'](this.resourceKey)
        let selectors = primaryKeys.map(x => {
          let pk = record[`${x}`].toString() || null
          if (!pk) throw new Error('Can\'t find a Primary Key for this record')
          return x + '=eq.' + pk
        })
        let path = '/record/edit/' + this.resourceKey + '?' + selectors.join('&')
        this.$router.push({ path: path })
      } catch (error) {
        console.log('error', error)
      }
    },
    paginate: function (start) {
      this.pushParams({ ...this.postgrestParams, offset: start })
    },
    pushParams: function (newParams) {
      let route = { path: this.$route.path, query: {} }
      let q = ''
      if (newParams.limit) q += `limit=${newParams.limit}&`
      if (newParams.offset) q += `offset=${newParams.offset}&`
      if (q !== '') route.query.q = encrypt(q.substring(0, q.length - 1)) // remove the trailing &
      this.$router.push(route)
    },
  }
}
</script>

<style lang="scss">
.table-box {
  overflow: scroll;
  font-size: 0.9rem;
  td:hover {
    cursor: pointer;
  }
}
</style>

