<script setup>
import {reactive, ref} from 'vue'

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
let dialog_caseNumCheck = ref(false);
let showCode = ref(false);
let incidentTypeModel = ref('');
let incidentCodeModel = ref('');
let displayedCodes = ref('');
let codeCategories = reactive([
    {name:'Murder', value:'100-200'},
    {name:'Rape', value:'200-300'},
    {name:'Theft', value:'300-400,500-800'},
    {name:'Assault', value:'400-500,800-900'},
    {name:'Arson', value:'900-1000'},
    {name:'Other', value:'1000-x'}
]);


//Upload incidents to database
async function uploadIncidents(){
    let formValues = {"case_number": caseNum.value, "date": dateI.value, "time": timeI.value, "code": code.value, "incident": IncidentName.value, "police_grid": Police_grid.value, "neighborhood_number": NeighNum.value, "block": AddressI.value};
    console.log("stuff: "+ caseNum.value, dateI.value, timeI.value, code.value, IncidentName.value, Police_grid.value, NeighNum.value, AddressI.value);
    let valueCheck = [caseNum.value, dateI.value, timeI.value, code.value, IncidentName.value, Police_grid.value, NeighNum.value, AddressI.value];
    //check to see if one of them is undefined.
    // curl -X PUT "http://localhost:8000/new-incident" -H "Content-Type: application/json" -d "{\"case_number\": 999999999, \"date\": \"2023-11-18\", \"time\": \"20:48:53\", \"code\": 23, \"incident\": \"Stole my heart\", \"police_grid\": 119, \"neighborhood_number\": 1, \"block\": \"4XX LUELLA ST\"}"
    if (!valueCheck.includes(undefined) && !(valueCheck.includes(""))) {
        const response = await fetch('http://localhost:8001/new-incident', { 
            method: 'PUT', 
            headers: { 
                'Content-type': 'application/json'
            }, 
            body: JSON.stringify(formValues) 
        }); 
            
            // Awaiting response.json() 
            const resData = response;
        
            if (resData.status === 200){
                dialog_errIncidents.value = false;
                dialog_caseNumCheck.value = false;
                dialog_success.value = true;
                // Return response data  
                return resData; 
            }else{
                dialog_errIncidents.value = false;
                dialog_caseNumCheck.value = true;
                dialog_success.value = false;
                // Return response data  
                return resData; 
            }
    }else{
        dialog_errIncidents.value = true;
        dialog_success.value = false;
        dialog_caseNumCheck.value = false;
    }
}

function updateIncidentCode(range){
    showCode.value = true;
    getCodeFromRange(range);
    console.log(incidentCodeModel);
    incidentCodeModel.value = '';
}

async function getCodeFromRange(range) {
    fetchJson('http://localhost:8001/codes?code_range='+range)
    .then(data => {
        displayedCodes.value = data;
    });
}
async function fetchJson(url) {
    return fetch(url).then(response => response.json());
}

</script>

<template>
    <div class="grid-container">
        <form class="uploadForm">
            <div class="grid-x grid-margin-x">
                <h1 class="cell">Upload Incident</h1>
                <div class="cell">
                    <p class="dialog-error" v-if="dialog_errIncidents" style="color: red">Error: One or more inputs are not filled in.</p>
                    <p class="dialog-caseNum" v-if="dialog_caseNumCheck" style="color: orange">Error: Case Number already exist.</p>
                    <p class="dialog-success" v-if="dialog_success" style="color: green">Success!</p>
                </div>
                <div class="cell">
                    <label for="caseNum">Case Number: <span style="color: red; font-weight: bold">*</span></label><br>
                    <input type="number" id="caseNum" name="caseNum" minlength="8" maxlength="8" required v-model="caseNum" placeholder="XXXXXXXX"><br>
                </div>

                <div class="cell medium-6">
                    <label for="date">Date of Incident: <span style="color: red; font-weight: bold">*</span></label><br>
                    <input type="date" id="date" name="date" required v-model="dateI"><br>
                </div>
                <div class="cell medium-6">
                    <label for="time">Time of Incident: <span style="color: red; font-weight: bold">*</span></label><br>
                    <input type="time" id="time" name="time" required v-model="timeI"><br>
                </div>

                <div class="cell medium-12">
                    <label for="incident-type">Incident Type: <span style="color: red; font-weight: bold">*</span></label><br>
                    <select v-model="incidentTypeModel" name="" id="incident-type" @change="updateIncidentCode(incidentTypeModel)">
                        <option selected disabled value="">Select an Incident Type</option>
                        <option
                            v-for="types in codeCategories" :key="codeCategories.name"
                                :value="types.value">
                                {{ types.name }}
                        </option>
                    </select>
                    <label v-if="showCode" for="incident-code">Incident Code: <span style="color: red; font-weight: bold">*</span></label><br>
                    <select v-model="incidentCodeModel" v-if="showCode" name="" id="incident-code">
                        <option selected disabled value="">Select a Code</option>
                        <option
                            v-for="codes in displayedCodes"
                                value="codes.code">
                                {{ codes.code }}: {{ codes.type }}
                        </option>
                    </select>
                </div>

                <div class="cell medium-12">
                    <label for="Incident">Description: <span style="color: red; font-weight: bold">*</span></label><br>
                <input type="text" id="Incident" name="Incident" required v-model="IncidentName" placeholder="EX: Robbery"><br>
                </div>

                <div class="cell">
                    <label for="Police_grid">Police Grid: <span style="color: red; font-weight: bold">*</span></label><br>
                    <input type="number" id="Police_grid" name="Police_grid" required v-model="Police_grid" placeholder="XXX"><br>
                </div>

                <div class="cell medium-6">
                    <label for="neighborhoodNum">Neighborhood Number: <span style="color: red; font-weight: bold">*</span></label><br>
                    <input type="number" id="neighborhoodNum" name="neighborhoodNum" required v-model="NeighNum" placeholder="XXX"><br>
                </div>

                <div class="cell medium-6">
                    <label for="address">Address of the Incident: <span style="color: red; font-weight: bold">*</span></label><br>
                    <input type="text" id="address" name="address" required v-model="AddressI" placeholder="EX: 123 Street Ave"><br>
                </div>
                <div class="cell">
                    <button class="button" type="button" @click="uploadIncidents">Upload</button>
                </div>
            </div>
        </form> 
    </div>
</template>