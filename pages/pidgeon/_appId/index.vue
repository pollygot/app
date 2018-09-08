<template>
  <div class="Pidgeon">
    <section class="section">

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
            <input class="input" type="text" placeholder="URL">
          </p>
          <p class="control">
            <a class="button is-primary">
              SEND
            </a>
          </p>
        </div>
        <div class="">
          <div class="tabs">
            <ul>
              <li :class="{'is-active': (optionsTab === 'OPTIONS')}" @click="optionsTab = 'OPTIONS'"><a>Options</a></li>
              <li :class="{'is-active': (optionsTab === 'BODY')}"><a @click="optionsTab = 'BODY'">Body</a></li>
              <li :class="{'is-active': (optionsTab === 'COLUMNS')}"><a>Columns</a></li>
              <li :class="{'is-active': (optionsTab === 'FILTER')}"><a>Filter</a></li>
              <li :class="{'is-active': (optionsTab === 'SORT')}"><a>Sort</a></li>
              <li :class="{'is-active': (optionsTab === 'HEADERS')}"><a>Headers</a></li>
            </ul>
          </div>
          <div class="" v-show="optionsTab === 'OPTIONS'">

            <div class="field is-horizontal">
              <div class="field-label is-normal"><label class="label">Pagination</label></div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <input class="input" type="number" placeholder="20" value="20">
                  </div>
                </div>
              </div>
            </div>

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
            <li class="is-active">
              <a>
                <span class="icon is-small"><i class="fas fa-align-left"></i></span>
                <span>Response preview</span>
              </a>
            </li>
            <li class="">
              <a>
                <span class="icon is-small"><i class="fas fa-code"></i></span>
                <span>CODE</span>
              </a>
            </li>
          </ul>
        </div>
        <div class="tab-box box">
          <textarea class="textarea has-text-mono" placeholder=""></textarea>
        </div>
      </div>


    </section>
  </div>
</template>

<script>
import axios from 'axios'
import config from '@/config/default'
import { mapActions } from 'vuex'
export default {
  layout: 'pidgeon',
  data () {
    return {
      limit: 20,
      optionsTab: 'OPTIONS',
      responseTab: 'RESPONSE'
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang="scss">
.Pidgeon {
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
