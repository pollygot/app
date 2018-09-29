<template>
<div class="CardList">
  

  <div class="columns is-multiline">

    <div class="column is-4" v-for="(card, i) in records" :key="'card'+i" >
      <a @click="$emit('onRecordClicked', card)">
        <div class="card">
          <div class="card-image" v-if="imageKey">
            <figure class="image is-4by3">
              <img :src="imageKey" alt="card" />
            </figure>
          </div>
          <div class="card-content">
            <div v-for="(column, j) in columns" :key="'col-td'+j" class="field" v-if="card[`${column.key}`] !== null && card[`${column.key}`]">
              <span class="heading has-text-grey-light m-b-none">{{ column.label }}</span>
              <div class="value">{{ card[`${column.key}`].toString() || '&nbsp;' }}</div>
            </div>
          </div>
        </div>
      </a>
    </div>
      
  </div>

</div>
</template>

<script>
export default {
  name: 'CardList',
  props: {
    imageKey: { required: false, type: String }, 
    columns: { required: true, type: Array }, 
    records: { required: true, type: Array }, // the data to be displayed
  },
  data () {
    return { }
  },
  methods: {
  }
}
</script>
<style lang="scss">
.CardList {
  .value {
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
