<script setup>
defineProps(['data']);

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
}

function codeName(c_id){
    let num = c_id / 100;
    let val = "red";
    if(num == 1 || num == 2 || num == 4 || num == 8 || num == 26){
        val = "rgb(252, 96, 99)";
    }
    if(num == 3 || num == 5 || num == 6 || num == 7 || num == 9 || num == 14){
        val = "rgb(252, 203, 104)";
    }
    if(num == 18){
        val = "rgb(104, 252, 161)";
    }
}



</script>