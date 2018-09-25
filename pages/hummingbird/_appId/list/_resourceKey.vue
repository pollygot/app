<template>
<div class="HummingbirdList">

  <div class="">
    <div class="top-level m-b-md">
      <nav class="level is-mobile p-lg m-none">
        <div class="level-left">
          <a class="level-item button is-small" @click="toggleFilters" :class="{'is-dark': filterPanelVisible}">
            <span class="icon is-small"><i class="fas fa-filter"></i></span>
            <span>{{filteredColumns.length || 'Filter'}}</span>
          </a>
          <a class="level-item button is-small" @click="toggleSorting" :class="{'is-dark': sortPanelVisible}">
            <span class="icon is-small"><i class="fas fa-sort"></i></span>
            <span>{{sortedColumns.length || 'Sort'}}</span>
          </a>
        </div>
        <div class="level-right">
          <div class="m-r-none level-item">
            <router-link tag="a"
              class="super-button button is-medium is-primary is-rounded"
              :to="`/hummingbird/${appId}/record/new/${resourceKey}`">
              <span>New</span>
              <span class="icon">
                <i class="fas fa-fw fa-arrow-right"></i>
              </span>
            </router-link>
          </div>
        </div>
      </nav>
      <div class="tabs is-centered is-small">
        <ul>
          <li :class="{'is-active': (currentViewType === VIEW_TYPES.GRID)}"><a @click="goToView(VIEW_TYPES.GRID)">Grid</a></li>
          <li :class="{'is-active': (currentViewType === VIEW_TYPES.CALENDAR)}"><a @click="goToView(VIEW_TYPES.CALENDAR)">Calendar</a></li>
          <li :class="{'is-active': (currentViewType === VIEW_TYPES.KANBAN)}"><a @click="goToView(VIEW_TYPES.KANBAN)">Kanban</a></li>
        </ul>
      </div>
    </div>

    <div class="table-box box p-none m-md m-b-xxl" v-show="currentViewType === VIEW_TYPES.GRID && records.length" :key="tableComponentMounted">
      <Table
        class=""
        :columns="tableColumns(this.resourceKey)"
        :records="records"
        :sortedColumns="sortedColumns"
        tableSize="LARGE"
        @onHeaderClicked="tableHeaderClicked"
        @onRecordClicked="gridRecordClicked"
      />
      <div class="pagination-section" v-show="totalRecords > paginationSize">
        <div class="select page-size">
          <select @change="(e) => updateLimit(e.target.value)">
            <option :selected="paginationSize === 20">20</option>
            <option :selected="paginationSize === 50">50</option>
            <option :selected="paginationSize === 100">100</option>
          </select>
        </div>
        <Pagination
          :currentRangeStart="postgrestParams.offset || 0"
          :currentRangeEnd="currentRangeEnd"
          :paginationSize="postgrestParams.limit || currentRangeEnd"
          :totalRecords="totalRecords"
          @onNewRangeStart="paginate"
        />
      </div>
    </div>
    <div class="" v-show="currentViewType === VIEW_TYPES.KANBAN && records.length" :key="kanbanComponentMounted">
      <Kanban 
        pivotKey="status"
        :columns="tableColumns(this.resourceKey)"
        :records="records"
      />
    </div>
    <div class="p-none m-md m-b-xl" v-if="!records.length">
      <h3 class="title is-5 has-text-centered m-xl">No records found</h3>
    </div>


  </div>

  <PostgrestFilterPanel
    :allColumns="tableColumns(resourceKey, true)"
    :isVisible="filterPanelVisible"
    :existingFilters="filteredColumns"
    :key="filterComponentMounted"
    @onFilter="filterColumns"
    @onHidePanel="() => { filterPanelVisible = false }"
  />
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
const VIEW_TYPES = { GRID: 'grid', CALENDAR: 'calendar', KANBAN: 'kanban' }
import axios from 'axios'
import * as Helpers from '~/lib/helpers'
import * as PostgrestHelpers from '~/lib/postgrestHelpers'
import Pagination from '~/components/Pagination.vue'
import PostgrestFilterPanel from '~/components/PostgrestFilterPanel.vue'
import PostgrestSortPanel from '~/components/PostgrestSortPanel.vue'
import Table from '~/components/Table.vue'
import Kanban from '~/components/Kanban.vue'
import { mapGetters } from 'vuex'
export default {
  layout: 'hummingbird',
  components: { Kanban, Pagination, PostgrestFilterPanel, PostgrestSortPanel, Table },
  watchQuery: ['q', 'v'],
  async asyncData ({ app, params, query, store }) {
    let { appId, resourceKey } = params
    let { q } = query
    let postgrestQueryString = (q) ? Helpers.decrypt(q) : DEFAULT_POSTGREST_QUERY
    let { data:response } = await app.$axios.get(`/api/postgrest/${appId}/${resourceKey}?q=${Helpers.encrypt(postgrestQueryString)}`, {
      'headers': { 'range-unit': 'items', 'prefer': 'count=exact' }
    })
    let rangeData = Helpers.getRangeDataFromPostgrestHeaders(response.headers)
    return {
      DEFAULT_OFFSET: DEFAULT_OFFSET,
      DEFAULT_PAGINATION_SIZE: DEFAULT_PAGINATION_SIZE,
      DEFAULT_POSTGREST_QUERY: DEFAULT_POSTGREST_QUERY,
      VIEW_TYPES: VIEW_TYPES,
      appId: appId,
      currentRangeEnd: rangeData.rangeEnd || 0,
      filterPanelVisible: false,
      pageTitle: params.resourceKey.replace(/_/g, ' '),
      pivotColumn: {},
      postgrestQueryString: postgrestQueryString,
      sortPanelVisible: false,
      records: response.data,
      resourceKey: params.resourceKey,
      totalRecords: rangeData.totalRecords,

      // give some components a key so they refresh on route change / data refresh
      filterComponentMounted: 'filters' + Date.now(), 
      kanbanComponentMounted: 'kanban' + Date.now(), 
      sortComponentMounted: 'sorts' + Date.now(), 
      tableComponentMounted: 'records' + Date.now()
    }
  },
  computed: {
    ...mapGetters({
      tableColumns: 'hummingbird/columnsForResource'
    }),
    currentViewType () {
      let { v } = this.$route.query
      return v || VIEW_TYPES.GRID // grid is the default
    },
    filteredColumns () {
      if (!this.isFiltered) return []
      let param = this.postgrestParams.or
      return PostgrestHelpers.parseFilterString(param.substring(1, param.length -1))
    },
    isFiltered () {
      return !!this.postgrestParams.or
    },
    isSorted () {
      return !!this.postgrestParams.order
    },
    paginationSize () {
      return this.postgrestParams.limit || DEFAULT_PAGINATION_SIZE
    },
    // parse the params from the query string
    postgrestParams () {
      let result = {}
      this.postgrestQueryString.split('&').forEach(part => {
        let item = part.split('=')
        result[item[0]] = decodeURIComponent(item[1])
      })
      if (result.limit) result.limit = parseInt(result.limit) // convert to number instead of string
      if (result.offset) result.offset = parseInt(result.offset) // convert to number instead of string
      return result
    },
    sortedColumns () {
      if (!this.isSorted) return []
      let sorting = this.postgrestParams.order.split(',')
      return sorting.map(x => ({ key: x.split('.')[0], sort: x.split('.')[1] }))
    },
  },
  methods: {
    goToView (viewType) {
      let query = Object.assign({}, this.$route.query)
      if (viewType === VIEW_TYPES.GRID) delete query.v
      else query.v = viewType
      let route = { path: this.$route.path, query: query }
      this.$router.push(route)
    },
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
      if (newParams.or) q += `or=${newParams.or}&`
      if (q !== '') route.query.q = Helpers.encrypt(q.substring(0, q.length - 1)) // remove the trailing &
      console.log('q', q)
      this.$router.push(route)
    },
    filterColumns (columns) {
      this.filterPanelVisible = false
      if (!columns.length) {
        this.pushParams({ ...this.postgrestParams, filters: null })
      } else {
        let ors = []
        let ands = []
        columns.forEach(col => {
          if (col.andOr === 'and') {
            ands.push(col)
          } else {
            ors.push(ands)
            ands = [col]
          }
        })
        ors.push(ands)
        let criteria = PostgrestHelpers.generateFilterString(ors)
        console.log('criteria', criteria)
        this.pushParams({ ...this.postgrestParams, or: criteria })
      }
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
        let newSorting = [{key: alreadySorted.key, sort: newDirection}, ...modified] // push to front
        this.sortColumns(newSorting)
      }
    },
    toggleFilters () {
      this.filterPanelVisible = !this.filterPanelVisible
    },
    toggleSorting () {
      this.sortPanelVisible = !this.sortPanelVisible
    },
    updateLimit (newSize) {
      this.pushParams({ ...this.postgrestParams, limit: newSize })
    }
  }
}
</script>

<style lang="scss">
.HummingbirdList {
  height: 100vh;
  overflow: hidden;
  overflow-y: auto;
  .top-level {
    background: #fff;
    border-bottom: 1px solid rgba(0,0,0,0.1);
  }
  .pagination-section {
    position: absolute;
    bottom: 0;
    left: 0;
    background: #fff;
    width: 100vw;
    height: 52px;
    padding: 12px 20px 12px 280px;
    border-top: 1px solid rgba(0,0,0,0.1);
    display: flex;
    flex-direction: row;
    .page-size {
      display: inline;
      margin: -2px 20px 0 0;
    }
  }
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
}
</style>
