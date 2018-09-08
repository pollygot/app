<template>
<div>

  <div class="main">

    <nav class="level is-mobile p-t-lg p-b-lg">
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
      <Table
        class=""
        :columns="columns"
        :records="records"
        :sortColumn="sortColumn"
        :sortDirection="sortDirection"
        tableSize="LARGE"
        @onSort="sort"
        @onRecordClicked="gridRecordClicked"
      />
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
import axios from 'axios'
import Pagination from '~/components/Pagination.vue'
import Table from '~/components/Table.vue'
import { encrypt, decrypt, getRangeDataFromPostgrestHeaders } from '~/lib/helpers'
export default {
  layout: 'hummingbird',
  components: {  Pagination, Table },
  watchQuery: ['q'],
  async asyncData ({ app, params, query, store }) {
    let { appId } = params
    let pollyApp = store.getters['app'](appId)
    let postgrestUrl = `${pollyApp.config.url}/${params.resourceKey}`
    let postgrestQueryString = (query.q) ? decrypt(query.q) : `select=*&limit=${DEFAULT_PAGINATION_SIZE}`
    let fullUrl = `${postgrestUrl}?${postgrestQueryString}`
    let { data:records, headers } = await axios.get(fullUrl, {
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
    isSorted: function () {
      return !!this.postgrestParams.order
    },
    // parse the params from the query string
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
    sortColumn: function () {
      if (!this.isSorted) return null
      return this.postgrestParams.order.split('.')[0]
    },
    sortDirection: function () {
      if (!this.isSorted) return null
      return this.postgrestParams.order.split('.')[1]
    }
  },
  methods: {
    gridRecordClicked: function (record) {
      try {
        let primaryKeys = this.$store.getters['hummingbird/primaryKeysForResource'](this.resourceKey)
        let selectors = primaryKeys.map(x => {
          let pk = record[`${x}`].toString() || null
          if (!pk) throw new Error('Can\'t find a Primary Key for this record')
          return x + '=eq.' + pk
        })
        let path = `/hummingbird/${this.$route.params.appId}/record/edit/` + this.resourceKey + '?q=' + encrypt(selectors.join('&'))
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
      if (newParams.order) q += `order=${newParams.order}&`
      if (q !== '') route.query.q = encrypt(q.substring(0, q.length - 1)) // remove the trailing &
      this.$router.push(route)
    },
    sort: function (columnName) {
      let sortDirection = (this.isSorted && this.sortColumn === columnName && this.sortDirection === 'asc')
        ? 'desc'
        : 'asc'
      this.pushParams({ ...this.postgrestParams, order: `${columnName}.${sortDirection}` })
    },
  }
}
</script>

<style lang="scss">
.table-box {
  overflow: auto;
  overflow-y: hidden;
  font-size: 0.9rem;
  td:hover {
    cursor: pointer;
  }
  a.sort-asc:after {
   content: ' ▾';
  }
  a.sort-desc:after {
   content: ' ▴';
  }
}
</style>
