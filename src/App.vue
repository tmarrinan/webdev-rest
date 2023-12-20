<script setup>
import { reactive, ref, onMounted } from 'vue';
import pageSidebar from "./components/sidebar.vue"
import pageLegend from "./components/legend.vue"
import pageheader from "./components/header.vue"
import pageFooter from "./components/footer.vue"
import pageTable from "./components/table.vue"
import NewIncidentForm from "./components/NewIncidentForm.vue"



let crime_url = ref('');
let dialog_err = ref(false);

let crimeData = ref({
  codes: [],
  neighborhoods: [],
  incidents: []
});


let crimeTableData = ref([]);
let isLoading = ref(false);

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
        { location: [44.942068, -93.020521], marker: 'Southeast', number:1 }, 
                    { location: [44.977413, -93.025156], marker: 'Greater East Side', number:2 },
                    { location: [44.931244, -93.079578], marker: 'West Side', number:3 },
                    { location: [44.956192, -93.060189], marker: "Dayton's Bluff", number:4  },
                    { location: [44.978883, -93.068163], marker: 'Payne - Phalen', number:5  },
                    { location: [44.975766, -93.113887], marker: 'North End', number:6 },
                    { location: [44.959639, -93.121271], marker: 'Frogtown', number:7 },
                    { location: [44.947700, -93.128505], marker: 'Summit - University', number:8 },
                    { location: [44.930276, -93.119911], marker: 'West Seventh - Fort Road', number:9 },
                    { location: [44.982752, -93.147910], marker: 'Como Park', number:10 },
                    { location: [44.963631, -93.167548], marker: 'Hamline - Midway', number:11 },
                    { location: [44.973971, -93.197965], marker: 'Saint Anthony Park', number:12 },
                    { location: [44.949043, -93.178261], marker: 'Union Park', number:13 },
                    { location: [44.934848, -93.176736], marker: 'Macalestar - Groveland', number:14 },
                    { location: [44.913106, -93.170779], marker: 'Highland', number:15 },
                    { location: [44.937705, -93.136997], marker: 'Summit Hill', number:16 },
                    { location: [44.949203, -93.093739], marker: 'Capital River', number:17 }
        ]
    }
);

// Vue callback for once <template> HTML has been added to web page
onMounted(() => {

    initializeCrimes().then(() => {
        isLoading.value = false;
    });

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


function initializeCrimes() {
    return new Promise((resolve, reject) => {
        fetch(crime_url.value + '/codes')
        .then(response => response.json())
        .then(data => {
            crimeData.value.codes = data;
        })
        .catch(error => {
            console.error('Error fetching codes', error);
            reject(error);
        })
        fetch(crime_url.value + '/neighborhoods')
        .then(response => response.json())
        .then(data => {
            crimeData.value.neighborhoods = data;
        })
        .catch(error => {
            console.error('Error fetching neighborhoods', error);
            reject(error);
        })
        fetch(crime_url.value + '/incidents')
        .then(response => response.json())
        .then(data => {
            crimeData.value.incidents = data;

            crimeTableData.value = data.map(incident => {
                return{
                    case_number: incident.case_number,
                    date_time: incident.date_time,
                    code: incident.code,
                    incident: incident.incident,
                    police_grid: incident.police_grid,
                    neighborhood_number: incident.neighborhood_number,
                    block: incident.block
                };
            });
            crimeTableData.value.sort((a,b) => new Date(b.date_time) - new Date(a.date_time));
            resolve();
        })
        .catch(error => {
            reject(error);
        }); 
    });
}

function addNeighborhoodMarkers() {
  // Clear existing markers
  map.leaflet.eachLayer(layer => {
    if (layer instanceof L.Marker) {
      map.leaflet.removeLayer(layer);
    }
  });

  map.neighborhood_markers.forEach((neighborhood) => {
    const marker = L.marker(neighborhood.location)
      .addTo(map.leaflet)
      .bindPopup('Loading...'); // Display a loading message initially

    // Fetch the number of incidents for the current neighborhood
    fetch(`${crime_url.value}/incidents?id=${neighborhood.number}&limit=10000000`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Check if the marker and map are available before updating the popup content
        if (marker && map.leaflet) {
          const popupContent = `
            <div class="popup-header" style="width: 150px; text-align: center">${neighborhood.marker}</div>
            <div class="popup-body" style="width: 150px; text-align: center"># of crimes: ${data.length}</div>
          `;
          marker.setPopupContent(popupContent);
        }
      })
      .catch(error => {
        console.error(`Error fetching incidents for ${neighborhood.marker}:`, error);
        // Handle non-JSON response or other errors
        if (marker && map.leaflet) {
          marker.setPopupContent(`Error fetching incidents for ${neighborhood.marker}`);
        }
      });
  });
}

function closeDialog() {
    let url_input = document.getElementById('dialog-url');
    if (crime_url.value !== '' && url_input.checkValidity()) {
        dialog_err.value = false;
        initializeCrimes();
        addNeighborhoodMarkers();
        
    }
    else {
        dialog_err.value = true;
    }
}


function deleteIncident(caseNumber) {
  // Send DELETE request to the server
  fetch(crime_url.value + '/remove-incident?case_number=' + caseNumber, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ case_number: caseNumber }),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Incident Removed successfully:', data);

      // Update the incidents array by filtering out the deleted incident
      const updatedIncidents = crimeData.value.incidents.filter(incident => incident.case_number !== caseNumber);

      // Sort the updated incidents array by date_time
      updatedIncidents.sort((a, b) => new Date(b.date_time) - new Date(a.date_time));

      // Update crimeData.value.incidents with the new sorted array
      crimeData.value.incidents = reactive(updatedIncidents);

      // Update crimeTableData
      crimeTableData.value = reactive([...updatedIncidents]);

      // Add new markers
      addNeighborhoodMarkers();

    })
    .catch(error => {
      // Handle errors or display a message to the user
      console.error('Error Removing incident:', error.message);
    });
}

