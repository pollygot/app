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
  </div>  
</div>
</template>

<script>
import NavBar from '~/components/NavBar.vue'
export default {
  components: {  NavBar },
  watchQuery: ['page'],
  async asyncData ({ app, params }) {
    let fullUrl = `${process.env.POSTGREST_URL}/${params.resourceKey}`
    let records = await app.$axios.$get(fullUrl, {
      'headers': {
        'Range-Unit': 'items',
        'Prefer': 'count=exact'
      }
    })
    return {
      pageTitle: params.resourceKey.replace(/_/g, ' '),
      records: records,
      resourceKey: params.resourceKey
    }
  },
  computed: {
    columns: function () {
      return Object.keys(this.records[0] || [])
    }
  },
  methods: {
    gridRecordClicked: () => {
      console.log('called')
    }
  }
}
</script>

<style lang="scss">
.main {
  margin: 20px;
}
.table-box {
  overflow: scroll;
  td:hover {
    cursor: pointer;
  }
}
</style>

