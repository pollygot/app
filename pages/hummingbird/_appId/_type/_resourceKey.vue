<template>
<div class="HummingbirdList">

  <div class="">
    <div class="top-level m-b-md">
      <nav class="level is-mobile p-lg m-none">
        <div class="level-left">
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
                    <span class="is-capitalized">{{currentViewType.toLowerCase()}}</span>
                  </button>
                </div>
                <div class="dropdown-menu" role="menu">
                  <div class="dropdown-content">

                    <!-- CARD fields -->
                    <div v-show="currentViewType === VIEW_TYPES.CARDS">
                      <p class="dropdown-item heading is-size-7" v-show="potentialImageColumns.length">Set card image</p>
                      <a class="dropdown-item" v-for="(col, i) in potentialImageColumns" :key="i" @click="changeCardImage(col.key)">
                        <span :class="{'has-text-primary': col.key === viewParams.image_key}">{{col.label}}</span>
                      </a>
                      <a class="dropdown-item has-text-danger" 
                        v-show="potentialImageColumns.length && viewParams.image_key"
                        @click="changeCardImage(null)">Remove</a>
                      <hr class="dropdown-divider">
                    </div>
                    <!-- CALENDAR fields -->
                    <div v-show="currentViewType === VIEW_TYPES.CALENDAR">
                      <p class="dropdown-item heading is-size-7">Pivot</p>
                      <a class="dropdown-item" 
                        v-for="column in dateColumns" 
                        :key="column.key"
                        @click="changeCalendarPivot(column.key)"
                        :class="{'has-text-primary': column.key === viewParams.pivotKey}">
                        {{column.label}}
                      </a>
                      <hr class="dropdown-divider">
                    </div>
                    <!-- KANBAN fields -->
                    <div v-show="currentViewType === VIEW_TYPES.KANBAN">
                      <div v-show="enumColumns.length">
                        <p class="dropdown-item heading is-size-7">Pivot</p>
                        <a class="dropdown-item" 
                          v-for="column in enumColumns" 
                          :key="column.key"
                          @click="changeKanbanPivot(column.key)"
                          :class="{'has-text-primary': column.key === viewParams.pivotKey}">
                          {{column.label}}
                        </a>
                        <hr class="dropdown-divider">
                      </div>
                    </div>

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

          <!--START CALENDAR fields -->
          <div class="level-item field is-grouped" v-show="currentViewType === VIEW_TYPES.CALENDAR">
            <div class="control">
              <datepicker :inputClass="'is-small'" :value="viewParams.date" @onChange="changeCalendarDate"></datepicker>
            </div>
          </div>
          <!--END CALENDAR fields -->


        </div>
        <div class="level-right">
          <div class="m-r-none level-item">
            <router-link tag="a" v-show="!currentResource.isViewOnly"
              class="super-button button is-medium is-primary is-rounded"
              :to="`/hummingbird/${appId}/record/new/${resourceKey}`">
              <span>New</span>
              <span class="icon">
                <i class="fas fa-fw fa-arrow-right"></i>
              </span>
            </router-link>
            <a v-show="currentResource.isViewOnly" class="button is-dark is-rounded is-outlined is-small" @click="$toast.show(READ_ONLY_MESSAGE, { duration: TOAST_DURATION })">
              <span>READ ONLY</span>
            </a>
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


    <div class="p-none m-md m-b-xl" v-if="!records.length">
      <h3 class="title is-5 has-text-centered m-xl">No records found</h3>
    </div>

    <div class="table-box box p-none m-md m-b-xxl" v-if="currentViewType === VIEW_TYPES.GRID && records.length" :key="tableComponentMounted">
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

    <div class="p-none m-md m-b-xxl" v-if="currentViewType === VIEW_TYPES.CARDS && records.length" :key="cardsComponentMounted">
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

    <div class="" v-if="currentViewType === VIEW_TYPES.CALENDAR" :key="calendarComponentMounted">
      <Calendar 
        v-if="viewParams.date && viewParams.pivotKey"
        :date="viewParams.date"
        :columns="viewParams.columns"
        :pivotKey="viewParams.pivotKey"
        :records="records"
        @onChange="({ record, column, date }) => { this.updateRecordField(record, column, date) }"
        @onRecordClicked="goToRecord"
      />
      <div v-show="dateColumns.length && (!viewParams.date || !viewParams.pivotKey)">
        <h3 class="title is-5 has-text-centered m-t-xl">Pick a date and a pivot column</h3>
        <p class="has-text-centered">Use the menu above to customise your view.</p>
      </div>
      <div v-show="!dateColumns.length">
        <h3 class="title is-5 has-text-centered m-t-xl">There aren't any date columns in this table to pivot</h3>
        <p class="has-text-centered">We need a date column to build the calendar view.</p>
      </div>
    </div>

    <div class="" v-if="currentViewType === VIEW_TYPES.KANBAN && records.length" :key="kanbanComponentMounted">
      <Kanban
        v-if="viewParams.pivotKey"
        :pivotKey="viewParams.pivotKey"
        :columns="viewParams.columns"
        :records="records"
        @onChange="({ record, column, value }) => { this.updateRecordField(record, column, value) }"
      />
      <div v-show="!viewParams.pivotKey && enumColumns.length">
        <h3 class="title is-5 has-text-centered m-t-xl">Select a field you'd like to pivot on</h3>
        <p class="has-text-centered">Use the menu above to customise your view.</p>
      </div>
      <div v-show="!enumColumns.length">
        <h3 class="title is-5 has-text-centered m-t-xl">There aren't any columns in this table to pivot</h3>
        <p class="has-text-centered">You can only pivot on columns with pre-defined database types.. for now :)</p>
      </div>
    </div>

  </div>

  <ColumnsPanel
    :columns="viewParams.columns"
    :key="columnsComponentMounted"
    :isVisible="visiblePanel === PANELS.COLUMNS"
    @onApply="updateColumns"
    @onHidePanel="() => { visiblePanel = null }"
  />
  <FilterPanel
    :allColumns="viewParams.columns"
    :isVisible="visiblePanel === PANELS.FILTERS"
    :existingFilters="filteredColumns"
    :key="filterComponentMounted"
    @onFilter="filterColumns"
    @onHidePanel="() => { visiblePanel = null }"
  />
  <JoinPanel
    :allTables="allTables"
    :base="resourceKey"
    :key="joinComponentMounted"
    :isVisible="visiblePanel === PANELS.JOINS"
    @onHidePanel="() => { visiblePanel = null }"
  />
  <SortPanel
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
import flat                     from 'flat'
import moment                   from 'moment'
import json2csv                 from 'json2csv'
import * as Helpers             from '~/lib/common/helpers'
import * as PostgrestHelpers    from '~/lib/common/postgrestHelpers'
import Calendar                 from '~/components/Calendar.vue'
import CardList                 from '~/components/CardList.vue'
import ColumnsPanel             from '~/components/hummingbird/ColumnsPanel.vue'
import Datepicker               from '~/components/inputs/Datepicker.vue'
import FilterPanel              from '~/components/hummingbird/FilterPanel.vue'
import JoinPanel                from '~/components/hummingbird/JoinPanel.vue'
import Kanban                   from '~/components/Kanban.vue'
import Pagination               from '~/components/Pagination.vue'
import SortPanel                from '~/components/hummingbird/SortPanel.vue'
import Table                    from '~/components/Table.vue'


