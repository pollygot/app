<template>
  <div class="columns is-gapless">
    <div class="column is-narrow is-hidden-mobile">
      <div class="sidebar">

        
        <nav class="navbar has-text-centered">
          <a class="navbar-item">
            <span class="icon is-large">Home</span>
          </a>
        </nav>

        <aside class="menu">
          <ul class="menu-list">
            <li><a>Dashboard</a></li>
            <li><a class="is-active">Customers</a></li>
          </ul>
        </aside>
      </div>
    </div>
    <div class="column" id="content">
      <nuxt/>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/assets/css/vars.scss';
.columns {
  height: 100vh;
}
.sidebar {
  height: 100vh;
  width: 260px;
  transition: all 0.3s;
  
  .navbar {
    border-bottom: 1px solid $light-grey;
    width: 100%;
    .navbar-item {
      margin-left: auto;
      margin-right: auto;
      &:hover {
        background: none;
      }
    }
  }

  .menu {
    margin-top: 50px;
  }
  .menu a {
    margin: 5px 0;
    padding: 15px 20px;
    text-transform: uppercase;
    font-size: 0.8em;
    border-radius: 0;
    &.is-active, &:hover {
      background: rgba( $blue, 0.05 );
      border-right: 2px solid $primary;
      color: #000;
    } 
  }
}
#content {
  background: #F5F6FA;
  border-left: 1px solid $light-grey;
  box-shadow: 5px 0px 5px rgba(0, 0, 0, 0.1);

  .navbar {
    border-bottom: 1px solid $light-grey;
  }
}
</style>

