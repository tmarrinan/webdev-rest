<!-- SelectButton.vue -->
<template>
    <button class="button" type="button" @click="toggleSelectCrime">
      {{ buttonText }}
    </button>
  </template>
  
  <script>
  export default {
    props: {
      address: String, // Assuming 'address' is passed as a prop
      date: String,
      time: String,
      incident: String,
      //delete: Function,
      case_number: String,
      onSelect: Function, // Function to be called when crime is selected
      onUnselect: Function, // Function to be called when crime is unselected
    },
    data() {
      return {
        selected: false,
      };
    },
    methods: {
      toggleSelectCrime() {
        if (!this.selected) {
          // Select logic
          // You can pass the address or any other necessary data to the parent component
          this.onSelect(this.address, this.date, this.time, this.incident, this.case_number);
        } else {
          // Unselect logic
          this.onUnselect(this.case_number, this.selected);
        }
  
        // Toggle the selected state
        this.$emit('selected-updated', this.selected);
      },
    },
    computed: {
      buttonText() {
        return this.selected ? "" : "Select";
      },
    },
  };

  </script>
  