async function submitIncident(incidentData) {
  try {
    const response = await fetch(`${crime_url.value}/new-incident`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incidentData),
    });

    if (response.ok) {
      window.alert("New Incident Created!");
    } else {
      console.error("Response not OK:", response);
      crimeTableData.value.push(newIncident);
      crimeData.value.push(newIncident);

      window.alert("New Incident Not Created!");
    }
  } catch (error) {
    console.error("Error in submitIncident:", error);
  }
}




function plotData(caseNumber) {
  const incident = crimeData.value.incidents.find(incident => incident.case_number === caseNumber);

  if (incident) {
    // Extract the block address from the incident
    let blockAddress = incident.block; // Update this part based on your actual data structure

    // Replace only the 'x' in the number with '0'
    blockAddress = blockAddress.replace(/(\d*)X/g, '$10');

    // Use Nominatim API to convert block address to latitude and longitude
    const nominatimEndpoint = 'https://nominatim.openstreetmap.org/search';
    const params = new URLSearchParams({
        q: `${blockAddress}, St. Paul, Minnesota`,
        format: 'json',
    });
    
    const nominatimUrl = `${nominatimEndpoint}?${params.toString()}`;

    fetch(nominatimUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          // Get the first result (assuming it's the most relevant)
          const result = data[0];

          // Extract the latitude and longitude from the result
          const latitude = result.lat;
          const longitude = result.lon;

          // Define a custom icon for the marker
          const customIcon = L.icon({
            iconUrl: 'https://cdn4.iconfinder.com/data/icons/small-n-flat/24/map-marker-1024.png', // Replace with the path to your custom marker image
            iconSize: [32, 32], // Adjust the size of your custom marker
            iconAnchor: [16, 32], // Adjust the anchor point of your custom marker
            popupAnchor: [0, -32], // Adjust the popup anchor of your custom marker
          });

          // Create a marker with the custom icon at the specified location
          const marker = L.marker([latitude, longitude], { icon: customIcon })
            .addTo(map.leaflet)
            .bindPopup(`Case Number: ${caseNumber}`);

            // Check if the marker was successfully added
            if (marker) {
            // Optionally, open the popup when the marker is added
            marker.openPopup();
            } else {
            console.error('Marker creation failed.');
            }
        } else {
          console.error(`No location found for caseNumber ${caseNumber}.`);
        }
      })
      .catch(error => {
        console.error('Error geocoding:', error);
      });
  } else {
    console.error(`Incident with caseNumber ${caseNumber} not found.`);
  }
}


