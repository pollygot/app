<template>
<div class="TableComponent">

  <div class="box has-corners" ref="table_element">
      <table class="table is-responsive is-fullwidth is-hoverable" v-bind:class="{ 'is-small': tableSize === 'SMALL' }">
        <thead>
          <tr>
            <th width="20" class="p-r-none">
              <div class="field">
                <input class="is-checkradio is-small" id="exampleCheckbox" type="checkbox" name="exampleCheckbox">
                <label for="exampleCheckbox" class="p-r-none"></label>
              </div>
            </th>
            <th v-for="(column, i) in flattenedColumns" :key="'col-h'+i"  v-if="!column.hidden">
              <a
                @click="$emit('onHeaderClicked', column.key)"
                :class="{
                  'sort-desc': (isSorted(column.key) && sortDirection(column.key) === 'desc'),
                  'sort-asc': (isSorted(column.key) && sortDirection(column.key) === 'asc')
                }"
              >
                {{column.label}}
              </a>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in flattenedRecords" :key="'record-'+index">
            <td class="p-r-none">
              <div class="field">
                <input class="is-checkradio is-small" :id="'check-'+index" type="checkbox" :name="'check-'+index">
                <label :for="'check-'+index" class="p-r-none"></label>
              </div>
            </td>
            <td v-for="(column, i) in columns" :key="'col-td'+i"  @click="$emit('onRecordClicked', record)" v-if="!column.hidden">
              <span>
                {{
                  record[`${column.key}`]
                  || (record[`${column.key}`]) ? record[`${column.key}`].toString() : '&nbsp;'
                }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
  </div>

</div>
</template>

<script>
import moment from 'moment'
import FlattenObject from 'flat'
import PerfectScrollbar from 'perfect-scrollbar'
export default {
  name: 'Table',
  props: {
    columns: { required: true, type: Array },
    records: { required: true, type: Array }, // the data to be displayed
    sortedColumns: { required: false, type: Array },
    tableSize: { required: false, type: String, default: 'SMALL' } // how large the text / cell size is
  },
  computed: {
    flattenedColumns () {
      console.log('flat Columns', this.columns)
      return this.columns
    },
    flattenedRecords () {
      console.log('flat Columns', this.columns)
      return this.records.map(x => FlattenObject(x))
    }
  },
  methods: {
    getDateAndTime (dateString) {
      if (!dateString) return null
      return moment(dateString).format('HH:mm - DD MMM YYYY')
    },
    getDate (dateString) {
      if (!dateString) return null
      return moment(dateString).format('DD MMM YYYY')
    },
    getValue (column, record) {
      let value = record[`${column.key}`]
      if (value && column.modifier) value = column.modifier(value)
      return value
    },
    isSorted (columnName) {
      if (!this.sortedColumns) return false
      return this.sortedColumns.some(x => (x.key === columnName))
    },
    sortDirection (columnName) {
      if (!this.sortedColumns.length) return false
      let col = this.sortedColumns.find(x => (x.key === columnName)) || {}
      return col.sort || 'asc'
    }
  },

  // View handlers
  mounted () {
    let tableElement = this.$refs['table_element']
    if (tableElement) this.tableScroll = new PerfectScrollbar(tableElement, { wheelPropagation: true })
  },
  beforeDestroy () {
    if (this.tableScroll) this.tableScroll.destroy()
    this.tableScroll = null
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.TableComponent {
    
  .box {
    padding: 0;
    position: relative;
    overflow: hidden;
    overflow-x: auto;
    .table {
      &.is-small {
        font-size: 0.8em;
      }
      td {
        cursor: pointer;
        white-space:nowrap;
        figure {
          box-shadow: 0px 0px 3px 2px rgba(0,0,0,0.1) !important;
        }
      }
      th {
        white-space:nowrap;
        a {
          color: #484848;
        }
      }
    }
    a.sort-asc:after {
      content: ' ▾';
    }
    a.sort-desc:after {
      content: ' ▴';
    }
    .switch-field  {
      padding-top: 3px;
      margin-bottom: -3px;
    }
  }

  @media screen and (max-width: 800px) {

    .box {
      a.sort-down:after {
      content: ' ▸';
      }
      a.sort-up:after {
      content: ' ◂';
      }
    }
    .is-responsive {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
      display: block;
      position: relative;
    }
    .is-responsive td:empty:before {
      content: '\00a0';
    }
    .is-responsive th,
    .is-responsive td {
      margin: 0;
      vertical-align: top;
    }
    .is-responsive th {
      text-align: left !important;
      // border: 1px solid #fff;
      width: 100% !important;
    }
    .is-responsive thead {
      border-right: solid 2px #dbdbdb;
      display: block;
      float: left;
    }
    .is-responsive thead tr {
      display: block;
      padding: 0 10px 0 0;
    }
    // .is-responsive thead tr th::before {
    //   content: "\00a0";
    // }
    .is-responsive thead td,
    .is-responsive thead th {
      border-width: 0 0 1px;
    }
    .is-responsive tbody {
      display: block;
      width: auto;
      position: relative;
      overflow-x: auto;
      white-space: nowrap;
    }
    .is-responsive tbody tr {
      display: inline-block;
      vertical-align: top;
    }
    .is-responsive th {
      display: block;
      text-align: right;
    }
    .is-responsive td {
      display: block;
      min-height: 1.25em;
      text-align: left;
    }
    .is-responsive th:last-child,
    .is-responsive td:last-child {
      border-bottom-width: 0;
    }
    .is-responsive tr:last-child td:not(:last-child) {
      border: 1px solid #dbdbdb;
      border-width: 0 0 1px;
    }
    .is-responsive.is-bordered td,
    .is-responsive.is-bordered th {
      border-width: 1px;
    }
    .is-responsive.is-bordered tr td:last-child,
    .is-responsive.is-bordered tr th:last-child {
      border-bottom-width: 1px;
    }
    .is-responsive.is-bordered tr:last-child td,
    .is-responsive.is-bordered tr:last-child th {
      border-width: 1px;
    }
  }
}
</style>
