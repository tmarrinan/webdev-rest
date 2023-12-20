<template>
  <div class="top-bar" id="responsive-menu">
    <div class="top-bar-left">
      <ul class="dropdown menu">
        <li class="menu-text">St. Paul Crime Data</li>
        <li><router-link to="/" class="navBarLink">Home</router-link></li>
        <li><router-link to="/About" class="navBarLink">About</router-link></li>
      </ul>
    </div>
  </div>
  <router-view />
</template>

<style scoped>
.menu-text {
  font-size: 1.6rem;
}

.navBarLink {
  color: black;
  font-weight: bold;
  font-size: 1rem;
  margin-top: 0.5rem;
  margin-right: 10px; /* Add space between links using margin */
  border: 1px solid #ccc;
  padding: 8px 12px;
  border-radius: 4px;
}

.navBarLink:hover {
  color: rgba(0, 183, 255);
  background-color: #f0f0f0;
}
</style>