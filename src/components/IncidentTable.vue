<script setup>
import { computed, ref, onMounted } from 'vue';
import IncidentRow from './IncidentRow.vue';
const someProps = defineProps(['crimes', 'codes', 'neighborhoods', 'map']);
let startItem = 0; //Lower limit 
let endItem = 6; //Upper Limit
let pageTotal = computed(() => Math.ceil(someProps.crimes.length / 6));
let pageNum = ref(1);

let isDisabledPrev = true;
let isDisabledNext = false;

function clickNext(){
    pageTotal.value = Math.ceil(someProps.crimes.length / 6);
    if (!(pageNum.value === pageTotal.value)){
        isDisabledNext = false;
        isDisabledPrev = false;
        startItem = startItem + 6;
        endItem = endItem + 6;
        pageNum.value = pageNum.value + 1;
        if ((pageNum.value === pageTotal.value)){
            isDisabledNext = true;
        }
    }else{
        isDisabledNext = true;
    }
}
function clickPrev(){
    pageTotal.value = Math.ceil(someProps.crimes.length / 6);
    if (!(pageNum.value === 1)){
        isDisabledPrev = false;
        isDisabledNext = false;
        startItem = startItem - 6;
        endItem = endItem - 6;
        pageNum.value = pageNum.value - 1;
        if ((pageNum.value === 1)){
            isDisabledPrev = true;
        }
    }else{
        isDisabledPrev = true;
    }
}



</script>



<template>
    <!-- <table v-if="crimes.length > 0">
        <thead>
            <tr>
                <th>Case Number</th>
                <th>Date</th>
                <th>Time</th>
                <th>Incident Type</th>
                <th>Description</th>
                <th>Police Grid</th>
                <th>Neighborhood</th>
                <th>Block</th>
            </tr>
        </thead>
        <tbody>
            <IncidentRow v-for="incident in crimes" :incident="incident" :codes="codes" :neighborhoods="neighborhoods"></IncidentRow>
        </tbody>
    </table> -->


    <div class="cell" style="text-align: center; padding: 1em;">
        <h2 style="font-size: 2rem; font-weight: bold;">Crimes Database</h2>
        <h3 style="font-size: 1.3rem; font-weight: bold;">Current Results: {{ crimes.length }}</h3>
    </div>
    <div class="cell grid-x grid-padding-x Legends">
        <h1 class="cell">Legends</h1>
        <p class="cell medium-2"><span class="L1"><ion-icon name="clipboard"></ion-icon></span> Murder</p>
        <p class="cell medium-2"><span class="L2"><ion-icon name="clipboard"></ion-icon></span> Rape</p>
        <p class="cell medium-2"><span class="L3"><ion-icon name="clipboard"></ion-icon></span> Theft</p>
        <p class="cell medium-2"><span class="L4"><ion-icon name="clipboard"></ion-icon></span> Assault</p>
        <p class="cell medium-2"><span class="L5"><ion-icon name="clipboard"></ion-icon></span> Arson</p>
        <p class="cell medium-2"><span class="L6"><ion-icon name="clipboard"></ion-icon></span> Other</p>
    </div>
    <div class="cell Tablebuttons grid-x grid-padding-x">
        <div class="cell medium-6">
            <button class="buttonPrev" :disabled='isDisabledPrev' @click="clickPrev()">Prev</button>
        </div>
        <div class="cell medium-6">
            <button class="buttonNext" :disabled='isDisabledNext' @click="clickNext()">Next</button>
        </div>
    </div>
    <h2 class="cell" style=" font-weight: bold; font-size: 1.5em;">Page {{ pageNum }} of {{ pageTotal }}</h2>
    <div class="grid-x grid-padding-x small-up-1 medium-up-2 large-up-3" v-if="crimes.length > 0">
        <IncidentRow v-for="incident in crimes.slice(startItem, endItem)" :incident="incident" :codes="codes" :neighborhoods="neighborhoods"></IncidentRow>
    </div>



</template>

<style scoped>

.Legends{
    border: 4px solid black;
}

.Legends .L1{
    color: rgb(230, 0, 0);
}
.Legends .L2{
    color: rgb(249, 0, 158);
}
.Legends .L3{
    color: rgb(6, 188, 0);
}
.Legends .L4{
    color: rgb(0, 116, 217);
}
.Legends .L5{
    color: rgb(129, 0, 203);
}
.Legends .L6{
    color: rgb(134, 134, 134);
}
.Legends h1{
    font-size: 2em;
    font-weight: bold;
}

.Tablebuttons{
    padding: 2em;
}
.Tablebuttons button{
    width: 90%;
    padding: 1em;
    margin: 1em;
    font-weight: bold;
    border: 2px solid black;
    border-radius: 1em;
    cursor: pointer;
}
.Tablebuttons button:hover{
    color: white;
    background-color: black;
}
.Tablebuttons button:disabled{
    color: white;
    background-color: gray;
    cursor:auto;
}
</style>