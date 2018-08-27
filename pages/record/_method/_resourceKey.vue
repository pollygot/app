<template>
<div>

  <NavBar>
    {{ pageTitle }}
  </NavBar>

  <div class="main">
    <nav class="level is-mobile">
      <div class="level-left"></div>

      <div class="animated zoomInRight level-right">

        <div class="level-item m-r-none ">
          <a class="super-button button is-medium is-primary is-rounded" @click="save()">
            <span>Save</span>
            <span class="icon">
              <i class="fas fa-fw fa-save"></i>
            </span>
          </a>
        </div>
      </div>
    </nav>
    
    <div class="box has-corners">
        <template v-for="field in formattedFields">

          <div class="animated fadeIn field is-horizontal" v-if="field.type === 'enum'" :key="field.key">
            <div class="field-label is-normal">
              <label class="label">{{field.label}}</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control select is-fullwidth">
                  <select v-model="field.value">
                    <option
                      v-for="(e, i) in field.enum"
                      :key="field.key + 'enum' + i"
                    >{{e}}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="animated fadeIn field is-horizontal" v-else-if="field.type === 'integer'" :key="field.key">
            <div class="field-label is-normal">
              <label class="label is-capitalized">{{field.label}}</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control is-expanded">
                  <input class="input is-fullwidth" type="number" :placeholder="field.value" v-model="field.value">
                </p>
              </div>
            </div>
          </div>

          <div class="animated fadeIn field is-horizontal" v-else-if="field.type === 'boolean'" :key="field.key">
            <div class="field-label is-normal">
              <label class="label is-capitalized">{{field.label}}</label>
            </div>
            <div class="field-body">
              <div class="field p-t-sm">
                <input class="is-checkradio" :id="'chk'+field.key" type="checkbox" :name="'chk'+field.key"  v-model="field.value">
                <label :for="'chk'+field.key" class="m-none"></label>
              </div>
            </div>
          </div>

          <div class="animated fadeIn field is-horizontal" v-else-if="field.type === 'timestamp'" :key="field.key">
            <div class="field-label is-normal">
              <label class="label is-capitalized">{{field.label}}</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p>
                  <input class="input is-fullwidth" type="datetime-local" :placeholder="field.value" v-model="field.value">
                </p>
              </div>
            </div>
          </div>

          <div class="animated fadeIn field is-horizontal" v-else-if="field.type === 'json'" :key="field.key">
            <div class="field-label is-normal">
              <label class="label is-capitalized">{{field.label}}</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control is-expanded">
                  <textarea class="textarea is-small is-fullwidth" :placeholder="field.value" v-model="field.value" rows="15"></textarea>
                </p>
              </div>
            </div>
          </div>

          <div class="animated fadeIn field is-horizontal" v-else :key="field.key">
            <div class="field-label is-normal">
              <label class="label is-capitalized">{{field.label}}</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control is-expanded">
                  <input class="input is-fullwidth" type="text" :placeholder="field.value" v-model="field.value">
                </p>
              </div>
            </div>
          </div>

        </template>
    </div>

  </div>

</div>
</template>

<script>
import NavBar from '~/components/NavBar.vue'
import { calulateDisplayTypeFromSwaggerInfo, enrichSwaggerField } from '~/lib/helpers'
export default {
  components: { NavBar },
  async asyncData ({ app, params, query, route }) {
    let isCreated = false
    let record = {}
    if (params.method === 'edit') {
      isCreated = true
      let postgrestUrl = `${process.env.POSTGREST_URL}/${params.resourceKey}`
      let selector = route.fullPath.split('?')[1]
      let fullUrl = `${postgrestUrl}?${selector}`
      record = await app.$axios.$get(fullUrl, {
        'headers': { 'Accept': 'application/vnd.pgrst.object+json' }
      })
    }
    let availableFields = app.store.getters['resources/columnsForResource'](params.resourceKey)
    let formattedFields = availableFields
      .map(x => calulateDisplayTypeFromSwaggerInfo(x)) // try figure out how each field should be displayed
      .map(x => (Object.assign({ value:record[`${x.key}`] }, x))) // add the current value to each field
      .map(x => enrichSwaggerField(x)) // add useful data to each field. eg, add Date() to timestamp strings

    return {
      availableFields: availableFields,
      formattedFields: formattedFields,
      isCreated: isCreated,
      pageTitle: params.resourceKey.replace(/_/g, ' '),
      primaryKeys: app.store.getters['resources/primaryKeysForResource'](params.resourceKey) || [],
      record: record,
      resourceKey: params.resourceKey,
    }
  },
}
</script>

<style>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