function getSearch(neighborhoodName) {
  // Check if the search value is a valid neighborhood name
  const validNeighborhood = map.neighborhood_markers.find(neighborhood => neighborhood.marker.toLowerCase() === neighborhoodName.toLowerCase());

  if (validNeighborhood) {
    // Zoom in on the selected neighborhood
    map.leaflet.setView(validNeighborhood.location, 14);

    // Filter the incidents for the selected neighborhood
    const filteredIncidents = crimeData.value.incidents.filter(incident => incident.neighborhood_number === validNeighborhood.number);

    // Update the crimeTableData
    crimeTableData.value = filteredIncidents.map(incident => ({
      case_number: incident.case_number,
      date_time: incident.date_time,
      code: incident.code,
      incident: incident.incident,
      police_grid: incident.police_grid,
      neighborhood_number: incident.neighborhood_number,
      block: incident.block,
    }));

    // Clear existing markers
    map.leaflet.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        map.leaflet.removeLayer(layer);
      }
    });

    // Add markers for the selected neighborhood
    addNeighborhoodMarkers();

    // Call plotData for each incident in the selected neighborhood
    filteredIncidents.forEach(incident => {
      plotData(incident); // Assuming plotData function takes an incident as an argument
    });
  } else {
    console.error(`Invalid neighborhood: ${neighborhoodName}`);
  }
}








</script>


<template>
    <pageheader style="margin-bottom: 30px !important;"></pageheader>
    <div class="grid-x" style="padding-bottom: 20px;">
        <div class="cell medium-12 large-8 columns chunk">
            <div class="grid-container map">
                <div class="grid-x">
                    <div id="leafletmap" class="cell auto" style="border-radius: 20px;"></div>
                </div>
            </div>
            <div>
                <pageLegend></pageLegend>
            </div>
            <template v-if="!isLoading">
                <pageTable :crimeTableData="crimeTableData" :deleteIncident="deleteIncident" :plotData="plotData" style="width: 100%;"></pageTable>
            </template>
            <template v-else>
                <p>Loading data...</p>
            </template>
        </div>
        <div class="cell large-3 columns bar">
            <div style="padding-bottom: 15px;">
                <div class="test">
                    <label>URL: </label>
                    <div style="padding-bottom: 5px;">
                        <input id="dialog-url" class="dialog-input" type="url" v-model="crime_url" placeholder="http://localhost:8000" />
                        <p class="dialog-error" v-if="dialog_err">Error: must enter valid URL</p>
                    </div>
                    <button class="button" type="button" @click="closeDialog">OK</button>
                </div>
            </div>
            <pageSidebar :getSearch="getSearch"></pageSidebar>
        </div>
    </div>
    <!-- In App.vue template -->
    <new-incident-form @submit-incident="submitIncident"></new-incident-form>

    <pageFooter></pageFooter>
 
</template>


<style>s
#rest-dialog {
    width: 20rem;
    margin-top: 100rem;
    z-index: 1000;
}

#leafletmap {
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

.main{
    background-color: white;
    border-radius: 30px;
    padding: 10px;
    padding-top: 25px;
    width: 90%;
}


.chunk{
    padding: 20px;
    background-color: white;
    border-radius: 30px;
}

.bar{
    margin: 30px;
}

.map{
    margin-bottom: 30px;
}

pageheader {
    margin-bottom: 20px;
}

.test{
    background-color: white;
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 30px;
}

.button{
    margin-top: 30px;
    font-weight: bold;
    width: 100%;
    background-color: rgb(221, 237, 237);
    border-radius: 10px;
    color: black;
    border-width: 2px;
    border-color: none;
}

.button:hover{
    font-weight: bold;
    color: black;
    background-color: rgb(221, 237, 237);
    border-width: 2px;
    border-color: black;
}


</style>
