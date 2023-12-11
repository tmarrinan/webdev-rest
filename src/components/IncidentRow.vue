<script setup>
defineProps(['incident', 'codes', 'neighborhoods']);
</script>

<template>
    <tr>
        <td>{{ incident.case_number }}</td>
        <td>{{ incident.date }}</td>
        <td>{{ incident.time }} mph</td>
        <td>{{ incident.code }}</td>
        <td>{{ incident.incident }}</td>
        <td>{{ incident.police_grid }}</td>
        <td>{{ incident.neighborhood_number }}</td>
        <td>{{ incident.block }}</td>
    </tr>
</template>

<style scoped>
td {
    border: solid 1px #000000
}
</style>