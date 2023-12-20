<template>
    <footer class="footer">
      <div class="row">
        <div class="column">
          <p>&copy; 2023 Saint Paul Crime</p>
        </div>
        <div class="column">
          <a href="/src/about.html">About this Project</a>
        </div>
      </div>
    </footer>
  </template>
  
  <script>

  export default {
    name: 'Footer',
  };
  
  </script>
  
  <style scoped>
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff; /* Adjust the color as needed */
    color: #333; /* Adjust the text color as needed */
    padding: 10px;
  }
  </style>
  