const CALENDAR_TYPES                = { WEEK: 'week', MONTH: 'month' }
const DEFAULT_OFFSET                = 0 // Pagination
const DEFAULT_PAGINATION_SIZE       = 20 // Pagination
const DOWNLOAD_FORMATS              = { CSV: 'CSV', JSON: 'JSON' }
const ERROR_MESSAGE_NO_PK           = 'Couldn\'t find a primary key'
const ERROR_MESSAGE_NOT_UNIQUE      = 'Couldn\'t get a unique selector. This would cause multiple updates to the database.'
const NUM_SPACES                    = 2 // for tabsToSpaces in text areas
const PANELS                        = { COLUMNS: 'COLUMNS', JOINS: 'JOINS', FILTERS: 'FILTERS', SORTING: 'SORTING',  }
const READ_ONLY_MESSAGE             = 'This resource doesn\'t allow updates'
const SUCCESS_MESSAGE               = 'Saved!'
const TOAST_DURATION                = 4000
const TOAST_ERROR_DURATION          = 4000
const TOAST_SUCCESS_DURATION        = 1000
const TODAY                         = moment()
const VIEW_TYPES                    = { GRID: 'GRID', CALENDAR: 'CALENDAR', CARDS: 'CARDS', KANBAN: 'KANBAN' }

// Dependencies on the constants above
const DEFAULT_QUERY = { 
  select: '*', 
  limit: DEFAULT_PAGINATION_SIZE 
}
const DEFAULT_VIEW_PARAMS = { 
  view: VIEW_TYPES.GRID, 
  columns: [] 
} 
const DEFAULT_VIEW_PARAMS_CALENDAR  = { 
  view: VIEW_TYPES.CALENDAR, 
  type: CALENDAR_TYPES.WEEK, 
  date: TODAY.format('YYYY-MM-DD'), 
  pivotKey: null, 
  columns: [] 
}
const DEFAULT_VIEW_PARAMS_KANBAN  = { 
  view: VIEW_TYPES.KANBAN, 
  pivotKey: null, 
  columns: [] 
}

