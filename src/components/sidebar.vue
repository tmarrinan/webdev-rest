<script>
import NewIncidentForm from "./newIncident.vue"
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
            incident_names: {
                'murder' : [100, 110, 120],
                'Rape' : [210, 220],
                'Robbery' : [300, 311, 312, 314, 321, 322, 323, 324, 331, 333, 334, 341, 342, 343, 344, 351, 352, 353, 354, 361, 363, 364, 371, 373, 374],
                'Aggravated Asssault' : [400, 410, 411, 412, 420, 421, 422, 430, 431, 432, 440, 441, 442, 450, 451, 452, 453],
                'Burglary' : [500, 510, 511, 513, 515, 516, 520, 521, 523, 525, 526, 530, 531, 533, 535, 536, 540, 541, 543, 545, 546, 550, 551, 553, 555, 556, 560, 561, 563, 565, 566],
                'Theft' : [600, 603, 611, 612, 613, 614, 621, 622, 623, 630, 631, 632, 633, 640, 641, 642, 643, 651, 652, 653, 661, 662, 663, 671, 672, 673, 681, 682, 683, 691, 692, 693],
                'Motor Vehicle Theft' : [700, 710, 711, 712, 720, 721, 722, 730, 731, 732],
                'Assault' : [810, 861, 862, 863],
                'Arson' : [900, 901, 903, 905, 911, 913, 915, 921, 922, 923, 925, 931, 933, 941, 942, 951, 961, 971, 972, 975, 981, 982],
                'Criminal Damage to Property' : [1400, 1401, 1410, 1415, 1416, 1420, 1425, 1426, 1430, 1435, 1436],
                'Narcotics' : [1800, 1810, 1811, 1813, 1814, 1815, 1820, 1822, 1823, 1824, 1825, 1830, 1835, 1840, 1841, 1842, 1843, 1844, 1845, 1850, 1855, 1860, 1865, 1870, 1880, 1885],
                'Weapons' : [2619],
                'Death Investigation' : [3100],
                'Proactive Police Visit' : [9954],
                'Community Engagement Event' : [9959],
                'Proactive Foot Patrol' : [9986]
            },
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
        }

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
}


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
        <!-- Dropdown with 12 options
        <div style="padding-bottom: 5px;">
            <button class="button" @click="toggleIncidentDropdown">Select Incidents</button>
            <div v-if="showIncidentDropdown" class="dropdown-content">
                <div v-for="(value, key) in incident_names" :key="key">
                    <input type="checkbox" @change="incidentChange(value, filtered.incidents)"/>{{ key }}
                </div>
            </div>
        </div>

      <div style="padding-bottom: 5px;">
          <button class="button" @click="toggleNeighborhoodDropdown">Select Neighborhoods</button>

          <div v-if="showNeighborhoodDropdown" class="dropdown-content">
              <div v-for="(value, key) in neighborhood_names" :key="key">
                  <input type="checkbox" @change="neighborhoodChange(value, filtered.neighborhoods)"/>{{ key }}
              </div>
          </div>

      </div>
          
      
        <div class="select">
            <label for="date1">Select Start Date:</label>
            <input type="date" id="date1">
        </div>
    
        <div class="select">
            <label for="date2">Select End Date:</label>
            <input type="date" id="date2">
        </div>
  
        <div class="select">
            <select>
                <option value="">Select Limit</option>
                <option value="1">5</option>
                <option value="1">10</option>
                <option value="1">25</option>
                <option value="1">50</option>
                <option value="1">100</option>
                <option value="1">250</option>
                <option value="1">500</option>
                <option value="8">1000</option>
            </select>
        </div> -->
    
        <!-- Submit button -->
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
  