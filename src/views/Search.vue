<script setup>
import { reactive, ref, onMounted } from 'vue';
import IncidentTable from '../components/IncidentTable.vue';

let base_url = ref('http://localhost:8001');
let dialog_err = ref(false);
let location = ref('');

// data models
let crimes = ref([]);
let codes = ref([]);
let neighborhoods = ref([]);

let addFilter1 = ref(true);
let myRefs = {addFilter1: addFilter1};

let id = 0;
const tags = ref([]);

let newTag = ref('');

function addTag(filter){
    if(newTag.value == ''){
        return;
    }
    if(filter != null){
        filter.value = false;
    }

    tags.value.push({id: id++, text: newTag.value});
}
function removeTag(tag){
    tags.value = tags.value.filter((t) => t !== tag)
}

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
            {location: [44.942068, -93.020521], marker: 1},
            {location: [44.977413, -93.025156], marker: 2},
            {location: [44.931244, -93.079578], marker: 3},
            {location: [44.956192, -93.060189], marker: 4},
            {location: [44.978883, -93.068163], marker: 5},
            {location: [44.975766, -93.113887], marker: 6},
            {location: [44.959639, -93.121271], marker: 7},
            {location: [44.947700, -93.128505], marker: 8},
            {location: [44.930276, -93.119911], marker: 9},
            {location: [44.982752, -93.147910], marker: 10},
            {location: [44.963631, -93.167548], marker: 11},
            {location: [44.973971, -93.197965], marker: 12},
            {location: [44.949043, -93.178261], marker: 13},
            {location: [44.934848, -93.176736], marker: 14},
            {location: [44.913106, -93.170779], marker: 15},
            {location: [44.937705, -93.136997], marker: 16},
            {location: [44.949203, -93.093739], marker: 17}
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
    initializeCrimes()

    map.neighborhood_markers.forEach((marker) => {
        L.marker(marker.location).addTo(map.leaflet).bindPopup(
            marker.marker + " Crimes: "
        );
    });
});


// Performs GET requests on /incident, /codes, /neightborhoods endpoints.
// Sorts return data into their respective data models.
function initializeCrimes() {
    fetch(base_url.value + "/incidents")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        crimes.value = data;
        return fetch(base_url.value + "/codes");
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        codes.value = data;
        return fetch(base_url.value + "/neighborhoods");
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        neighborhoods.value = data;
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
        dialog.close();
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
</script>

<template>
    <!-- <dialog id="rest-dialog" open>
        <h1 class="dialog-header">St. Paul Crime REST API</h1>
        <label class="dialog-label">Location: </label>
        <input id="dialog-loc" class="dialog-input" v-model="location" placeholder="Enter a location" />
        <p class="dialog-error" v-if="dialog_err">Error: must enter valid URL</p>
        <br/>
        <button class="button" type="button" @click="closeDialog">GO</button>
    </dialog> -->
    
    <div class="grid-container" style="padding: 0; margin-left: 0%; background-color: red; max-width: 100%;">
        <div class="grid-x" style="background-color: yellow; margin: 0; padding: 0;">
            <!-- might not need hardcoded height when all filters are added-->
            <div id="rest-dialog" class="cell small-4 grid-container" style="background-color: green; margin: 0; padding:0;height: 500px;">
                <div class="grid-container">
                    <h1 class="dialog-header">St. Paul Crime REST API</h1>
                    <div class="grid-y grid-margin-y">
                        <label class="dialog-label">Location: </label>
                        <input id="dialog-loc" class="dialog-input" v-model="location" placeholder="Enter a location" />
                        <div class="grid-x">
                            <select id="filter1" class="cell small-4" style="height: 2.6rem;" v-model="newTag" >
                                <option value="" selected disabled hidden>Filter</option> 
                                <option value="a">a</option>
                                <option value="b">b</option>
                                <option value="c">c</option>
                            </select>
                            <button v-if="addFilter1" class="button cell small-2" type="button" @click="addTag(myRefs.addFilter1)" >+</button>
                        </div>
                        <button class="button cell" type="button" @click="closeDialog">GO</button>
                    </div>
                </div>
                <div class="cell small-12" style="margin-top:1rem; padding: 1rem; background-color: aquamarine;">
                    <div class="button tag-button"
                        v-for="tag in tags" :key="tag.id" >
                            {{ tag.text }}
                            <button class="tag-close" @click="removeTag(tag)">X</button>
                    </div>
                </div>
            </div>
            <div class="cell small-8" style="background-color: blue;">
                <div id="leafletmap"  style="margin:0; padding: 0; height: 100%;"></div>
            </div>
        </div>
    </div>
    <div class="grid-container">
        <div id="grid-x grid-padding-x">
            <IncidentTable id="table" :crimes="crimes" :codes="codes" :neighborhoods="neighborhoods"></IncidentTable>
        </div>   
    </div>
</template>

<style scoped>
/**
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
