<template>
<div>

  <div class="main">

    <nav class="level is-mobile p-t-lg p-b-lg">
      <div class="level-left">
        <a class="button" @click="toggleSorting">Sort</a>
      </div>

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
        :columns="columnNames"
        :records="records"
        :sortedColumns="sortedColumns"
        :key="tableComponentMounted"
        tableSize="LARGE"
        @onHeaderClicked="tableHeaderClicked"
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

  <PostgrestSortPanel
    :allColumns="tableColumns(resourceKey, true)"
    :isVisible="sortPanelVisible"
    :sortedColumns="sortedColumns"
    :key="sortComponentMounted"
    @onSort="sortColumns"
    @onHidePanel="() => { sortPanelVisible = false }"
  />

</div>
</template>

<script>
const DEFAULT_OFFSET = 0
const DEFAULT_PAGINATION_SIZE = 20
const DEFAULT_POSTGREST_QUERY = `select=*&limit=${DEFAULT_PAGINATION_SIZE}`
import axios from 'axios'
import draggable from 'vuedraggable'
import * as Helpers from '~/lib/helpers'
import Pagination from '~/components/Pagination.vue'
import PostgrestSortPanel from '~/components/PostgrestSortPanel.vue'
import Table from '~/components/Table.vue'
import { mapGetters } from 'vuex'
export default {
  layout: 'hummingbird',
  components: {  draggable, Pagination, PostgrestSortPanel, Table },
  watchQuery: ['q'],
  async asyncData ({ app, params, query, store }) {
    let { appId, resourceKey } = params
    let { q } = query
    let postgrestQueryString = (q) ? Helpers.decrypt(q) : DEFAULT_POSTGREST_QUERY
    let { data:response } = await app.$axios.get(`/api/postgrest/${appId}/${resourceKey}?q=${Helpers.encrypt(postgrestQueryString)}`, {
      'headers': { 'range-unit': 'items', 'prefer': 'count=exact' }
    })
    let rangeData = Helpers.getRangeDataFromPostgrestHeaders(response.headers)
    console.log('response', response)
    return {
      DEFAULT_OFFSET: DEFAULT_OFFSET,
      DEFAULT_PAGINATION_SIZE: DEFAULT_PAGINATION_SIZE,
      DEFAULT_POSTGREST_QUERY: DEFAULT_POSTGREST_QUERY,
      currentRangeEnd: rangeData.rangeEnd,
      pageTitle: params.resourceKey.replace(/_/g, ' '),
      postgrestQueryString: postgrestQueryString,
      sortPanelVisible: false,
      records: response.data,
      resourceKey: params.resourceKey,
      totalRecords: rangeData.totalRecords,

      // give some components a key so they refresh on route change / data refresh
      sortComponentMounted: Date.now(), 
      tableComponentMounted: Date.now()
    }
  },
  computed: {
    ...mapGetters({
      tableColumns: 'hummingbird/columnsForResource'
    }),
    columnNames: function () {
      return this.tableColumns(this.resourceKey).map(x => x.key)
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
      if (result.limit) result.limit = parseInt(result.limit) // convert to number instead of string
      if (result.offset) result.offset = parseInt(result.offset) // convert to number instead of string
      return result
    },
    sortedColumns: function () {
      if (!this.isSorted) return []
      let sorting = this.postgrestParams.order.split(',')
      return sorting.map(x => ({ key: x.split('.')[0], sort: x.split('.')[1] }))
    },
  },
  methods: {
    // getRecords: async function () {
      
    // }
    gridRecordClicked (record) {
      try {
        let primaryKeys = this.$store.getters['hummingbird/primaryKeysForResource'](this.resourceKey)
        let selectors = primaryKeys.map(x => {
          let pk = record[`${x}`].toString() || null
          if (!pk) throw new Error('Can\'t find a Primary Key for this record')
          return x + '=eq.' + pk
        })
        let q = Helpers.encrypt(selectors.join('&'))
        let path = `/hummingbird/${this.$route.params.appId}/record/edit/` + this.resourceKey + '?q=' + encodeURIComponent(q) // there is an occasional "+" appearing when not re-encoded. Not sure why..
        this.$router.push({ path: path })
      } catch (error) {
        console.log('error', error)
      }
    },
    paginate (start) {
      this.pushParams({ ...this.postgrestParams, offset: start })
    },
    pushParams (newParams) {
      let route = { path: this.$route.path, query: {} }
      let q = ''
      if (newParams.limit) q += `limit=${newParams.limit}&`
      if (newParams.offset) q += `offset=${newParams.offset}&`
      if (newParams.order) q += `order=${newParams.order}&`
      if (q !== '') route.query.q = Helpers.encrypt(q.substring(0, q.length - 1)) // remove the trailing &
      console.log('q', q)
      this.$router.push(route)
    },
    sortColumns (columns) {
      this.sortPanelVisible = false
      let ordering = columns.map(x => ( `${x.key}.${x.sort}`)).join(',')
      this.pushParams({ ...this.postgrestParams, order: ordering })
    },
    tableHeaderClicked (key) {
      let alreadySorted = this.sortedColumns.find(x => (x.key === key)) || false
      if (!alreadySorted) {
        let newSorting = [{key: key, sort: 'asc'}, ...this.sortedColumns] // push to front
        this.sortColumns(newSorting)
      }
      else {
        let modified = this.sortedColumns.filter(x => (x.key !== key))
        let newDirection = (alreadySorted.sort === 'asc') ? 'desc' : 'asc'
        console.log('alreadySorted.sor', alreadySorted.sort)
        console.log('newDirection', newDirection)
        let newSorting = [{key: alreadySorted.key, sort: newDirection}, ...modified] // push to front
        this.sortColumns(newSorting)
      }
    },
    toggleSorting () {
      this.sortPanelVisible = !this.sortPanelVisible
    }
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
