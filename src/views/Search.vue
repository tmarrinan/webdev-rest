<script setup>
import { reactive, ref, onMounted } from 'vue'

//Incident upload variables
let caseNum = ref();
let dateI = ref();
let timeI = ref();
let code = ref();
let IncidentName = ref();
let Police_grid = ref();
let NeighNum = ref();
let AddressI = ref();
let dialog_errIncidents = ref(false);
let dialog_success = ref(false);

let crime_url = ref('');
let dialog_err = ref(false);
let location = ref('');
let map = reactive(
    {
        leaflet: null,
        center: {
            lat: 44.955139,
            lng: -93.102222,
            address: ''
        },
        zoom: 12,
        bounds: {
            nw: {lat: 45.008206, lng: -93.217977},
            se: {lat: 44.883658, lng: -92.993787}
        },
        neighborhood_markers: [
            {location: [44.942068, -93.020521], marker: null},
            {location: [44.977413, -93.025156], marker: null},
            {location: [44.931244, -93.079578], marker: null},
            {location: [44.956192, -93.060189], marker: null},
            {location: [44.978883, -93.068163], marker: null},
            {location: [44.975766, -93.113887], marker: null},
            {location: [44.959639, -93.121271], marker: null},
            {location: [44.947700, -93.128505], marker: null},
            {location: [44.930276, -93.119911], marker: null},
            {location: [44.982752, -93.147910], marker: null},
            {location: [44.963631, -93.167548], marker: null},
            {location: [44.973971, -93.197965], marker: null},
            {location: [44.949043, -93.178261], marker: null},
            {location: [44.934848, -93.176736], marker: null},
            {location: [44.913106, -93.170779], marker: null},
            {location: [44.937705, -93.136997], marker: null},
            {location: [44.949203, -93.093739], marker: null}
        ]
    }
);

// Vue callback for once <template> HTML has been added to web page
onMounted(() => {
    // Create Leaflet map (set bounds and valied zoom levels)
    map.leaflet = L.map('leafletmap').setView([map.center.lat, map.center.lng], map.zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 11,
        maxZoom: 18
    }).addTo(map.leaflet);
    map.leaflet.setMaxBounds([[44.883658, -93.217977], [45.008206, -92.993787]]);

    // Get boundaries for St. Paul neighborhoods
    let district_boundary = new L.geoJson();
    district_boundary.addTo(map.leaflet);
    fetch('data/StPaulDistrictCouncil.geojson')
    .then((response) => {
        return response.json();
    })
    .then((result) => {
        result.features.forEach((value) => {
            district_boundary.addData(value);
        });
    })
    .catch((error) => {
        console.log('Error:', error);
    });
});


// FUNCTIONS http://localhost:8001/codes
// Function called once user has entered REST API URL
function initializeCrimes() {
    // TODO: get code and neighborhood data
    //       get initial 1000 crimes
    fetch(crime_url.value)
    .then((response) => {
        return response.json();
    })
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.log('Error:', error);
    });
}

// Function called when user presses 'OK' on dialog box
function closeDialog() {
    let dialog = document.getElementById('rest-dialog');
    let url_input = document.getElementById('dialog-url');
    let loc_input = document.getElementById('dialog-loc');
    if(loc_input.value !== ''){
        locationTest(loc_input.value);
    }
    /*/
    if (crime_url.value !== '' && url_input.checkValidity()) {
        dialog_err.value = false;
        dialog.close();
        initializeCrimes();
    }
    else {
        dialog_err.value = true;
    }
    //*/
}

//in search bar try "Frogtown, MN"
function locationTest(loc){
    let url = 'https://nominatim.openstreetmap.org/search?q='+loc+'&format=json&&limit=1';
    fetch(url)
    .then((response)=>{
        return response.json();
    })
    .then((data)=>{
        if(data.length > 0){
            let lat = data[0].lat;
            let lon = data[0].lon;
            map.leaflet.setView([lat, lon], 14);
        }else{
            console.log("Not found");
        }
        console.log(data);
    })
    .catch((error)=>{
        console.log('Error:', error);
    });
}

