<template>
<div class="HummingbirdList">

  <div class="">
    <div class="top-level m-b-md">
      <nav class="level is-mobile p-lg m-none">
        <div class="level-left">
          <!--START Generic fields -->
          <!-- <a class="level-item button is-small" @click="toggleVisiblePanel(PANELS.JOINS)" :class="{'is-dark': visiblePanel === PANELS.JOINS}">
            <span class="icon is-small"><i class="fas fa-link"></i></span>
            <span>Joins</span>
          </a> -->
          <a class="level-item button is-small" @click="toggleVisiblePanel(PANELS.COLUMNS)" :class="{'is-dark': visiblePanel === PANELS.COLUMNS}">
            <span class="icon is-small"><i class="fas fa-table"></i></span>
            <span>{{visibleColumns.length + ' columns'}}</span>
          </a>
          <a class="level-item button is-small" @click="toggleVisiblePanel(PANELS.FILTERS)" :class="{'is-dark': visiblePanel === PANELS.FILTERS}">
            <span class="icon is-small"><i class="fas fa-filter"></i></span>
            <span>{{filteredColumns.length || 'Filter'}}</span>
          </a>
          <a class="level-item button is-small" @click="toggleVisiblePanel(PANELS.SORTING)" :class="{'is-dark': visiblePanel === PANELS.SORTING}">
            <span class="icon is-small"><i class="fas fa-sort"></i></span>
            <span>{{sortedColumns.length || 'Sort'}}</span>
          </a>
          <div class="level-item field is-grouped">
            <div class="control">
              <div class="dropdown is-hoverable  ">
                <div class="dropdown-trigger">
                  <button class="button is-small" aria-haspopup="true" aria-controls="dropdown-menu6">
                    <span class="icon is-small has-text-grey"><i class="fas fa-cog" aria-hidden="true"></i></span>
                    <span>View</span>
                  </button>
                </div>
                <div class="dropdown-menu" role="menu">
                  <div class="dropdown-content">
                    <p class="dropdown-item heading is-size-7">Download</p>
                    <a class="dropdown-item" @click="downloadRecords(DOWNLOAD_FORMATS.CSV)">CSV</a>
                    <!-- <a class="dropdown-item">JSON</a> -->
                    <hr class="dropdown-divider">
                    <!-- <a class="dropdown-item"><span>Add to favourites</span></a>
                    <a class="dropdown-item"><span>Save as new view</span></a>
                    <a class="dropdown-item"><span>Overwite current view</span></a>
                    <hr class="dropdown-divider"> -->
                    <p class="dropdown-item heading is-size-7">Advanced</p>
                    <a class="dropdown-item" @click="() => {this.queryEditorMode = true}"><span>Query editor</span></a>
                    <a class="dropdown-item" @click="() => {this.viewEditorMode = true}"><span>View editor</span></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--END Generic fields -->

          <!--START CARD fields -->
          <div class="level-item field is-grouped" v-show="currentViewType === VIEW_TYPES.CARDS">
            <div class="control">
              <div class="dropdown is-hoverable  ">
                <div class="dropdown-trigger">
                  <button class="button is-small" aria-haspopup="true" aria-controls="dropdown-menu6">
                    <span class="icon is-small has-text-grey"><i class="fas fa-th"></i></span>
                    <span>Cards</span>
                  </button>
                </div>
                <div class="dropdown-menu" role="menu">
                  <div class="dropdown-content">
                    <p class="dropdown-item heading is-size-7">Card size</p>
                    <a class="dropdown-item"><span>Small</span></a>
                    <a class="dropdown-item"><span>Medium</span></a>
                    <a class="dropdown-item"><span>Large</span></a>
                    <hr class="dropdown-divider" v-show="potentialImageColumns.length">
                    <p class="dropdown-item heading is-size-7" v-show="potentialImageColumns.length">Set card image</p>
                    <a class="dropdown-item" v-for="(col, i) in potentialImageColumns" :key="i" @click="changeCardImage(col.key)">
                      <span :class="{'has-text-primary': col.key === viewParams.image_key}">{{col.label}}</span>
                    </a>
                    <a class="dropdown-item has-text-danger" 
                      v-show="potentialImageColumns.length && viewParams.image_key"
                      @click="changeCardImage(null)">Remove</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--END CARD fields -->

          <!--START KANBAN fields -->
          <div class="level-item field is-grouped" v-show="currentViewType === VIEW_TYPES.KANBAN">
            <div class="control">
              <div class="dropdown is-hoverable">
                <div class="dropdown-trigger">
                  <button class="button is-small" aria-haspopup="true" aria-controls="dropdown-menu6">
                    <span class="icon is-small has-text-grey"><i class="fas fa-columns"></i></span>
                    <span>Kanban</span>
                  </button>
                </div>
                <div class="dropdown-menu" role="menu">
                  <div class="dropdown-content">
                    <p class="dropdown-item heading is-size-7">Pivot</p>
                    <a class="dropdown-item" 
                      v-for="column in enumColumns" 
                      :key="column.key"
                      @click="changeKanbanPivot(column.key)"
                      :class="{'has-text-primary': column.key === viewParams.pivot_key}">
                      {{column.label}}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--END KANBAN fields -->

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
          <li :class="{'is-active': (currentViewType === VIEW_TYPES.CARDS)}"><a @click="goToView(VIEW_TYPES.CARDS)">Cards</a></li>
          <li :class="{'is-active': (currentViewType === VIEW_TYPES.CALENDAR)}"><a @click="goToView(VIEW_TYPES.CALENDAR)">Calendar</a></li>
          <li :class="{'is-active': (currentViewType === VIEW_TYPES.KANBAN)}"><a @click="goToView(VIEW_TYPES.KANBAN)">Kanban</a></li>
        </ul>
      </div>
    </div>

    <div class="box m-md" v-show="queryEditorMode">
      <textarea class="textarea has-text-mono" v-model="userModifiedPostgrestParams" @keydown="(e) => Helpers.tabsToSpaces(e, NUM_SPACES)"></textarea>
      <p class="help is-danger"><span v-show="!Helpers.isValidJsonObject(userModifiedPostgrestParams)">There is an error in your syntax.</span>&nbsp;</p>
      <div class="buttons is-right m-t-md">
        <span class="button is-rounded is-outlined is-small"
          @click="() => { this.queryEditorMode = false }">Hide</span>
        <span class="button is-rounded is-outlined is-small"
          @click="() => { this.userModifiedPostgrestParams = JSON.stringify(this.postgrestParams, null, 2) }">Revert changes</span>
        <span class="button is-rounded is-small is-outlined"
          :class="[ Helpers.isValidJsonObject(userModifiedPostgrestParams) ? 'is-dark' : 'is-danger' ]"
          @click="() => {this.applyManualParams('q', this.userModifiedPostgrestParams)}">Apply</span>
      </div>
    </div>

    <div class="box m-md " v-show="viewEditorMode">
      <textarea class="textarea has-text-mono" v-model="userModifiedViewParams" @keydown="(e) => Helpers.tabsToSpaces(e, NUM_SPACES)"></textarea>
      <p class="help is-danger"><span v-show="!Helpers.isValidJsonObject(userModifiedViewParams)">There is an error in your syntax.</span>&nbsp;</p>
      <div class="buttons is-right m-t-md">
        <span class="button is-rounded is-outlined is-small"
          @click="() => { this.viewEditorMode = false }">Hide</span>
        <span class="button is-rounded is-outlined is-small"
          @click="() => { this.userModifiedViewParams = JSON.stringify(this.viewParams, null, 2) }">Revert changes</span>
        <span class="button is-rounded is-small is-outlined"
          :class="[ Helpers.isValidJsonObject(userModifiedViewParams) ? 'is-dark' : 'is-danger' ]"
          @click="() => {this.applyManualParams('v', this.userModifiedViewParams)}">Apply</span>
      </div>
    </div>

    <div class="table-box box p-none m-md m-b-xxl" v-show="currentViewType === VIEW_TYPES.GRID && records.length" :key="tableComponentMounted">
      <Table
        class=""
        :columns="viewParams.columns"
        :records="records"
        :sortedColumns="sortedColumns"
        tableSize="LARGE"
        @onHeaderClicked="tableHeaderClicked"
        @onRecordClicked="goToRecord"
      />
      <div class="pagination-section" v-show="totalRecords > paginationSize">
        <div class="select page-size">
          <select @change="(e) => updateLimit(e.target.value)">
            <option :selected="postgrestParams.limit === '20'" value="20">20</option>
            <option :selected="postgrestParams.limit === '50'" value="50">50</option>
            <option :selected="postgrestParams.limit === '100'" value="100">100</option>
          </select>
        </div>
        <Pagination
          class="pages"
          :currentRangeStart="postgrestParams.offset || 0"
          :currentRangeEnd="currentRangeEnd"
          :paginationSize="parseInt(postgrestParams.limit) || currentRangeEnd"
          :totalRecords="totalRecords"
          @onNewRangeStart="paginate"
        />
      </div>
    </div>

    <div class="p-none m-md m-b-xxl" v-show="currentViewType === VIEW_TYPES.CARDS && records.length" :key="cardsComponentMounted">
      <CardList
        :imageKey="viewParams.image_key"
        :columns="viewParams.columns"
        :records="records"
        @onRecordClicked="goToRecord"
      />
      <div class="pagination-section" v-show="totalRecords > paginationSize">
        <div class="select page-size">
          <select @change="(e) => updateLimit(e.target.value)">
            <option :selected="postgrestParams.limit === '20'" value="20">20</option>
            <option :selected="postgrestParams.limit === '50'" value="50">50</option>
            <option :selected="postgrestParams.limit === '100'" value="100">100</option>
          </select>
        </div>
        <Pagination
          class="pages"
          :currentRangeStart="postgrestParams.offset || 0"
          :currentRangeEnd="currentRangeEnd"
          :paginationSize="parseInt(postgrestParams.limit) || currentRangeEnd"
          :totalRecords="totalRecords"
          @onNewRangeStart="paginate"
        />
      </div>
    </div>

    <div class="" v-show="currentViewType === VIEW_TYPES.CALENDAR && records.length" :key="calendarComponentMounted">
      <Calendar />
    </div>

    <div class="" v-show="currentViewType === VIEW_TYPES.KANBAN && records.length" :key="kanbanComponentMounted">
      <Kanban
        v-if="viewParams.pivot_key"
        :pivotKey="viewParams.pivot_key"
        :columns="viewParams.columns"
        :records="records"
      />
      <div v-show="!viewParams.pivot_key && enumColumns.length">
        <h3 class="title is-5 has-text-centered m-xl">Select a field you'd like to pivot on.</h3>
        <div class="field has-addons has-addons-centered">
          <div class="control has-icons-left">
            <div class="select">
              <select class="definitely-has-corners" @change="(e) => {this.changeKanbanPivot(e.target.value)}">
                <option :selected="!viewParams.pivot_key">Select field</option>
                <option v-for="column in enumColumns" :value="column.key" :key="column.key" class="is-capitalized" :selected="column.key === viewParams.pivot_key">
                  {{column.label}}
                </option>
              </select>
            </div>
            <div class="icon is-left"><i class="fas fa-columns"></i></div>
          </div>
        </div>
      </div>
      <div v-show="!enumColumns.length">
        <h3 class="title is-5 has-text-centered m-t-xl">There aren't any columns in this table to pivot.</h3>
        <p class="has-text-centered">You can only pivot on columns with pre-defined database types.. for now :)</p>
      </div>
    </div>

    <div class="p-none m-md m-b-xl" v-if="!records.length">
      <h3 class="title is-5 has-text-centered m-xl">No records found</h3>
    </div>

  </div>

  <ColumnsPanel
    :columns="viewParams.columns"
    :key="columnsComponentMounted"
    :isVisible="visiblePanel === PANELS.COLUMNS"
    @onApply="updateColumns"
    @onHidePanel="() => { visiblePanel = null }"
  />
  <PostgrestFilterPanel
    :allColumns="viewParams.columns"
    :isVisible="visiblePanel === PANELS.FILTERS"
    :existingFilters="filteredColumns"
    :key="filterComponentMounted"
    @onFilter="filterColumns"
    @onHidePanel="() => { visiblePanel = null }"
  />
  <PostgrestJoinPanel
    :allTables="allTables"
    :base="resourceKey"
    :key="joinComponentMounted"
    :isVisible="visiblePanel === PANELS.JOINS"
    @onHidePanel="() => { visiblePanel = null }"
  />
  <PostgrestSortPanel
    :allColumns="viewParams.columns"
    :isVisible="visiblePanel === PANELS.SORTING"
    :sortedColumns="sortedColumns"
    :key="sortComponentMounted"
    @onSort="sortColumns"
    @onHidePanel="() => { visiblePanel = null }"
  />

