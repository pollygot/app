<template>
  <div class="Pidgeon">
    <section class="main">

      <div class="box">
        <div class="field has-addons">
          <p class="control">
            <span class="select">
              <select name="country">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </span>
          </p>
          <p class="control is-expanded">
            <input class="input" type="text" placeholder="URL" :value="nextUrl">
          </p>
          <p class="control">
            <a class="button is-primary" @click="pushParams(updatedParams)">
              SEND
            </a>
          </p>
        </div>
        <div class="">
          <div class="tabs">
            <ul>
              <li :class="{'is-active': (optionsTab === 'BODY')}"><a @click="optionsTab = 'BODY'">Body</a></li>
              <li :class="{'is-active': (optionsTab === 'HEADERS')}" @click="optionsTab = 'HEADERS'"><a>Headers</a></li>
              <li :class="{'is-active': (optionsTab === 'PAGINATION')}" @click="optionsTab = 'PAGINATION'"><a>Pagination</a></li>
              <li :class="{'is-active': (optionsTab === 'COLUMNS')}"><a>Filters</a></li>
            </ul>
          </div>
          <div class="" v-show="optionsTab === 'PAGINATION'">

            <div class="field is-horizontal">
              <div class="field-label is-normal"><label class="label">Limit</label></div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input class="input" type="number" min="1" placeholder="20" v-model="updatedParams.limit">
                  </div>
                  <p class="help">How many records to retrieve in each request.</p>
                </div>
              </div>
            </div>

            <div class="field is-horizontal">
              <div class="field-label is-normal"><label class="label">Offset</label></div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input class="input" type="number" min="1" placeholder="20" v-model="updatedParams.offset">
                  </div>
                  <p class="help">How many records to skip. Useful for pagination.</p>
                </div>
              </div>
            </div>

          </div>
          <div class="" v-show="optionsTab === 'HEADERS'">

            <div class="field is-horizontal">
              <div class="field-label is-normal"><label class="label">Response</label></div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <div class="select is-fullwidth">
                      <select>
                        <option>JSON</option>
                        <option>CSV</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-normal"><label class="label"></label></div>
              <div class="field-body">
                <div class="field">
                  <input id="switchRoundedDefault" type="checkbox" name="switchRoundedDefault" class="switch is-rounded" checked="checked">
                  <label for="switchRoundedDefault">Singular</label>
                  <p class="help">Respond with single object (rather than array)</p>
                </div>
              </div>
            </div>
          </div>

          <div v-show="optionsTab === 'BODY'">
            <div class="field">
              <textarea class="textarea has-text-mono" :placeholder="JSON.stringify({id: '0',name:'Hello', body:'World'}, null, 2)"></textarea>
            </div>
          </div>


        </div>
      </div>

      <div class="Pidgeon__tab-container">
        <div class="tabs is-boxed is-right">
          <ul>
            <li :class="{'is-active': (responseTab === 'RESPONSE')}" @click="responseTab = 'RESPONSE'">
              <a>
                <span class="icon is-small"><i class="fas fa-align-left"></i></span>
                <span>Response</span>
              </a>
            </li>
            <li :class="{'is-active': (responseTab === 'CODE')}" @click="responseTab = 'CODE'">
              <a>
                <span class="icon is-small"><i class="fas fa-code"></i></span>
                <span>CODE</span>
              </a>
            </li>
          </ul>
        </div>
        <div class="tab-box box" v-show="responseTab === 'RESPONSE'">
          <div class="" contenteditable="true" >
            <pre>{{records.length ? JSON.stringify(records, null, 2) : null}}</pre>
          </div>
        </div>
        <div class="tab-box box" v-show="responseTab === 'CODE'">
          <textarea class="textarea has-text-mono" placeholder="TBD"></textarea>
        </div>
      </div>


    </section>
    
  </div>
</template>

<script>
const DEFAULT_OFFSET = 0
const DEFAULT_PAGINATION_SIZE = 20
const DEFAULT_HEADERS = { 'Range-Unit': 'items', 'Prefer': 'count=exact' }
import axios from 'axios'
import * as Helpers from '~/lib/helpers'
import * as Postgrest from '~/lib/postgrest'
export default {
  layout: 'pidgeon',
  components: { },
  watchQuery: ['q'],
  watch: {
    '$route' () {
      Object.assign(this.$data, this.$options.data())
    }
  },
  async asyncData ({app, params, query, store}) {
    let baseUrl = store.getters['pidgeon/baseUrl']
    let fullUrl = `${baseUrl}/${params.resourceKey}`
    let postgrestQueryString = (query.q) ? Helpers.decrypt(query.q) : `select=*&limit=${DEFAULT_PAGINATION_SIZE}&offset=0`
    fullUrl = `${fullUrl}?${postgrestQueryString}`
    let headers = DEFAULT_HEADERS
    let { data:records, headers: responseHeaders } = await axios.get(fullUrl, {
      'headers': headers
    })
    console.log('Postgrest.paramsFromQueryString(postgrestQueryString))', Postgrest.paramsFromQueryString(postgrestQueryString))
    console.log('postgrestQueryString', postgrestQueryString)
    return {
      DEFAULT_OFFSET: DEFAULT_OFFSET,
      DEFAULT_PAGINATION_SIZE: DEFAULT_PAGINATION_SIZE,
      baseUrl: baseUrl,
      headers: headers,
      optionsTab: 'BODY',
      postgrestQueryString: postgrestQueryString,
      previousParams: Postgrest.paramsFromQueryString(postgrestQueryString),
      previousRangeData: Postgrest.getRangeDataFromResponseHeaders(responseHeaders),
      updatedParams: Object.assign({
        limit: DEFAULT_PAGINATION_SIZE,
        offset: DEFAULT_OFFSET
      }, Postgrest.paramsFromQueryString(postgrestQueryString)),
      records: records,
      responseHeaders: responseHeaders,
      responseTab: 'RESPONSE'
    }
  },
  computed: {
    nextUrl: {
      get () {
        let queryString = Helpers.serialize(this.updatedParams)
        return `${this.baseUrl}?${queryString}`
      },
      set () {
        return null
      }
    }
  },
  methods: {
    pushParams (newParams) {
      let route = { path: this.$route.path, query: {} }
      let q = ''
      if (newParams.limit) q += `limit=${newParams.limit}&`
      if (newParams.offset) q += `offset=${newParams.offset}&`
      if (newParams.order) q += `order=${newParams.order}&`
      if (newParams.select) q += `select=${newParams.select}&`
      if (q !== '') route.query.q = Helpers.encrypt(q.substring(0, q.length - 1)) // remove the trailing &
      this.$router.push(route)
    },
  }
}
</script>

<style lang="scss">
.Pidgeon {
  min-height: 100vh;
  &__tab-container {
    .tabs {
      margin: 0 10px;
    }
    .tab-box {
      margin: 0 1px 0 1px;
    }
  }
}

</style>
