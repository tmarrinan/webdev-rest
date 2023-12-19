<!-- NewIncidentForm.vue -->

<template>
    <div class="popup">
      <form @submit.prevent="submitForm">
        <div class="pads">
            <h4>New Incident Form</h4>
        </div>
        <div class="pads">
            <label for="case_number">Case Number:</label>
            <input v-model="formData.case_number" type="text" id="case_number" required />
        </div>
        <div class="pads">
            <label for="date_time">Date/Time:</label>
            <input v-model="formData.date_time" type="datetime-local" id="date_time" required />
        </div>
        <div class="pads">
            <label for="code">Code:</label>
            <input v-model="formData.code" type="number" id="code" required />
        </div>
        <div class="pads">
            <label for="incident">Incident:</label>
            <input v-model="formData.incident" type="text" id="incident" required />
        </div>
        <div class="pads">
            <label for="police_grid">Police Grid:</label>
            <input v-model="formData.police_grid" type="number" id="police_grid" required />
        </div>
        <div class="pads">
            <label for="neighborhood_number">Neighborhood Number:</label>
            <input v-model="formData.neighborhood_number" type="number" id="neighborhood_number" required />
        </div>
        <div class="pads">
            <label for="block">Block:</label>
            <input v-model="formData.block" type="text" id="block" required />
        </div>
        <div style="padding: 10px;">
            <button class="button" type="submit">Submit</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        formData: {
          case_number: "",
          date_time: "",
          code: null,
          incident: "",
          police_grid: null,
          neighborhood_number: null,
          block: "",
          // Add other form fields here
        },
      };
    },
    methods: {
      submitForm() {
        // Call the function to submit the PUT request in app.vue
        this.$emit("submit", this.formData);
      },
    },
  };
  </script>
  
  <!-- NewIncidentForm.vue -->

<style scoped>
.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgb(221, 237, 237);
  padding: 20px;
  border-radius: 10px;
  border-width: 5px;
  border-color: black;
  border-style: solid;
  width: 50%;
  height: 72%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1000; /* Set a value higher than the z-index of the map */
}

.button{
    background-color: white;
    border-radius: 10px;
    color: black;
    border-width: 2px;
    border-color: none;
  }

  .button:hover{
    border-width: 2px;
    border-color: black;
  }
  .pads{
    padding: 5px;
    padding-bottom: 0px;;
  }
</style>
