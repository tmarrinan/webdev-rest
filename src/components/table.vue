<script setup>
defineProps(['crimeTableData', 'deleteIncident', 'plotData']);


const violentCodes = [2619, 810, 861, 862, 863, 100, 110, 120, 210, 220, 400, 410, 411, 412, 420, 421, 422,
                      430, 431, 432, 440, 441, 442, 450, 451, 452, 453, 300, 311, 312, 314, 321, 322, 323, 
                      324, 331, 333, 334, 341, 342, 343, 344, 351, 352, 353, 354, 361, 363, 364, 371, 373, 374];
const propCodes = [1400, 1401, 1410, 1415, 1416, 1420, 1425, 1426, 1430, 1435, 1436, 900, 901, 903, 905, 911, 913,
                   915, 921, 922, 923, 925, 931, 933, 941, 942, 951, 961, 971, 972, 975, 981, 982, 700, 710, 711, 712, 720,
                   721, 722, 730, 731, 732, 600, 603, 611, 612, 613, 614, 621, 622, 623, 630, 631, 632, 633, 640, 641, 642, 643,
                   651, 652, 653, 661, 662, 663, 671, 672, 673, 681, 682, 683, 691, 692, 693, 500, 510, 511, 513, 515, 516,
                   520, 521, 523, 525, 526, 530, 531, 533, 535, 536, 540, 541, 546, 553, 543, 545, 550, 551, 555, 556, 560, 
                   561, 563, 565, 566];
const otherCodes = [9986, 9959, 9954, 3100, 1800, 1810, 1811, 1813, 1814, 1815, 1820, 1822, 1823, 1824, 1825, 1830,
                    1835, 1840, 1841, 1842, 1843, 1844, 1845, 1850, 1855, 1860, 1865, 1870, 1880, 1885];

function getNeighborhood(n_id){
    let neighborhood = "St.Paul";
    if(n_id == 1){
        neighborhood = "Southside";
    }
    if(n_id == 2){
        neighborhood = "Greater East Side";
    }
    if(n_id == 3){
        neighborhood = "West Side";
    }
    if(n_id == 4){
        neighborhood = "Dayton's Bluff";
    }
    if(n_id == 5){
        neighborhood = "Payne-Phalen";
    }
    if(n_id == 6){
        neighborhood = "North End";
    }
    if(n_id == 7){
        neighborhood = "Frogtown";
    }
    if(n_id == 8){
        neighborhood = "Summit - University";
    }
    if(n_id == 9){
        neighborhood = "West Seventh";
    }
    if(n_id == 10){
        neighborhood = "Como Park";
    }
    if(n_id == 11){
        neighborhood = "Hamline - Midway";
    }
    if(n_id == 12){
        neighborhood = "St. Anthony Park";
    }
    if(n_id == 13){
        neighborhood = "Union Park";
    }
    if(n_id == 14){
        neighborhood = "Macalester - Groveland";
    }
    if(n_id == 15){
        neighborhood = "Highland";
    }
    if(n_id == 16){
        neighborhood = "Summit Hill";
    }
    if(n_id == 17){
        neighborhood = "Downtown";
    }
    return neighborhood;
}

function getRowColorClass(code) {
    // Define your logic for assigning colors based on code values
    if (violentCodes.includes(code)) {
        return 'row-color-a';
    } else if (propCodes.includes(code)) {
        return 'row-color-b';
    } else if (otherCodes.includes(code)) {
        return 'row-color-c';
    } else {
        return ''; // Default color or no additional class
    }
}




</script>


<template>

    <div>
        <table v-if="crimeTableData && crimeTableData.length > 0">
            <thead>
                <tr>
                    <th>Case Number</th>
                    <th>Date and Time</th>
                    <th>Code</th>
                    <th>Incident</th>
                    <th>Police Grid</th>
                    <th>Neighborhood</th>
                    <th>Block</th>
                    <th>Plot Data</th>
                    <th>Delete Data</th>
                </tr>
            </thead>
            <tbody>
                <tr style="border-radius: 10px;" v-for="item in crimeTableData" :key="item.case_number" :class="getRowColorClass(item.code)">
                    <td>{{ item.case_number }}</td>
                    <td>{{ item.date_time }}</td>
                    <td>{{ item.code }}</td>
                    <td>{{ item.incident }}</td>
                    <td>{{ item.police_grid }}</td>
                    <td>{{ getNeighborhood(item.neighborhood_number) }}</td>
                    <td>{{ item.block }}</td>
                    <td><button id="plot" class="button button1" type="button" @click="plotData(item.case_number)"><b>!</b></button></td>
                    <td><button id=delete class="button" type="button" @click="deleteIncident(item.case_number)"><b>X</b></button></td>
                </tr>
            </tbody>
        </table>
        <p v-else>Loading Data...</p>
    </div>
</template>


<style scoped>
.row-color-a {
    background-color: rgb(252, 96, 99); /* Set your desired color for code A */
}

.row-color-b {
    background-color: rgb(252, 203, 104); /* Set your desired color for code B */
}

.row-color-c {
    background-color: rgb(104, 252, 161); /* Set your desired color for code C */
}

.row{
    border-radius: 10px;
    border: 1px solid #ccc; /* Add a border for visibility */
}

table {
    border-radius: 10px;
    border-collapse: separate;
    border-spacing: 0 8px;
}


.button{
    background-color: red;
}

.button:hover{
    background-color: red;
}

.button1{
    background-color:darkseagreen;
}

.button1:hover{
    background-color:darkseagreen;
}

/* Add more classes and colors as needed */
</style>