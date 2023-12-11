<script setup>
defineProps(['incident', 'codes', 'neighborhoods']);

function getIncidentTypeByCode(code, codes) {
    // finds json object for code passed
    const incident = codes.find(i => i.code === code);
    return incident ? incident.type : null;
}

function getNeighborhoodNameById(id, neighborhoods) {
    // finds json object for id passed
    const neighborhood = neighborhoods.find(i => i.id === id);
    return neighborhood ? neighborhood.name : null;
}
</script>

<template>
    <tr>
        <td>{{ incident.case_number }}</td>
        <td>{{ incident.date }}</td>
        <td>{{ incident.time }} mph</td>
        <td>{{ getIncidentTypeByCode(incident.code, codes)}}</td>
        <td>{{ incident.incident }}</td>
        <td>{{ incident.police_grid }}</td>
        <td>{{ getNeighborhoodNameById(incident.neighborhood_number, neighborhoods) }}</td>
        <td>{{ incident.block }}</td>
    </tr>
</template>

<style scoped>
td {
    border: solid 1px #000000
}
</style>