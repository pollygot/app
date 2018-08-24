<template>
  <nav class="custom-nav">
    <div class="navbar-brand">
      <a class="navbar-item">
        <span class="icon is-large"><i class="fas fa-bars"></i></span>
      </a>
    </div>

    <div class="navbar-item navbar-title">
      <span>
        <slot>
          Page Title
        </slot>
      </span>
    </div>
    <a class="navbar-item">
        <span class="icon is-large"><i class="far fa-bell"></i></span>
      </a>
  </nav>
</template>

<style lang="scss" scoped>
.custom-nav {
  background-color: white;
  position: relative;
  z-index: 30;
  min-height: 3.25rem;
  align-items: stretch;
  display: flex;

  .navbar-brand {
    align-items: stretch;
    display: flex;
    flex-shrink: 0;
    min-height: 3.25rem;
  }

  .navbar-item {
    display: flex;
    align-items: center;
    flex-grow: 0;
    flex-shrink: 0;
    color: #4a4a4a;
    line-height: 1.5;
    padding: 0.5rem 0.75rem;
    position: relative;

    &.navbar-title {
      flex-grow: 1;
      text-align: center;
      font-weight: bold;
      justify-content: center;
    }
  }
}
</style>

