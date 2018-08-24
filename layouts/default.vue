<template>
  <div class="columns is-gapless">
    <div class="column is-narrow is-hidden-mobile">
      <div class="sidebar">

        
        <nav class="navbar">
          <div class="navbar-brand">
            <!-- navbar items, navbar burger... -->
          </div>
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
    border-bottom: 1px solid grey;
    width: 100%;
  }

  .menu {
    margin-top: 50px;
  }
  .menu a {
    padding: 10px 20px;
    text-transform: uppercase;
    font-size: 0.8em;
    border-radius: 0;
    &.is-active, &:hover {
      background: $blue;
      color: #fff;
    } 
  }
}
#content {
  background: #ededed;
  border-left: 1px solid grey;
  box-shadow: 5px 0px 5px rgba(0, 0, 0, 0.1);

  .navbar {
    border-bottom: 1px solid grey;
  }
}
</style>