//Upload incidents to database
//TODO: check to see if the data already exist when submit a new one
function uploadIncidents(){
    let formValues = {"case_number": caseNum.value, "date": dateI.value, "time": timeI.value, "code": code.value, "incident": IncidentName.value, "police_grid": Police_grid.value, "neighborhood_number": NeighNum.value, "block": AddressI.value};
    console.log("stuff: "+ caseNum.value, dateI.value, timeI.value, code.value, IncidentName.value, Police_grid.value, NeighNum.value, AddressI.value);

    let valueCheck = [caseNum.value, dateI.value, timeI.value, code.value, IncidentName.value, Police_grid.value, NeighNum.value, AddressI.value];
    //check to see if one of them is undefined.
    // curl -X PUT "http://localhost:8000/new-incident" -H "Content-Type: application/json" -d "{\"case_number\": 999999999, \"date\": \"2023-11-18\", \"time\": \"20:48:53\", \"code\": 23, \"incident\": \"Stole my heart\", \"police_grid\": 119, \"neighborhood_number\": 1, \"block\": \"4XX LUELLA ST\"}"
    if (!valueCheck.includes(undefined)) {
        dialog_errIncidents.value = false;
        dialog_success.value = true;
        const response = fetch('http://localhost:8001/new-incident', { 
            method: 'PUT', 
            headers: { 
                'Content-type': 'application/json'
            }, 
            body: JSON.stringify(formValues) 
        }); 
            
            // Awaiting response.json() 
            const resData = response; 
        
            // Return response data  
            return resData; 
    }else{
        dialog_errIncidents.value = true;
        dialog_success.value = false;
        //window.location.href = "https://www.youtube.com/watch?v=oHg5SJYRHA0";
    }
}
</script>

<template>
    <dialog id="rest-dialog" open>
        <h1 class="dialog-header">St. Paul Crime REST API</h1>
        <label class="dialog-label">Location: </label>
        <!-- <input id="dialog-url" class="dialog-input" type="url" v-model="crime_url" placeholder="http://localhost:8000" /> -->
        <input id="dialog-loc" class="dialog-input" v-model="location" placeholder="Enter a location" />
        <p class="dialog-error" v-if="dialog_err">Error: must enter valid URL</p>
        <br/>
        <button class="button" type="button" @click="closeDialog">GO</button>
    </dialog>
    <div class="grid-container ">
        <div class="grid-x grid-padding-x">
            <div id="leafletmap" class="cell auto"></div>
        </div>
    </div>

    <form class="uploadForm">
        <h1>Upload Incidents</h1>
        <p class="dialog-error" v-if="dialog_errIncidents">Error: One or more inputs are not filled in.</p>
        <p class="dialog-success" v-if="dialog_success" style="color: green">Success!</p>
        <label for="caseNum">Case Number:</label><br>
        <input type="number" id="caseNum" name="caseNum" minlength="8" maxlength="8" required v-model="caseNum"><br>

        <label for="date">Date of Incident:</label><br>
        <input type="date" id="date" name="date" required v-model="dateI"><br>

        <label for="time">Time of Incident:</label><br>
        <input type="time" id="time" name="time" required v-model="timeI"><br>

        <label for="code">Code:</label><br>
        <input type="number" id="code" name="code" required v-model="code"><br>

        <label for="Incident">What was the Incident?:</label><br>
        <input type="text" id="Incident" name="Incident" required v-model="IncidentName"><br>

        <label for="Police_grid">Police_grid:</label><br>
        <input type="number" id="Police_grid" name="Police_grid" required v-model="Police_grid"><br>

        <label for="neighborhoodNum">Neighborhood Number:</label><br>
        <input type="number" id="neighborhoodNum" name="neighborhoodNum" required v-model="NeighNum"><br>

        <label for="address">Address of the Incident taken place:</label><br>
        <input type="text" id="address" name="address" required v-model="AddressI"><br>

        <button class="button" type="button" @click="uploadIncidents">Upload</button>

    </form> 
</template>

<style scoped>
#rest-dialog {
    width: 20rem;
    margin-top: 1rem;
    z-index: 1000;
}

#leafletmap {
    margin: 60px;
    height: 500px;
}

.dialog-header {
    font-size: 1.2rem;
    font-weight: bold;
}

.dialog-label {
    font-size: 1rem;
}

.dialog-input {
    font-size: 1rem;
    width: 100%;
}

.dialog-error {
    font-size: 1rem;
    color: #D32323;
}
/**/
</style>
