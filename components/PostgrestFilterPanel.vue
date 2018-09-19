<template>
<div class="PostgrestFilterPanel">

  <div id="PostgrestFilterPanel" class="quickview" :class="{ 'is-active': isVisible }">
    <div class="quickview-body">
      <div class="quickview-block p-md">

        <div class="dropdown is-hoverable m-b-md">
          <div class="dropdown-trigger">
            <button class="button" aria-haspopup="true" aria-controls="dropdown-menu4">
              <span>Filter by</span>
              <span class="icon is-small"><i class="fas fa-angle-down" aria-hidden="true"></i></span>
            </button>
          </div>
          <div class="dropdown-menu">
            <div class="dropdown-content">
              <a class="dropdown-item is-capitalized" 
                v-for="column in allColumns" 
                :key="'sortable'+column.key"
                @click="addFilter(column)"
              >
                {{column.key.replace(/_/g, ' ')}}
              </a>
            </div>
          </div>
        </div>

        <div class="buttons is-right header-buttons">
          <span class="button is-outlined is-rounded is-small " @click="cancel()">Cancel</span>
          <span class="button is-dark is-outlined is-rounded is-small" @click="applyFilters()">Apply</span>
        </div>

        <draggable v-model="newFilters">
          <div class="m-b-sm p-sm drag-container" v-for="(filter, index) in newFilters" :key="'sort'+filter.key+index">
            <button class="delete is-small" @mousedown="remove(index)"></button>
            <div class="and-or-criteria buttons has-addons is-centered m-b-sm" :class="{'hidden': !index}">
              <button class="button is-small is-rounded" @mousedown="changeAndOr(filter, 'and')" :class="{'is-dark': filter.andOr === 'and'}" onClick="">AND</button>
              <button class="button is-small is-rounded" @mousedown="changeAndOr(filter, 'or')" :class="{'is-primary': filter.andOr === 'or'}">OR</button>
            </div>
            <div class="draggable-item box has-corners " >

              <div class="field is-horizontal">
                <div class="field-body">
                  <div class="field has-addons">
                    <p class="control">
                      <span class="select is-small">
                        <select v-model="filter.is">
                          <option :value="true">'{{filter.key.replace(/_/g, ' ').toUpperCase()}}' IS</option>
                          <option :value="false">'{{filter.key.replace(/_/g, ' ').toUpperCase()}}' IS NOT</option>
                        </select>
                      </span>
                    </p>
                    <p class="control is-expanded">
                      <span class="select is-fullwidth is-small">
                        <select v-model="filter.criteria">
                          <option :value="operator.value" v-for="(operator, i) in operators" :key="'operator'+i">
                            {{operator.label}}
                          </option>
                        </select>
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="field">
                <div class="control is-expanded">
                  <input class="input is-small" type="text" :placeholder="operators.find(x => (x.value === filter.criteria)).hint || '... filter'" v-model="filter.filterString" >
                  <p class="help is-danger" v-show="!filter.filterString.length">Required</p>
                </div>
              </div>
            </div>
          </div>
        </draggable>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  name: 'PostgrestFilterPanel',
  props: {
    allColumns: { required: true, type: Array },
    isVisible: { required: true, type: Boolean },
    existingFilters: { required: true, type: Array }
  },
  components: { draggable },
  data () {
    return {
      newFilters: [...this.existingFilters],
      emptyFilter: {
        is: true,
        criteria: 'eq',
        filterString: '',
        andOr: 'and'
      },
      operators: [
        { value: 'eq', label: 'equal to ...', hint: '' },
        { value: 'gt', label: 'greater than ...', hint: '' },
        { value: 'gte', label: 'greater than or equal to ...', hint: '' },
        { value: 'lt', label: 'less than ...', hint: '' },
        { value: 'lte', label: 'less than or equal to ...', hint: '' },
        { value: 'neq', label: 'not equal ...', hint: '' },
        { value: 'like', label: 'like ...', hint: 'LIKE operator (use * in place of %)' },
        { value: 'ilike', label: 'like (insensitive) ...', hint: 'ILIKE operator (use * in place of %)' },
        { value: 'in', label: 'in list ...', hint: 'e.g. id in ... (1,2,3) – supports commas like ("hi,there","yes,you")' },
        { value: 'is', label: 'exactly ...', hint: 'checking for exact equality (null,true,false)' },
        { value: 'cs', label: 'contain ...', hint: 'e.g. tags contain ... {example, new}' },
        { value: 'cd', label: 'contained ...', hint: 'e.g. values contained ... {1,2,3}' },
        { value: 'ov', label: 'overlap ...', hint: 'e.g. Period overlap ... [2017-01-01,2017-06-30]' }
      ]
    }
  },
  methods: {
    addFilter (column) {
      this.newFilters.push({...column, ...this.emptyFilter})
    },
    applyFilters () {
      this.newFilters = this.newFilters.filter(x => (x.filterString.length))
      if (this.newFilters.length) {this.newFilters[0].andOr = 'and'}
      this.$emit('onFilter', this.newFilters)
    },
    cancel () {
      this.newFilters = [...this.existingFilters]
      this.$emit('onHidePanel')
    },
    changeAndOr (filter, andOr) {
      filter.andOr = andOr
    },
    remove (index) {
      console.log('index', index)
      this.newFilters.splice(index, 1)
    },
    sortBy (column, direction) {
      this.newFilters = [...this.newFilters].map(x => {
        if (x.key === column.key) x.sort = direction
        return x
      })
    }
  }
}
</script>
<style lang="scss">
.PostgrestFilterPanel {
  .header-buttons {
    position: absolute;
    top: 18px;
    right: 15px;
  }
  .drag-container {
    position: relative;
    border-radius: 3px;
    border: 1px solid #fff;
    .delete {
      position: absolute;
      top: 0.7rem;
      right: 0.5rem;
    }
    &:hover {
      background: #fefefe;
      border-radius: 3px;
      border: 1px solid rgba(0,0,0,0.1);
    }
    .box:hover {
      cursor: default;
    }
  }
  .hidden {
    visibility: hidden;
  }
  .sortable-chosen, .sortable-drag, .sortable-ghost {
    background: #F5F6FA;
    border-radius: 3px;
    border: 1px solid rgba(0,0,0,0.1);
  }
 
}
</style>

