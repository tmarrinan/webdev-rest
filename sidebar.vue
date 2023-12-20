<script>
import NewIncidentForm from "./NewIncidentForm.vue"
import pageFilters from "./filters.vue"



export default{
    data(){
        return {
          showIncidentForm: false,

            filtered: {
                incidents: [],
                neighborhoods: [],
                startDate: '',
                endDate: '',
                limit: [],
                removed: false
            },
            searchValue: '',
            searchErr: false,
            filters: false,
            showIncidentDropdown: false,
            showNeighborhoodDropdown: false,
            neighborhood_names: {
                'Conway/Battlecreek/Highwood' : 1,
                'Greater East Side' : 2,
                'West Side' : 3,
                'Dayton\'s Bluff' : 4,
                'Payne - Phalen' : 5,
                'North End' : 6,
                'Frogtown' : 7, 
                'Summit - University' : 8,
                'West Seventh' : 9,
                'Como Park' : 10,
                'Hamline - Midway' : 11,
                'St. Anthony Park' : 12,
                'Union Park' : 13,
                'Macalester - Groveland' : 14,
                'Highland' : 15,
                'Summit Hill' : 16,
                'Downtown' : 17
            }
        };
  },
    methods: {
        searchNeighborhood() {
            this.$emit('searchNeighborhood', document.getElementById('neighborhoodInput').value.trim());
        },
        incidentChange(value, targetArray) {
            // ... implementation ...
        },
        neighborhoodChange(value, targetArray) {
            // ... implementation ...
        },
        toggleFilters() {
            // ... implementation ...
        },
        openIncidentForm() {
            // ... implementation ...
        },
    methods: {
   
      incidentChange(value, targetArray) {
      const index = targetArray.indexOf(value);
      if (index !== -1) {
        targetArray.splice(index, 1);
      } else {
        targetArray.push(value);
      }
    },
    
    submitIncident(formData) {
            this.$emit("submitIncident", formData);
            this.showIncidentForm = false;
        },
        
    },
    components: {
        NewIncidentForm,
        pageFilters
    },
    neighborhoodChange(value, targetArray) {
      const index = targetArray.indexOf(value);
      if (index !== -1) {
        targetArray.splice(index, 1);
      } else {
        targetArray.push(value);
      }
    },
    toggleFilters(){
      this.filters = !this.filters;
    },
    openIncidentForm(){
      this.showIncidentForm = true;
    },
    submitIncident(formData){
      this.$emit("submitIncident", formData);
      this.showIncidentForm = false;
    },
  },
  components: {
    NewIncidentForm,
    pageFilters
  },
};


</script>
<template>
    <div style="justify-content: space-evenly;">
        <div class="select">
              <div style="padding-bottom: 5px;">
                    <input id="searchInput" class="dialog-input" style="height: 40px;" v-model="searchValue" placeholder="Neighborhood Name" />
                    <p class="dialog-error" v-if="searchErr">Must Enter a Valid Neighborhood</p>
              </div> 
              <button class="button" type="button" @click="this.$parent.getSearch(searchValue);">Search</button>
        </div>
       
        <div class="select">
            <button class="button" @click="toggleFilters">Filters</button>
            <pageFilters v-if="filters == true"></pageFilters>
        </div>
        <div class="select">
            <button class="button" @click="openIncidentForm">Submit New Incident</button>
            <NewIncidentForm v-if="showIncidentForm" @submits="submitIncident"></NewIncidentForm>
        </div>
    </div>
  </template>
  
  <style scoped>
  div {
    background-color: white;
    width: 100%;
    border-radius: 20px;
    text-align: center;
    padding: 5px;
  }
  
  .select {
    margin-bottom: 40px;
    width: 100%;
    border-radius: 10px;
    font-weight: bold;
  }
  
  /* Style the dropdowns */
  select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  /* Style the date inputs */
  input[type="date"] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .button{
    background-color: rgb(221, 237, 237);
    border-radius: 10px;
    color: black;
    border-width: 2px;
    border-color: none;
  }

  .button:hover{
    border-width: 2px;
    border-color: black;
  }

  .searchButton{
    background-color: rgb(221, 237, 237);
    border-radius: 10px;
    color: black;
    border-width: 2px;
    border-color: none;
  }

  .searchButton:hover{
    background-color: rgb(221, 237, 237);
    border-radius: 10px;
    color: black;
    border-width: 2px;
    border-color: none;
  }

  .search{
    width: 80%
  }

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  padding: 5px;
  z-index: 1;
}

.dropdown-content input[type="checkbox"] {
  display: block;
  margin: 0;
}
  </style>
  