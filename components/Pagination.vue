<template>
<div id="TablePagination" >

  <div class="TablePaginator p-t-none">
    <nav class="pagination is-rounded is-small" role="navigation" aria-label="pagination">
      <a class="pagination-previous" v-if="!isUserOnFirstPage" @click="previousPage()">Previous</a>
      <a class="pagination-next" v-if="!isUserOnLastPage" @click="nextPage()">Next page</a>
      <ul class="pagination-list">
        <li v-show="currentPageNumber > 3">
          <a class="pagination-link" @click="goToPage(1)">1</a>
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li v-for="(page) in pages" :key="'page'+page.number">
          <!-- <span class="pagination-ellipsis" v-if="page.isCurrentPage && page.number !== 1">&hellip;</span>
          <a v-if="page.number === 1 || page.number == pages.length || page.isCurrentPage"
            class="pagination-link"
            v-bind:class="{'is-current': page.isCurrentPage}"
            @click="goToPage(page.number)"
          >{{page.number}}</a>
          <span class="pagination-ellipsis" v-if="page.isCurrentPage && page.number !== pages.length">&hellip;</span> -->
          <a class="pagination-link"
            v-show="(page.number > (currentPageNumber - 3)) && (page.number < (currentPageNumber + 3))"
            v-bind:class="{'is-current': page.isCurrentPage}"
            @click="goToPage(page.number)"
          >{{page.number}}</a>
        </li>
        <li v-show="currentPageNumber < (totalPages - 2)">
        <span class="pagination-ellipsis">&hellip;</span>
          <a class="pagination-link" @click="goToPage(totalPages)">{{totalPages}}</a>
        </li>
      </ul>
    </nav>
  </div>

</div>
</template>

<script>
export default {
  props: {
    currentRangeStart: { required: true, type: Number },
    currentRangeEnd: { required: true, type: Number },
    paginationSize: { required: true, type: Number },
    totalRecords: { required: true, type: Number },
  },
  computed: {
    currentPageNumber: function() {
      return Math.ceil(this.currentRangeEnd / this.paginationSize)
    },
    isUserOnFirstPage: function() {
      return this.currentRangeStart === 0
    },
    isUserOnLastPage: function() {
      return this.currentRangeEnd === this.totalRecords - 1
    },
    pages: function() {
      let pages = []
      for (let i = 0; i < this.totalPages; i++) {
        let pageNumber = i + 1
        let rangeStart = i * this.paginationSize
        let rangeEnd = pageNumber * this.paginationSize - 1
        pages[i] = {
          number: pageNumber,
          isCurrentPage: this.currentRangeStart === rangeStart,
          rangeStart: rangeStart,
          rangeEnd: rangeEnd,
        }
      }
      return pages
    },
    totalPages: function() {
      return Math.ceil(this.totalRecords / this.paginationSize)
    },
  },
  methods: {
    emitNewRangeStart: function(rangeStart) {
      this.$emit('onNewRangeStart', rangeStart)
    },
    goToPage: function(pageNumber) {
      this.emitNewRangeStart((pageNumber - 1) * this.paginationSize)
    },
    nextPage: function() {
      this.emitNewRangeStart(this.currentRangeStart + this.paginationSize)
    },
    previousPage: function() {
      this.emitNewRangeStart(this.currentRangeStart - this.paginationSize)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.pagination-next,
.pagination-previous {
  min-width: 6rem;
}
</style>