</div>
</template>

<script>
import axios                    from 'axios'
import json2csv                 from 'json2csv'
import * as Helpers             from '~/lib/helpers'
import * as PostgrestHelpers    from '~/lib/postgrestHelpers'
import Calendar                 from '~/components/Calendar.vue'
import CardList                 from '~/components/CardList.vue'
import Kanban                   from '~/components/Kanban.vue'
import Pagination               from '~/components/Pagination.vue'
import ColumnsPanel             from '~/components/hummingbird/ColumnsPanel.vue'
import PostgrestFilterPanel     from '~/components/PostgrestFilterPanel.vue'
import PostgrestJoinPanel       from '~/components/PostgrestJoinPanel.vue'
import PostgrestSortPanel       from '~/components/PostgrestSortPanel.vue'
import Table                    from '~/components/Table.vue'

const DEFAULT_OFFSET                = 0 // Pagination
const DEFAULT_PAGINATION_SIZE       = 20 // Pagination
const DEFAULT_POSTGREST_QUERY       = { select: '*', limit: DEFAULT_PAGINATION_SIZE }
const VIEW_TYPES                    = { GRID: 'GRID', CALENDAR: 'CALENDAR', CARDS: 'CARDS', KANBAN: 'KANBAN' }
const DEFAULT_VIEW_PARAMS           = { view: VIEW_TYPES.GRID, columns: [] } // columns added on load
const NUM_SPACES                    = 2 // for tabsToSpaces in text areas
const PANELS                        = { COLUMNS: 'COLUMNS', JOINS: 'JOINS', FILTERS: 'FILTERS', SORTING: 'SORTING',  }
const DOWNLOAD_FORMATS              = { CSV: 'CSV', JSON: 'JSON' }

