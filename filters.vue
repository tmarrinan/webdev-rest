<script>
  export default {
    data() {
      return {
        checkboxesSection1: {
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
        selectedCheckboxesSection1: [],
  
        checkboxesSection2: {
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
        },
        selectedCheckboxesSection2: [],
  
        startDate: '',
        endDate: '',
  
        selectedOption: '',
      };
    },
    methods: {
      applyFilters() {
        // Handle the logic to apply filters with the selected data
        console.log('Incidents:', this.selectedCheckboxesSection1);
        console.log('Neighborhoods:', this.selectedCheckboxesSection2);
        console.log('Start Date:', this.startDate);
        console.log('End Date:', this.endDate);
        console.log('Selected Option:', this.selectedOption);
      },
    },
  };
</script>
<template>
    <div>
      <!-- Section with 12 checkboxes -->
      <div style="padding: 5px; background-color: rgb(221, 237, 237);">
        <div style="background-color: white;">
            <p>Incidents</p>
            <div v-for="(value, key) in checkboxesSection1" :key="key">
              <input type="checkbox" v-model="selectedCheckboxesSection1" :value="value" />
              {{ key }}
            </div>
        </div>
      </div>
  
      <!-- Section with 17 checkboxes -->
      <div style="padding: 5px; background-color: rgb(221, 237, 237);">
        <div style="background-color: white;">
          <p>Neighborhoods</p>
          <div v-for="(value, key) in checkboxesSection2" :key="key">
            <input type="checkbox" v-model="selectedCheckboxesSection2" :value="value" />
            {{ key }}
          </div>
        </div>
      </div>
  
      <!-- Two date selectors -->
      <div>
        <div>
          <label for="startDate">Select Start Date:</label>
          <input type="date" id="startDate" v-model="startDate" />
        </div>
        <div>
          <label for="endDate">Select End Date:</label>
          <input type="date" id="endDate" v-model="endDate" />
        </div>
      </div>
  
      <!-- Selector with 8 options -->
      <div style="padding-top: 10px; padding-bottom: 10px;">
        <select v-model="selectedOption">
          <option value="">Select Limit</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="250">250</option>
          <option value="500">500</option>
          <option value="1000">1000</option>
        </select>
      </div>
  
      <!-- Button to apply filters -->
      <div>
        <button class="button" @click="applyFilters">Apply Filters</button>
      </div>
    </div>
  </template>
  
  
<style scoped>
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

  p{
    font-size: 20px;
    font-weight: bold;
  }

  .line{
    background-color: black;
    width: 100%;
    height: 3px;
    border-radius: 10px;
  }
  </style>
  