export default {
  async asyncData ({ app, params, query, store }) {
    let { appId, type, resourceKey } = params
    let { q, v } = query
    let queryParams = DEFAULT_QUERY
    let viewParams = DEFAULT_VIEW_PARAMS
    let allTables = store.getters['hummingbird/tables']

    if (type === 'list') {
      if (typeof q !== 'undefined') queryParams = JSON.parse(Helpers.decrypt(q))
      if (typeof v !== 'undefined') viewParams = JSON.parse(Helpers.decrypt(v))
      if (!viewParams.columns.length) {
        let columns = store.getters['hummingbird/columnsForResource'](resourceKey)
        viewParams = {...viewParams, columns: [...columns]}
      }
    } else if (type === 'view') { // custom view 
      let customView = store.getters['hummingbird/customView'](resourceKey)
      queryParams = (typeof q !== 'undefined') ? JSON.parse(Helpers.decrypt(q)) : {...customView.queryParams}
      viewParams = (typeof v !== 'undefined') ? JSON.parse(Helpers.decrypt(v)) : {...customView.viewParams}
      resourceKey = customView.resourceKey // transfer ownership of the resource key
    }

    // Check if the view overrides any of the query params
    if (viewParams.query) {
      if (viewParams.query.limit) queryParams.limit = viewParams.query.limit
      if (viewParams.query.criteria) queryParams.criteria = viewParams.query.criteria // Just make this an "AND" instead of overide?
    }
    
    // Convert the newParams into a query string for PostgREST
    let postgrestQueryString = ''
    let mutatedParams = {...queryParams}
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
      currentResource: allTables.find(x => (x.key === resourceKey)),
      calendarDateKey: null,
      kanbanPivotKey: null,
      pageTitle: params.resourceKey.replace(/_/g, ' '),
      postgrestParams: queryParams,
      primaryKeys: app.store.getters['hummingbird/primaryKeysForResource'](resourceKey) || [],
      queryEditorMode: false,
      records: response.data,
      resourceKey: params.resourceKey,
      totalRecords: rangeData.totalRecords,
      userModifiedPostgrestParams: JSON.stringify({...queryParams}, null, NUM_SPACES),
      userModifiedPostgrestParamsError: false,
      userModifiedViewParams: JSON.stringify({...viewParams}, null, NUM_SPACES),
      userModifiedViewParamsError: false,
      viewEditorMode: false,
      viewParams: viewParams,
      visiblePanel: null,

      // expose constants
      DEFAULT_OFFSET: DEFAULT_OFFSET,
      DEFAULT_PAGINATION_SIZE: DEFAULT_PAGINATION_SIZE,
      DEFAULT_QUERY: DEFAULT_QUERY,
      DOWNLOAD_FORMATS: DOWNLOAD_FORMATS,
      NUM_SPACES: NUM_SPACES,
      PANELS: PANELS,
      READ_ONLY_MESSAGE: READ_ONLY_MESSAGE,
      TOAST_DURATION: TOAST_DURATION,
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
    dateColumns () {
      return this.viewParams.columns.filter(x => (x.format === 'DATE' || x.format === 'DATETIME')) || []
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
        let query = {}
        query[`${type}`] = JSON.parse(params)
        this.pushEncodedQuery(query)
      }
    },
    calendarSettingsChanged (pivot, dateString) {
      if (pivot && dateString) {
        const DATE_FORMAT = 'YYYY-MM-DD'
        let baseDate = moment(dateString, DATE_FORMAT)
        let rangeStart = baseDate.clone().startOf(this.viewParams.type).format(DATE_FORMAT)
        let rangeEnd = baseDate.clone().endOf(this.viewParams.type).format(DATE_FORMAT)
        let newCriteria = this.generateFilterString([
          { andOr: 'and', key: pivot, is: true, criteria: 'gte', filterString: rangeStart },
          { andOr: 'and', key: pivot, is: true, criteria: 'lt', filterString: rangeEnd },
        ])
        let queryOveride = { limit: '*', criteria: newCriteria }
        this.pushEncodedQuery({
          'v': { ...this.viewParams, date: dateString, pivotKey: pivot, query: queryOveride }
        })
      }
    },
    changeCalendarDate (dateString) {
      this.viewParams.date = dateString
      this.calendarSettingsChanged(this.viewParams.pivotKey, this.viewParams.date)
    },
    changeCalendarPivot (key) {
      this.viewParams.pivotKey = key
      this.calendarSettingsChanged(this.viewParams.pivotKey, this.viewParams.date)
    },
    changeKanbanPivot (key) {
      this.pushEncodedQuery({'v': { ...this.viewParams, pivotKey: key }})
    },
    changeCardImage (columnKey) {
      if (columnKey) this.pushEncodedQuery({'v': { ...this.viewParams, image_key: columnKey }}) 
      else {
        let mutatedParams = { ...this.viewParams }
        delete mutatedParams.image_key
        this.pushEncodedQuery({'v': mutatedParams})
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
        this.pushEncodedQuery({'q': mutatedParams})
      } else {
        let criteria = this.generateFilterString(columns)
        console.log('criteria', criteria)
        this.pushEncodedQuery({'q': { ...this.postgrestParams, criteria: criteria }})
      }
    },
    generateFilterString (columns) {
      console.log('columns', columns)
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
      return PostgrestHelpers.generateFilterString(ors)
    },
    goToRecord (record) {
      if (this.currentResource.isViewOnly) return null
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
      let query = {}
      if (viewType === VIEW_TYPES.CALENDAR) {
        let newViewParams = Object.assign({...DEFAULT_VIEW_PARAMS_CALENDAR}, {columns: this.viewParams.columns})
        query = {'v': newViewParams}
      }
      else if (viewType === VIEW_TYPES.KANBAN) {
        let newViewParams = Object.assign({...DEFAULT_VIEW_PARAMS_KANBAN}, {columns: this.viewParams.columns}) 
        query = {'v': newViewParams}
      }
      else query = {'v': Object.assign({}, {view: viewType}, {columns: this.viewParams.columns})} // only keep the column config
      this.pushEncodedQuery(query)
    },
    paginate (start) {
      this.pushEncodedQuery({'q': { ...this.postgrestParams, offset: start }})
    },
    // stringify, hash and URL encode an object, then assign it to a queryKey, and then update the route
    // eg: @param newParams = { 'v': {...someViewParams} } OR newParams = { 'v': {...someViewParams}, 'q': {...someQueryParams} } 
    pushEncodedQuery (newParams) { 
      let query = {...this.$route.query} || {}
      Object.keys(newParams).forEach(queryKey => {
        if (Object.keys(newParams).length) query[`${queryKey}`] = Helpers.encrypt(JSON.stringify(newParams[`${queryKey}`]))
        else delete query[`${queryKey}`]
      })
      this.$router.push({ path: this.$route.path, query: query })
    },
    sortColumns (columns) {
      this.visiblePanel = null
      if (columns.length) {
        let ordering = columns.map(x => ( `${x.key}.${x.sort}`)).join(',')
        this.pushEncodedQuery({'q': { ...this.postgrestParams, order: ordering }})
      } else {
        let newParams = { ...this.postgrestParams }
        delete newParams.order
        this.pushEncodedQuery({'q': newParams})
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
    toggleVisiblePanel (panelName) {
      let visible = (this.visiblePanel === panelName) ? null : panelName
      this.visiblePanel = visible
    },
    updateColumns (columns) {
      this.visiblePanel = null
      this.pushEncodedQuery({'v': { ...this.viewParams, columns: columns }})
    },
    updateLimit (newSize) {
      this.pushEncodedQuery({'q': { ...this.postgrestParams, limit: newSize }})
    },
    updateRecordField: async function (record, column, value) { // updates an individual field
      let selector = Helpers.encrypt(PostgrestHelpers.getUniqueSelector(this.primaryKeys, record))
      if (!selector) this.$toast.error(ERROR_MESSAGE_NO_PK, { duration: TOAST_ERROR_DURATION })
      else if (!await PostgrestHelpers.verifySelectorReturnsUnique(this, this.appId, this.resourceKey, selector)) {
        this.$toast.error(ERROR_MESSAGE_NOT_UNIQUE, { duration: TOAST_ERROR_DURATION })
      } else {
        let data = {}
        data[`${column}`] = value
        let {data:response} = await PostgrestHelpers.updateRecord(this, this.appId, this.resourceKey, selector, data).catch(this.handleErrorResponse)
        if (response) this.$toast.success(SUCCESS_MESSAGE, { duration: TOAST_SUCCESS_DURATION })
      }
    },
  },

  // View handlers
  layout: 'hummingbird',
  watchQuery: ['q', 'v'],
  components: { 
    Calendar, 
    CardList, 
    ColumnsPanel, 
    Datepicker, 
    FilterPanel, 
    JoinPanel, 
    Kanban, 
    Pagination, 
    SortPanel, 
    Table 
  },
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
  }
  .definitely-has-corners {
    border-radius: 5px !important;
  }
}
</style>