export default {
  async asyncData ({ app, params, query, store }) {
    let { appId, resourceKey } = params
    let { q, v } = query
    let newParams = (typeof q !== 'undefined') ? JSON.parse(Helpers.decrypt(q)) : DEFAULT_POSTGREST_QUERY
    let viewParams = (typeof v !== 'undefined') ? JSON.parse(Helpers.decrypt(v)) : DEFAULT_VIEW_PARAMS
    let allTables = store.getters['hummingbird/tables']
    if (!viewParams.columns.length) viewParams = {...viewParams, columns: store.getters['hummingbird/columnsForResource'](resourceKey)}
    
    // let val = function (val) { return val.replace('.net/', '.net/100t/') }
    // console.log('val.toString()', val.toString())

    // Convert the newParms into a query string for PostgREST
    let postgrestQueryString = ''
    let mutatedParams = {...newParams}
    if (mutatedParams.criteria) {
      mutatedParams.or = mutatedParams.criteria
      delete mutatedParams.criteria
    }
    Object.keys(mutatedParams).forEach(key => { postgrestQueryString += `${key}=${mutatedParams[key]}&` })
    postgrestQueryString = postgrestQueryString.substring(0, postgrestQueryString.length - 1) // remove the trailing &

    // Get the data for the page
    let { data:response } = await app.$axios.get(`/api/postgrest/${appId}/${resourceKey}?q=${Helpers.encrypt(postgrestQueryString)}`, {
      'headers': { 'range-unit': 'items', 'prefer': 'count=exact' }
    })
    let rangeData = PostgrestHelpers.getRangeDataFromResponseHeaders(response.headers)
    return {
      allTables: allTables,
      appId: appId,
      currentRangeEnd: rangeData.rangeEnd || 0,
      kanbanPivotKey: null,
      pageTitle: params.resourceKey.replace(/_/g, ' '),
      postgrestParams: newParams,
      queryEditorMode: false,
      records: response.data,
      resourceKey: params.resourceKey,
      totalRecords: rangeData.totalRecords,
      userModifiedPostgrestParams: JSON.stringify({...newParams}, null, NUM_SPACES),
      userModifiedPostgrestParamsError: false,
      userModifiedViewParams: JSON.stringify({...viewParams}, null, NUM_SPACES),
      userModifiedViewParamsError: false,
      viewEditorMode: false,
      viewParams: viewParams,
      visiblePanel: null,

      // expose constants
      DEFAULT_OFFSET: DEFAULT_OFFSET,
      DEFAULT_PAGINATION_SIZE: DEFAULT_PAGINATION_SIZE,
      DEFAULT_POSTGREST_QUERY: DEFAULT_POSTGREST_QUERY,
      DOWNLOAD_FORMATS: DOWNLOAD_FORMATS,
      NUM_SPACES: NUM_SPACES,
      PANELS: PANELS,
      VIEW_TYPES: VIEW_TYPES,

      // give some components keys to force refresh
      calendarComponentMounted: 'calendar' + Date.now(),
      cardsComponentMounted: 'cards' + Date.now(),
      columnsComponentMounted: 'columns' + Date.now(),
      filterComponentMounted: 'filters' + Date.now(),
      joinComponentMounted: 'joins' + Date.now(),
      kanbanComponentMounted: 'kanban' + Date.now(),
      sortComponentMounted: 'sorts' + Date.now(),
      tableComponentMounted: 'records' + Date.now()
    }
  },
  computed: {
    Helpers: { // expose all Helpers to the page
      get() { return Helpers }
    },
    currentViewType () { // GRID, CALENDAR etc
      return this.viewParams.view
    },
    enumColumns () { // Used for pivoting to a Kanban view. Only let the user pivot on predefined database Enums (for now)
      return this.viewParams.columns.filter(x => ('enum' in x)) || []
    },
    filteredColumns () {
      if (!this.isFiltered) return []
      let param = this.postgrestParams.criteria
      return PostgrestHelpers.parseFilterString(param.substring(1, param.length -1))
    },
    isFiltered () {
      return !!this.postgrestParams.criteria
    },
    isSorted () {
      return !!this.postgrestParams.order
    },
    paginationSize () {
      return this.postgrestParams.limit || DEFAULT_PAGINATION_SIZE
    },
    potentialImageColumns () {
      let probableFormat = PostgrestHelpers.VALID_FORMATS.TEXT
      return this.viewParams.columns.filter(x => (x.format === probableFormat))
    },
    sortedColumns () {
      if (!this.isSorted) return []
      let sorting = this.postgrestParams.order.split(',')
      return sorting.map(x => ({ key: x.split('.')[0], sort: x.split('.')[1] }))
    },
    visibleColumns () {
      return this.viewParams.columns.filter(x => !x.hidden)
    }
  },
  methods: {
    applyManualParams (type, params) {
      if (Helpers.isValidJsonObject(params)) {
        this.pushEncodedQuery(type, JSON.parse(params))
      }
    },
    changeKanbanPivot (key) {
      this.pushEncodedQuery('v', { ...this.viewParams, pivot_key: key })
    },
    changeCardImage (columnKey) {
      if (columnKey) this.pushEncodedQuery('v', { ...this.viewParams, image_key: columnKey }) 
      else {
        let mutatedParams = { ...this.viewParams }
        delete mutatedParams.image_key
        this.pushEncodedQuery('v', mutatedParams)
      }
    },
    downloadRecords (format) {
      let fields = this.viewParams.columns.filter(x => (!x.hidden)).map(c => (c.key))
      switch (format) {
        case DOWNLOAD_FORMATS.CSV:
          const json2csvParser = new json2csv.Parser({ fields })
          const csv = json2csvParser.parse(this.records)
          return window.location.href = "data:text/csv," + encodeURIComponent(csv)
        case DOWNLOAD_FORMATS.JSON:
          return null
      }
    },
    filterColumns (columns) {
      this.visiblePanel = null
      if (!columns.length) {
        let mutatedParams = { ...this.postgrestParams }
        delete mutatedParams.criteria
        this.pushEncodedQuery('q', mutatedParams)
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
        this.pushEncodedQuery('q', { ...this.postgrestParams, criteria: criteria })
      }
    },
    goToRecord (record) {
      try {
        let primaryKeys = this.$store.getters['hummingbird/primaryKeysForResource'](this.resourceKey)
        let selectors = primaryKeys.map(x => {
          let pk = record[`${x}`].toString() || null
          if (!pk) throw new Error('Can\'t find a Primary Key for this record')
          return x + '=eq.' + pk
        })
        let q = encodeURIComponent(Helpers.encrypt(selectors.join('&'))) // an occasional "+" appearing when not re-encoded. Not sure why but best to encode again
        let path = `/hummingbird/${this.$route.params.appId}/record/edit/${this.resourceKey}?q=${q}`
        this.$router.push({ path: path })
      } catch (error) {
        console.log('error', error)
      }
    },
    goToView (viewType) {
      this.pushEncodedQuery('v', { ...this.viewParams, view: viewType })
    },
    paginate (start) {
      this.pushEncodedQuery('q', { ...this.postgrestParams, offset: start })
    },
    pushEncodedQuery (queryKey, newParams) { // stringify, hash and URL encode an object, then assign it to a queryKey, and then update the route
      let query = {...this.$route.query} || {}
      if (Object.keys(newParams).length) query[`${queryKey}`] = Helpers.encrypt(JSON.stringify(newParams))
      else delete query[`${queryKey}`]
      this.$router.push({ path: this.$route.path, query: query })
    },
    sortColumns (columns) {
      this.visiblePanel = null
      if (columns.length) {
        let ordering = columns.map(x => ( `${x.key}.${x.sort}`)).join(',')
        this.pushEncodedQuery('q', { ...this.postgrestParams, order: ordering })
      } else {
        let newParams = { ...this.postgrestParams }
        delete newParams.order
        this.pushEncodedQuery('q', newParams)
      }
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
    updateColumns (columns) {
      this.visiblePanel = null
      this.pushEncodedQuery('v', { ...this.viewParams, columns: columns })
    },
    updateLimit (newSize) {
      this.pushEncodedQuery('q', { ...this.postgrestParams, limit: newSize })
    },
    toggleVisiblePanel (panelName) {
      let visible = (this.visiblePanel === panelName) ? null : panelName
      this.visiblePanel = visible
    },
  },

  // View handlers
  layout: 'hummingbird',
  watchQuery: ['q', 'v'],
  components: { Calendar, CardList, ColumnsPanel, Kanban, Pagination, PostgrestFilterPanel, PostgrestJoinPanel, PostgrestSortPanel, Table },
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
    z-index: 6;
    .page-size {
      display: inline;
      margin: -2px 20px 0 0;
    }
    .pages {
      flex-grow: 2;
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
  .definitely-has-corners {
    border-radius: 5px !important;
  }
}
</style>
