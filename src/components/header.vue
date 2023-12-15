<template>
    <header class="page-header">
      <h1>Saint Paul Crime</h1>
      <div class="header-controls" v-if="isWideScreen">
        <!-- Drop-downs go here (replace with your actual dropdown components) -->
        <select v-for="index in 5" :key="index">
          <option :value="`Option ${index}`">{{ `Option ${index}` }}</option>
        </select>
        <!-- Original button goes here (replace with your actual button component) -->
        <button @click="handleButtonClick">Original Button</button>
      </div>
      <button v-else @click="toggleMobileControls">Show Controls</button>
      <div class="mobile-controls" v-show="showMobileControls">
        <!-- Drop-downs and button for mobile view go here -->
        <select v-for="index in 5" :key="index">
          <option :value="`Option ${index}`">{{ `Option ${index}` }}</option>
        </select>
        <button @click="handleButtonClick">Mobile Button</button>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isWideScreen: window.innerWidth >= 700,
        showMobileControls: false,
      };
    },
    mounted() {
      window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleResize);
    },
    methods: {
      handleResize() {
        this.isWideScreen = window.innerWidth >= 700;
      },
      toggleMobileControls() {
        this.showMobileControls = !this.showMobileControls;
      },
      handleButtonClick() {
        // Add logic for button click
        console.log('Button clicked!');
      },
    },
  };
  </script>
  
  <style scoped>
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #fff; /* Adjust the color as needed */
    color: #333; /* Adjust the text color as needed */
  }
  
  .header-controls {
    display: flex;
    align-items: center;
  }
  
  .mobile-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  </style>
  