<script setup>

import IncidentRow from './IncidentRow.vue';
defineProps(['crimes', 'codes', 'neighborhoods', 'map']);

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


    <div class="cell" style="text-align: center; font-size: 2rem; font-weight: bold; padding: 1em;">Crimes Database</div>
    <div class="grid-x grid-padding-x Legends">
        <h1 class="cell">Legends</h1>
        <p class="cell medium-2"><span class="L1"><ion-icon name="clipboard"></ion-icon></span> Murder</p>
        <p class="cell medium-2"><span class="L2"><ion-icon name="clipboard"></ion-icon></span> Rape</p>
        <p class="cell medium-2"><span class="L3"><ion-icon name="clipboard"></ion-icon></span> Theft</p>
        <p class="cell medium-2"><span class="L4"><ion-icon name="clipboard"></ion-icon></span> Assault</p>
        <p class="cell medium-2"><span class="L5"><ion-icon name="clipboard"></ion-icon></span> Arson</p>
        <p class="cell medium-2"><span class="L6"><ion-icon name="clipboard"></ion-icon></span> Other</p>
    </div>
    <div class="boxes grid-x grid-padding-x small-up-2 medium-up-4" v-if="crimes.length > 0">
        <IncidentRow v-for="incident in crimes" :incident="incident" :codes="codes" :neighborhoods="neighborhoods"></IncidentRow>
    </div>



</template>

<style scoped>
.boxes{
    align-items: center;
    justify-content: center;
}

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
</style>