<template>
  <div class="Squirrel">

    <nav class="level is-mobile section m-b-none p-b-none">
      <div class="level-left"></div>

      <div class="level-right">
        <p class="m-r-none level-item">
          <router-link tag="a"
            class="super-button button is-medium is-primary is-rounded"
            to="/">
            <span>Upload</span>
            <span class="icon">
              <i class="fas fa-fw fa-upload"></i>
            </span>
          </router-link>
        </p>
      </div>
    </nav>

    <section class="section">

      <nav class="Squirrel--directory box panel p-none">
        <a class="panel-block" v-for="folder in folders" :key="folder.key">
          <span class="panel-icon">
            <i class="fas fa-folder" aria-hidden="true"></i>
          </span>
          {{folder.name}}
        </a>
        <a class="panel-block" v-for="file in files" :key="file.key">
          <span class="panel-icon">
            <i class="fas fa-file" aria-hidden="true"></i>
          </span>
          {{file.name}}
        </a>
      </nav>

    </section>
  </div>
</template>

<script>
import axios from 'axios'
import config from '~/config/default'
import * as S3Helpers from '~/lib/common/s3'
// var AWS = require('aws-sdk')
export default {
  layout: 'squirrel',
  async asyncData ({ store, params }) {
    let { appId } = params
    let pollyApp = store.getters['app'](appId)


    // // Set the region 
    // AWS.config.update({
    //   accessKeyId: pollyApp.config.key,
    //   secretAccessKey: pollyApp.config.secret,
    //   region: pollyApp.config.region
    // });
    // let s3 = new AWS.S3({apiVersion: '2006-03-01'});
    // var bucketParams = {Bucket: pollyApp.config.bucket}
    // let contents = await new Promise((resolve, reject) => {
    //   s3.listObjects(bucketParams, (err, data) => {
    //     if (err) return reject(err)
    //     else return resolve(data)
    //   })
    // }).catch(err => console.log('err', err))
    
    // let standardizedContents = S3Helpers.standardizeFormat(contents)

    return {
      // pollyApp: pollyApp,
      // contents: standardizedContents || []
    }
  },
  computed: {
    folders () {
      return this.contents.filter(x => x.isFolder)
    },
    files () {
      return this.contents.filter(x => !x.isFolder)
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
.Squirrel {
  &--directory {
    overflow: hidden;
  }
}
</style>
