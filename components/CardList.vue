<template>
<div class="CardList">
  

  <div class="columns is-multiline">

    <div class="column is-4" v-for="(card, i) in records" :key="'card'+i" >
      <a @click="$emit('onRecordClicked', card)">
        <div class="card has-corners">
          <div class="card-image" v-if="imageKey && isUrl(card[`${imageKey}`])">
            <figure class="image is-4by3" :style="{'background-image': 'url(' + card[`${imageKey}`] + ')'}">
            <!-- <figure class="image is-4by3"> -->
              <!-- <img v-bind:src="downscaleImage(card[`${imageKey}`], 200)" alt="card" /> -->
            </figure>
          </div>
          <div class="card-content">
            <div v-for="(column, j) in columns" :key="'col-td'+j" class="field" v-if="!column.hidden && card[`${column.key}`] !== null && card[`${column.key}`]">
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
  data() {
    return {}
  },
  methods: {
    downscaleImage(dataUrl, newWidth, imageType, imageArguments) {
      'use strict'
      var image, oldWidth, oldHeight, newHeight, canvas, ctx, newDataUrl

      // Provide default values
      imageType = imageType || 'image/jpeg'
      imageArguments = imageArguments || 0.7

      // Create a temporary image so that we can compute the height of the downscaled image.
      image = new Image()
      image.src = dataUrl
      oldWidth = image.width
      oldHeight = image.height
      newHeight = Math.floor((oldHeight / oldWidth) * newWidth)

      // Create a temporary canvas to draw the downscaled image on.
      canvas = document.createElement('canvas')
      canvas.width = newWidth
      canvas.height = newHeight

      // Draw the downscaled image on the canvas and return the new data URL.
      ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0, newWidth, newHeight)
      newDataUrl = canvas.toDataURL(imageType, imageArguments)
      return newDataUrl
    },
    isUrl(str) {
      return str.indexOf('http') >= 0
    },
  },
}
</script>
<style lang="scss">
.CardList {
  .card-image {
    .image {
      background-size: cover;
      background-position: center;
    }
  }
  .value {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
