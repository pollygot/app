<template>
  <div class="columns">
    <div class="column is-narrow is-hidden-mobile">
      <div class="sidebar">
        
      </div>
    </div>
    <div class="column">
      <nuxt/>
    </div>
  </div>
</template>

<style lang="scss">
.columns {
  height: 100vh;
}
.sidebar {
  width: 300px;
  background: #333;
  height: 100vh;
}
</style>

